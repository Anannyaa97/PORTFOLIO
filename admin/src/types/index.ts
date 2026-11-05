export interface Profile {
  id: string;
  name: string;
  title: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone?: string;
  availabilityStatus: string;
  specialization: string;
  academicScore: string;
  industryExpCount: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface About {
  id: string;
  narrativeTitle: string;
  narrativeBody: string;
  narrativeSub?: string;
  currentFocus: string;
  collegeName: string;
  cgpa: string;
  statusBadge: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  iconName: string;
  proficiency: number;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  images?: string[];
  visualType: "chart" | "terminal" | "hotel" | "hardware" | "web" | "migration";
  statLabel?: string;
  statValue?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  type: string;
  description: string[];
  technologies: string[];
  iconName: string;
  accent?: "emerald" | "mint" | "teal" | "cyan";
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  grade: string;
  badge?: string;
  description?: string;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueYear: string;
  credentialUrl?: string;
  fileUrl?: string;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  associatedEvent?: string;
  order?: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  deliverables?: string[];
  order?: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  rating?: number;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeItem {
  id: string;
  title: string;
  version: string;
  fileUrl: string;
  driveFileId?: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconName: string;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactSettings {
  id: string;
  email: string;
  phone?: string;
  location: string;
  formEnabled: boolean;
  notificationEmail?: string;
  contactMessage?: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  audioUrl: string;
  color: string;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppearanceSettings {
  theme: "dark" | "light" | "system";
  accentColor: string;
  backgroundColor: string;
  showHero: boolean;
  showAbout: boolean;
  showExperience: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showServices: boolean;
  showEducation: boolean;
  showCertificates: boolean;
  showAchievements: boolean;
  showTestimonials: boolean;
  showContact: boolean;
  showMusicPlayer: boolean;
  enableAnimations: boolean;
  [key: string]: any;
}

export interface SEOSettings {
  id: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  ogImage: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  driveFileId: string;
  publicUrl: string;
  sizeBytes: number;
  category: "Images" | "Documents" | "Audio" | "Other";
  createdAt: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  status: "SUCCESS" | "FAILURE" | "PENDING";
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalSkills: number;
  totalCertificates: number;
  totalExperience: number;
  totalServices: number;
  totalTestimonials: number;
  totalMedia: number;
  lastUpdated: string;
  recentActivity: ActivityLogItem[];
  dbConnected?: boolean;
}

export interface AuthUser {
  email: string;
  name: string;
  picture?: string;
  idToken?: string;
  adminKey?: string;
  isAuthorized: boolean;
}
