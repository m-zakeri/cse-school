const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// Auth API
export async function apiLogin(identifier, password) {
  return await fetchFromAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function apiRegister(userData) {
  return await fetchFromAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Courses API
export async function apiGetCourses() {
  return await fetchFromAPI("/courses/");
}

export async function apiGetCourseDetail(identifier) {
  return await fetchFromAPI(`/courses/${identifier}`);
}

// Enrollments API
export async function apiCreateBatchEnrollment(data) {
  return await fetchFromAPI("/enrollments/batch", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetUserEnrollments(nationalId) {
  return await fetchFromAPI(`/enrollments/user/${nationalId}`);
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
