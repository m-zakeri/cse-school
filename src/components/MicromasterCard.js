const MicromasterCard = ({ micromaster }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">{micromaster.icon}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {micromaster.title}
        </h3>
        <p className="text-gray-600 text-sm">{micromaster.description}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">شامل:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {micromaster.courses.map((course, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-blue-500">•</span>
              {course}
            </li>
          ))}
        </ul>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
        ثبت‌نام کنید
      </button>
    </div>
  );
};

export default MicromasterCard;
