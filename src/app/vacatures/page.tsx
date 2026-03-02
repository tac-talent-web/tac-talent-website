import type { Metadata } from "next";
import { getJobs, Job } from "@/lib/jobs";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import VacaturesClient from "./VacaturesClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Vacatures | TAC — The Talent Acquisition Company",
  description:
    "Bekijk alle openstaande vacatures bij TAC. Techniek, Automotive, Productie, Logistiek en meer. Solliciteer direct.",
  alternates: { canonical: "https://tac-talent-website.vercel.app/vacatures" },
  openGraph: {
    title: "Vacatures | TAC — The Talent Acquisition Company",
    description:
      "Openstaande vacatures in Techniek, Automotive, Productie en Logistiek.",
    url: "https://tac-talent-website.vercel.app/vacatures",
  },
};

export default async function VacaturesPage() {
  const jobs: Job[] = await getJobs();

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#111111",
        background: "#FFFFFF",
        overflowX: "hidden",
      }}
    >
      <Nav />
      <VacaturesClient jobs={jobs} />
      <Footer />
    </div>
  );
}
