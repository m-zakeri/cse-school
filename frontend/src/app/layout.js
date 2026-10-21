import localFont from "next/font/local";
import "./globals.css";

const yekanBakh = localFont({
  src: [
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 03 Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 04 Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 05 Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 06 Bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 07 Heavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-yekan-bakh",
  display: "swap",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata = {
  title: {
    default: "مدرسه کامپیوتر امیرکبیر | دانشگاه صنعتی امیرکبیر",
    template: "%s | مدرسه کامپیوتر امیرکبیر",
  },
  description:
    "سامانه رسمی ثبت‌نام و برگزاری دوره‌های تخصصی و بسته‌های میکرومستر دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران).",
  keywords: [
    "دانشگاه صنعتی امیرکبیر",
    "دانشکده مهندسی کامپیوتر",
    "مدرسه کامپیوتر امیرکبیر",
    "یادگیری ماشین",
    "مهندسی نرم‌افزار",
    "تضمین کیفیت نرم‌افزار",
    "رایانش ابری",
    "میکرومستر",
  ],
  authors: [{ name: "حسین زارعی‌نژاد" }],
  creator: "حسین زارعی‌نژاد",
  publisher: "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
  metadataBase: new URL("https://ce.aut.ac.ir"),
  openGraph: {
    title: "مدرسه کامپیوتر امیرکبیر | دانشگاه صنعتی امیرکبیر",
    description:
      "سامانه رسمی ثبت‌نام و برگزاری دوره‌های تخصصی و بسته‌های میکرومستر دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران).",
    url: "https://ce.aut.ac.ir",
    siteName: "مدرسه کامپیوتر امیرکبیر",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/photos/coursepic/ml.jpg",
        width: 1200,
        height: 630,
        alt: "مدرسه کامپیوتر امیرکبیر دانشگاه صنعتی امیرکبیر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مدرسه کامپیوتر امیرکبیر | دانشگاه صنعتی امیرکبیر",
    description:
      "سامانه رسمی ثبت‌نام دوره‌های تخصصی و بسته‌های آموزشی مهندسی کامپیوتر پلی‌تکنیک تهران.",
    images: ["/photos/coursepic/ml.jpg"],
  },
  icons: {
    icon: "/photos/aut_logo.png",
    shortcut: "/photos/aut_logo.png",
    apple: "/photos/aut_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${yekanBakh.variable} font-yekan-bakh antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        >
          پرش به محتوای اصلی
        </a>
        {children}
      </body>
    </html>
  );
}
