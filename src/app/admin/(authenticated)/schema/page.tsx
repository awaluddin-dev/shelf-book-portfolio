import AdminSchema from "@/views/admin-schema/ui/AdminSchema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Database Schema",
};

export default function AdminSchemaPage() {
  return <AdminSchema />;
}
