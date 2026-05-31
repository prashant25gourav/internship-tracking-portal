const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function handleResp(res) {
  return res.json().then((json) => {
    if (!res.ok) {
      const msg =
        (json && json.error && json.error.message) ||
        json.message ||
        res.statusText;
      throw new Error(msg);
    }
    return json;
  });
}

export async function registerStudent(payload) {
  const res = await fetch(`${BASE}/register-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResp(res);
}

export async function loginStudent(payload) {
  const res = await fetch(`${BASE}/login-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResp(res);
}

export async function getInternships() {
  const res = await fetch(`${BASE}/internships`);
  return handleResp(res);
}

export async function applyInternship(payload, token) {
  const res = await fetch(`${BASE}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return handleResp(res);
}

export async function uploadReport(formData, token) {
  const res = await fetch(`${BASE}/upload-report`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResp(res);
}

export async function getStudentApplications(studentId) {
  const res = await fetch(`${BASE}/student-applications/${studentId}`);
  return handleResp(res);
}

export async function getApplications() {
  const res = await fetch(`${BASE}/applications`);
  return handleResp(res);
}

export async function updateApplicationStatus(payload, token) {
  const res = await fetch(`${BASE}/update-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  return handleResp(res);
}

export async function listReports() {
  const res = await fetch(`${BASE}/reports`);
  return handleResp(res);
}

export async function downloadReport(reportId) {
  // return a raw response so caller can stream download
  const res = await fetch(`${BASE}/reports/${reportId}/download`);
  if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
  return res;
}

export async function adminAuth(password) {
  const res = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return handleResp(res);
}

export async function analyticsSummary(token) {
  const res = await fetch(`${BASE}/analytics/summary`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return handleResp(res);
}

export async function analyticsRecentActivities(token) {
  const res = await fetch(`${BASE}/analytics/recent-activities`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return handleResp(res);
}

export async function analyticsAppStatus(token) {
  const res = await fetch(`${BASE}/analytics/applications/status-breakdown`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return handleResp(res);
}

export default {
  registerStudent,
  loginStudent,
  getInternships,
  applyInternship,
  uploadReport,
  getStudentApplications,
  getApplications,
  updateApplicationStatus,
  listReports,
  downloadReport,
  adminAuth,
  analyticsSummary,
  analyticsRecentActivities,
  analyticsAppStatus,
};
