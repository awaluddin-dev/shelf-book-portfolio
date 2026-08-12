import AdminErd from "@/views/admin-erd/ui/AdminErd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Entity Relationship Diagram",
};

export default function AdminErdPage() {
  return <AdminErd />;
}
