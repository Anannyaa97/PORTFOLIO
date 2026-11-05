import {
  Profile,
  About,
  Skill,
  Project,
  Experience,
  Education,
  Certificate,
  Achievement,
  Service,
  Testimonial,
  ResumeItem,
  SocialLink,
  ContactSettings,
  MusicTrack,
  AppearanceSettings,
  SEOSettings,
  MediaItem,
  NavigationItem,
  ActivityLogItem,
  DashboardStats,
} from "../types";

export const STORAGE_KEYS = {
  API_URL: "portfolio_cms_apps_script_url",
  AUTH: "portfolio_cms_auth_data",
  LOCAL_DATA: "portfolio_cms_local_store",
  SYNC_TIMESTAMP: "portfolio_sync_timestamp",
};

export const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyg_38Pa8ZBj0iRCCYcColssYsOcVLHLmfizVcWiPFMDtVguZUeVqldCnqeS32wZZofjQ/exec";

export function getAppsScriptUrl(): string {
  const customUrl = localStorage.getItem(STORAGE_KEYS.API_URL);
  if (customUrl && customUrl.trim()) {
    return customUrl.trim();
  }
  // When running on local Vite dev server, route through /api-proxy for Node-level redirect handling
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "/api-proxy";
  }
  return import.meta.env.VITE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
}

export function setAppsScriptUrl(url: string) {
  localStorage.setItem(STORAGE_KEYS.API_URL, url.trim());
}

function getAuthPayload() {
  const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!raw) return { adminKey: "anannya_admin_secret_key_2026", auth: "anannya_admin_secret_key_2026" };
  try {
    const parsed = JSON.parse(raw);
    return {
      idToken: parsed.idToken || "",
      adminKey: parsed.adminKey || "anannya_admin_secret_key_2026",
      auth: parsed.idToken || parsed.adminKey || "anannya_admin_secret_key_2026",
    };
  } catch (e) {
    return { adminKey: "anannya_admin_secret_key_2026", auth: "anannya_admin_secret_key_2026" };
  }
}

/**
 * Signal across all tabs and components that portfolio content was updated
 */
export function broadcastDataChange(entity: string, actionType: string) {
  const now = Date.now().toString();
  try {
    localStorage.setItem(STORAGE_KEYS.SYNC_TIMESTAMP, now);
    window.dispatchEvent(
      new CustomEvent("portfolio:synced", {
        detail: { entity, actionType, timestamp: now },
      })
    );
  } catch (e) {}
}

// Initial Verified Default Dataset matching Google Sheets Schema
export const INITIAL_DATA: {
  Profile: Profile[];
  About: About[];
  Skills: Skill[];
  Projects: Project[];
  Experience: Experience[];
  Education: Education[];
  Certificates: Certificate[];
  Achievements: Achievement[];
  Services: Service[];
  Testimonials: Testimonial[];
  Resume: ResumeItem[];
  SocialLinks: SocialLink[];
  Contact: ContactSettings[];
  Music: MusicTrack[];
  Appearance: AppearanceSettings;
  SEOSettings: SEOSettings;
  Media: MediaItem[];
  Navigation: NavigationItem[];
  ActivityLog: ActivityLogItem[];
} = {
  Profile: [
    {
      id: "profile_1",
      name: "Anannya AK",
      title: "Data Science & Software Engineering",
      headline: "CSE Student — Data Science Specialization",
      bio: "Building high-performance ecosystems at the intersection of logical problem-solving and data-driven insights. Hands-on experience in distributed big data pipelines, machine learning, and secure database architectures.",
      avatarUrl: "profile/profile.jpeg",
      resumeUrl: "resume.pdf",
      location: "Kannur, Kerala, India",
      email: "anannyaak01@gmail.com",
      phone: "+91 0000000000",
      availabilityStatus: "Active CSE Student",
      specialization: "Data Science & ML",
      academicScore: "CGPA: 8.6 / 10",
      industryExpCount: "2 Internships",
      published: true,
      updatedAt: new Date().toISOString(),
    },
  ],
  About: [
    {
      id: "about_1",
      narrativeTitle: "Academic Pulse & Identity",
      narrativeBody:
        "I am a B.Tech student specializing in Computer Science and Engineering (Data Science). I thrive at the intersection of logical problem-solving and data-driven insights, with hands-on internship experience in software development, database migration, and Python-based data pipelines.",
      narrativeSub:
        "Passionate about architecting clean data infrastructures, applying machine learning algorithms (regression, classification, clustering, PCA), and writing robust code in Python, Java, SQL, and modern web environments.",
      currentFocus: "Data Science & Engineering",
      collegeName: "St. Thomas College of Engg.",
      cgpa: "8.6 / 10",
      statusBadge: "Active CSE Student",
      published: true,
      updatedAt: new Date().toISOString(),
    },
  ],
  Skills: [
    { id: "skill_1", category: "Programming Languages", name: "Python", iconName: "Code", proficiency: 90, order: 1, published: true },
    { id: "skill_2", category: "Programming Languages", name: "Java", iconName: "Code", proficiency: 85, order: 2, published: true },
    { id: "skill_3", category: "Programming Languages", name: "C", iconName: "Code", proficiency: 80, order: 3, published: true },
    { id: "skill_4", category: "Databases & Storage", name: "MySQL", iconName: "Database", proficiency: 90, order: 4, published: true },
    { id: "skill_5", category: "Databases & Storage", name: "PostgreSQL", iconName: "Database", proficiency: 85, order: 5, published: true },
    { id: "skill_6", category: "Databases & Storage", name: "JDBC", iconName: "Database", proficiency: 80, order: 6, published: true },
    { id: "skill_7", category: "Databases & Storage", name: "SQL Optimization", iconName: "Database", proficiency: 85, order: 7, published: true },
    { id: "skill_8", category: "Data Analysis & ML", name: "Pandas", iconName: "LineChart", proficiency: 90, order: 8, published: true },
    { id: "skill_9", category: "Data Analysis & ML", name: "NumPy", iconName: "LineChart", proficiency: 90, order: 9, published: true },
    { id: "skill_10", category: "Data Analysis & ML", name: "Matplotlib", iconName: "LineChart", proficiency: 85, order: 10, published: true },
    { id: "skill_11", category: "Web Technologies", name: "HTML5", iconName: "Globe", proficiency: 95, order: 11, published: true },
    { id: "skill_12", category: "Web Technologies", name: "CSS3", iconName: "Globe", proficiency: 90, order: 12, published: true },
    { id: "skill_13", category: "Web Technologies", name: "JavaScript", iconName: "Globe", proficiency: 85, order: 13, published: true },
    { id: "skill_14", category: "Development Tools", name: "Git", iconName: "Terminal", proficiency: 85, order: 14, published: true },
    { id: "skill_15", category: "Development Tools", name: "VS Code", iconName: "Terminal", proficiency: 90, order: 15, published: true },
  ],
  Projects: [
    {
      id: "hospital-analysis",
      title: "Hospital Patient Record Analysis",
      category: "Big Data & Distributed Computing",
      description:
        "Distributed big data pipeline processing New York State inpatient discharge records using HDFS and PySpark for high-throughput cleansing and exploratory analytics, presented in a custom live analytics dashboard.",
      shortDescription: "PySpark & HDFS distributed data pipeline with interactive analytics.",
      technologies: ["PySpark", "HDFS", "Python", "Big Data", "HTML5", "Chart.js"],
      githubUrl: "https://github.com/Anannyaa97/Hospital-Patient-Analysis",
      liveUrl: "https://hospital-patient-analysis.onrender.com",
      visualType: "chart",
      statLabel: "Engine",
      statValue: "PySpark + HDFS",
      featured: true,
      order: 1,
      published: true,
    },
    {
      id: "cybersentry",
      title: "CyberSentry: Phishing Analyzer",
      category: "Security & Heuristic Intelligence",
      description:
        "Explainable URL security analysis engine that inspects text patterns and computes transparent 0–100 heuristic risk scores, identifying threat vectors rather than relying on opaque classifications.",
      shortDescription: "0–100 heuristic risk scoring engine for phishing URL identification.",
      technologies: ["Python", "Heuristic Analysis", "Cybersecurity", "Risk Scoring"],
      githubUrl: "https://github.com/Anannyaa97/CyberSentry",
      liveUrl: "https://cybersentry-skx7.onrender.com",
      visualType: "terminal",
      statLabel: "Heuristics",
      statValue: "0-100 Risk Engine",
      featured: true,
      order: 2,
      published: true,
    },
    {
      id: "hotel-booking",
      title: "Hotel Room Booking System",
      category: "Software Engineering & Database",
      description:
        "Full-featured reservation system developed with Java Swing for user interaction and MySQL with JDBC for persistent storage, handling room bookings, payment tracking, and customer reviews.",
      shortDescription: "Java Swing + MySQL ACID relational booking and review engine.",
      technologies: ["Java Swing", "MySQL", "JDBC", "OOP Architecture"],
      githubUrl: "https://github.com/Anannyaa97/Hotel-Room-Booking-System",
      visualType: "hotel",
      statLabel: "Storage",
      statValue: "MySQL ACID",
      featured: false,
      order: 3,
      published: true,
    },
    {
      id: "riscv-cache",
      title: "Unified vs Split Cache RISC-V Analysis",
      category: "Computer Architecture",
      description:
        "Comprehensive benchmark comparing Unified and Split Cache memory architectures executing RISC-V assembly routines on the Ripes simulator to evaluate cycle times, miss ratios, and stalls.",
      shortDescription: "Microarchitecture cache benchmarking in RISC-V assembly.",
      technologies: ["RISC-V Assembly", "Ripes Simulator", "Architecture Benchmarking"],
      githubUrl: "https://github.com/Anannyaa97/Unified-vs-Split-Cache-RISC-V",
      visualType: "hardware",
      statLabel: "Platform",
      statValue: "RISC-V ISA",
      featured: false,
      order: 4,
      published: true,
    },
    {
      id: "ieee-website",
      title: "IEEE Student Branch Portal",
      category: "Full Stack & Web Technologies",
      description:
        "Official interactive web platform created for the IEEE Student Branch, serving event registrations, organizational updates, technical committee directories, and workshop schedules.",
      shortDescription: "Interactive student branch web platform with event registries.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git"],
      githubUrl: "https://github.com/Anannyaa97/IEEE-WEBSITE",
      liveUrl: "https://anannyaa97.github.io/IEEE-WEBSITE/",
      visualType: "web",
      statLabel: "Status",
      statValue: "Live Deployment",
      featured: false,
      order: 5,
      published: true,
    },
    {
      id: "db-migration",
      title: "Database Migration Engine",
      category: "Enterprise Infrastructure",
      description:
        "Automated database migration framework developed at Dinesh IT Systems for seamless data transformation between MySQL and PostgreSQL with schema validation and complete SRS documentation.",
      shortDescription: "Automated schema transformation and data migration pipeline.",
      technologies: ["Python", "PostgreSQL", "MySQL", "SRS Documentation", "Validation"],
      githubUrl: "https://github.com/Anannyaa97",
      visualType: "migration",
      statLabel: "Scope",
      statValue: "Dinesh IT Systems",
      featured: false,
      order: 6,
      published: true,
    },
  ],
  Experience: [
    {
      id: "exp_1",
      role: "Software Development Intern",
      company: "Dinesh IT Systems",
      period: "June 2026",
      type: "Internship Protocol",
      description: [
        "Architected and implemented a high-performance Database Migration System connecting MySQL and PostgreSQL.",
        "Conducted extensive testing, system debugging, and enterprise UI/UX enhancements across core systems.",
        "Authored rigorous, comprehensive Software Requirements Specification (SRS) documentation.",
        "Engineered automated validation routines ensuring 100% data integrity during schema transformations.",
      ],
      technologies: ["Python", "PostgreSQL", "MySQL", "JavaScript", "HTML/CSS", "SRS Docs"],
      iconName: "Terminal",
      accent: "emerald",
      order: 1,
      published: true,
    },
    {
      id: "exp_2",
      role: "Python for Database Intern",
      company: "Neovent Innovations",
      period: "June 2025",
      type: "Internship Protocol",
      description: [
        "Engineered end-to-end Python data analysis pipelines utilizing Pandas, NumPy, and Matplotlib for analytical insights.",
        "Developed preprocessing and feature engineering routines on structured and multi-source dataset streams.",
        "Explored and implemented core Machine Learning models covering regression, classification, clustering, and PCA.",
        "Designed visual dashboards and automated statistical summaries for data-informed decision making.",
      ],
      technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Machine Learning", "Data Pipelines"],
      iconName: "Database",
      accent: "mint",
      order: 2,
      published: true,
    },
  ],
  Education: [
    {
      id: "edu_1",
      institution: "St. Thomas College of Engineering and Technology, Kannur",
      degree: "B.Tech",
      field: "Computer Science and Engineering (Data Science)",
      period: "2024 - 2028 (Expected)",
      grade: "CGPA: 8.6 / 10",
      badge: "Expected 2028",
      order: 1,
      published: true,
    },
    {
      id: "edu_2",
      institution: "Government Higher Secondary School, Chala, Kannur",
      degree: "Class XII",
      field: "Higher Secondary",
      period: "Graduated 2024",
      grade: "95% Aggregate",
      badge: "Higher Secondary",
      order: 2,
      published: true,
    },
  ],
  Certificates: [
    {
      id: "cert_1",
      title: "Python Training",
      issuer: "Spoken Tutorial, IIT Bombay",
      issueYear: "2025",
      credentialUrl: "https://spoken-tutorial.org",
      order: 1,
      published: true,
    },
    {
      id: "cert_2",
      title: "Python for Data Science",
      issuer: "NPTEL Certification",
      issueYear: "2025",
      credentialUrl: "https://nptel.ac.in",
      order: 2,
      published: true,
    },
  ],
  Achievements: [
    {
      id: "ach_1",
      title: "Top 5% Academic Honor",
      description: "Recognized for outstanding academic achievement in Data Science & Mathematics.",
      date: "2025",
      order: 1,
      published: true,
    },
  ],
  Services: [
    {
      id: "srv_1",
      title: "Data Pipelines & Distributed ETL",
      description: "Architecture and optimization of resilient data pipelines in Python, PySpark, and SQL.",
      deliverables: ["Automated Ingestion", "Schema Migration", "Data Quality Auditing"],
      iconName: "Database",
      order: 1,
      published: true,
    },
    {
      id: "srv_2",
      title: "Full-Stack Web Engineering",
      description: "Modern, high-performance web applications with React, TypeScript, and cloud integrations.",
      deliverables: ["Responsive UI", "REST APIs", "Modern Component Architecture"],
      iconName: "Code",
      order: 2,
      published: true,
    },
    {
      id: "srv_3",
      title: "Machine Learning & Analytics",
      description: "Statistical modeling, classification, regression, clustering, and heuristic threat detection engines.",
      deliverables: ["Model Training", "Heuristic Scoring", "Visual Dashboards"],
      iconName: "LineChart",
      order: 3,
      published: true,
    },
  ],
  Testimonials: [
    {
      id: "test_1",
      clientName: "Academic Supervisor",
      clientRole: "Professor & Head of Department",
      company: "St. Thomas College of Engg.",
      quote: "Anannya demonstrates exceptional dedication to software engineering principles and big data systems architecture.",
      rating: 5,
      order: 1,
      published: true,
    },
  ],
  Resume: [
    {
      id: "res_1",
      title: "Anannya AK — Official Curriculum Vitae",
      version: "2026.1",
      fileUrl: "resume.pdf",
      isActive: true,
      updatedAt: new Date().toISOString(),
    },
  ],
  SocialLinks: [
    { id: "soc_1", platform: "GitHub", label: "GitHub", url: "https://github.com/Anannyaa97", iconName: "Github", order: 1, published: true },
    { id: "soc_2", platform: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/in/anannya-ak/", iconName: "Linkedin", order: 2, published: true },
    { id: "soc_3", platform: "Email", label: "Email", url: "mailto:anannyaak01@gmail.com", iconName: "Mail", order: 3, published: true },
  ],
  Contact: [
    {
      id: "contact_1",
      email: "anannyaak01@gmail.com",
      phone: "+91 0000000000",
      location: "Kannur, Kerala, India",
      formEnabled: true,
      contactMessage: "Let's connect and build something impactful.",
      published: true,
    },
  ],
  Music: [
    {
      id: "track-1",
      title: "Deep Focus Ambient (432Hz)",
      artist: "Anannya AK — Coding Session",
      category: "Lo-Fi Ambient Chords",
      audioUrl: "audio/deep-focus.wav",
      color: "#50C878",
      order: 1,
      published: true,
    },
    {
      id: "track-2",
      title: "Midnight Algorave",
      artist: "Data Science Synthesis",
      category: "Melodic Synthwave",
      audioUrl: "audio/midnight-pulse.wav",
      color: "#D1F2EB",
      order: 2,
      published: true,
    },
    {
      id: "track-3",
      title: "Neural Synthesis Drift",
      artist: "Machine Learning Flow",
      category: "Atmospheric Soundscape",
      audioUrl: "audio/neural-drift.wav",
      color: "#50C878",
      order: 3,
      published: true,
    },
  ],
  Appearance: {
    theme: "dark",
    accentColor: "#50C878",
    backgroundColor: "#0A0A0A",
    showHero: true,
    showAbout: true,
    showExperience: true,
    showProjects: true,
    showSkills: true,
    showServices: true,
    showEducation: true,
    showCertificates: true,
    showAchievements: true,
    showTestimonials: true,
    showContact: true,
    showMusicPlayer: true,
    enableAnimations: true,
  },
  SEOSettings: {
    id: "seo_1",
    metaTitle: "Anannya AK | Data Science & Software Engineering Portfolio",
    metaDescription: "Portfolio of Anannya AK — CSE Student specializing in Data Science & Software Engineering. Featuring big data pipelines, machine learning models, and modern software development.",
    canonicalUrl: "https://anannya-ak.onrender.com",
    keywords: "Anannya AK, Data Science, Software Engineering, Python, PySpark, Machine Learning, Portfolio, Kannur",
    ogImage: "profile/profile.jpeg",
    updatedAt: new Date().toISOString(),
  },
  Media: [
    {
      id: "media_profile",
      fileName: "profile.jpeg",
      fileType: "image/jpeg",
      mimeType: "image/jpeg",
      driveFileId: "local_profile",
      publicUrl: "profile/profile.jpeg",
      sizeBytes: 226786,
      category: "Images",
      createdAt: new Date().toISOString(),
    },
    {
      id: "media_resume",
      fileName: "resume.pdf",
      fileType: "application/pdf",
      mimeType: "application/pdf",
      driveFileId: "local_resume",
      publicUrl: "resume.pdf",
      sizeBytes: 260056,
      category: "Documents",
      createdAt: new Date().toISOString(),
    },
    {
      id: "media_audio1",
      fileName: "deep-focus.wav",
      fileType: "audio/wav",
      mimeType: "audio/wav",
      driveFileId: "local_audio1",
      publicUrl: "audio/deep-focus.wav",
      sizeBytes: 3175244,
      category: "Audio",
      createdAt: new Date().toISOString(),
    },
  ],
  Navigation: [
    { id: "nav_1", label: "Home", href: "#hero", order: 1, published: true },
    { id: "nav_2", label: "About", href: "#about", order: 2, published: true },
    { id: "nav_3", label: "Experience", href: "#experience", order: 3, published: true },
    { id: "nav_4", label: "Projects", href: "#projects", order: 4, published: true },
    { id: "nav_5", label: "Skills", href: "#skills", order: 5, published: true },
    { id: "nav_6", label: "Services", href: "#services", order: 6, published: true },
    { id: "nav_7", label: "Education", href: "#education", order: 7, published: true },
    { id: "nav_8", label: "Contact", href: "#contact", order: 8, published: true },
  ],
  ActivityLog: [
    {
      id: "log_init",
      timestamp: new Date().toISOString(),
      userEmail: "anannyamalu23@gmail.com",
      action: "INIT",
      entity: "System",
      details: "Portfolio CMS initialized with verified data",
      status: "SUCCESS",
    },
  ],
};

/**
 * Normalizes entity models to match Google Sheets column headers exactly
 */
export function normalizeForSheet(sheetName: string, data: any): any {
  if (!data || typeof data !== "object") return data;
  const clone = { ...data };

  if (sheetName === "Profile") {
    return {
      ...clone,
      name: clone.name,
      designation: clone.designation || clone.title || "",
      tagline: clone.tagline || clone.headline || "",
      bio: clone.bio || "",
      profile_image: clone.profile_image || clone.avatarUrl || "",
      resume_url: clone.resume_url || clone.resumeUrl || "",
      location: clone.location || "",
      email: clone.email || "",
      phone: clone.phone || "",
      availability: clone.availability || clone.availabilityStatus || "",
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "About") {
    return {
      ...clone,
      title: clone.title || clone.narrativeTitle || "",
      description: clone.description || clone.narrativeBody || "",
      category: clone.category || "Identity",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Skills") {
    return {
      ...clone,
      skill_name: clone.skill_name || clone.name || "",
      category: clone.category || "General",
      proficiency: Number(clone.proficiency) || 80,
      icon: clone.icon || clone.iconName || "Code",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Projects") {
    const techs = Array.isArray(clone.technologies) ? clone.technologies.join(", ") : (clone.technologies || "");
    return {
      ...clone,
      title: clone.title || "",
      slug: clone.slug || clone.id || "",
      short_description: clone.short_description || clone.shortDescription || "",
      description: clone.description || "",
      thumbnail: clone.thumbnail || clone.thumbnailUrl || "",
      gallery_urls: clone.gallery_urls || "",
      github_url: clone.github_url || clone.githubUrl || "",
      live_url: clone.live_url || clone.liveUrl || "",
      technologies: techs,
      category: clone.category || "Development",
      featured: clone.featured === true || clone.featured === "true" || clone.featured === 1,
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Experience") {
    const desc = Array.isArray(clone.description) ? clone.description.join("\n") : (clone.description || "");
    const techs = Array.isArray(clone.technologies) ? clone.technologies.join(", ") : (clone.technologies || "");
    return {
      ...clone,
      position: clone.position || clone.role || "",
      organization: clone.organization || clone.company || "",
      employment_type: clone.employment_type || clone.type || "",
      location: clone.location || "",
      start_date: clone.start_date || (clone.period ? clone.period.split("-")[0]?.trim() : ""),
      end_date: clone.end_date || (clone.period ? clone.period.split("-")[1]?.trim() : ""),
      currently_working: clone.currently_working || clone.isCurrent || false,
      description: desc,
      technologies: techs,
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Education") {
    return {
      ...clone,
      institution: clone.institution || "",
      degree: clone.degree || "",
      course: clone.course || clone.field || "",
      start_year: clone.start_year || (clone.period ? clone.period.split("-")[0]?.trim() : ""),
      end_year: clone.end_year || (clone.period ? clone.period.split("-")[1]?.trim() : ""),
      grade: clone.grade || "",
      description: clone.description || "",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Certificates") {
    return {
      ...clone,
      title: clone.title || "",
      issuing_organization: clone.issuing_organization || clone.issuer || "",
      issue_date: clone.issue_date || clone.issueYear || "",
      credential_id: clone.credential_id || clone.credentialId || "",
      verification_url: clone.verification_url || clone.credentialUrl || "",
      certificate_file: clone.certificate_file || clone.fileUrl || "",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Achievements") {
    return {
      ...clone,
      title: clone.title || "",
      description: clone.description || "",
      event: clone.event || clone.associatedEvent || "",
      achievement_date: clone.achievement_date || clone.date || "",
      image_url: clone.image_url || clone.imageUrl || "",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Services") {
    const deliverables = Array.isArray(clone.deliverables) ? clone.deliverables.join(", ") : (clone.deliverables || "");
    return {
      ...clone,
      title: clone.title || "",
      description: clone.description || "",
      deliverables,
      icon: clone.icon || clone.iconName || "Code",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Testimonials") {
    return {
      ...clone,
      client_name: clone.client_name || clone.clientName || "",
      client_role: clone.client_role || clone.clientRole || "",
      company: clone.company || "",
      quote: clone.quote || "",
      avatar_url: clone.avatar_url || clone.avatarUrl || "",
      rating: Number(clone.rating) || 5,
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Resume") {
    return {
      ...clone,
      title: clone.title || "Curriculum Vitae",
      version: clone.version || "1.0",
      file_url: clone.file_url || clone.fileUrl || "",
      drive_file_id: clone.drive_file_id || clone.driveFileId || "",
      is_active: clone.is_active !== false && clone.isActive !== false,
    };
  }

  if (sheetName === "SocialLinks") {
    return {
      ...clone,
      platform: clone.platform || "",
      username: clone.username || clone.label || "",
      url: clone.url || "",
      icon: clone.icon || clone.iconName || "",
      display_order: clone.display_order || clone.order || 1,
      status: clone.status || (clone.published ? "published" : "draft"),
    };
  }

  if (sheetName === "Contact") {
    return {
      ...clone,
      email: clone.email || "",
      phone: clone.phone || "",
      location: clone.location || "",
      contact_message: clone.contact_message || clone.contactMessage || "",
    };
  }

  if (sheetName === "Music") {
    return {
      ...clone,
      title: clone.title || "",
      artist: clone.artist || "",
      audio_url: clone.audio_url || clone.audioUrl || "",
      cover_image: clone.cover_image || clone.coverUrl || "",
      display_order: clone.display_order || clone.order || 1,
      enabled: clone.enabled !== false && clone.published !== false,
    };
  }

  if (sheetName === "Navigation") {
    return {
      ...clone,
      section_name: clone.section_name || clone.label || "",
      section_id: clone.section_id || clone.href || "",
      display_label: clone.display_label || clone.label || "",
      display_order: clone.display_order || clone.order || 1,
      visible: clone.visible !== false && clone.published !== false,
    };
  }

  if (sheetName === "SEOSettings") {
    return {
      ...clone,
      meta_title: clone.meta_title || clone.metaTitle || "",
      meta_description: clone.meta_description || clone.metaDescription || "",
      canonical_url: clone.canonical_url || clone.canonicalUrl || "",
      keywords: clone.keywords || "",
      og_image: clone.og_image || clone.ogImage || "",
    };
  }

  return clone;
}

/**
 * Normalizes raw Google Sheets rows into typed TypeScript entity objects
 */
export function normalizeFromSheet(sheetName: string, item: any): any {
  if (!item || typeof item !== "object") return item;
  const clone = { ...item };

  if (sheetName === "Profile") {
    return {
      ...clone,
      name: clone.name || "",
      title: clone.designation || clone.title || "",
      headline: clone.tagline || clone.headline || "",
      bio: clone.bio || "",
      avatarUrl: clone.profile_image || clone.avatarUrl || "",
      resumeUrl: clone.resume_url || clone.resumeUrl || "",
      location: clone.location || "",
      email: clone.email || "",
      phone: clone.phone || "",
      availabilityStatus: clone.availability || clone.availabilityStatus || "",
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "About") {
    return {
      ...clone,
      narrativeTitle: clone.title || clone.narrativeTitle || "",
      narrativeBody: clone.description || clone.narrativeBody || "",
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Skills") {
    return {
      ...clone,
      name: clone.skill_name || clone.name || "",
      category: clone.category || "General",
      proficiency: Number(clone.proficiency) || 80,
      iconName: clone.icon || clone.iconName || "Code",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Projects") {
    let techs: string[] = [];
    if (Array.isArray(clone.technologies)) {
      techs = clone.technologies;
    } else if (typeof clone.technologies === "string") {
      techs = clone.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    return {
      ...clone,
      title: clone.title || "",
      slug: clone.slug || clone.id || "",
      shortDescription: clone.short_description || clone.shortDescription || "",
      description: clone.description || "",
      thumbnailUrl: clone.thumbnail || clone.thumbnailUrl || "",
      githubUrl: clone.github_url || clone.githubUrl || "",
      liveUrl: clone.live_url || clone.liveUrl || "",
      technologies: techs,
      category: clone.category || "Development",
      featured: clone.featured === true || clone.featured === "true" || clone.featured === 1,
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Experience") {
    let desc: string[] = [];
    if (Array.isArray(clone.description)) {
      desc = clone.description;
    } else if (typeof clone.description === "string") {
      desc = clone.description.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }
    let techs: string[] = [];
    if (Array.isArray(clone.technologies)) {
      techs = clone.technologies;
    } else if (typeof clone.technologies === "string") {
      techs = clone.technologies.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    const period = (clone.start_date || "") + (clone.end_date ? ` - ${clone.end_date}` : (clone.currently_working ? " - Present" : ""));
    return {
      ...clone,
      role: clone.position || clone.role || "",
      company: clone.organization || clone.company || "",
      type: clone.employment_type || clone.type || "Internship Protocol",
      period: period || clone.period || "",
      description: desc,
      technologies: techs,
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Education") {
    const period = (clone.start_year || "") + (clone.end_year ? ` - ${clone.end_year}` : "");
    return {
      ...clone,
      institution: clone.institution || "",
      degree: clone.degree || "",
      field: clone.course || clone.field || "",
      period: period || clone.period || "",
      grade: clone.grade || "",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Certificates") {
    return {
      ...clone,
      title: clone.title || "",
      issuer: clone.issuing_organization || clone.issuer || "",
      issueYear: clone.issue_date || clone.issueYear || "",
      credentialUrl: clone.verification_url || clone.credentialUrl || "",
      fileUrl: clone.certificate_file || clone.fileUrl || "",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Achievements") {
    return {
      ...clone,
      title: clone.title || "",
      description: clone.description || "",
      associatedEvent: clone.event || clone.associatedEvent || "",
      date: clone.achievement_date || clone.date || "",
      imageUrl: clone.image_url || clone.imageUrl || "",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Services") {
    let deliverables: string[] = [];
    if (Array.isArray(clone.deliverables)) {
      deliverables = clone.deliverables;
    } else if (typeof clone.deliverables === "string") {
      deliverables = clone.deliverables.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    return {
      ...clone,
      title: clone.title || "",
      description: clone.description || "",
      deliverables,
      iconName: clone.icon || clone.iconName || "Code",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Testimonials") {
    return {
      ...clone,
      clientName: clone.client_name || clone.clientName || "",
      clientRole: clone.client_role || clone.clientRole || "",
      company: clone.company || "",
      quote: clone.quote || "",
      avatarUrl: clone.avatar_url || clone.avatarUrl || "",
      rating: Number(clone.rating) || 5,
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Resume") {
    return {
      ...clone,
      title: clone.title || "Curriculum Vitae",
      version: clone.version || "1.0",
      fileUrl: clone.file_url || clone.fileUrl || "",
      driveFileId: clone.drive_file_id || clone.driveFileId || "",
      isActive: clone.is_active !== false && clone.isActive !== false,
      updatedAt: clone.updated_at || clone.updatedAt || "",
    };
  }

  if (sheetName === "SocialLinks") {
    return {
      ...clone,
      platform: clone.platform || "",
      label: clone.username || clone.label || clone.platform || "",
      url: clone.url || "",
      iconName: clone.icon || clone.iconName || "",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.status ? clone.status.toLowerCase() === "published" : clone.published !== false,
    };
  }

  if (sheetName === "Contact") {
    return {
      ...clone,
      email: clone.email || "",
      phone: clone.phone || "",
      location: clone.location || "",
      contactMessage: clone.contact_message || clone.contactMessage || "",
      published: true,
    };
  }

  if (sheetName === "Music") {
    return {
      ...clone,
      title: clone.title || "",
      artist: clone.artist || "",
      audioUrl: clone.audio_url || clone.audioUrl || "",
      coverUrl: clone.cover_image || clone.coverUrl || "",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.enabled === true || String(clone.enabled).toLowerCase() === "true" || clone.enabled === 1 || clone.status === "published",
    };
  }

  if (sheetName === "Navigation") {
    return {
      ...clone,
      label: clone.display_label || clone.label || clone.section_name || "",
      href: clone.section_id || clone.href || "",
      order: Number(clone.display_order || clone.order) || 1,
      published: clone.visible === true || String(clone.visible).toLowerCase() === "true" || clone.visible === 1 || clone.status === "published",
    };
  }

  if (sheetName === "SEOSettings") {
    return {
      ...clone,
      metaTitle: clone.meta_title || clone.metaTitle || "",
      metaDescription: clone.meta_description || clone.metaDescription || "",
      canonicalUrl: clone.canonical_url || clone.canonicalUrl || "",
      keywords: clone.keywords || "",
      ogImage: clone.og_image || clone.ogImage || "",
      updatedAt: clone.updated_at || clone.updatedAt || "",
    };
  }

  return clone;
}

/**
 * Main API Request Dispatcher with STRICT Error Transparency
 * DOES NOT silently mask database errors with fake success.
 */
export async function apiCall<T = any>(
  action: string,
  method: "GET" | "POST" = "GET",
  bodyData: any = {}
): Promise<{ success: boolean; data?: T; error?: string; [key: string]: any }> {
  const url = getAppsScriptUrl();

  if (!url) {
    return {
      success: false,
      error: "No Google Apps Script backend URL configured. Please configure VITE_APPS_SCRIPT_URL.",
    };
  }

  const auth = getAuthPayload();

  // Normalize outgoing CRUD data to match spreadsheet column headers
  if (
    (action === "createRecord" || action === "updateRecord" || action === "create" || action === "update") &&
    bodyData.sheetName &&
    bodyData.data
  ) {
    bodyData.data = normalizeForSheet(bodyData.sheetName, bodyData.data);
  }

  try {
    let res: Response;
    if (method === "GET") {
      const params = new URLSearchParams({
        action,
        _t: Date.now().toString(),
        ...auth,
        ...bodyData,
      });
      res = await fetch(`${url}?${params.toString()}`, {
        method: "GET",
      });
    } else {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action,
          ...auth,
          ...bodyData,
        }),
      });
    }

    if (!res.ok && res.status !== 302) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();

    if (!json.success && json.error) {
      return { success: false, error: json.error };
    }

    // On successful mutation, broadcast sync signal across tabs and windows
    if (
      json.success &&
      method === "POST" &&
      (action === "createRecord" ||
        action === "updateRecord" ||
        action === "deleteRecord" ||
        action === "publishContent" ||
        action === "reorderRecords" ||
        action === "updateAppearance" ||
        action === "updateSEO" ||
        action === "uploadMedia" ||
        action === "deleteMedia")
    ) {
      broadcastDataChange(bodyData.sheetName || "system", action);
    }

    // Normalize incoming data from Google Sheets to Admin entity models
    if (
      (action === "getAllAdminData" || action === "portfolio" || action === "getPortfolioData") &&
      json.success &&
      json.data
    ) {
      const normalized: any = { ...json.data };
      for (const sheetName of Object.keys(normalized)) {
        if (Array.isArray(normalized[sheetName])) {
          if (normalized[sheetName].length === 0 && (INITIAL_DATA as any)[sheetName]) {
            // Keep default starter items if sheet exists but has 0 records yet
            normalized[sheetName] = (INITIAL_DATA as any)[sheetName];
          } else {
            normalized[sheetName] = normalized[sheetName].map((item: any) =>
              normalizeFromSheet(sheetName, item)
            );
          }
        }
      }
      return { ...json, data: normalized };
    }

    return json;
  } catch (err: any) {
    const errorMsg =
      err?.message || "Failed to communicate with Google Sheets Apps Script API.";
    console.error(`[API Error in ${action}]:`, errorMsg);

    // If read-only fetch of all data fails on initial load, provide cached/starter dataset
    // WITH explicit error flag so admin UI knows it is currently disconnected from the live DB!
    if (action === "getAllAdminData" || action === "getPortfolioData") {
      return {
        success: false,
        error: errorMsg,
        data: {
          ...INITIAL_DATA,
          dbConnected: false,
        } as unknown as T,
      };
    }

    // For MUTATIONS (create, update, delete, publish): NEVER return fake success!
    // Accurately report failure to the caller so a failure toast is displayed.
    return {
      success: false,
      error: `Database Operation Failed: ${errorMsg}. Please verify that the Apps Script backend deployment is active and that your Google account has editor access.`,
    };
  }
}

/**
 * File to Base64 utility
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
