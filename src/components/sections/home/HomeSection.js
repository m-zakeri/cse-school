// import CourseCard from "@/components/CourseCard";
// import { courses, micromasterPackages } from "@/data/sampleData";

// export default function HomeSection() {
//   return (
//     <>
//       {/* Page Title */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           دوره‌های آموزشی
//         </h1>
//         <p className="text-gray-600">ترم تابستان ۱۴۰۴</p>
//       </div>

//       {/* Courses Section */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           دوره‌های موجود
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course) => (
//             <CourseCard key={course.id} course={course} />
//           ))}
//         </div>
//       </section>

//       {/* Benefits Section */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           مزایای دوره‌ها
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-4xl mb-4">🎓</div>
//             <h3 className="text-lg font-bold text-gray-900 mb-2">
//               آموزش امیرکبیر
//             </h3>
//             <p className="text-gray-600 text-sm">
//               تدریس توسط اساتید دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-4xl mb-4">📜</div>
//             <h3 className="text-lg font-bold text-gray-900 mb-2">گواهی رسمی</h3>
//             <p className="text-gray-600 text-sm">
//               دریافت گواهی رسمی دو زبانه از دانشگاه امیرکبیر
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-4xl mb-4">📚</div>
//             <h3 className="text-lg font-bold text-gray-900 mb-2">
//               ادامه تحصیل
//             </h3>
//             <p className="text-gray-600 text-sm">
//               کسب دانش مورد نیاز برای پژوهش و ادامه تحصیل
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-4xl mb-4">💼</div>
//             <h3 className="text-lg font-bold text-gray-900 mb-2">
//               موقعیت‌های شغلی
//             </h3>
//             <p className="text-gray-600 text-sm">
//               افزایش توانمندی و قدرت رقابت برای استخدام
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Micromaster Packages Section */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">
//           بسته‌های میکرومستر
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {micromasterPackages.map((pkg) => (
//             <div
//               key={pkg.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <div
//                 className={`h-32 bg-gradient-to-r ${pkg.color} flex items-center justify-center`}
//               >
//                 <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
//               </div>
//               <div className="p-6">
//                 <p className="text-gray-600 mb-4">{pkg.description}</p>
//                 <div className="mb-4">
//                   <h4 className="font-bold text-gray-900 mb-2">دروس شامل:</h4>
//                   <ul className="text-sm text-gray-600 space-y-1">
//                     {pkg.courses.map((course, index) => (
//                       <li key={index}>• {course}</li>
//                     ))}
//                   </ul>
//                 </div>
//                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
//                   ثبت‌نام کنید
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Links Section */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">پیوندها</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-3xl mb-3">📱</div>
//             <h3 className="font-bold text-gray-900 mb-2">کانال رسمی</h3>
//             <p className="text-gray-600 text-sm">کانال رسمی آموزش‌های تخصصی</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-3xl mb-3">🏛️</div>
//             <h3 className="font-bold text-gray-900 mb-2">دانشکده</h3>
//             <p className="text-gray-600 text-sm">دانشکده مهندسی کامپیوتر</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <div className="text-3xl mb-3">🎓</div>
//             <h3 className="font-bold text-gray-900 mb-2">دانشگاه</h3>
//             <p className="text-gray-600 text-sm">دانشگاه امیرکبیر</p>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
