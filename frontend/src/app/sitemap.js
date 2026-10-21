export const dynamic = "force-static";

const BASE = "https://ce.aut.ac.ir";
const PAGES = ["", "courses", "instructors", "syllabus", "calendar", "micromaster", "info", "terms", "about", "contact"];

export default function sitemap() {
  return PAGES.map((path) => ({
    url: `${BASE}/${path}${path ? "/" : ""}`,
    changeFrequency: path === "courses" || path === "calendar" ? "weekly" : "monthly",
  }));
}
