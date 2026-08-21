const AUTH_STORAGE_KEY = "aut_ce_school_auth";

export function saveAuthSession(token, user) {
  if (typeof window === "undefined") return;
  const session = {
    token,
    user,
    timestamp: Date.now(),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const session = getAuthSession();
  return session?.user || null;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function updateAuthUser(updatedUser) {
  if (typeof window === "undefined") return;
  const session = getAuthSession() || {};
  session.user = { ...session.user, ...updatedUser };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function isAdminUser() {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
}
