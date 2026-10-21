const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      credentials: "include",
      headers: options.body ? { "Content-Type": "application/json", ...options.headers } : options.headers,
      ...options
    });
  } catch (cause) {
    throw new Error("Unable to reach the ChurchConnect service. Check your connection and try again.", { cause });
  }

  let payload;
  try {
    payload = await response.json();
  } catch (cause) {
    if (!response.ok && response.status >= 500) {
      throw new Error("The ChurchConnect service is temporarily unavailable.", { cause });
    }
    throw new Error("The server returned an unreadable response.", { cause });
  }
  if (!response.ok) {
    const error = new Error(payload.error || (response.status >= 500
      ? "The ChurchConnect service is temporarily unavailable."
      : "Something went wrong. Please try again."));
    error.status = response.status;
    error.details = payload.details;
    throw error;
  }
  return payload.data;
}

export const publicApi = {
  events: () => api("/public/events"),
  sermons: (search = "") => api(`/public/sermons${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  pray: (data) => api("/public/prayer-requests", { method: "POST", body: JSON.stringify(data) }),
  contact: (data) => api("/public/contact-messages", { method: "POST", body: JSON.stringify(data) })
};

export const adminApi = {
  login: (data) => api("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => api("/auth/logout", { method: "POST" }),
  me: () => api("/auth/me"),
  overview: () => api("/admin/overview"),
  records: (collection) => api(`/admin/${collection}`),
  create: (collection, data) => api(`/admin/${collection}`, { method: "POST", body: JSON.stringify(data) }),
  update: (collection, id, data) => api(`/admin/${collection}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (collection, id) => api(`/admin/${collection}/${id}`, { method: "DELETE" }),
  prayerRequests: () => api("/admin/prayer-requests"),
  contactMessages: () => api("/admin/contact-messages")
};
