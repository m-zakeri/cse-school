export const coursesFullDetails = {
  1: {
    id: 1,
    title: "یادگیری ماشین",
    englishTitle: "Machine Learning",
    instructor: "دکتر احسان ناظرفرد",
    author: "احسان ناظرفرد",
    version: "۱.۰",
    field: "مهندسی کامپیوتر – هوش مصنوعی",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی ارشد",
    prerequisites: "داده‌کاوی یا بازیابی اطلاعات",
    corequisites: "ندارد",
    prerequisiteTopics: "آمار و احتمال مهندسی و جبر خطی",
    courseLevel: "متوسط",
    duration: "۸ هفته کلاس درس (۲۴ ساعت – ۱۶ جلسه ۹۰ دقیقه‌ای) + ۱ هفته رفع اشکال و ۱ هفته ارزیابی",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "هدف از مبحث یادگیری ماشین مطالعه الگوریتم‌هایی است که قادر به یادگیری از داده‌ها و تجربیات هستند. در این درس مفاهیم یادگیری ماشین مطرح شده و جنبه‌های مهم عملی و نظری آن معرفی و تحلیل خواهد شد. رویکردهای یادگیری تحت نظارت، بدون نظارت و یادگیری تقویتی مورد بحث قرار می‌گیرند.",
    objectives: [
      "آشنایی عمیق با مبانی نظری و ریاضی یادگیری ماشین",
      "تسلط بر مدل‌های اصلی یادگیری تحت نظارت (رگرسیون و دسته‌بندی)",
      "یادگیری روش‌های بدون نظارت و خوشه‌بندی پیشرفته",
      "آشنایی با یادگیری تقویتی و حل مسائل دنیای واقعی با پایتون",
    ],
    targetAudience: [
      "دانشجویان و دانش‌آموختگان مهندسی و علوم کامپیوتر",
      "مهندسان و علاقه‌مندان به هوش مصنوعی، علم داده و داده‌کاوی",
      "پژوهشگران و توسعه‌دهندگان سیستم‌های هوشمند",
    ],
    topics: [
      {
        title: "مقدمات و مثال‌های کاربردی",
        description: "تعاریف یادگیری تحت نظارت (رگرسیون و دسته‌بندی)، بدون نظارت، تقویتی، انتقالی و یادگیری فعال.",
      },
      {
        title: "پیش‌پردازش داده‌ها",
        description: "پاکسازی داده‌ها، مدیریت مقادیر گمشده و پرت، نرمال‌سازی، استخراج و انتخاب ویژگی‌ها.",
      },
      {
        title: "یادگیری تحت نظارت – رگرسیون",
        description: "همبستگی، رگرسیون خطی، گرادیان نزولی، رگرسیون غیرخطی و چندمتغیره، رگرسیون منظم‌شده (Ridge و Lasso)، مصالحه بایاس و واریانس و ارزیابی مدل‌ها.",
      },
      {
        title: "یادگیری تحت نظارت – دسته‌بندی",
        description: "الگوریتم K نزدیک‌ترین همسایه (KNN)، درخت تصمیم، شبکه‌های بیزین، رگرسیون لجستیک، ماشین بردار پشتیبان (SVM)، مدل‌های تجمعی و ترکیبی (Random Forest, Boosting).",
      },
      {
        title: "یادگیری بدون نظارت",
        description: "تحلیل مولفه اصلی (PCA)، خوشه‌بندی مبتنی بر تقسیم فضا (K-Means)، چگالی (DBSCAN)، سلسله‌مراتبی و احتمالاتی (GMM).",
      },
      {
        title: "مقدمه‌ای بر یادگیری تقویتی",
        description: "مفاهیم پایه، عامل و محیط، توابع ارزش و کیفیت، معادله بلمن و یادگیری Q-Learning.",
      },
    ],
    softwareTools: [
      { category: "زبان برنامه‌نویسی", tools: "Python 3.x" },
      { category: "کتابخانه‌های تخصصی", tools: "NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn" },
      { category: "محیط توسعه", tools: "Jupyter Notebook, Google Colab, VS Code" },
    ],
    assignments: "۲ تمرین تئوری و ۲ پروژه عملی پیاده‌سازی الگوریتم‌ها با داده‌های واقعی",
    grading: [
      { label: "تکالیف تئوری", percent: "۲۰٪" },
      { label: "پروژه‌های عملی و کدنویسی", percent: "۳۰٪" },
      { label: "آزمون و ارزیابی پایانی", percent: "۵۰٪" },
    ],
    references: [
      "Learning from data: a short course, Malik Magdon-Ismail and Yaser S. Abu-Mostafa, 2012",
      "Introduction to Machine Learning, Ethem Alpaydin, MIT Press, 2020",
      "Machine Learning: A Probabilistic Perspective, Kevin Murphy, MIT Press, 2013",
      "Pattern Recognition and Machine Learning, Christopher M. Bishop, Springer, 2006",
      "Machine Learning, Tom Mitchell, McGraw-Hill, 1997",
    ],
  },

  2: {
    id: 2,
    title: "آزمون و تضمین کیفیت نرم‌افزار",
    englishTitle: "Software Testing and Quality Assurance",
    instructor: "دکتر مرتضی ذاکری",
    author: "مرتضی ذاکری",
    version: "۲.۰",
    field: "مهندسی کامپیوتر – نرم‌افزار",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی",
    prerequisites: "برنامه‌نویسی شی‌گرا",
    corequisites: "مهندسی نرم‌افزار",
    prerequisiteTopics: "مفاهیم پایه مهندسی نرم‌افزار و برنامه‌نویسی",
    courseLevel: "مبتدی و متوسط",
    duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "اصول، فنون، معیارها و ابزارهای آزمون کارکردی نرم‌افزار به صورت مدل‌رانده، خودکارسازی تست و ارزیابی کیفیت در چرخه‌حیات مهندسی نرم‌افزار مدرن.",
    objectives: [
      "آشنایی با مدل V و سطوح مختلف آزمون نرم‌افزار",
      "تسلط بر طراحی سیستماتیک آزمون مبتنی بر گراف، منطق، افراز ورودی و نحو",
      "توسعه آزمون‌رانده (TDD) و خودکارسازی آزمون‌های واحد و یکپارچگی",
      "کار با ابزارهای تست فازی، تحلیل ایستا و پویای کیفیت کد",
    ],
    targetAudience: [
      "دانشجویان و مهندسان نرم‌افزار",
      "توسعه‌دهندگان و مهندسان تضمین کیفیت (QA Engineers)",
      "توسعه‌دهندگان علاقه‌مند به متدولوژی‌های TDD و CI/CD",
    ],
    topics: [
      {
        title: "مقدمه و تعاریف آزمون (۲ جلسه)",
        description: "اهمیت و جایگاه آزمون کارکردی، واژه‌شناسی استاندارد، خطای انسانی، نقص و شکست، مدل V و سطوح آزمون.",
      },
      {
        title: "آزمون پیوسته و چابک (۴ جلسه)",
        description: "طراحی آزمون مدل‌رانده، آزمون‌پذیری، خودکارسازی آزمون، فریم‌ورک‌های تست و توسعه آزمون‌رانده (TDD).",
      },
      {
        title: "طراحی و ارزیابی سیستماتیک آزمون (۵ جلسه)",
        description: "معیارهای کفایت آزمون، افراز فضای ورودی (Input Space Partitioning)، آزمون مبتنی بر گراف (Control Flow & Data Flow)، آزمون مبتنی بر منطق و نحو (Mutation Testing).",
      },
      {
        title: "آزمون واسط کاربری گرافیکی (GUI) (۲ جلسه)",
        description: "روش‌های آزمون رابط کاربری گرافیکی، تست وب و سناریوهای End-to-End با ابزارهای خودکارساز.",
      },
      {
        title: "آزمون فازی و شناسایی آسیب‌پذیری‌ها (۲ جلسه)",
        description: "اصول Fuzz Testing، آزمون جعبه‌سیاه و جعبه‌خاکستری، شناسایی باگ‌های امنیتی و حافظه.",
      },
      {
        title: "مدیریت پروژه‌های آزمون (۱ جلسه)",
        description: "طرح آزمون (Test Plan)، دوگان آزمون (Mocking/Stubbing)، آزمون رگرسیون و تحلیل پوشش کد.",
      },
    ],
    softwareTools: [
      { category: "فریم‌ورک‌های تست واحد", tools: "JUnit 5, PyTest, NUnit" },
      { category: "تحلیل کیفیت و امنیت کد", tools: "SonarQube, JaCoCo" },
      { category: "تولید خودکار داده آزمون", tools: "EvoSuite, Randoop" },
      { category: "تست فازی و امنیتی", tools: "AFL, DeepFuzz" },
      { category: "تست وب و رابط کاربری", tools: "Selenium, Playwright" },
    ],
    assignments: "۴ سری تکلیف کاربردی و پروژه‌های خودکارسازی تست روی پروژه‌های واقعی",
    grading: [
      { label: "تکالیف تئوری", percent: "۲۰٪" },
      { label: "تکالیف و پروژه‌های عملی", percent: "۳۰٪" },
      { label: "آزمون پایانی", percent: "۵۰٪" },
    ],
    references: [
      "P. Ammann and J. Offutt. Introduction to Software Testing. 2nd Edition, Cambridge University Press, 2017.",
      "P. C. Jorgensen and B. DeVries. Software Testing: A Craftsman's Approach. 5th Edition, CRC Press, 2021.",
      "R. Bierig, S. Brown, E. Galván, and J. Timoney. Essentials of Software Testing. Cambridge University Press, 2021.",
    ],
  },

  3: {
    id: 3,
    title: "برنامه نویسی شی گرا (جاوا)",
    englishTitle: "Object-Oriented Programming (Java)",
    instructor: "دکتر معصومه طارمی راد",
    author: "معصومه طارمی راد",
    version: "۱.۰",
    field: "مهندسی کامپیوتر – نرم‌افزار",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی",
    prerequisites: "مبانی برنامه‌نویسی یا برنامه‌سازی ساخت‌یافته",
    corequisites: "ندارد",
    prerequisiteTopics: "مفاهیم پایه الگوریتم و برنامه‌نویسی",
    courseLevel: "مبتدی و متوسط",
    duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "آموزش جامع و عملیاتی پارادایم شی‌گرایی، مفاهیم کپسوله‌سازی، وراثت، چندریختی، اینترفیس‌ها، الگوهای طراحی، مدیریت خطا، ساختمان داده‌های Java Collections، همروندی و سوکت‌پروگرمینگ در بستر زبان جاوا.",
    objectives: [
      "درک عمیق مفاهیم شی‌گرایی و تفاوت آن با برنامه‌نویسی رویه‌ای",
      "تسلط کامل بر سینتکس و قابلیت‌های پیشرفته زبان Java",
      "استفاده حرفه‌ای از Collections Framework و Generics",
      "پیاده‌سازی برنامه‌های چندنخی (Multithreading) و تحت شبکه",
    ],
    targetAudience: [
      "دانشجویان رشته مهندسی کامپیوتر و علوم داده",
      "برنامه‌نویسان مایل به یادگیری اصولی زبان جاوا و شی‌گرایی",
      "علاقه‌مندان به توسعه نرم‌افزارهای سازمانی و بک‌اند",
    ],
    topics: [
      {
        title: "مفاهیم شی‌گرایی و رده‌ها (۲ جلسه)",
        description: "تعریف رده (Class)، شیء (Object)، متدها و فیلدها، دسترسی‌ها، اشاره‌گر this، سازنده‌ها، فیلدهای static، بسته‌ها (Package) و نمودار کلاس UML.",
      },
      {
        title: "وراثت و چندریختی (۲ جلسه)",
        description: "مفهوم وراثت، کلیدواژه‌های protected, abstract, super، چندریختی پویا، بازنویسی متدها (Overriding) و اعضای final.",
      },
      {
        title: "واسط‌ها و چندریختی چندگانه (۱ جلسه)",
        description: "کاربرد Interfaceها، انتزاع کامل، وراثت چندگانه واسط‌ها، متدهای default و static در واسط‌ها.",
      },
      {
        title: "مدیریت استثناها (Exceptions) (۱ جلسه)",
        description: "چارچوب مدیریت خطا در جاوا، بلوک‌های try-catch-finally، استثناهای Checked و Unchecked و ساخت استثنای سفارشی.",
      },
      {
        title: "داده‌های عام (Generics) (۱ جلسه)",
        description: "کلاس‌ها و متدهای عام، Wildcards، مزایای Type Safety در زمان کامپایل.",
      },
      {
        title: "مجموعه‌ها و ظرف‌ها (Collections Framework) (۲ جلسه)",
        description: "بررسی List, Set, Map, Queue، کلاس‌های ArrayList, LinkedList, HashSet, HashMap، کار با Iteratorها و الگوریتم‌های کمکی.",
      },
      {
        title: "ورودی/خروجی، فایل و شبکه (۱ جلسه)",
        description: "جویبارهای بایت و کاراکتر (Streams)، سریال‌سازی (Serialization) و برنامه‌نویسی سوکت تحت شبکه.",
      },
      {
        title: "برنامه‌نویسی همروند و بازتاب (۲ جلسه)",
        description: "چرخه حیات Thread، همگام‌سازی (Synchronization)، قفل‌ها، بخش بحرانی و آشنایی با Reflection (RTTI).",
      },
    ],
    softwareTools: [
      { category: "زبان برنامه‌نویسی", tools: "Java SE (JDK 17/21)" },
      { category: "محیط توسعه یکپارچه", tools: "IntelliJ IDEA Ultimate, Eclipse" },
      { category: "سیستم‌های بیلد و مدیریت وابستگی", tools: "Maven, Gradle" },
    ],
    assignments: "۴ تمرین برنامه‌نویسی و یک پروژه جامع کاربردی شی‌گرا",
    grading: [
      { label: "تکالیف تئوری و کوییزها", percent: "۲۰٪" },
      { label: "پروژه‌های عملی کدنویسی", percent: "۳۰٪" },
      { label: "آزمون پایان‌ترم", percent: "۵۰٪" },
    ],
    references: [
      "P. Deitel, H. Deitel. Java How to Program, Early Objects. 11th Edition, Pearson Education, 2017.",
      "B. Eckel. Thinking in Java. 4th Edition, Prentice Hall, 2006.",
      "M. Fowler, K. Beck. Refactoring: Improving the Design of Existing Code. Addison-Wesley, 1999.",
      "K. Sierra, B. Bates, and T. Gee. Head First Java. 3rd Edition, O'Reilly Media, 2022.",
    ],
  },

  4: {
    id: 4,
    title: "مهندسی نرم‌افزار",
    englishTitle: "Software Engineering",
    instructor: "دکتر معصومه طارمی راد",
    author: "معصومه طارمی راد",
    version: "۱.۰",
    field: "مهندسی کامپیوتر – نرم‌افزار",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی",
    prerequisites: "برنامه‌سازی پیشرفته",
    corequisites: "ندارد",
    prerequisiteTopics: "مفاهیم پایه برنامه‌نویسی و توسعه نرم‌افزار",
    courseLevel: "مبتدی و متوسط",
    duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "بررسی متدولوژی‌های نوین مهندسی نرم‌افزار، معماری سازگار با تغییر، یکپارچه‌سازی و تحویل مستمر (CI/CD)، فرهنگ DevOps، مهندسی نیازمندی‌ها، طراحی شی‌گرا و توسعه چابک (Scrum/Agile).",
    objectives: [
      "آشنایی با متدولوژی‌های توسعه نرم‌افزار سنتی و چابک",
      "تسلط بر اصول مهندسی مدرن: ماژولار بودن، انتزاع، کوپلینگ و چسبندگی",
      "درک فرآیندهای CI/CD، زیرساخت به عنوان کد (IaC) و Docker",
      "آشنایی با معماری‌های مونولیت ماژولار، میکروسرویس و طراحی دامنه‌محور (DDD)",
    ],
    targetAudience: [
      "دانشجویان مهندسی نرم‌افزار و فناوری اطلاعات",
      "توسعه‌دهندگانی که مایل به درک تصویر کلان چرخه‌حیات محصول هستند",
      "مدیران فنی و اعضای تیم‌های چابک",
    ],
    topics: [
      {
        title: "مبانی مهندسی نرم‌افزار مدرن",
        description: "تعاریف مهندسی نرم‌افزار، رویکردهای سنتی در برابر مدرن، تاریخچه مدل‌های آبشاری و RUP، آغاز جنبش چابک.",
      },
      {
        title: "اصول مهندسی و مدیریت پیچیدگی",
        description: "انتزاع، ماژولار بودن، کوپلینگ و چسبندگی (Cohesion)، طراحی برای تغییرپذیری، تست به عنوان فعالیت طراحی و بازخورد سریع.",
      },
      {
        title: "تحویل مستمر (Continuous Delivery) و فرهنگ DevOps",
        description: "پایپ‌لاین‌های بیلد و تست خودکار (CI/CD)، معرفی Jenkins و GitHub Actions، کانتینرسازی با Docker، زیرساخت به عنوان کد (IaC) و استراتژی‌های استقرار.",
      },
      {
        title: "معماری و طراحی نرم‌افزار",
        description: "معماری مونولیت در برابر میکروسرویس‌ها، مونوولیت ماژولار، مبانی DDD، قابلیت مشاهده و مانیتورینگ سیستم‌ها (Logs/Metrics/Traces).",
      },
      {
        title: "روش‌های توسعه چابک (Agile Frameworks)",
        description: "چارچوب Scrum (نقش‌ها، رویدادها، مصنوعات)، روش‌های Kanban و Extreme Programming (XP).",
      },
      {
        title: "کار تیمی، رویه‌های بهینه و مسئولیت حرفه‌ای",
        description: "بهترین شیوه‌های توسعه تیمی (Code Review, Pair Programming)، اخلاق حرفه‌ای و پایداری در نرم‌افزار.",
      },
    ],
    softwareTools: [
      { category: "ابزارهای CI/CD و بیلد", tools: "GitHub Actions, Jenkins" },
      { category: "کانتینرسازی و استقرار", tools: "Docker, Docker Compose" },
      { category: "مدیریت پروژه چابک", tools: "Jira, Trello, Git/GitHub" },
    ],
    assignments: "۲ تمرین تئوری و یک پروژه عملی کار تیمی در بستر Git و CI/CD",
    grading: [
      { label: "تکالیف تئوری", percent: "۲۰٪" },
      { label: "پروژه تیمی و عملی", percent: "۳۰٪" },
      { label: "آزمون پایانی", percent: "۵۰٪" },
    ],
    references: [
      "David Farley, Modern Software Engineering, Addison-Wesley, 2021",
      "Jez Humble and David Farley, Continuous Delivery, Addison-Wesley, 2010",
      "K.S. Rubin. Essential Scrum: A Practical Guide, Addison-Wesley, 2012",
      "Mark Richards and Neal Ford. Fundamentals of Software Architecture, O'Reilly, 2020",
    ],
  },

  5: {
    id: 5,
    title: "کارآفرینی",
    englishTitle: "Entrepreneurship",
    instructor: "دکتر مرتضی ذاکری",
    author: "مرتضی ذاکری",
    version: "۱.۰",
    field: "مهندسی کامپیوتر – نرم‌افزار",
    type: "اختیاری",
    units: "۳ واحد",
    level: "کارشناسی",
    prerequisites: "ندارد",
    corequisites: "مهندسی نرم‌افزار",
    prerequisiteTopics: "مفاهیم پایه کسب‌وکار و کار تیمی",
    courseLevel: "مبتدی و متوسط",
    duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "اصول و شیوه‌های راه‌اندازی، اعتبارسنجی ایده، توسعه مدل کسب‌وکار، تحلیل اقتصادی، شاخص‌های عملکرد کلیدی (KPIs) و فنون جذب سرمایه برای استارتاپ‌های حوزه فناوری و نرم‌افزار.",
    objectives: [
      "شناسایی فرصت‌ها و ایده‌پردازی ساختاریافته در بازار فناوری",
      "بخش‌بندی بازار، تخمین اندازه بازار (TAM) و ساخت پرسونای مشتری",
      "طراحی مدل‌های کسب‌وکار نوآورانه و مدل‌های قیمت‌گذاری",
      "تدوین طرح کسب‌وکار (Business Plan) و ارائه به سرمایه‌گذار (Pitch Deck)",
    ],
    targetAudience: [
      "دانشجویان و فارغ‌التحصیلان علاقه‌مند به راه‌اندازی کسب‌وکار نوپا",
      "توسعه‌دهندگان و مدیران محصول نرم‌افزاری",
      "علاقه‌مندان به اقتصاد فناوری و استارتاپ‌ها",
    ],
    topics: [
      {
        title: "بخش‌بندی و انتخاب بازار (۲ جلسه)",
        description: "ماتریس بخش‌بندی بازار، پژوهش بازار اولیه و ثانویه، بهره‌گیری از هوش مصنوعی در تحقیقات بازار، بازار ساحلی (Beachhead Market) و تخمین TAM.",
      },
      {
        title: "تولید و پرورش ایده‌های کسب‌وکار (۱ جلسه)",
        description: "متدولوژی Lean Startup، تفکر طراحی (Design Thinking)، جعبه مورفولوژیکی، شناسایی مزیت رقابتی پایدار.",
      },
      {
        title: "مدل کسب‌وکار و چارچوب قیمت‌گذاری (۲ جلسه)",
        description: "انواع بوم‌های مدل کسب‌وکار (Business Model Canvas)، استراتژی‌های قیمت‌گذاری، عبور از شکاف (Crossing the Chasm).",
      },
      {
        title: "اقتصاد مهندسی و هوش مالی (۴ جلسه)",
        description: "ارزش زمانی پول، جریان‌های نقدی، نرخ بازگشت سرمایه (ROI)، نقطه سربه‌سر، حسابداری تعهدی، صورت‌های مالی و ارزش‌گذاری استارتاپ.",
      },
      {
        title: "شاخص‌های عملکرد کلیدی (KPIs) (۲ جلسه)",
        description: "ارزش طول عمر مشتری (LTV)، هزینه جذب مشتری (CAC)، نرخ نگهداشت و ریزش (Churn)، نرخ تبدیل و شاخص NPS.",
      },
      {
        title: "طرح کسب‌وکار و ارائه به سرمایه‌گذار (۱ جلسه)",
        description: "تدوین مأموریت و چشم‌انداز، طراحی ساختار مالی و جداول پیش‌بینی درآمد، تدوین Pitch Deck حرفه‌ای.",
      },
    ],
    softwareTools: [
      { category: "مدل‌سازی و بوم‌ها", tools: "Strategyzer, Miro, Notion" },
      { category: "تحلیل مالی و پیش‌بینی", tools: "Microsoft Excel, Google Sheets" },
      { category: "طراحی ارائه", tools: "Pitch, Figma, Canva" },
    ],
    assignments: "۴ تکلیف کاربردی میدانی و تدوین جامع یک طرح کسب‌وکار واقعی (Business Plan)",
    grading: [
      { label: "تکالیف میدانی", percent: "۲۰٪" },
      { label: "پروژه تدوین طرح کسب‌وکار", percent: "۴۰٪" },
      { label: "ارائه و آزمون پایانی", percent: "۴۰٪" },
    ],
    references: [
      "Aulet, Bill. Disciplined Entrepreneurship: 24 Steps to a Successful Startup, Wiley, 2024.",
      "Wasserman, Noam. The Founder's Dilemmas, Princeton University Press, 2013.",
      "Ries, Eric. The Lean Startup, Crown Business, 2011.",
      "Thiel, Peter. Zero to One, Crown, 2014.",
    ],
  },

  6: {
    id: 6,
    title: "اصول و الگوها در مهندسی نرم‌افزار",
    englishTitle: "Principles and Patterns in Software Engineering",
    instructor: "دکتر مرتضی ذاکری",
    author: "مرتضی ذاکری",
    version: "۱.۰",
    field: "مهندسی کامپیوتر – نرم‌افزار",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی ارشد",
    prerequisites: "برنامه‌نویسی شی‌گرا",
    corequisites: "مهندسی نرم‌افزار",
    prerequisiteTopics: "مفاهیم پایه مهندسی نرم‌افزار و برنامه‌سازی شی‌گرا (به‌ویژه Java)",
    courseLevel: "متوسط و پیشرفته",
    duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "بررسی عمیق اصول طراحی نرم‌افزار (SOLID, GRASP, PHAME)، الگوهای طراحی کلاسیک GoF، الگوهای معماری سازمانی و معماری تمیز (Clean Architecture)، پادالگوها و روش‌های بازآرایی کد (Refactoring).",
    objectives: [
      "تسلط بر اصول بنیادین طراحی شی‌گرا (SOLID و GRASP)",
      "پیاده‌سازی اصولی الگوهای آفرینشی، ساختاری و رفتاری GoF",
      "درک اصول معماری کامپوننت‌ها، چسبندگی و اتصال (Cohesion & Coupling)",
      "شناسایی بوهای بد کد (Code Smells) و پادالگوها و اجرای بازآرایی سیستماتیک",
    ],
    targetAudience: [
      "دانشجویان تحصیلات تکمیلی مهندسی نرم‌افزار",
      "توسعه‌دهندگان ارشد و معماران نرم‌افزار",
      "برنامه‌نویسانی که قصد ارتقای کیفیت کد و توسعه سیستم‌های بزرگ‌مقیاس را دارند",
    ],
    topics: [
      {
        title: "مقدمه و تعاریف اصول و الگوها (۱ جلسه)",
        description: "معنا و جایگاه الگوهای مهندسی نرم‌افزار، دسته‌بندی الگوها و معرفی منابع مرجع.",
      },
      {
        title: "اصول طراحی نرم‌افزار (۲ جلسه)",
        description: "اصول PHAME، اصول تخصیص مسئولیت GRASP، اصول پنج‌گانه SOLID و روابط بین آنها.",
      },
      {
        title: "اصول مؤلفه و معماری (۲ جلسه)",
        description: "اصول چسبندگی مؤلفه‌ها (REP, CCP, CRP)، اصول اتصال مؤلفه‌ها (ADP, SDP, SAP) و معیارهای سنجش پایداری معماری.",
      },
      {
        title: "الگوهای طراحی (۸ جلسه)",
        description: "الگوهای تزریق وابستگی (Dependency Injection)، الگوهای آفرینشی (Factory, Builder, Singleton)، الگوهای ساختاری (Adapter, Composite, Decorator, Facade) و الگوهای رفتاری (Observer, Strategy, Command, State).",
      },
      {
        title: "پادالگوها، بوهای طراحی و بازآرایی (۳ جلسه)",
        description: "بدهی فنی (Technical Debt)، بوهای طراحی، پادالگوهای متداول و تکنیک‌های Refactoring جهت اصلاح ساختار بدون تغییر در رفتار خارجی.",
      },
    ],
    softwareTools: [
      { category: "زبان‌های پیاده‌سازی الگوها", tools: "Java / C# / Python" },
      { category: "ابزارهای مدل‌سازی UML", tools: "StarUML, Visual Paradigm, PlantUML" },
      { category: "ابزارهای تحلیل معماری و کیفیت", tools: "SonarQube, Structure101" },
    ],
    assignments: "۴ سری تکلیف پیاده‌سازی الگوها و یک پروژه بازآرایی و معماری مجدد کد",
    grading: [
      { label: "تکالیف تئوری و تحلیل کد", percent: "۲۰٪" },
      { label: "پروژه‌های عملی پیاده‌سازی الگوها", percent: "۳۰٪" },
      { label: "آزمون پایانی", percent: "۵۰٪" },
    ],
    references: [
      "E. Gamma, R. Helm, R. Johnson, and J. Vlissides. Design Patterns, Addison-Wesley, 1995.",
      "Martin, Robert C. Clean Architecture, Prentice Hall, 2018.",
      "Suryanarayana, G., Samarthyam, G., Sharma, T. Refactoring for Software Design Smells, Elsevier, 2014.",
      "Fowler, M. Refactoring: Improving the Design of Existing Code (2nd ed.), Addison-Wesley, 2018.",
    ],
  },

  7: {
    id: 7,
    title: "اصول رایانش ابری",
    englishTitle: "Principles of Cloud Computing",
    instructor: "دکتر سید احمد جوادی",
    author: "سید احمد جوادی",
    version: "۱.۰",
    field: "مهندسی کامپیوتر – معماری سیستم‌های کامپیوتر",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی",
    prerequisites: "سیستم‌های عامل، شبکه‌های کامپیوتری",
    corequisites: "ندارد",
    prerequisiteTopics: "مفاهیم پایه سیستم‌های عامل و شبکه‌های کامپیوتری",
    courseLevel: "مبتدی و متوسط",
    duration: "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
    deliveryMethod: "ترکیبی (کلاس‌های برخط + ارزیابی پایانی حضوری)",
    description:
      "مبانی و معماری سامانه‌های ابری، مدل‌های سرویس‌دهی (IaaS, PaaS, SaaS)، فناوری‌های مجازی‌سازی سطح سخت‌افزار و سیستم‌عامل (Containers & Docker)، مدیریت منابع ابری، کوبرنتیز، تحلیل داده‌های حجیم در ابر (Hadoop/Spark) و توزیع بار پویا.",
    objectives: [
      "درک معماری زیرساخت‌ها، لایه‌ها و مدل‌های سرویس ابری",
      "تسلط بر اصول مجازی‌سازی سرور، شبکه و ذخیره‌ساز",
      "کار با سامانه‌های مدیریت کانتینر (Docker & Kubernetes) و پلتفرم OpenStack",
      "آشنایی با مدل‌های پردازش داده‌های حجیم (MapReduce) و توزیع بار هوشمند",
    ],
    targetAudience: [
      "دانشجویان مهندسی کامپیوتر، فناوری اطلاعات و علوم داده",
      "مهندسان زیرساخت، DevOps و Site Reliability Engineers (SRE)",
      "توسعه‌دهندگان سیستم‌های توزیع‌شده و مقیاس‌پذیر",
    ],
    topics: [
      {
        title: "مقدمه‌ای بر رایانش ابری (۲ جلسه)",
        description: "تاریخچه، اصول، مدل‌های استقرار (عمومی، خصوصی، هیبریدی)، مدل‌های خدمات و چالش‌های مقیاس‌پذیری و امنیت.",
      },
      {
        title: "اصول و معماری مجازی‌سازی (۴ جلسه)",
        description: "مدل ماشین مجازی، Hypervisorها (Type-1 و Type-2)، مجازی‌سازی سخت‌افزار، کانتینرسازی سطح سیستم‌عامل، مجازی‌سازی شبکه (SDN) و ذخیره‌سازی ابری.",
      },
      {
        title: "ارکستراسیون و پلتفرم‌های ابری (۴ جلسه)",
        description: "مقدمه‌ای بر معماری Kubernetes، معماری اجزای OpenStack (Nova, Neutron, Cinder) و مدیریت کلاسترها.",
      },
      {
        title: "تحلیل کلان‌داده در رایانش ابری (۳ جلسه)",
        description: "مدل برنامه‌نویسی MapReduce، سیستم فایل توزیع‌شده HDFS، مقدمه‌ای بر فریم‌ورک‌های Apache Hadoop و Apache Spark.",
      },
      {
        title: "توزیع بار و مقیاس‌پذیری پویا (۳ جلسه)",
        description: "توزیع بار پویا (Load Balancing)، مقیاس‌پذیری خودکار (Auto-scaling)، کاهش زمان تاخیر دم (Tail Latency) و مدیریت تداخل منابع.",
      },
    ],
    softwareTools: [
      { category: "کانتینرسازی و ارکستراسیون", tools: "Docker, Kubernetes" },
      { category: "مدیریت زیرساخت ابری", tools: "OpenStack, KVM" },
      { category: "پردازش کلان‌داده", tools: "Apache Hadoop, Apache Spark" },
    ],
    assignments: "۳ تمرین عملی کارگاهی و ۱ پروژه عملی راه‌اندازی و آزمون سرویس در محیط ابری",
    grading: [
      { label: "تکالیف عملی کارگاهی", percent: "۳۰٪" },
      { label: "پروژه عملی کلاسترینگ", percent: "۲۰٪" },
      { label: "آزمون پایانی", percent: "۵۰٪" },
    ],
    references: [
      "Mastering Cloud Computing: Foundations and Applications, Rajkumar Buyya et al., 2013.",
      "Understanding Full Virtualization and Hardware Assist, VMware Whitepaper.",
      "Hadoop: The Definitive Guide, Tom White, O'Reilly Media, 2015.",
      "DIAL: Reducing Tail Latencies for Cloud Applications, Javadi & Gandhi, ICAC 2017.",
    ],
  },
};
