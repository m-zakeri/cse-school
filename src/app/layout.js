import localFont from "next/font/local";
import "./globals.css";

const yekanBakh = localFont({
  src: [
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 01 Hairline.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 02 Thin.ttf",
      weight: "200",
      style: "normal",
    },
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
    {
      path: "../../public/fonts/ttf/Yekan Bakh FaNum 08 Fat.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekan-bakh",
  display: "swap",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata = {
  title: "مدرسه پاییزه امیرکبیر",
  description: "دوره‌های آموزشی تخصصی دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${yekanBakh.variable} font-yekan-bakh antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
