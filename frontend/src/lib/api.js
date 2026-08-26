const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const USERS_STORAGE_KEY = "aut_ce_registered_users_v2";

if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("aut_ce_dynamic_courses");
    localStorage.removeItem("aut_ce_enrollments");
    localStorage.removeItem("aut_ce_registered_users");
    // Enrollments and courses are served straight from the backend now. Drop the
    // old caches so a stale entry can never be shown as if it were real data.
    localStorage.removeItem("aut_ce_enrollments_v2");
    localStorage.removeItem("aut_ce_dynamic_courses_v2");
  } catch {}
}

function getAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("aut_ce_school_auth_v2");
    return raw ? JSON.parse(raw)?.token || null : null;
  } catch {
    return null;
  }
}

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    // Only warn in development
    if (process.env.NODE_ENV !== "production") {
      console.warn(`API Error [${endpoint}]:`, error.message);
    }
    if (error instanceof TypeError) {
      // fetch() only throws TypeError when the request never reached the server.
      throw new Error(
        "ارتباط با سرور سامانه برقرار نشد. لطفاً از اتصال شبکه اطمینان حاصل کرده و مجدداً تلاش نمایید."
      );
    }
    throw error;
  }
}

// ----------------------------------------------------
// Local Storage Dynamic Registered Users Fallback
// ----------------------------------------------------
export function getLocalUsers() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalUser(user) {
  if (typeof window === "undefined") return;
  const current = getLocalUsers();
  const updated = [user, ...current.filter((u) => u.national_id !== user.national_id)];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
}

// ----------------------------------------------------
// Auth API with Fallback
// ----------------------------------------------------
export async function apiLogin(identifier, password) {
  // Authentication is always delegated to the backend. There is deliberately no
  // offline fallback here: a client-side credential check can be bypassed by the
  // client and would hand out an ADMIN session to anyone.
  return await fetchFromAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function apiRegister(userData) {
  // Like login, account creation must go through the backend so that uniqueness
  // and password hashing are enforced server-side.
  return await fetchFromAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// ----------------------------------------------------
// Courses API — the backend owns the catalogue.
// ----------------------------------------------------
export async function apiGetCourses() {
  return await fetchFromAPI("/courses/");
}

export async function apiGetCourseDetail(identifier) {
  return await fetchFromAPI(`/courses/${identifier}`);
}

export async function apiCreateCourse(courseData) {
  // No local fallback: a course that only exists in localStorage is invisible to
  // students and to every other admin.
  return await fetchFromAPI("/courses/", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
}

export async function apiUpdateCourse(courseId, courseData) {
  return await fetchFromAPI(`/courses/${courseId}`, {
    method: "PUT",
    body: JSON.stringify(courseData),
  });
}

export async function apiDeleteCourse(courseId) {
  return await fetchFromAPI(`/courses/${courseId}`, {
    method: "DELETE",
  });
}

// ----------------------------------------------------
// Instructors API
// ----------------------------------------------------
export async function apiGetInstructors() {
  return await fetchFromAPI("/instructors/");
}

export async function apiCreateInstructor(data) {
  return await fetchFromAPI("/instructors/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateInstructor(instructorId, data) {
  return await fetchFromAPI(`/instructors/${instructorId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteInstructor(instructorId) {
  return await fetchFromAPI(`/instructors/${instructorId}`, {
    method: "DELETE",
  });
}

// ----------------------------------------------------
// Certificates API
// ----------------------------------------------------
export async function apiGetCertificatesAdmin() {
  return await fetchFromAPI("/certificates/admin/all");
}

export async function apiIssueCertificate(enrollmentId) {
  return await fetchFromAPI("/certificates/admin/issue", {
    method: "POST",
    body: JSON.stringify({ enrollment_id: enrollmentId }),
  });
}

export async function apiRevokeCertificate(certificateId) {
  return await fetchFromAPI(`/certificates/admin/${certificateId}`, {
    method: "DELETE",
  });
}

export async function apiVerifyCertificate(serialNumber) {
  return await fetchFromAPI(`/certificates/verify/${serialNumber}`);
}

// ----------------------------------------------------
// Enrollments API with Fallback
// ----------------------------------------------------
// Enrollments are academic records: the backend is the single source of truth.
// These helpers deliberately have no offline fallback — inventing a local record
// would tell a student they are registered when the server rejected the request.
export async function apiCreateBatchEnrollment(data) {
  return await fetchFromAPI("/enrollments/batch", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetUserEnrollments(identifier) {
  const cleanId = String(identifier).trim();
  // An empty array is a valid answer ("this student has no courses"), so it is
  // returned as-is rather than being treated as a miss.
  return await fetchFromAPI(`/enrollments/user/${cleanId}`);
}

export async function apiGetAllEnrollmentsAdmin() {
  return await fetchFromAPI("/enrollments/admin/all");
}

export async function apiUpdateEnrollmentStatus(enrollmentId, status, finalGrade = null) {
  return await fetchFromAPI(`/enrollments/admin/${enrollmentId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, final_grade: finalGrade }),
  });
}

export async function apiDeleteEnrollmentAdmin(enrollmentId) {
  return await fetchFromAPI(`/enrollments/admin/${enrollmentId}`, {
    method: "DELETE",
  });
}

export async function apiDropEnrollment(enrollmentId) {
  return await fetchFromAPI(`/enrollments/${enrollmentId}`, {
    method: "DELETE",
  });
}

export async function apiUpdateUserProfile(profileData) {
  // Server-side only: the backend resolves the target account from the bearer
  // token, so a client cannot edit someone else's profile.
  return await fetchFromAPI("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}
