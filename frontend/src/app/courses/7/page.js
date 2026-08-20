import CourseDetails from "../[id]/page";

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  return <CourseDetails params={{ id: "7" }} searchParams={sp} />;
}
