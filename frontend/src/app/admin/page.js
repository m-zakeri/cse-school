"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser, saveAuthSession, clearAuthSession } from "@/lib/auth";
import {
  apiGetAllEnrollmentsAdmin,
  apiUpdateEnrollmentStatus,
  apiDeleteEnrollmentAdmin,
  apiGetCourses,
  apiCreateCourse,
  apiUpdateCourse,
  apiDeleteCourse,
  apiGetInstructors,
  apiCreateInstructor,
  apiUpdateInstructor,
  apiDeleteInstructor,
  apiGetCertificatesAdmin,
  apiIssueCertificate,
  apiRevokeCertificate,
  apiLogin,
} from "@/lib/api";
import {
  ShieldCheckIcon,
  UsersIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SearchIcon,
  AwardIcon,
  ClockIcon,
  UserPlusIcon,
  CodeIcon,
  SparklesIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
} from "@/components/Icons";
import {
  toPersianDigits,
  toEnglishDigits,
  formatPriceToman,
  formatTrackingCode,
} from "@/lib/formatters";
import CustomModal from "@/components/UI/CustomModal";

// Mirrors CourseCreate on the backend, so an admin can fill in every field the
// API accepts rather than the handful the form used to expose.
const EMPTY_COURSE = {
  title_fa: "",
  title_en: "",
  instructor_id: "",
  instructor_name: "",
  field: "مهندسی کامپیوتر – نرم‌افزار",
  type: "اختصاصی",
  units: "۳ واحد",
  level: "کارشناسی ارشد",
  course_level: "متوسط",
  price: 2500000,
  capacity: 30,
  prerequisites: "",
  corequisites: "",
  prerequisite_topics: "",
  duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه)",
  delivery_method: "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
  description: "",
  assignments_info: "",
  author: "",
  version: "۱.۰",
  topicsText: "",
  objectivesText: "",
  targetAudienceText: "",
  softwareToolsText: "",
  gradingText: "",
  referencesText: "",
};

const EMPTY_INSTRUCTOR = {
  name: "",
  position: "استادیار دانشکده مهندسی کامپیوتر",
  department: "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
  specialization: "",
  image_url: "",
  profile_link: "",
  bio: "",
};

const FIELD_OPTIONS = [
  "مهندسی کامپیوتر – نرم‌افزار",
  "مهندسی کامپیوتر – هوش مصنوعی",
  "رایانش ابری و زیرساخت",
  "امنیت و شبکه",
];

const TYPE_OPTIONS = ["اختصاصی", "اختیاری", "عمومی"];
const COURSE_LEVEL_OPTIONS = ["مبتدی", "مبتدی و متوسط", "متوسط", "پیشرفته"];

/** Splits a textarea into trimmed, non-empty lines. */
function linesOf(text) {
  return (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * Parses "label|percent" lines into the grading_info objects the API stores.
 * A line without a separator keeps an empty percent rather than being dropped.
 */
function parseGrading(text) {
  return linesOf(text).map((line) => {
    const [label, percent] = line.split("|").map((p) => p?.trim());
    return { label: label || line, percent: percent || "" };
  });
}

/** Software tools are stored as objects; accept "name|note" lines. */
function parseTools(text) {
  return linesOf(text).map((line) => {
    const [name, note] = line.split("|").map((p) => p?.trim());
    return { name: name || line, note: note || "" };
  });
}

function getInstructorName(course) {
  if (!course) return "عضو هیئت علمی";
  if (course.instructor_name && typeof course.instructor_name === "string") {
    return course.instructor_name;
  }
  if (course.instructor) {
    if (typeof course.instructor === "string") return course.instructor;
    if (typeof course.instructor === "object" && course.instructor.name) {
      return course.instructor.name;
    }
  }
  return "عضو هیئت علمی دانشگاه صنعتی امیرکبیر";
}

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ENROLLMENTS"); // "ENROLLMENTS" | "ANALYTICS" | "COURSES" | "NEW_COURSE"

  // Modal Dialog State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "danger",
    title: "",
    message: "",
    confirmText: "تأیید",
    cancelText: "انصراف",
    isConfirm: true,
    onConfirm: null,
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@aut.ac.ir");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enrollments State
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  // Courses State
  const [allCourses, setAllCourses] = useState([]);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseSuccessMsg, setCourseSuccessMsg] = useState("");
  const [courseErrorMsg, setCourseErrorMsg] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Instructors State
  const [instructors, setInstructors] = useState([]);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  const [isSubmittingInstructor, setIsSubmittingInstructor] = useState(false);
  const [instructorSuccessMsg, setInstructorSuccessMsg] = useState("");
  const [instructorErrorMsg, setInstructorErrorMsg] = useState("");
  const [newInstructor, setNewInstructor] = useState({ ...EMPTY_INSTRUCTOR });

  // Certificates State
  const [certificates, setCertificates] = useState([]);

  // Per-row grade drafts, so a typed grade survives re-renders until it is saved.
  const [gradeDrafts, setGradeDrafts] = useState({});

  const isGradeDirty = (enr) => {
    const draft = gradeDrafts[enr.id];
    if (draft === undefined) return false;
    const saved = enr.final_grade == null ? "" : String(enr.final_grade);
    return draft.trim() !== saved;
  };

  // Panel-wide feedback
  const [panelError, setPanelError] = useState("");
  const [panelSuccess, setPanelSuccess] = useState("");

  // New / Edit Course Form State
  const [newCourse, setNewCourse] = useState({ ...EMPTY_COURSE });

  const notifyError = (err, fallback) => {
    setPanelSuccess("");
    setPanelError(err?.message || fallback);
  };

  const notifySuccess = (text) => {
    setPanelError("");
    setPanelSuccess(text);
  };

  const loadData = async () => {
    // Everything below is authoritative backend state. A failure is surfaced
    // rather than silently replaced with sample data.
    const [enr, courseList, instructorList, certList] = await Promise.allSettled([
      apiGetAllEnrollmentsAdmin(),
      apiGetCourses(),
      apiGetInstructors(),
      apiGetCertificatesAdmin(),
    ]);

    const failures = [];

    if (enr.status === "fulfilled") {
      setEnrollments(Array.isArray(enr.value) ? enr.value : []);
    } else {
      setEnrollments([]);
      failures.push("پرونده‌های ثبت‌نام");
    }

    if (courseList.status === "fulfilled") {
      setAllCourses(Array.isArray(courseList.value) ? courseList.value : []);
    } else {
      setAllCourses([]);
      failures.push("فهرست دوره‌ها");
    }

    if (instructorList.status === "fulfilled") {
      setInstructors(Array.isArray(instructorList.value) ? instructorList.value : []);
    } else {
      setInstructors([]);
      failures.push("فهرست اساتید");
    }

    if (certList.status === "fulfilled") {
      setCertificates(Array.isArray(certList.value) ? certList.value : []);
    } else {
      setCertificates([]);
      failures.push("گواهینامه‌ها");
    }

    if (failures.length > 0) {
      setPanelError(
        `دریافت ${failures.join("، ")} از سامانه ممکن نشد. لطفاً صفحه را مجدداً بارگذاری نمایید.`
      );
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const user = getCurrentUser();
    if (user && user.role === "ADMIN") {
      setAdminUser(user);
      loadData();
    }
  }, []);

  const handleDirectLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await apiLogin(loginEmail.trim(), loginPassword);
      if (res.user && res.user.role === "ADMIN") {
        saveAuthSession(res.access_token, res.user);
        setAdminUser(res.user);
        loadData();
        return;
      }
      setLoginError("حساب کاربری شما دارای سطح دسترسی مدیریت نیست.");
    } catch (err) {
      setLoginError(err?.message || "پست الکترونیکی یا کلمه عبور مدیریت نادرست است.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const applyEnrollmentUpdate = (enrId, patch) => {
    setEnrollments((prev) =>
      prev.map((item) => (item.id === enrId ? { ...item, ...patch } : item))
    );
  };

  const handleStatusChange = async (enrId, newStatus) => {
    try {
      await apiUpdateEnrollmentStatus(enrId, newStatus);
      applyEnrollmentUpdate(enrId, { status: newStatus });
      notifySuccess("وضعیت پرونده ثبت‌نام به‌روزرسانی شد.");
    } catch (err) {
      notifyError(err, "تغییر وضعیت پرونده ثبت نشد.");
    }
  };

  /** Cycles a record between "registered" and "completed". */
  const handleToggleStatus = (enrId, currentStatus) => {
    const nextStatus = currentStatus === "COMPLETED" ? "REGISTERED" : "COMPLETED";
    return handleStatusChange(enrId, nextStatus);
  };

  const handleGradeChange = async (enrId, currentStatus, rawGrade) => {
    const trimmed = String(rawGrade ?? "").trim();
    const newGrade = trimmed === "" ? null : Number(toEnglishDigits(trimmed));

    if (newGrade !== null && (Number.isNaN(newGrade) || newGrade < 0 || newGrade > 20)) {
      notifyError(null, "نمره باید عددی بین ۰ تا ۲۰ باشد.");
      return;
    }

    try {
      await apiUpdateEnrollmentStatus(enrId, currentStatus, newGrade);
      applyEnrollmentUpdate(enrId, { final_grade: newGrade });
      // Clear the draft so the row falls back to the saved value.
      setGradeDrafts((prev) => {
        const next = { ...prev };
        delete next[enrId];
        return next;
      });
      notifySuccess("نمره نهایی دانشجو ثبت شد.");
    } catch (err) {
      notifyError(err, "ثبت نمره انجام نشد.");
    }
  };

  const handleDeleteEnrollment = (enrId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "تأیید حذف پرونده دانشجو",
      message: "آیا از حذف این پرونده ثبت‌نام اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
      confirmText: "بله، حذف پرونده",
      cancelText: "انصراف",
      isConfirm: true,
      onConfirm: async () => {
        try {
          await apiDeleteEnrollmentAdmin(enrId);
          // Only drop the row once the server confirms the delete.
          setEnrollments((prev) => prev.filter((item) => item.id !== enrId));
          notifySuccess("پرونده ثبت‌نام دانشجو حذف شد.");
        } catch (err) {
          notifyError(err, "حذف پرونده ثبت‌نام انجام نشد.");
        }
      },
    });
  };

  // --- Certificates -------------------------------------------------------
  const handleIssueCertificate = async (enrId) => {
    try {
      const cert = await apiIssueCertificate(enrId);
      setCertificates((prev) => [cert, ...prev]);
      notifySuccess(`گواهینامه با شماره سریال ${cert.serial_number} صادر شد.`);
    } catch (err) {
      notifyError(err, "صدور گواهینامه انجام نشد.");
    }
  };

  const handleRevokeCertificate = (certId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "تأیید ابطال گواهینامه",
      message: "آیا از ابطال این گواهینامه اطمینان دارید؟ پس از ابطال، استعلام آنلاین آن نامعتبر می‌شود.",
      confirmText: "بله، ابطال کن",
      cancelText: "انصراف",
      isConfirm: true,
      onConfirm: async () => {
        try {
          await apiRevokeCertificate(certId);
          setCertificates((prev) => prev.filter((c) => c.id !== certId));
          notifySuccess("گواهینامه ابطال شد.");
        } catch (err) {
          notifyError(err, "ابطال گواهینامه انجام نشد.");
        }
      },
    });
  };

  // --- Instructors --------------------------------------------------------
  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingInstructor(true);
    setInstructorSuccessMsg("");
    setInstructorErrorMsg("");

    const payload = {
      name: newInstructor.name.trim(),
      position: newInstructor.position.trim() || null,
      department: newInstructor.department.trim(),
      specialization: newInstructor.specialization.trim() || null,
      image_url: newInstructor.image_url.trim() || null,
      profile_link: newInstructor.profile_link.trim() || null,
      bio: newInstructor.bio.trim() || null,
    };

    try {
      if (editingInstructorId) {
        const updated = await apiUpdateInstructor(editingInstructorId, payload);
        setInstructors((prev) =>
          prev.map((i) => (i.id === editingInstructorId ? updated : i))
        );
        setInstructorSuccessMsg(`مشخصات «${updated.name}» به‌روزرسانی شد.`);
      } else {
        const created = await apiCreateInstructor(payload);
        setInstructors((prev) => [...prev, created]);
        setInstructorSuccessMsg(`استاد «${created.name}» با موفقیت ثبت شد.`);
      }
      setNewInstructor({ ...EMPTY_INSTRUCTOR });
      setEditingInstructorId(null);
    } catch (err) {
      setInstructorErrorMsg(err.message || "ثبت مشخصات استاد انجام نشد.");
    } finally {
      setIsSubmittingInstructor(false);
    }
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructorId(instructor.id);
    setInstructorSuccessMsg("");
    setInstructorErrorMsg("");
    setNewInstructor({
      name: instructor.name || "",
      position: instructor.position || "",
      department: instructor.department || EMPTY_INSTRUCTOR.department,
      specialization: instructor.specialization || "",
      image_url: instructor.image_url || "",
      profile_link: instructor.profile_link || "",
      bio: instructor.bio || "",
    });
    setActiveTab("INSTRUCTORS");
  };

  const handleDeleteInstructor = (instructorId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "تأیید حذف استاد",
      message: "آیا از حذف این استاد از سامانه اطمینان دارید؟",
      confirmText: "بله، حذف استاد",
      cancelText: "انصراف",
      isConfirm: true,
      onConfirm: async () => {
        try {
          await apiDeleteInstructor(instructorId);
          setInstructors((prev) => prev.filter((i) => i.id !== instructorId));
          notifySuccess("استاد از سامانه حذف شد.");
        } catch (err) {
          notifyError(err, "حذف استاد انجام نشد.");
        }
      },
    });
  };

  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingCourse(true);
    setCourseSuccessMsg("");
    setCourseErrorMsg("");

    const formattedTopics = linesOf(newCourse.topicsText).map((line, idx) => {
      const [title, description] = line.split("|").map((p) => p?.trim());
      return {
        order_index: idx + 1,
        title: title || line,
        description: description || null,
        sessions_count: 1,
      };
    });

    const coursePayload = {
      title_fa: newCourse.title_fa.trim(),
      title_en: newCourse.title_en.trim(),
      field: newCourse.field,
      type: newCourse.type,
      units: newCourse.units,
      level: newCourse.level,
      course_level: newCourse.course_level,
      price: Number(newCourse.price),
      capacity: Number(newCourse.capacity),
      prerequisites: newCourse.prerequisites.trim() || "ندارد",
      corequisites: newCourse.corequisites.trim() || null,
      prerequisite_topics: newCourse.prerequisite_topics.trim() || null,
      duration: newCourse.duration.trim() || null,
      delivery_method: newCourse.delivery_method.trim(),
      description: newCourse.description.trim(),
      assignments_info: newCourse.assignments_info.trim() || null,
      author: newCourse.author.trim() || null,
      version: newCourse.version.trim() || "۱.۰",
      topics: formattedTopics,
      objectives: linesOf(newCourse.objectivesText),
      target_audience: linesOf(newCourse.targetAudienceText),
      software_tools: parseTools(newCourse.softwareToolsText),
      grading_info: parseGrading(newCourse.gradingText),
      references: linesOf(newCourse.referencesText),
    };

    // Prefer an existing instructor; fall back to creating one by name.
    if (newCourse.instructor_id) {
      coursePayload.instructor_id = newCourse.instructor_id;
    } else {
      coursePayload.instructor_name = newCourse.instructor_name.trim();
    }

    try {
      if (editingCourseId) {
        const updated = await apiUpdateCourse(editingCourseId, coursePayload);
        setAllCourses((prev) =>
          prev.map((c) => (c.id === editingCourseId ? updated : c))
        );
        setCourseSuccessMsg(`دوره «${updated.title_fa}» با موفقیت به‌روزرسانی شد.`);
      } else {
        const created = await apiCreateCourse(coursePayload);
        setAllCourses((prev) => [created, ...prev]);
        setCourseSuccessMsg(`دوره «${created.title_fa}» با موفقیت در سامانه تعریف و ثبت شد.`);
      }

      // A newly named instructor may have just been created server-side.
      apiGetInstructors().then(setInstructors).catch(() => {});

      setNewCourse({ ...EMPTY_COURSE });
      setEditingCourseId(null);

      setTimeout(() => {
        setActiveTab("COURSES");
        setCourseSuccessMsg("");
      }, 1500);
    } catch (err) {
      setCourseErrorMsg(err.message || "خطا در ثبت دوره.");
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseSuccessMsg("");
    setCourseErrorMsg("");
    setNewCourse({
      title_fa: course.title_fa || "",
      title_en: course.title_en || "",
      instructor_id: course.instructor?.id || "",
      instructor_name: course.instructor?.name || "",
      field: course.field || EMPTY_COURSE.field,
      type: course.type || EMPTY_COURSE.type,
      units: course.units || EMPTY_COURSE.units,
      level: course.level || EMPTY_COURSE.level,
      course_level: course.course_level || EMPTY_COURSE.course_level,
      price: Number(course.price) || 0,
      capacity: Number(course.capacity) || 30,
      prerequisites: course.prerequisites || "",
      corequisites: course.corequisites || "",
      prerequisite_topics: course.prerequisite_topics || "",
      duration: course.duration || "",
      delivery_method: course.delivery_method || EMPTY_COURSE.delivery_method,
      description: course.description || "",
      assignments_info: course.assignments_info || "",
      author: course.author || "",
      version: course.version || "۱.۰",
      topicsText: (course.topics || [])
        .map((t) => (t.description ? `${t.title}|${t.description}` : t.title))
        .join("\n"),
      objectivesText: (course.objectives || []).join("\n"),
      targetAudienceText: (course.target_audience || []).join("\n"),
      softwareToolsText: (course.software_tools || [])
        .map((t) => (t.note ? `${t.name}|${t.note}` : t.name || ""))
        .join("\n"),
      gradingText: (course.grading_info || [])
        .map((g) => `${g.label || ""}|${g.percent || ""}`)
        .join("\n"),
      referencesText: (course.references || []).join("\n"),
    });
    setActiveTab("NEW_COURSE");
  };

  const handleDeleteCourse = (courseId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "تأیید حذف دوره آموزشی",
      message: "آیا از حذف این دوره از سامانه اطمینان دارید؟ این دوره از فهرست دوره‌ها و سرفصل‌ها حذف خواهد شد.",
      confirmText: "بله، حذف دوره",
      cancelText: "انصراف",
      isConfirm: true,
      onConfirm: async () => {
        try {
          // courseId is the backend UUID; the list is loaded from the API so the
          // numeric course_number is never sent here.
          await apiDeleteCourse(courseId);
          setAllCourses((prev) => prev.filter((c) => c.id !== courseId));
          notifySuccess("دوره از سامانه حذف شد.");
        } catch (err) {
          notifyError(err, "حذف دوره انجام نشد.");
        }
      },
    });
  };

  const handleLogout = () => {
    clearAuthSession();
    setAdminUser(null);
  };

  // Export to UTF-8 BOM CSV / Excel
  const handleExportCSV = () => {
    if (filteredEnrollments.length === 0) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "گزارش اکسل",
        message: "هیچ پرونده ثبت‌نامی متناسب با فیلترهای انتخابی جهت خروجی اکسل یافت نشد.",
        confirmText: "متوجه شدم",
        isConfirm: false,
        onConfirm: null,
      });
      return;
    }

    const headers = [
      "ردیف",
      "نام دانشجو",
      "کد ملی",
      "شماره تماس",
      "ایمیل",
      "دانشگاه",
      "عنوان دوره",
      "مدرس",
      "کد رهگیری",
      "وضعیت پرونده",
      "تاریخ ثبت‌نام",
    ];

    const rows = filteredEnrollments.map((enr, idx) => {
      const fullName = enr.user?.full_name || enr.full_name || "—";
      const nationalId = enr.user?.national_id || enr.national_id || "—";
      const phone = enr.user?.phone_number || enr.phone_number || "—";
      const email = enr.user?.email || enr.email || "—";
      const uni = enr.user?.university || "دانشگاه صنعتی امیرکبیر";
      const title = enr.course?.title_fa || enr.course?.title || "دوره آموزشی";
      const instructor =
        enr.course?.instructor_name || enr.course?.instructor || "عضو هیئت علمی";
      const tracking = enr.tracking_code || "—";
      const status =
        enr.status === "REGISTERED"
          ? "در انتظار بررسی"
          : enr.status === "APPROVED"
          ? "تأیید شده / فعال"
          : enr.status === "COMPLETED"
          ? "تکمیل شده"
          : "رد شده / لغو";
      const date = enr.created_at
        ? new Date(enr.created_at).toLocaleDateString("fa-IR")
        : "—";

      return [
        idx + 1,
        `"${fullName}"`,
        `"${nationalId}"`,
        `"${phone}"`,
        `"${email}"`,
        `"${uni}"`,
        `"${title}"`,
        `"${instructor}"`,
        `"${tracking}"`,
        `"${status}"`,
        `"${date}"`,
      ];
    });

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `AUT_CE_Students_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintRoster = () => {
    window.print();
  };

  const filteredEnrollments = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    const cleanDigitsQuery = toEnglishDigits(cleanQuery);

    return enrollments.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const cId = item.course?.course_number || item.course?.id || item.course_id;
      const matchesCourse =
        courseFilter === "ALL" || String(cId) === String(courseFilter);

      if (!cleanQuery) {
        return matchesStatus && matchesCourse;
      }

      // Fields to match
      const nationalId = toEnglishDigits(
        item.user?.national_id || item.national_id || ""
      );
      const phone = toEnglishDigits(
        item.user?.phone_number || item.phone_number || ""
      );
      const tracking = toEnglishDigits(
        item.tracking_code || ""
      ).toLowerCase();
      const rawTracking = (item.tracking_code || "").toLowerCase();
      const fullName = (
        item.user?.full_name ||
        item.full_name ||
        ""
      ).toLowerCase();
      const email = (
        item.user?.email ||
        item.email ||
        ""
      ).toLowerCase();
      const courseTitleFa = (
        item.course?.title_fa ||
        item.course?.title ||
        ""
      ).toLowerCase();
      const instructor = (
        item.course?.instructor_name ||
        item.course?.instructor ||
        ""
      ).toLowerCase();

      const matchesSearch =
        fullName.includes(cleanQuery) ||
        email.includes(cleanQuery) ||
        courseTitleFa.includes(cleanQuery) ||
        instructor.includes(cleanQuery) ||
        rawTracking.includes(cleanQuery) ||
        // Digit matching (support both Persian and English keyboard input)
        (cleanDigitsQuery && (
          nationalId.includes(cleanDigitsQuery) ||
          phone.includes(cleanDigitsQuery) ||
          tracking.includes(cleanDigitsQuery)
        ));

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [enrollments, searchQuery, statusFilter, courseFilter]);

  // Analytics Computation with Strict 1-to-1 Course Matching
  const analyticsData = useMemo(() => {
    const courseBreakdown = allCourses.map((c) => {
      const cNum = Number(c.course_number || c.id) || null;
      const cIdStr = String(c.id || "").toLowerCase();
      const cTitle = (c.title_fa || c.title || "").trim();

      const matchingEnrollments = enrollments.filter((enr) => {
        const enrCourse = enr.course || {};
        const enrNum = Number(enrCourse.course_number) || null;
        const enrId = String(enrCourse.id || enr.course_id || "").toLowerCase();
        const enrTitle = (enrCourse.title_fa || enrCourse.title || "").trim();

        // 1. Strict exact course number match (e.g. 1 === 1)
        if (cNum && enrNum && cNum === enrNum) return true;
        // 2. Strict exact UUID match
        if (cIdStr && enrId && cIdStr === enrId) return true;
        // 3. Strict exact title match
        if (cTitle && enrTitle && cTitle === enrTitle) return true;
        return false;
      });

      const enrolledCount = matchingEnrollments.length;
      const capacity = Number(c.capacity) || 30;

      return {
        id: c.id,
        course_number: c.course_number,
        title: c.title_fa || c.title,
        instructor: getInstructorName(c),
        enrolledCount,
        capacity,
      };
    });

    courseBreakdown.sort((a, b) => b.enrolledCount - a.enrolledCount);

    return {
      coursesBreakdown: courseBreakdown,
      totalEnrollments: enrollments.length,
      completedEnrollments: enrollments.filter((e) => e.status === "COMPLETED").length,
    };
  }, [enrollments, allCourses]);

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-xs text-slate-500">
          در حال بارگذاری پنل مدیریت...
        </div>
      </MainLayout>
    );
  }

  // If not authenticated as Admin, show inline Admin Access Portal
  if (!adminUser) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4 shadow-sm">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              احراز هویت مدیر آموزش
            </h1>
            <p className="text-xs text-slate-600 mt-1.5">
              جهت ورود به پنل مدیریت، مشخصات ارشد را وارد نمایید.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleDirectLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  پست الکترونیکی سازمانی
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@aut.ac.ir"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  کلمه عبور مدیر سیستم
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="کلمه عبور ادمین را وارد کنید"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span>در حال بررسی دسترسی...</span>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>ورود به پنل مدیریت آموزش</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md border border-slate-800 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  پنل مدیریت جامع آموزش و پذیرش
                </h1>
                <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  دسترسی ارشد
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                مدیریت دوره‌ها، پرونده‌های ثبت‌نامی و صدور مدارک دانشگاه صنعتی امیرکبیر
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-300 hover:text-red-400 font-medium px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors self-start sm:self-auto"
          >
            خروج از پنل
          </button>
        </div>
      </div>

      {/* Panel-wide feedback */}
      {panelError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3 print:hidden">
          <span>{panelError}</span>
          <button onClick={() => setPanelError("")} className="text-red-400 hover:text-red-700">
            ✕
          </button>
        </div>
      )}
      {panelSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 print:hidden">
          <span>{panelSuccess}</span>
          <button onClick={() => setPanelSuccess("")} className="text-emerald-500 hover:text-emerald-800">
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 print:hidden">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">کل پرونده‌های ثبت‌نام</p>
              <p className="text-lg font-extrabold text-slate-900">
                {toPersianDigits(enrollments.length)} دانشجو
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">ثبت‌نام‌های قطعی</p>
              <p className="text-lg font-extrabold text-emerald-600">
                {toPersianDigits(
                  enrollments.filter(
                    (e) => e.status === "REGISTERED" || e.status === "COMPLETED"
                  ).length
                )} نفر
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <AwardIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">گواهینامه‌های صادرشده</p>
              <p className="text-lg font-extrabold text-indigo-600">
                {toPersianDigits(analyticsData.completedEnrollments)} گواهی
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">دوره‌های فعال سامانه</p>
              <p className="text-lg font-extrabold text-purple-600">
                {toPersianDigits(allCourses.length)} عنوان دوره
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6 print:hidden">
        <button
          onClick={() => setActiveTab("ENROLLMENTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "ENROLLMENTS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>پرونده‌های ثبت‌نام ({toPersianDigits(enrollments.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "ANALYTICS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>آمار و نمودارهای تحلیلی</span>
        </button>

        <button
          onClick={() => setActiveTab("COURSES")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "COURSES"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <BookOpenIcon className="w-4 h-4" />
          <span>لیست دوره‌ها ({toPersianDigits(allCourses.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab("INSTRUCTORS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "INSTRUCTORS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>اساتید ({toPersianDigits(instructors.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab("CERTIFICATES")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "CERTIFICATES"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>گواهینامه‌ها ({toPersianDigits(certificates.length)})</span>
        </button>

        <button
          onClick={() => {
            setEditingCourseId(null);
            setNewCourse({ ...EMPTY_COURSE });
            setActiveTab("NEW_COURSE");
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "NEW_COURSE"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>+ تعریف دوره جدید</span>
        </button>
      </div>

      {/* Print Letterhead Roster Header */}
      <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4 text-center">
        <h2 className="text-lg font-extrabold text-slate-900">
          دانشگاه صنعتی امیرکبیر — دانشکده مهندسی کامپیوتر
        </h2>
        <h3 className="text-sm font-bold text-slate-700 mt-1">
          لیست رسمی حضور و غیاب و ارزیابی دانشجویان — ترم پاییز ۱۴۰۴
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          تاریخ گزارش: {new Date().toLocaleDateString("fa-IR")}
        </p>
      </div>

      {/* TAB 1: Enrollments Management */}
      {activeTab === "ENROLLMENTS" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 print:hidden">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <span>فهرست پرونده‌های متقاضیان ({toPersianDigits(filteredEnrollments.length)})</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام، کد ملی، دوره..."
                  className="pr-8 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-hidden"
              >
                <option value="ALL">همه دوره‌ها</option>
                {allCourses.map((c) => (
                  <option key={c.id} value={c.course_number ?? c.id}>
                    {c.title_fa || c.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>دانلود اکسل (CSV)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintRoster}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>چاپ لیست کلاسی</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">مشخصات دانشجو</th>
                  <th className="py-3.5 px-4">کد ملی و تماس</th>
                  <th className="py-3.5 px-4">عنوان دوره و مدرس</th>
                  <th className="py-3.5 px-4 text-center">کد رهگیری</th>
                  <th className="py-3.5 px-4 text-center">وضعیت</th>
                  <th className="py-3.5 px-4 text-center">نمره نهایی</th>
                  <th className="py-3.5 px-4 text-center print:hidden">گواهینامه</th>
                  <th className="py-3.5 px-4 text-center print:hidden">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.map((enr, idx) => {
                  const courseData = enr.course || {};
                  const instructor = getInstructorName(courseData);
                  const title = courseData.title_fa || courseData.title || "دوره تخصصی";
                  const studentName = enr.user?.full_name || enr.full_name || "دانشجو";
                  const nationalId = enr.user?.national_id || enr.national_id || "—";
                  const phone = enr.user?.phone_number || enr.phone_number || "—";
                  const certificate = certificates.find(
                    (c) => c.enrollment_id === enr.id
                  );

                  return (
                    <tr key={enr.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                        {toPersianDigits(idx + 1)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {studentName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                        <div className="font-mono">{toPersianDigits(nationalId)}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{title}</p>
                        <p className="text-[11px] text-slate-400">{instructor}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-blue-700 font-bold dir-ltr">
                        {formatTrackingCode(enr.tracking_code)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(enr.id, enr.status)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            enr.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          {enr.status === "COMPLETED" ? "✓ تکمیل دوره" : "ثبت‌نام نهایی"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <input
                            type="text"
                            value={
                              gradeDrafts[enr.id] ??
                              (enr.final_grade == null ? "" : String(enr.final_grade))
                            }
                            onChange={(e) =>
                              setGradeDrafts((prev) => ({
                                ...prev,
                                [enr.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleGradeChange(enr.id, enr.status, e.currentTarget.value);
                              }
                            }}
                            placeholder="—"
                            className="w-16 text-center py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                          />
                          {isGradeDirty(enr) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleGradeChange(enr.id, enr.status, gradeDrafts[enr.id])
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-colors"
                            >
                              ثبت
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center print:hidden">
                        {certificate ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-mono text-[10px] text-emerald-700 dir-ltr">
                              {certificate.serial_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRevokeCertificate(certificate.id)}
                              className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
                            >
                              ابطال
                            </button>
                          </div>
                        ) : enr.status === "COMPLETED" ? (
                          <button
                            type="button"
                            onClick={() => handleIssueCertificate(enr.id)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors"
                          >
                            صدور گواهی
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            پس از تکمیل دوره
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center print:hidden">
                        <button
                          type="button"
                          onClick={() => handleDeleteEnrollment(enr.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors"
                        >
                          حذف از دوره
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Analytics Dashboard */}
      {activeTab === "ANALYTICS" && (
        <div className="space-y-6 mb-12">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-blue-600" />
              <span>توزیع ثبت‌نام و ظرفیت دوره‌های آموزشی ترم پاییز ۱۴۰۴</span>
            </h2>

            <div className="space-y-5">
              {analyticsData.coursesBreakdown.map((c, idx) => {
                const percent = Math.min(
                  Math.round((c.enrolledCount / c.capacity) * 100),
                  100
                );
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {c.title}
                        </span>
                        <span className="text-slate-500 mr-2">
                          (مدرس: {c.instructor})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-blue-900">
                        <span>
                          {toPersianDigits(c.enrolledCount)} از {toPersianDigits(c.capacity)} دانشجو
                        </span>
                        <span className="text-slate-400 font-normal">|</span>
                        <span className="text-blue-700">
                          {toPersianDigits(percent)}٪ ظرفیت
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Courses Management */}
      {activeTab === "COURSES" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              <span>فهرست دوره‌های آموزشی تعریف‌شده</span>
            </h2>
            <button
              onClick={() => setActiveTab("NEW_COURSE")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-xs"
            >
              + تعریف دوره جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((c) => (
              <div
                key={c.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                      {c.units} • {c.level}
                    </span>
                    <span className="text-slate-500 font-mono">
                      #{toPersianDigits(c.course_number || c.id)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {c.title_fa || c.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    مدرس: {getInstructorName(c)}
                  </p>
                  <p className="text-xs font-bold text-blue-900">
                    {formatPriceToman(c.price)}
                  </p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <Link
                    href={`/courses/${c.course_number || c.id}`}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 text-center py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    سرفصل
                  </Link>
                  <button
                    onClick={() => handleEditCourse(c)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(c.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: New Course Form */}
      {activeTab === "NEW_COURSE" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-3xl mb-12">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <span>
              {editingCourseId ? "ویرایش دوره تخصصی" : "تعریف و ایجاد دوره تخصصی جدید"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {editingCourseId
              ? "تغییرات پس از ذخیره بلافاصله در فهرست دوره‌ها و صفحه ثبت‌نام دانشجویان اعمال می‌شود."
              : "دوره جدید بلافاصله در فهرست دوره‌ها، جستجو و جدول ثبت‌نام قرار خواهد گرفت."}
          </p>

          {courseSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              <span>{courseSuccessMsg}</span>
            </div>
          )}

          {courseErrorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{courseErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  عنوان فارسی دوره *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title_fa}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title_fa: e.target.value })
                  }
                  placeholder="مثال: یادگیری عمیق و بینایی ماشین"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  عنوان انگلیسی دوره
                </label>
                <input
                  type="text"
                  value={newCourse.title_en}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title_en: e.target.value })
                  }
                  placeholder="Deep Learning & Computer Vision"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  استاد دوره *
                </label>
                <select
                  value={newCourse.instructor_id}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, instructor_id: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="">— استاد جدید (نام را وارد کنید) —</option>
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
                {!newCourse.instructor_id && (
                  <input
                    type="text"
                    required
                    value={newCourse.instructor_name}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        instructor_name: e.target.value,
                      })
                    }
                    placeholder="نام استاد جدید، مثال: دکتر مرتضی ذاکری"
                    className="w-full mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مقطع تحصیلی
                </label>
                <select
                  value={newCourse.level}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, level: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="کارشناسی">کارشناسی</option>
                  <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  تعداد واحد
                </label>
                <select
                  value={newCourse.units}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, units: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="۳ واحد">۳ واحد</option>
                  <option value="۲ واحد">۲ واحد</option>
                  <option value="۴ واحد">۴ واحد</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  شهریه مصوب (تومان)
                </label>
                <input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, price: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ظرفیت کلاس (نفر)
                </label>
                <input
                  type="number"
                  value={newCourse.capacity}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, capacity: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  گرایش / رشته
                </label>
                <select
                  value={newCourse.field}
                  onChange={(e) => setNewCourse({ ...newCourse, field: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {FIELD_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  نوع درس
                </label>
                <select
                  value={newCourse.type}
                  onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  سطح دشواری
                </label>
                <select
                  value={newCourse.course_level}
                  onChange={(e) => setNewCourse({ ...newCourse, course_level: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  {COURSE_LEVEL_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  پیش‌نیازها
                </label>
                <input
                  type="text"
                  value={newCourse.prerequisites}
                  onChange={(e) => setNewCourse({ ...newCourse, prerequisites: e.target.value })}
                  placeholder="مثال: برنامه‌نویسی شی‌گرا"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  هم‌نیازها
                </label>
                <input
                  type="text"
                  value={newCourse.corequisites}
                  onChange={(e) => setNewCourse({ ...newCourse, corequisites: e.target.value })}
                  placeholder="مثال: مهندسی نرم‌افزار"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مباحث پیش‌نیاز
                </label>
                <input
                  type="text"
                  value={newCourse.prerequisite_topics}
                  onChange={(e) => setNewCourse({ ...newCourse, prerequisite_topics: e.target.value })}
                  placeholder="مثال: آمار و احتمال، جبر خطی"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  طول و زمان‌بندی دوره
                </label>
                <input
                  type="text"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  شیوه برگزاری
                </label>
                <input
                  type="text"
                  value={newCourse.delivery_method}
                  onChange={(e) => setNewCourse({ ...newCourse, delivery_method: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                توضیحات و شرح دوره *
              </label>
              <textarea
                rows={3}
                required
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="شرح اهداف، کاربردهای صنعتی و مهارت‌های کسب‌شده در این دوره..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                عناوین سرفصل‌های آموزشی (هر جلسه در یک خط — «عنوان|توضیح»)
              </label>
              <textarea
                rows={4}
                value={newCourse.topicsText}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, topicsText: e.target.value })
                }
                placeholder="مقدمه و تعاریف پایه|آشنایی با کلیات&#10;معماری و ساختار مدل‌ها&#10;پیاده‌سازی پروژه‌های عملی"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  اهداف آموزشی (هر مورد در یک خط)
                </label>
                <textarea
                  rows={3}
                  value={newCourse.objectivesText}
                  onChange={(e) => setNewCourse({ ...newCourse, objectivesText: e.target.value })}
                  placeholder="تسلط بر مبانی و اصول موضوع&#10;پیاده‌سازی پروژه‌های کاربردی صنعتی"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مخاطبان هدف (هر مورد در یک خط)
                </label>
                <textarea
                  rows={3}
                  value={newCourse.targetAudienceText}
                  onChange={(e) => setNewCourse({ ...newCourse, targetAudienceText: e.target.value })}
                  placeholder="دانشجویان مهندسی کامپیوتر&#10;متخصصان صنعت نرم‌افزار"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ابزارها و نرم‌افزارها («نام|توضیح» در هر خط)
                </label>
                <textarea
                  rows={3}
                  value={newCourse.softwareToolsText}
                  onChange={(e) => setNewCourse({ ...newCourse, softwareToolsText: e.target.value })}
                  placeholder="Python|زبان اصلی دوره&#10;Docker"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  بارم‌بندی نمره («عنوان|درصد» در هر خط)
                </label>
                <textarea
                  rows={3}
                  value={newCourse.gradingText}
                  onChange={(e) => setNewCourse({ ...newCourse, gradingText: e.target.value })}
                  placeholder="تکالیف و پروژه کلاسی|۵۰٪&#10;آزمون پایانی|۵۰٪"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                مراجع و منابع درس (هر مورد در یک خط)
              </label>
              <textarea
                rows={2}
                value={newCourse.referencesText}
                onChange={(e) => setNewCourse({ ...newCourse, referencesText: e.target.value })}
                placeholder="Introduction to Machine Learning, MIT Press"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  توضیح تکالیف
                </label>
                <input
                  type="text"
                  value={newCourse.assignments_info}
                  onChange={(e) => setNewCourse({ ...newCourse, assignments_info: e.target.value })}
                  placeholder="مثال: ۴ تکلیف عملی + پروژه پایانی"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  تهیه‌کننده طرح درس
                </label>
                <input
                  type="text"
                  value={newCourse.author}
                  onChange={(e) => setNewCourse({ ...newCourse, author: e.target.value })}
                  placeholder="پیش‌فرض: نام استاد دوره"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  نگارش طرح درس
                </label>
                <input
                  type="text"
                  value={newCourse.version}
                  onChange={(e) => setNewCourse({ ...newCourse, version: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={isSubmittingCourse}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmittingCourse
                  ? "در حال ثبت..."
                  : editingCourseId
                  ? "ذخیره تغییرات دوره"
                  : "ثبت و انتشار دوره"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingCourseId(null);
                  setNewCourse({ ...EMPTY_COURSE });
                  setActiveTab("COURSES");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: Instructors Management */}
      {activeTab === "INSTRUCTORS" && (
        <div className="space-y-6 mb-12">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-3xl">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <span>
                {editingInstructorId ? "ویرایش مشخصات استاد" : "افزودن استاد جدید"}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              این مشخصات در صفحه «اساتید دوره» و در کارت دوره‌های مربوطه نمایش داده می‌شود.
            </p>

            {instructorSuccessMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 shrink-0" />
                <span>{instructorSuccessMsg}</span>
              </div>
            )}
            {instructorErrorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>{instructorErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleInstructorSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInstructor.name}
                    onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                    placeholder="مثال: دکتر مرتضی ذاکری"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    مرتبه علمی
                  </label>
                  <input
                    type="text"
                    value={newInstructor.position}
                    onChange={(e) => setNewInstructor({ ...newInstructor, position: e.target.value })}
                    placeholder="مثال: استادیار دانشکده مهندسی کامپیوتر"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  دانشکده / سازمان
                </label>
                <input
                  type="text"
                  value={newInstructor.department}
                  onChange={(e) => setNewInstructor({ ...newInstructor, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  زمینه تخصصی و پژوهشی
                </label>
                <input
                  type="text"
                  value={newInstructor.specialization}
                  onChange={(e) => setNewInstructor({ ...newInstructor, specialization: e.target.value })}
                  placeholder="مثال: یادگیری ماشین، داده‌کاوی، پردازش زبان طبیعی"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    آدرس تصویر پروفایل
                  </label>
                  <input
                    type="text"
                    value={newInstructor.image_url}
                    onChange={(e) => setNewInstructor({ ...newInstructor, image_url: e.target.value })}
                    placeholder="/photos/instructors/zakeri.jpg یا https://..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    لینک رزومه رسمی
                  </label>
                  <input
                    type="text"
                    value={newInstructor.profile_link}
                    onChange={(e) => setNewInstructor({ ...newInstructor, profile_link: e.target.value })}
                    placeholder="https://aut.ac.ir/cv/2485"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                  />
                </div>
              </div>

              {newInstructor.image_url.trim() && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <img
                    src={newInstructor.image_url}
                    alt="پیش‌نمایش تصویر استاد"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white"
                  />
                  <span className="text-[11px] text-slate-500">
                    پیش‌نمایش تصویر پروفایل استاد
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  بیوگرافی و سوابق
                </label>
                <textarea
                  rows={3}
                  value={newInstructor.bio}
                  onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                  placeholder="سوابق علمی، پژوهشی و صنعتی استاد..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingInstructor}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {isSubmittingInstructor
                    ? "در حال ثبت..."
                    : editingInstructorId
                    ? "ذخیره تغییرات"
                    : "افزودن استاد"}
                </button>
                {editingInstructorId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingInstructorId(null);
                      setNewInstructor({ ...EMPTY_INSTRUCTOR });
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    انصراف از ویرایش
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <span>کادر علمی ثبت‌شده ({toPersianDigits(instructors.length)})</span>
            </h2>

            {instructors.length === 0 ? (
              <p className="text-xs text-slate-500">
                هنوز استادی در سامانه ثبت نشده است.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((i) => (
                  <div
                    key={i.id}
                    className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {i.image_url ? (
                        <img
                          src={i.image_url}
                          alt={i.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                          {i.name?.charAt(0) || "؟"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900">{i.name}</h3>
                        <p className="text-[11px] text-slate-500">{i.position || "—"}</p>
                        <p className="text-[11px] text-blue-700 font-semibold mt-1">
                          {toPersianDigits(i.courses_count)} دوره
                        </p>
                      </div>
                    </div>

                    {i.specialization && (
                      <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">
                        {i.specialization}
                      </p>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleEditInstructor(i)}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteInstructor(i.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: Certificates */}
      {activeTab === "CERTIFICATES" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <AwardIcon className="w-5 h-5 text-blue-600" />
            <span>گواهینامه‌های صادرشده ({toPersianDigits(certificates.length)})</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">
            صدور گواهی از ستون «گواهینامه» در تب پرونده‌های ثبت‌نام و پس از تغییر وضعیت دوره به «تکمیل دوره» انجام می‌شود.
          </p>

          {certificates.length === 0 ? (
            <p className="text-xs text-slate-500">
              هنوز گواهینامه‌ای صادر نشده است.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3.5 px-4 text-center w-12">#</th>
                    <th className="py-3.5 px-4">دانشجو</th>
                    <th className="py-3.5 px-4">دوره</th>
                    <th className="py-3.5 px-4 text-center">شماره سریال</th>
                    <th className="py-3.5 px-4 text-center">تاریخ صدور</th>
                    <th className="py-3.5 px-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificates.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                        {toPersianDigits(idx + 1)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {c.student_name || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {c.course_title || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-700 font-bold dir-ltr">
                        {c.serial_number}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-500">
                        {c.issued_at
                          ? new Date(c.issued_at).toLocaleDateString("fa-IR")
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRevokeCertificate(c.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors"
                        >
                          ابطال
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Custom Centered Modal Dialog */}
      <CustomModal
        {...modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </MainLayout>
  );
}
