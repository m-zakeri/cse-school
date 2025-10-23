import Image from "next/image";

const InstructorCard = ({ instructor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center">
      {/* Instructor Photo */}
      <div className="w-24 h-24 mx-auto mb-4 relative">
        <Image
          src={instructor.image}
          alt={instructor.name}
          width={96}
          height={96}
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Instructor Info */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {instructor.name}
      </h3>
      <p className="text-gray-600 text-sm mb-1">{instructor.position}</p>
      <p className="text-blue-600 text-xs font-medium">
        {instructor.specialization}
      </p>
    </div>
  );
};

export default InstructorCard;
