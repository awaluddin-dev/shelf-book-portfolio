import { Metadata } from "next";
import { AdminYouTube } from "@/views/admin-youtube/ui/AdminYouTube";

export const metadata: Metadata = {
  title: "Admin YouTube Videos | Awaluddin Portfolio",
};

export default function Page() {
  return <AdminYouTube />;
}
