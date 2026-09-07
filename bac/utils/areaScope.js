// Administrative district scoping.
// SuperAdmin can switch the active district from the dashboard.
// DistrictAdmin/other field admins are restricted to their stored district.

const ADMIN_ROLES = ["SuperAdmin", "DistrictAdmin", "NGO", "Police"];

const normalizeDistrict = (value) => String(value || "").trim().replace(/\s+/g, " ");

const getAdminDistrict = (req) => {
  const role = req.user?.role;
  if (!ADMIN_ROLES.includes(role)) return "";
  if (role === "SuperAdmin") {
    return normalizeDistrict(req.headers["x-admin-district"] || req.query.district || "");
  }
  return normalizeDistrict(req.user?.district || "");
};

const hasDistrictScope = (req) => Boolean(getAdminDistrict(req));

// Matches the new district field and common legacy location fields so older
// MongoDB records can still appear when their city/assigned area equals the
// selected district.
const districtFilter = (req, field = "district") => {
  const district = getAdminDistrict(req);
  if (!district) return {};
  if (field !== "district") return { [field]: district };
  return {
    $or: [
      { district },
      { city: district },
      { assignedArea: district },
      { "location.city": district },
    ],
  };
};

const scopedFilter = (req, base = {}, field = "district") => {
  const district = getAdminDistrict(req);
  if (!district) return { ...base };

  // If the caller already needs an $or condition, use $and so both constraints
  // are respected.
  const scope = districtFilter(req, field);
  if (base.$or) return { $and: [base, scope] };
  return { ...base, ...scope };
};

const setDistrictOnCreate = (req, body = {}) => {
  const district = getAdminDistrict(req);
  return district ? { ...body, district } : body;
};

module.exports = {
  ADMIN_ROLES,
  normalizeDistrict,
  getAdminDistrict,
  hasDistrictScope,
  districtFilter,
  scopedFilter,
  setDistrictOnCreate,
};
