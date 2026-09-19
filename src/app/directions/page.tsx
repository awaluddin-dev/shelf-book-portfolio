import { Metadata } from "next";
import { DirectionsPage } from "@/views/directions/ui/DirectionsPage";

export const metadata: Metadata = {
  title: "Current & Future Directions | Awaluddin",
  description:
    "What Awaluddin is learning and building right now, upcoming quarterly roadmap, engineering articles from dev.to, and YouTube videos.",
};

export default function Page() {
  return <DirectionsPage />;
}
