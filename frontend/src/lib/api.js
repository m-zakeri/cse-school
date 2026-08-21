import { courses as sampleCourses } from "@/data/sampleData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const DYNAMIC_COURSES_KEY = "aut_ce_dynamic_courses";
const ENROLLMENTS_STORAGE_KEY = "aut_ce_enrollments";
const USERS_STORAGE_KEY = "aut_ce_registered_users";

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
    // Only warn in development
    if (process.env.NODE_ENV !== "production") {
      console.warn(`API Error [${endpoint}]:`, error.message);
    }
    throw error;
  }
}

// ----------------------------------------------------
// Local Storage Dynamic Courses Fallback
// ----------------------------------------------------
export function getLocalDynamicCourses() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DYNAMIC_COURSES_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.filter((c) => {
      const title = c.title_fa || c.title || "";
      const inst = c.instructor_name || c.instructor || "";
      return !title.includes("?") && !inst.includes("?");
    });
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
  const updated = current.filter(
    (c) => c.id !== courseId && c.course_number !== courseId
  );
  localStorage.setItem(DYNAMIC_COURSES_KEY, JSON.stringify(updated));
}

// ----------------------------------------------------
// Local Storage Dynamic Enrollments Fallback
// ----------------------------------------------------
export function getLocalEnrollments() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalEnrollments(enrollmentList) {
  if (typeof window === "undefined") return;
  const current = getLocalEnrollments();
  const newIds = new Set(enrollmentList.map((e) => e.id));
  const merged = [
    ...enrollmentList,
    ...current.filter((e) => !newIds.has(e.id)),
  ];
  localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(merged));
}

export function deleteLocalEnrollment(enrollmentId) {
  if (typeof window === "undefined") return;
  const current = getLocalEnrollments();
  const updated = current.filter((e) => e.id !== enrollmentId);
  localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(updated));
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
  try {
    return await fetchFromAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
  } catch (err) {
    // Offline / GitHub Pages Fallback
    const cleanId = identifier.trim().toLowerCase();

    // 1. Admin login check
    if (
      cleanId === "admin" ||
      cleanId === "admin@aut.ac.ir" ||
      cleanId === "0019988776" ||
      cleanId === "0000000000"
    ) {
      if (password && password !== "Admin@AUT1404!" && password !== "admin" && password !== "123456") {
        throw new Error("کلمه عبور وارد شده برای مدیر سامانه نادرست است.");
      }

      const adminUser = {
        id: "admin-uuid",
        national_id: "0019988776",
        phone_number: "09121234567",
        email: "admin@aut.ac.ir",
        full_name: "مدیر آموزش دانشکده مهندسی کامپیوتر",
        role: "ADMIN",
        university: "دانشگاه صنعتی امیرکبیر",
        education_level: "faculty",
      };
      saveLocalUser(adminUser);
      return {
        access_token: "mock-admin-token",
        token_type: "bearer",
        user: adminUser,
      };
    }

    // 2. Pre-registered local users
    const localUsers = getLocalUsers();
    const found = localUsers.find(
      (u) =>
        u.national_id === cleanId ||
        u.phone_number === cleanId ||
        u.email?.toLowerCase() === cleanId
    );

    if (found) {
      return {
        access_token: "mock-student-token",
        token_type: "bearer",
        user: found,
      };
    }

    // 3. Reject unknown user
    throw new Error(
      "کاربری با این مشخصات یافت نشد. لطفاً ابتدا از تب «ثبت‌نام جدید» در سامانه ثبت‌نام نمایید."
    );
  }
}

export async function apiRegister(userData) {
  try {
    return await fetchFromAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (err) {
    // If backend responded with validation/duplicate error, throw it directly
    if (
      err.message &&
      (err.message.includes("قبلاً") ||
        err.message.includes("ثبت‌نام کرده") ||
        err.message.includes("نامعتبر") ||
        err.message.includes("الزامی"))
    ) {
      throw err;
    }

    // Offline / GitHub Pages Fallback: Check duplicates in local database
    const localUsers = getLocalUsers();
    const cleanNationalId = userData.national_id.trim();
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanPhone = userData.phone_number.trim();

    // Check duplicate national ID
    if (localUsers.some((u) => u.national_id === cleanNationalId)) {
      throw new Error("کاربری با این کد ملی قبلاً در سامانه ثبت‌نام کرده است.");
    }
    // Check duplicate email
    if (localUsers.some((u) => u.email?.toLowerCase() === cleanEmail)) {
      throw new Error("کاربری با این آدرس ایمیل قبلاً در سامانه ثبت‌نام کرده است.");
    }
    // Check duplicate phone number
    if (localUsers.some((u) => u.phone_number === cleanPhone)) {
      throw new Error("کاربری با این شماره تلفن همراه قبلاً در سامانه ثبت‌نام کرده است.");
    }

    const createdUser = {
      id: `usr-${Date.now()}`,
      national_id: cleanNationalId,
      phone_number: cleanPhone,
      email: cleanEmail,
      full_name: userData.full_name.trim(),
      password: userData.password,
      role: "STUDENT",
      university: userData.university || "دانشگاه صنعتی امیرکبیر",
      education_level: userData.education_level || "bachelor_student",
      field_of_study: userData.field_of_study || "مهندسی کامپیوتر",
    };
    saveLocalUser(createdUser);
    return {
      access_token: "mock-student-token",
      token_type: "bearer",
      user: createdUser,
    };
  }
}

// ----------------------------------------------------
// Courses API with Fallback
// ----------------------------------------------------
export async function apiGetCourses() {
  try {
    return await fetchFromAPI("/courses/");
  } catch {
    const dyn = getLocalDynamicCourses();
    return [...dyn, ...sampleCourses];
  }
}

export async function apiGetCourseDetail(identifier) {
  try {
    return await fetchFromAPI(`/courses/${identifier}`);
  } catch {
    const dyn = getLocalDynamicCourses();
    const foundDyn = dyn.find(
      (c) => String(c.id) === String(identifier) || String(c.course_number) === String(identifier)
    );
    if (foundDyn) return foundDyn;
    return sampleCourses.find(
      (c) => String(c.id) === String(identifier) || String(c.course_number) === String(identifier)
    );
  }
}

export async function apiCreateCourse(courseData) {
  try {
    const res = await fetchFromAPI("/courses/", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
    saveLocalDynamicCourse(res);
    return res;
  } catch {
    const fallbackCourse = {
      id: `dyn-${Date.now()}`,
      course_number: (Date.now() % 1000) + 8,
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
    // Offline
  }
  deleteLocalDynamicCourse(courseId);
}

// ----------------------------------------------------
// Enrollments API with Fallback
// ----------------------------------------------------
export async function apiCreateBatchEnrollment(data) {
  try {
    const res = await fetchFromAPI("/enrollments/batch", {
      method: "POST",
      body: JSON.stringify(data),
    });
    saveLocalEnrollments(res);
    return res;
  } catch {
    // Offline / GitHub Pages Fallback
    const trackingCode = `AUT-1404-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const allCourses = [...getLocalDynamicCourses(), ...sampleCourses];

    const generated = data.course_ids.map((cId, idx) => {
      const courseObj = allCourses.find(
        (c) => String(c.id) === String(cId) || String(c.course_number) === String(cId)
      ) || {
        id: cId,
        title_fa: `دوره آموزشی ${cId}`,
        title: `دوره آموزشی ${cId}`,
        instructor_name: "عضو هیئت علمی",
        units: 3,
      };

      return {
        id: `enr-${Date.now()}-${idx}`,
        user_id: `usr-${data.national_id}`,
        course_id: courseObj.id,
        tracking_code: trackingCode,
        status: "APPROVED",
        final_grade: null,
        created_at: new Date().toISOString(),
        course: {
          id: courseObj.id,
          course_number: courseObj.course_number || courseObj.id,
          title_fa: courseObj.title_fa || courseObj.title,
          title_en: courseObj.title_en || courseObj.englishTitle,
          instructor_name: courseObj.instructor_name || courseObj.instructor,
          units: courseObj.units,
          level: courseObj.level || "کارشناسی ارشد",
          price: courseObj.price || 2500000,
        },
        user: {
          national_id: data.national_id,
          phone_number: data.phone_number,
          email: data.email,
          full_name: data.full_name,
        },
      };
    });

    saveLocalEnrollments(generated);
    return generated;
  }
}

export async function apiGetUserEnrollments(identifier) {
  const cleanId = String(identifier).trim();
  try {
    const res = await fetchFromAPI(`/enrollments/user/${cleanId}`);
    if (Array.isArray(res) && res.length > 0) {
      saveLocalEnrollments(res);
      return res;
    }
  } catch {
    // Fallback to local storage
  }

  const localList = getLocalEnrollments();
  return localList.filter(
    (e) =>
      e.user?.national_id === cleanId ||
      e.user?.phone_number === cleanId ||
      e.user?.email === cleanId ||
      e.user_id === `usr-${cleanId}`
  );
}

export async function apiGetAllEnrollmentsAdmin() {
  try {
    const res = await fetchFromAPI("/enrollments/admin/all");
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
  } catch {
    // Fallback
  }
  return getLocalEnrollments();
}

export async function apiUpdateEnrollmentStatus(enrollmentId, status, finalGrade = null) {
  try {
    return await fetchFromAPI(`/enrollments/admin/${enrollmentId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, final_grade: finalGrade }),
    });
  } catch {
    const localList = getLocalEnrollments();
    const updated = localList.map((e) => {
      if (e.id === enrollmentId) {
        return {
          ...e,
          status,
          ...(finalGrade !== null ? { final_grade: finalGrade } : {}),
        };
      }
      return e;
    });
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated.find((e) => e.id === enrollmentId);
  }
}

export async function apiDeleteEnrollmentAdmin(enrollmentId) {
  try {
    await fetchFromAPI(`/enrollments/admin/${enrollmentId}`, {
      method: "DELETE",
    });
  } catch {
    // Offline
  }
  deleteLocalEnrollment(enrollmentId);
}

export async function apiDropEnrollment(enrollmentId) {
  try {
    await fetchFromAPI(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });
  } catch {
    // Offline
  }
  deleteLocalEnrollment(enrollmentId);
}

export async function apiUpdateUserProfile(profileData) {
  try {
    return await fetchFromAPI("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  } catch {
    saveLocalUser(profileData);
    return profileData;
  }
}

export async function apiSendOTP(identifier) {
  try {
    return await fetchFromAPI("/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ identifier }),
    });
  } catch {
    // Offline Mock OTP
    return {
      message: "کد تأیید یکبارمصرف ارسال شد.",
      mock_code: "123456",
      expires_in: 120,
    };
  }
}

export async function apiVerifyOTP(data) {
  try {
    return await fetchFromAPI("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // Offline Mock OTP verification
    const cleanId = data.identifier.trim();
    const mockUser = {
      id: `usr-${cleanId}`,
      national_id: cleanId.length === 10 ? cleanId : "0019988776",
      phone_number: cleanId.startsWith("09") ? cleanId : "09120000000",
      email: cleanId.includes("@") ? cleanId : `user_${cleanId}@aut.ac.ir`,
      full_name: "دانشجوی گرامی",
      role: "STUDENT",
      university: "دانشگاه صنعتی امیرکبیر",
    };
    saveLocalUser(mockUser);
    return {
      access_token: "mock-otp-token",
      token_type: "bearer",
      user: mockUser,
    };
  }
}
