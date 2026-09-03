const RescueTeam = require("../models/RescueTeam");
const Tracking = require("../models/Tracking");
const User = require("../models/User");
const SOS = require("../models/SOS");
const calculateDistance = require("../utils/distanceCalculator");
const {
    emitLocationUpdate,
    emitRescueAssignment,
    emitRescueStatusUpdate,
    emitUserNotification,
} = require("../services/socketService");

const adminRoles = ["SuperAdmin", "DistrictAdmin", "NGO"];

const teamView = async (team) => {
    const item = team.toObject ? team.toObject() : team;
    let tracking = null;
    const userId = item.user?._id || item.user;
    if (userId) {
        tracking = await Tracking.findOne({
            user: userId,
            type: "RescueTeam",
            isActive: true,
        }).sort({ lastUpdated: -1 }).lean();
    }
    const location = tracking?.location || item.currentLocation || null;
    return {
        ...item,
        location,
        lat: location?.latitude ?? null,
        lng: location?.longitude ?? null,
        lastUpdated: tracking?.lastUpdated || item.lastLocationUpdate || null,
        trackingStatus: tracking?.status || item.status,
        trackingId: tracking?._id || null,
        isLive: Boolean(tracking?.lastUpdated && new Date(tracking.lastUpdated) >= new Date(Date.now() - 45 * 1000)),
    };
};

const getRescueTeams = async (req, res) => {
    try {
        const teams = await RescueTeam.find({ isActive: true })
            .populate("user", "name email phone role isActive")
            .populate("assignedSOS", "status severity disasterType location createdAt")
            .sort({ createdAt: -1 });
        const data = await Promise.all(teams.map(teamView));
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLiveRescueTeams = async (req, res) => {
    try {
        // A location is LIVE only when the rescue device has checked in
        // during the last 45 seconds. The frontend sends a 10-second heartbeat.
        const cutoff = new Date(Date.now() - 45 * 1000);

        const teams = await RescueTeam.find({ isActive: true })
            .populate("user", "name email phone role")
            .populate("assignedSOS", "status severity disasterType location createdAt")
            .lean();

        const userIds = teams.map(t => t.user?._id).filter(Boolean);

        const tracks = await Tracking.find({
            user: { $in: userIds },
            type: "RescueTeam",
            isActive: true,
            lastUpdated: { $gte: cutoff },
        }).sort({ lastUpdated: -1 }).lean();

        const latest = new Map();
        tracks.forEach(t => {
            const key = String(t.user);
            if (!latest.has(key)) latest.set(key, t);
        });

        const data = teams.map(t => {
            const tr = t.user?._id ? latest.get(String(t.user._id)) : null;
            const loc = tr?.location;

            if (
                !loc ||
                !Number.isFinite(Number(loc.latitude)) ||
                !Number.isFinite(Number(loc.longitude))
            ) return null;

            return {
                ...t,
                trackingId: tr._id,
                location: loc,
                lat: Number(loc.latitude),
                lng: Number(loc.longitude),
                accuracy: Number.isFinite(Number(loc.accuracy)) ? Number(loc.accuracy) : null,
                lastUpdated: tr.lastUpdated,
                trackingStatus: tr.status || t.status,
                isLive: true,
            };
        }).filter(Boolean);

        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRescueTeamById = async (req, res) => {
    try {
        const team = await RescueTeam.findOne({ _id: req.params.id, isActive: true })
            .populate("user", "name email phone role isActive")
            .populate("assignedSOS", "status severity disasterType location createdAt");
        if (!team) return res.status(404).json({ success: false, message: "Rescue team not found" });
        res.json({ success: true, data: await teamView(team) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createRescueTeam = async (req, res) => {
    try {
        const { name, leaderName, phone, email, password, members, skills, assignedArea, status } = req.body;
        if (!name || !leaderName || !phone || !email) {
            return res.status(400).json({ success: false, message: "name, leaderName, phone and email are required" });
        }
        const normalizedEmail = email.toLowerCase().trim();
        let account = await User.findOne({ email: normalizedEmail });
        let temporaryPassword = null;
        if (account) {
            if (account.role !== "RescueTeam") return res.status(409).json({ success: false, message: "Email belongs to another role" });
            if (account.isActive === false) account.isActive = true;
            if (password) account.password = password;
            account.name = account.name || name;
            account.phone = phone;
            await account.save();
        } else {
            temporaryPassword = password || `SDRP@${Math.random().toString(36).slice(2, 8)}!`;
            account = await User.create({ name, email: normalizedEmail, password: temporaryPassword, phone, role: "RescueTeam", isVerified: true });
        }
        const existingTeam = await RescueTeam.findOne({ user: account._id });
        if (existingTeam) return res.status(409).json({ success: false, message: "This login email is already linked to a rescue team. Use a different login email for each rescue team." });
        const team = await RescueTeam.create({ name, leaderName, phone, members: Number(members) || 1, skills: Array.isArray(skills) ? skills : [], assignedArea: assignedArea || "", status: status || "Available", user: account._id });
        const view = await teamView(await RescueTeam.findById(team._id).populate("user", "name email phone role isActive"));
        res.status(201).json({ success: true, message: "Rescue team and login account created", credentials: { email: normalizedEmail, temporaryPassword: temporaryPassword || (password ? "Password set by admin" : null) }, data: view });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: "Email or rescue team account already exists" });
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRescueTeam = async (req, res) => {
    try {
        const allowed = ["name", "leaderName", "phone", "members", "skills", "assignedArea", "status", "isActive"];
        const updates = {};
        for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
        const team = await RescueTeam.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
            .populate("user", "name email phone role isActive")
            .populate("assignedSOS", "status severity disasterType location createdAt");
        if (!team) return res.status(404).json({ success: false, message: "Rescue team not found" });
        res.json({ success: true, message: "Rescue team updated", data: await teamView(team) });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteRescueTeam = async (req, res) => {
    try {
        const team = await RescueTeam.findByIdAndUpdate(req.params.id, { isActive: false, status: "Offline" }, { new: true });
        if (!team) return res.status(404).json({ success: false, message: "Rescue team not found" });
        if (team.user) await User.findByIdAndUpdate(team.user, { isActive: false });
        await Tracking.updateMany({ user: team.user, type: "RescueTeam" }, { isActive: false, status: "Offline" });
        res.json({ success: true, message: "Rescue team deactivated" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateRescueTeamLocation = async (req, res) => {
    try {
        const latitude = Number(req.body.latitude), longitude = Number(req.body.longitude), accuracy = Number(req.body.accuracy);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return res.status(400).json({ success: false, message: "Valid latitude and longitude are required" });
        const team = await RescueTeam.findOne({ user: req.user._id, isActive: true }).populate("assignedSOS", "status location user");
        if (!team) return res.status(404).json({ success: false, message: "No active rescue team is linked to this account" });
        const location = { latitude, longitude, accuracy: Number.isFinite(accuracy) ? accuracy : null };
        team.currentLocation = location;
        team.lastLocationUpdate = new Date();
        if (team.status === "Offline") team.status = "Available";
        await team.save();
        const tracking = await Tracking.findOneAndUpdate(
            { user: req.user._id, type: "RescueTeam" },
            { user: req.user._id, type: "RescueTeam", rescueTeam: team._id, sos: team.assignedSOS?._id || null, location, status: team.status, isActive: true, lastUpdated: new Date() },
            { new: true, upsert: true, runValidators: true }
        );
        const payload = { trackingId: tracking._id, teamId: team._id, teamUserId: req.user._id, sosId: team.assignedSOS?._id || null, type: "RescueTeam", name: team.name, leaderName: team.leaderName, phone: team.phone, members: team.members, status: team.status, location, lat: latitude, lng: longitude, lastUpdated: tracking.lastUpdated };
        emitLocationUpdate(payload);
        res.json({ success: true, message: "Rescue team location updated", data: payload });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const stopRescueTeamLocation = async (req, res) => {
    try {
        const team = await RescueTeam.findOne({
            user: req.user._id,
            isActive: true,
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "No active rescue team is linked to this account",
            });
        }

        const tracking = await Tracking.findOneAndUpdate(
            { user: req.user._id, type: "RescueTeam" },
            {
                isActive: false,
                status: "Offline",
                lastUpdated: new Date(),
            },
            { new: true }
        );

        const payload = {
            teamId: team._id,
            teamUserId: req.user._id,
            type: "RescueTeam",
            name: team.name,
            status: "Offline",
            isLive: false,
            lastUpdated: tracking?.lastUpdated || new Date(),
        };

        emitLocationUpdate(payload);

        res.json({
            success: true,
            message: "Rescue team GPS tracking stopped",
            data: payload,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyRescueTeam = async (req, res) => {
    try {
        const team = await RescueTeam.findOne({ user: req.user._id, isActive: true }).populate("user", "name email phone role isActive").populate("assignedSOS", "status severity disasterType location createdAt user");
        if (!team) return res.status(404).json({ success: false, message: "No rescue team linked to this account" });
        res.json({ success: true, data: await teamView(team) });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getMyAssignments = async (req, res) => {
    try {
        const team = await RescueTeam.findOne({ user: req.user._id, isActive: true });
        if (!team) return res.status(404).json({ success: false, message: "No rescue team linked to this account" });
        const sos = await SOS.find({ assignedRescueTeam: team._id }).populate("user", "name phone email").sort({ createdAt: -1 });
        res.json({ success: true, count: sos.length, data: sos });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const assignRescueTeam = async (req, res) => {
    try {
        const { rescueTeamId } = req.body;
        if (!rescueTeamId) return res.status(400).json({ success: false, message: "rescueTeamId is required" });
        const [sos, team] = await Promise.all([
            SOS.findById(req.params.sosId),
            RescueTeam.findOne({ _id: rescueTeamId, isActive: true }).populate("user", "name email phone role"),
        ]);
        if (!sos) return res.status(404).json({ success: false, message: "SOS not found" });
        if (!team) return res.status(404).json({ success: false, message: "Rescue team not found" });
        if (team.status === "Busy" && team.assignedSOS && String(team.assignedSOS) !== String(sos._id)) return res.status(409).json({ success: false, message: "Rescue team is already busy" });
        if (sos.assignedRescueTeam && String(sos.assignedRescueTeam) !== String(team._id)) {
            await RescueTeam.findByIdAndUpdate(sos.assignedRescueTeam, { assignedSOS: null, status: "Available" });
        }
        sos.assignedRescueTeam = team._id;
        sos.assignedAt = new Date();
        sos.reachedAt = null;
        sos.status = "Dispatched";
        sos.isActive = true;
        await sos.save();
        team.assignedSOS = sos._id;
        team.status = "Busy";
        await team.save();
        emitRescueAssignment(sos, team);
        if (sos.user) emitUserNotification(sos.user, { type: "RESCUE_ASSIGNED", title: "Rescue Team Assigned", message: `${team.name} has been dispatched to your SOS`, sosId: String(sos._id), teamId: String(team._id) });
        if (team.user) emitUserNotification(team.user._id || team.user, { type: "NEW_RESCUE_ASSIGNMENT", title: "New SOS Assignment", message: `${sos.disasterType} emergency assigned to ${team.name}`, sosId: String(sos._id) });
        res.json({ success: true, message: "Rescue team assigned", data: { sos, team: await teamView(team) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const trackMyRescueTeam = async (req, res) => {
    try {
        const sos = await SOS.findOne({ user: req.user._id, isActive: true, assignedRescueTeam: { $ne: null } })
            .sort({ createdAt: -1 })
            .populate("assignedRescueTeam", "name leaderName phone members skills status currentLocation lastLocationUpdate user");
        if (!sos) return res.status(404).json({ success: false, message: "No active SOS with an assigned rescue team" });
        const team = sos.assignedRescueTeam;
        const tracking = team.user ? await Tracking.findOne({ user: team.user, type: "RescueTeam", isActive: true }).sort({ lastUpdated: -1 }).lean() : null;
        const location = tracking?.location || team.currentLocation || null;
        let distanceKm = null;
        if (location) distanceKm = calculateDistance(sos.location.latitude, sos.location.longitude, location.latitude, location.longitude);
        res.json({ success: true, data: { sos: { _id: sos._id, status: sos.status, location: sos.location, disasterType: sos.disasterType, severity: sos.severity, assignedAt: sos.assignedAt, reachedAt: sos.reachedAt, resolvedAt: sos.resolvedAt }, team: { ...team.toObject(), location, lastUpdated: tracking?.lastUpdated || team.lastLocationUpdate }, distanceKm: distanceKm === null ? null : Number(distanceKm), etaMinutes: distanceKm === null ? null : Math.max(1, Math.round((Number(distanceKm) / 30) * 60)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateAssignedSOSStatus = async (req, res) => {
    try {
        const team = await RescueTeam.findOne({ user: req.user._id, isActive: true });
        if (!team) return res.status(404).json({ success: false, message: "No rescue team linked to this account" });
        const sos = await SOS.findOne({ _id: req.params.sosId, assignedRescueTeam: team._id });
        if (!sos) return res.status(403).json({ success: false, message: "This SOS is not assigned to your team" });
        const allowed = ["Accepted", "Rescue On Way", "Reached", "Resolved"];
        if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid rescue status", allowed });
        sos.status = req.body.status;
        if (req.body.status === "Reached") sos.reachedAt = new Date();
        if (req.body.status === "Resolved") { sos.resolvedAt = new Date(); sos.isActive = false; }
        await sos.save();
        if (req.body.status === "Resolved") { team.assignedSOS = null; team.status = "Available"; } else { team.status = req.body.status === "Rescue On Way" || req.body.status === "Reached" ? "Busy" : team.status; }
        await team.save();
        emitRescueStatusUpdate(sos);
        if (sos.user) emitUserNotification(sos.user, { type: "SOS_STATUS_UPDATE", title: `Rescue status: ${sos.status}`, message: `Your rescue request is now ${sos.status}`, sosId: String(sos._id), status: sos.status });
        res.json({ success: true, message: "SOS status updated", data: sos });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getRescueTeams, getLiveRescueTeams, getRescueTeamById, createRescueTeam, updateRescueTeam, deleteRescueTeam, updateRescueTeamLocation, stopRescueTeamLocation, getMyRescueTeam, getMyAssignments, assignRescueTeam, trackMyRescueTeam, updateAssignedSOSStatus };
