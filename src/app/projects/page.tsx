import { Metadata } from "next";
import { ProjectsCatalogPage } from "@/views/projects-catalog/ui/ProjectsCatalogPage";

export const metadata: Metadata = {
  title: "Full Projects Archive | Awaluddin Portfolio",
  description:
    "Complete interactive engineering archive of production applications, system APIs, and developer tools built by Awaluddin.",
};

export default function Page() {
  return <ProjectsCatalogPage />;
}
