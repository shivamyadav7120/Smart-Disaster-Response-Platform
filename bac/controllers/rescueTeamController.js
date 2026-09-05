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
    };
};

const getRescueTeams = async (req, res) => {
    try {
        const teams = await RescueTeam.find({ isActive: true })
            .populate("user", "name email phone role isActive")
            .populate("assignedSOS", "status severity disasterType location createdAt")
            .populate("assignedSOSs", "status severity disasterType location createdAt description user")
            .sort({ createdAt: -1 });
        const data = await Promise.all(teams.map(teamView));
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLiveRescueTeams = async (req, res) => {
    try {
        const teams = await RescueTeam.find({ isActive: true })
            .populate("user", "name email phone role")
            .populate("assignedSOS", "status severity disasterType location createdAt description user")
            .populate("assignedSOSs", "status severity disasterType location createdAt description user")
            .lean();
        const userIds = teams.map(t => t.user?._id).filter(Boolean);
        const tracks = await Tracking.find({ user: { $in: userIds }, type: "RescueTeam", isActive: true })
            .sort({ lastUpdated: -1 }).lean();
        const latest = new Map();
        tracks.forEach(t => { if (!latest.has(String(t.user))) latest.set(String(t.user), t); });
        const data = teams.map(t => {
            const tr = t.user?._id ? latest.get(String(t.user._id)) : null;
            const loc = tr?.location || t.currentLocation;
            if (loc?.latitude == null || loc?.longitude == null) return null;
            const assigned = (Array.isArray(t.assignedSOSs) && t.assignedSOSs.length)
                ? t.assignedSOSs
                : (t.assignedSOS ? [t.assignedSOS] : []);
            const assignments = assigned.map(sos => {
                if (!sos?.location) return { sos, distanceKm: null, distanceMeters: null };
                const distanceKm = Number(calculateDistance(sos.location.latitude, sos.location.longitude, loc.latitude, loc.longitude));
                return { sos, distanceKm, distanceMeters: Math.round(distanceKm * 1000), distanceText: distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(2)} km` };
            });
            return { ...t, assignedSOSs: assigned, assignments, location: loc, lat: loc.latitude, lng: loc.longitude, lastUpdated: tr?.lastUpdated || t.lastLocationUpdate, trackingStatus: tr?.status || t.status };
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
            .populate("assignedSOS", "status severity disasterType location createdAt")
            .populate("assignedSOSs", "status severity disasterType location createdAt description user");
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
        if (existingTeam) return res.status(409).json({ success: false, message: "This account is already linked to a rescue team" });
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
            .populate("assignedSOS", "status severity disasterType location createdAt")
            .populate("assignedSOSs", "status severity disasterType location createdAt description user");
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
        const team = await RescueTeam.findOne({ user: req.user._id, isActive: true }).populate("assignedSOSs", "status location user description disasterType severity");
        if (!team) return res.status(404).json({ success: false, message: "No active rescue team is linked to this account" });
        const location = { latitude, longitude, accuracy: Number.isFinite(accuracy) ? accuracy : null };
        team.currentLocation = location;
        team.lastLocationUpdate = new Date();
        if (team.status === "Offline") team.status = "Available";
        const assignedIds = (Array.isArray(team.assignedSOSs) ? team.assignedSOSs : []).map(x => x?._id || x).filter(Boolean);
        if (!assignedIds.length && team.assignedSOS) assignedIds.push(team.assignedSOS);
        await team.save();
        const tracking = await Tracking.findOneAndUpdate(
            { user: req.user._id, type: "RescueTeam" },
            { user: req.user._id, type: "RescueTeam", rescueTeam: team._id, sos: assignedIds[0] || null, location, status: team.status, isActive: true, lastUpdated: new Date() },
            { new: true, upsert: true, runValidators: true }
        );
        const assignments = (team.assignedSOSs || []).map(sos => {
            if (!sos?.location) return { sosId: String(sos?._id || sos), distanceKm: null, distanceMeters: null };
            const distanceKm = Number(calculateDistance(sos.location.latitude, sos.location.longitude, latitude, longitude));
            return { sosId: String(sos._id), distanceKm, distanceMeters: Math.round(distanceKm * 1000), distanceText: distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(2)} km` };
        });
        const payload = { trackingId: tracking._id, teamId: team._id, teamUserId: req.user._id, sosId: assignedIds[0] || null, sosIds: assignedIds.map(String), assignments, type: "RescueTeam", name: team.name, leaderName: team.leaderName, phone: team.phone, members: team.members, status: team.status, location, lat: latitude, lng: longitude, lastUpdated: tracking.lastUpdated };
        emitLocationUpdate(payload);
        res.json({ success: true, message: "Rescue team location updated", data: payload });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
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
        const ids = (Array.isArray(team.assignedSOSs) && team.assignedSOSs.length) ? team.assignedSOSs : (team.assignedSOS ? [team.assignedSOS] : []);
        const sos = await SOS.find({ _id: { $in: ids } }).populate("user", "name phone email").sort({ createdAt: -1 });
        const location = team.currentLocation;
        const data = sos.map(item => {
            const distanceKm = location ? Number(calculateDistance(item.location.latitude, item.location.longitude, location.latitude, location.longitude)) : null;
            return { ...item.toObject(), distanceKm, distanceMeters: distanceKm == null ? null : Math.round(distanceKm * 1000), distanceText: distanceKm == null ? "GPS unavailable" : distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(2)} km`, etaMinutes: distanceKm == null ? null : Math.max(1, Math.round((distanceKm / 30) * 60)) };
        });
        res.json({ success: true, count: data.length, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const assignRescueTeam = async (req, res) => {
    try {
        const ids = Array.isArray(req.body.rescueTeamIds) ? req.body.rescueTeamIds : (req.body.rescueTeamId ? [req.body.rescueTeamId] : []);
        const rescueTeamIds = [...new Set(ids.map(String).filter(Boolean))];
        if (!rescueTeamIds.length) return res.status(400).json({ success: false, message: "rescueTeamId or rescueTeamIds is required" });
        const sos = await SOS.findById(req.params.sosId);
        if (!sos) return res.status(404).json({ success: false, message: "SOS not found" });
        const teams = await RescueTeam.find({ _id: { $in: rescueTeamIds }, isActive: true }).populate("user", "name email phone role");
        if (teams.length !== rescueTeamIds.length) return res.status(404).json({ success: false, message: "One or more rescue teams were not found or are inactive" });
        const existing = (Array.isArray(sos.assignedRescueTeams) && sos.assignedRescueTeams.length) ? sos.assignedRescueTeams.map(String) : (sos.assignedRescueTeam ? [String(sos.assignedRescueTeam)] : []);
        const merged = [...new Set([...existing, ...rescueTeamIds])];
        const now = new Date();
        sos.assignedRescueTeams = merged;
        sos.assignedRescueTeam = merged[0];
        sos.assignedAt = now;
        sos.reachedAt = null;
        sos.status = "Dispatched";
        sos.isActive = true;
        await sos.save();
        for (const team of teams) {
            const teamIds = (Array.isArray(team.assignedSOSs) ? team.assignedSOSs.map(String) : []);
            if (!teamIds.includes(String(sos._id))) teamIds.push(String(sos._id));
            team.assignedSOSs = teamIds;
            if (!team.assignedSOS) team.assignedSOS = sos._id;
            team.status = "Busy";
            await team.save();
            emitRescueAssignment(sos, team);
            if (sos.user) emitUserNotification(sos.user, { type: "RESCUE_ASSIGNED", title: "Rescue Team Assigned", message: `${team.name} has been dispatched to your SOS`, sosId: String(sos._id), teamId: String(team._id) });
            if (team.user) emitUserNotification(team.user._id || team.user, { type: "NEW_RESCUE_ASSIGNMENT", title: "New SOS Assignment", message: `${sos.disasterType} emergency assigned to ${team.name}`, sosId: String(sos._id) });
        }
        const populated = await SOS.findById(sos._id).populate("assignedRescueTeams", "name leaderName phone status currentLocation lastLocationUpdate").populate("user", "name phone email");
        res.json({ success: true, message: `${teams.length} rescue team${teams.length === 1 ? "" : "s"} assigned`, data: { sos: populated, teams: await Promise.all(teams.map(teamView)) } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const trackMyRescueTeam = async (req, res) => {
    try {
        const baseQuery = { user: req.user._id, isActive: true };
        if (req.params.sosId) baseQuery._id = req.params.sosId;
        const sosList = await SOS.find(baseQuery)
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("assignedRescueTeams", "name leaderName phone members skills status currentLocation lastLocationUpdate user");
        const sos = sosList.find(item => (Array.isArray(item.assignedRescueTeams) && item.assignedRescueTeams.length) || item.assignedRescueTeam);
        if (!sos) return res.status(404).json({ success: false, message: "No active SOS with an assigned rescue team" });
        let teams = Array.isArray(sos.assignedRescueTeams) && sos.assignedRescueTeams.length ? sos.assignedRescueTeams : (sos.assignedRescueTeam ? [sos.assignedRescueTeam] : []);
        const teamData = [];
        for (const team of teams) {
            const tracking = team.user ? await Tracking.findOne({ user: team.user, type: "RescueTeam", isActive: true }).sort({ lastUpdated: -1 }).lean() : null;
            const location = tracking?.location || team.currentLocation || null;
            const distanceKm = location ? Number(calculateDistance(sos.location.latitude, sos.location.longitude, location.latitude, location.longitude)) : null;
            teamData.push({ ...team.toObject(), location, lastUpdated: tracking?.lastUpdated || team.lastLocationUpdate, distanceKm, distanceMeters: distanceKm == null ? null : Math.round(distanceKm * 1000), distanceText: distanceKm == null ? "GPS unavailable" : distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(2)} km`, etaMinutes: distanceKm == null ? null : Math.max(1, Math.round((distanceKm / 30) * 60)) });
        }
        res.json({ success: true, data: { sos: { _id: sos._id, status: sos.status, location: sos.location, disasterType: sos.disasterType, severity: sos.severity, description: sos.description, assignedAt: sos.assignedAt, reachedAt: sos.reachedAt, resolvedAt: sos.resolvedAt }, teams: teamData, team: teamData[0] || null } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateAssignedSOSStatus = async (req, res) => {
    try {
        const team = await RescueTeam.findOne({ user: req.user._id, isActive: true });
        if (!team) return res.status(404).json({ success: false, message: "No rescue team linked to this account" });
        const assignedIds = (Array.isArray(team.assignedSOSs) ? team.assignedSOSs.map(String) : []);
        if (team.assignedSOS) assignedIds.push(String(team.assignedSOS));
        const sos = await SOS.findOne({ _id: req.params.sosId, $or: [{ assignedRescueTeams: team._id }, { assignedRescueTeam: team._id }] });
        if (!sos || !assignedIds.includes(String(sos._id))) return res.status(403).json({ success: false, message: "This SOS is not assigned to your team" });
        const allowed = ["Accepted", "Rescue On Way", "Reached", "Resolved"];
        if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid rescue status", allowed });
        sos.status = req.body.status;
        if (req.body.status === "Reached") sos.reachedAt = new Date();
        if (req.body.status === "Resolved") {
            sos.resolvedAt = new Date(); sos.isActive = false;
            const allTeamIds = (Array.isArray(sos.assignedRescueTeams) ? sos.assignedRescueTeams : (sos.assignedRescueTeam ? [sos.assignedRescueTeam] : []));
            await RescueTeam.updateMany({ _id: { $in: allTeamIds } }, { $pull: { assignedSOSs: sos._id } });
            const remainingTeams = await RescueTeam.find({ _id: { $in: allTeamIds } });
            for (const remainingTeam of remainingTeams) {
                const stillBusy = Array.isArray(remainingTeam.assignedSOSs) && remainingTeam.assignedSOSs.length > 0;
                if (!stillBusy && remainingTeam.assignedSOS && String(remainingTeam.assignedSOS) === String(sos._id)) remainingTeam.assignedSOS = null;
                remainingTeam.status = stillBusy ? "Busy" : "Available";
                await remainingTeam.save();
            }
        }
        await sos.save();
        if (req.body.status !== "Resolved") team.status = req.body.status === "Rescue On Way" || req.body.status === "Reached" ? "Busy" : team.status;
        await team.save();
        emitRescueStatusUpdate(sos);
        if (sos.user) emitUserNotification(sos.user, { type: "SOS_STATUS_UPDATE", title: `Rescue status: ${sos.status}`, message: `Your rescue request is now ${sos.status}`, sosId: String(sos._id), status: sos.status });
        res.json({ success: true, message: "SOS status updated", data: sos });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getRescueTeams, getLiveRescueTeams, getRescueTeamById, createRescueTeam, updateRescueTeam, deleteRescueTeam, updateRescueTeamLocation, getMyRescueTeam, getMyAssignments, assignRescueTeam, trackMyRescueTeam, updateAssignedSOSStatus };
