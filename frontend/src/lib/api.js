const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const DYNAMIC_COURSES_KEY = "aut_ce_dynamic_courses";

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

// Dynamic local storage fallback for courses
export function getLocalDynamicCourses() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DYNAMIC_COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalDynamicCourse(course) {
  if (typeof window === "undefined") return;
  const current = getLocalDynamicCourses();
  const updated = [course, ...current.filter((c) => c.id !== course.id)];
  localStorage.setItem(DYNAMIC_COURSES_KEY, JSON.stringify(updated));
}

export function deleteLocalDynamicCourse(courseId) {
  if (typeof window === "undefined") return;
  const current = getLocalDynamicCourses();
  const updated = current.filter((c) => c.id !== courseId && c.course_number !== courseId);
  localStorage.setItem(DYNAMIC_COURSES_KEY, JSON.stringify(updated));
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

export async function apiCreateCourse(courseData) {
  try {
    const res = await fetchFromAPI("/courses/", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
    saveLocalDynamicCourse(res);
    return res;
  } catch (err) {
    // Local fallback creation
    const fallbackCourse = {
      id: `dyn-${Date.now()}`,
      course_number: Date.now() % 1000 + 8,
      title_fa: courseData.title_fa,
      title: courseData.title_fa,
      title_en: courseData.title_en,
      englishTitle: courseData.title_en,
      instructor: courseData.instructor_name,
      instructor_name: courseData.instructor_name,
      field: courseData.field,
      type: courseData.type,
      units: courseData.units,
      level: courseData.level,
      course_level: courseData.course_level,
      price: courseData.price,
      capacity: courseData.capacity,
      description: courseData.description,
      prerequisites: courseData.prerequisites,
      topics: courseData.topics || [],
      objectives: courseData.objectives || [],
      is_active: true,
      created_at: new Date().toISOString(),
    };
    saveLocalDynamicCourse(fallbackCourse);
    return fallbackCourse;
  }
}

export async function apiDeleteCourse(courseId) {
  try {
    await fetchFromAPI(`/courses/${courseId}`, {
      method: "DELETE",
    });
  } catch {
    // Ignore if backend offline
  }
  deleteLocalDynamicCourse(courseId);
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
