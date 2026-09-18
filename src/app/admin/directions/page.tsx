import { Metadata } from "next";
import { AdminDirections } from "@/views/admin-directions/ui/AdminDirections";

export const metadata: Metadata = {
  title: "Admin Directions & Roadmap | Awaluddin Portfolio",
};

export default function Page() {
  return <AdminDirections />;
}
