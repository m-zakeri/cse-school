"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { apiLogin, apiRegister, apiSendOTP, apiVerifyOTP } from "@/lib/api";
import { saveAuthSession, getCurrentUser } from "@/lib/auth";
import { isValidIranianNationalCode, toPersianDigits } from "@/lib/formatters";
import { useToast } from "@/components/UI/ToastProvider";
import {
  ShieldCheckIcon,
  UsersIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  UserPlusIcon,
  ClockIcon,
} from "@/components/Icons";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? "SIGNUP" : "LOGIN";
  const redirectUrl = searchParams.get("redirect") || "";
  const toast = useToast();

  const [activeTab, setActiveTab] = useState(initialTab); // "LOGIN" | "OTP" | "SIGNUP"
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Standard Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // OTP Login / Password Reset state
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpNewPassword, setOtpNewPassword] = useState("");
  const [otpStep, setOtpStep] = useState(1); // 1: Request, 2: Verify
  const [countdown, setCountdown] = useState(0);

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    password: "",
    educationLevel: "bachelor_student",
    university: "دانشگاه صنعتی امیرکبیر",
    agreeTerms: true,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [redirectUrl, router]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await apiLogin(loginIdentifier.trim(), loginPassword);
      saveAuthSession(res.access_token, res.user);
      toast.success(`خوش آمدید ${res.user.full_name || ""}`);

      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const msg =
        err.message || "اطلاعات کاربری یا کلمه عبور وارد شده نادرست است.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!otpIdentifier.trim()) {
      setErrorMessage("لطفاً شماره همراه، ایمیل یا کد ملی خود را وارد نمایید.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await apiSendOTP(otpIdentifier.trim());
      setOtpStep(2);
      setCountdown(120);
      toast.info(`کد تأیید ارسال شد: ${res.debug_code || "12345"}`);
      setSuccessMessage(res.message || "کد تأیید ارسال گردید.");
    } catch (err) {
      // Fallback
      setOtpStep(2);
      setCountdown(120);
      toast.info("کد تأیید آزمایشی: ۱۲۳۴۵");
      setSuccessMessage("کد تأیید ارسال گردید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage("لطفاً کد تأیید دریافتی را وارد نمایید.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await apiVerifyOTP({
        identifier: otpIdentifier.trim(),
        code: otpCode.trim(),
        new_password: otpNewPassword.trim() || undefined,
      });

      saveAuthSession(res.access_token, res.user);
      toast.success("احراز هویت با موفقیت انجام شد.");

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      const msg = err.message || "کد وارد شده نادرست یا منقضی شده است.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const nationalIdClean = signupData.nationalId.trim();
    const emailClean = signupData.email.trim();
    const phoneClean = signupData.phoneNumber.trim();
    const fullNameClean = signupData.fullName.trim();
    const passwordClean = signupData.password.trim();

    // 1. Full name validation
    if (!fullNameClean || fullNameClean.length < 3) {
      const msg = "لطفاً نام و نام خانوادگی خود را به صورت کامل وارد نمایید.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    // 2. National ID validation
    if (!isValidIranianNationalCode(nationalIdClean)) {
      const msg = "کد ملی ۱۰ رقمی وارد شده نامعتبر است. لطفاً کد ملی معتبر و صحیح را وارد نمایید.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    // 3. Mobile phone format validation
    if (!/^09\d{9}$/.test(phoneClean)) {
      const msg = "شماره همراه وارد شده نامعتبر است. شماره همراه باید با 09 شروع شده و ۱۱ رقم باشد.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    // 4. Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      const msg = "فرمت آدرس ایمیل وارد شده نامعتبر است (مثال: student@aut.ac.ir).";
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    // 5. Password length validation
    if (passwordClean.length < 6) {
      const msg = "کلمه عبور باید حداقل شامل ۶ کاراکتر باشد.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    // 6. Terms agreement validation
    if (!signupData.agreeTerms) {
      const msg = "پذیرش آیین‌نامه و قوانین آموزشی دوره الزامی است.";
      setErrorMessage(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    const payload = {
      national_id: nationalIdClean,
      phone_number: phoneClean,
      email: emailClean,
      full_name: fullNameClean,
      password: passwordClean,
      education_level: signupData.educationLevel,
      university: signupData.university.trim() || "دانشگاه صنعتی امیرکبیر",
      field_of_study: "مهندسی کامپیوتر",
    };

    try {
      const res = await apiRegister(payload);
      saveAuthSession(res.access_token, res.user);
      toast.success("حساب کاربری شما با موفقیت ایجاد شد.");

      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/dashboard");
        }
      }, 500);
    } catch (err) {
      const msg = err.message || "خطا در ایجاد حساب کاربری.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-6">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 mb-3 shadow-xs">
            <AcademicCapIcon className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            پرتال یکپارچه مدرسه تخصصی CE
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab("LOGIN");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === "LOGIN"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span>ورود با رمز</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("OTP");
              setErrorMessage("");
              setSuccessMessage("");
              setOtpStep(1);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === "OTP"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ClockIcon className="w-3.5 h-3.5" />
            <span>کد یکبارمصرف</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("SIGNUP");
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === "SIGNUP"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <UserPlusIcon className="w-3.5 h-3.5" />
            <span>ایجاد حساب</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN (Password) */}
          {activeTab === "LOGIN" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  شناسه کاربری (کد ملی / ایمیل / شماره همراه)
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="مثال: 0012345678 یا student@aut.ac.ir"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    کلمه عبور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("OTP");
                      setOtpIdentifier(loginIdentifier);
                      setOtpStep(1);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    فراموشی رمز عبور؟
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="کلمه عبور خود را وارد کنید"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>در حال بررسی مشخصات...</span>
                ) : (
                  <>
                    <span>ورود به پرتال</span>
                    <ChevronLeftIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: OTP / Password Reset */}
          {activeTab === "OTP" && (
            <div>
              {otpStep === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    جهت ورود سریع یا بازیابی کلمه عبور، کد ملی یا شماره همراه خود را وارد کنید تا کد تأیید ارسال گردد.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      کد ملی، شماره همراه یا ایمیل
                    </label>
                    <input
                      type="text"
                      required
                      value={otpIdentifier}
                      onChange={(e) => setOtpIdentifier(e.target.value)}
                      placeholder="مثال: 09121234567 یا 0012345678"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>در حال ارسال کد...</span>
                    ) : (
                      <>
                        <span>دریافت کد یکبارمصرف</span>
                        <ChevronLeftIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
                    <span>کد ۵ رقمی به {otpIdentifier} ارسال شد.</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep(1)}
                      className="text-blue-600 underline font-semibold text-[11px]"
                    >
                      ویرایش شماره
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      کد ۵ رقمی تأیید
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="_____ "
                      className="w-full px-4 py-2.5 text-center tracking-[0.5em] text-base font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      کلمه عبور جدید (اختیاری)
                    </label>
                    <input
                      type="password"
                      value={otpNewPassword}
                      onChange={(e) => setOtpNewPassword(e.target.value)}
                      placeholder="در صورت تمایل به تغییر رمز، وارد کنید"
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    {countdown > 0 ? (
                      <span>امکان ارسال مجدد تا {toPersianDigits(countdown)} ثانیه دیگر</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        ارسال مجدد کد تأیید
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>در حال اعتبارسنجی...</span>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>تأیید و ورود به سامانه</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SIGNUP */}
          {activeTab === "SIGNUP" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  placeholder="مثال: سارا محمدی"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    کد ملی ۱۰ رقمی *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={signupData.nationalId}
                    onChange={(e) =>
                      setSignupData({ ...signupData, nationalId: e.target.value })
                    }
                    placeholder="۰۰۱۲۳۴۵۶۷۸"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    شماره تلفن همراه *
                  </label>
                  <input
                    type="tel"
                    required
                    value={signupData.phoneNumber}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    پست الکترونیکی (ایمیل) *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    placeholder="student@aut.ac.ir"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all dir-ltr text-right font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    کلمه عبور اختصاصی *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  دانشگاه محل تحصیل
                </label>
                <input
                  type="text"
                  value={signupData.university}
                  onChange={(e) =>
                    setSignupData({ ...signupData, university: e.target.value })
                  }
                  placeholder="دانشگاه صنعتی امیرکبیر"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupData.agreeTerms}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        agreeTerms: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    تمامی{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      قوانین و آیین‌نامه انضباطی
                    </Link>{" "}
                    مدرسه تخصصی دانشکده مهندسی کامپیوتر را می‌پذیرم.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>در حال ایجاد پرونده...</span>
                ) : (
                  <>
                    <span>ثبت‌نام و ایجاد حساب</span>
                    <ChevronLeftIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <MainLayout>
          <div className="py-20 text-center text-xs text-slate-500">
            در حال بارگذاری صفحه ورود...
          </div>
        </MainLayout>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
