export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  url?: string;
  testimonial: string;
  tags: string[];
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  spineColor: string;
  coverColor: string;
  spineText: string;
  date: string;
  demoUrl?: string;
  github?: string;
  stats?: { label: string; value: string }[];
  phases?: { date: string; title: string; description: string }[];
  markdown?: string;
}
