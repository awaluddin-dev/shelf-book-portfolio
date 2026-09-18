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
  projectLifecycles?: any[];
  systemArchitectures?: {
    id?: string;
    imageUrl: string;
    order: number;
    description?: string;
  }[];
  projectDatabaseSchemas?: {
    id?: string;
    imageUrl: string;
    order: number;
    description?: string;
  }[];
  projectErds?: {
    id?: string;
    imageUrl: string;
    order: number;
    description?: string;
  }[];
  technicalImagery?: {
    featured: string;
    blueprint: string;
    metrics: string;
    featuredCaption: string;
    blueprintCaption: string;
    metricsCaption: string;
  };
}

export interface HeroConfigV2 {
  id?: string;
  name: string;
  role: string;
  headline: string;
  quote: string;
  status: string;
  statusText: string;
  resumeUrl: string;
  docsUrl: string;
}

export interface MetricV2 {
  id?: string;
  value: string;
  label: string;
  description: string;
  subtext: string;
  icon: string;
  order?: number;
}

export interface CareerBulletV2 {
  situation: string;
  action: string;
  metricPrefix?: string;
  metric: string;
  metricSuffix?: string;
}

export interface CareerExperienceV2 {
  id?: string;
  company: string;
  role: string;
  period: string;
  isActive?: boolean;
  bullets: CareerBulletV2[];
  techTags: string[];
  order?: number;
}

export interface ProficiencySkillV2 {
  name: string;
  status: 'PROD' | 'R&D';
}

export interface ProficiencyPillarV2 {
  id?: string;
  pillarNumber: string;
  title: string;
  description: string;
  icon: string;
  skills: ProficiencySkillV2[];
  order?: number;
}

export interface ProjectV2 {
  id?: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  tags: string[];
  domainBadge?: string;
  problem?: string;
  solution?: string;
  pipelineFlow?: string[];
  spineColor: string;
  coverColor: string;
  spineText: string;
  github?: string;
  demoUrl?: string;
  stats?: { label: string; value: string }[];
  phases?: { date: string; title: string; description: string }[];
  markdown?: string;
  order?: number;
}
