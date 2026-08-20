import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon, AcademicCapIcon } from "./Icons";

const InstructorCard = ({ instructor }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 p-6 flex flex-col items-center text-center">
      {/* Avatar Container */}
      <div className="w-28 h-28 relative mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md">
          <div className="w-full h-full bg-white rounded-full p-1 overflow-hidden relative">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="112px"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
        {instructor.name}
      </h3>

      <p className="text-slate-600 text-xs font-medium mb-1">
        {instructor.position}
      </p>
      
      <p className="text-slate-500 text-xs mb-3">
        {instructor.department || "دانشگاه صنعتی امیرکبیر"}
      </p>

      {/* Specialization Chip */}
      <div className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-xl mb-5 w-full flex items-center justify-center gap-1.5">
        <AcademicCapIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="truncate">{instructor.specialization}</span>
      </div>

      {/* Profile Link */}
      <a
        href={instructor.profileLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 py-2 px-4 rounded-xl transition-all w-full"
      >
        <span>مشاهده رزومه در سامانه دانشگاه</span>
        <ExternalLinkIcon className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

export default InstructorCard;
