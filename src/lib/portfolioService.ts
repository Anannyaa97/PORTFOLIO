/**
 * Public Portfolio Dynamic Service
 * Connects the public website to Google Apps Script backend read-only endpoints.
 * Includes caching, instant cross-tab invalidation, and complete entity parsing.
 */

export interface PublicPortfolioData {
  profile: {
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
  };
  about: {
    narrativeTitle: string;
    narrativeBody: string;
    narrativeSub?: string;
    currentFocus: string;
    collegeName: string;
    cgpa: string;
    statusBadge: string;
  };
  skills: Array<{
    id: string;
    category: string;
    name: string;
    iconName: string;
    proficiency: number;
    order: number;
    published: boolean;
  }>;
  projects: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    shortDescription?: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    thumbnailUrl?: string;
    visualType: "chart" | "terminal" | "hotel" | "hardware" | "web" | "migration";
    statLabel?: string;
    statValue?: string;
    featured: boolean;
    order: number;
    published: boolean;
  }>;
  experience: Array<{
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
  }>;
  education: Array<{
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
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issuer: string;
    issueYear: string;
    credentialUrl?: string;
    fileUrl?: string;
    order: number;
    published: boolean;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    associatedEvent?: string;
    date: string;
    imageUrl?: string;
    order: number;
    published: boolean;
  }>;
  services: Array<{
    id: string;
    title: string;
    description: string;
    deliverables: string[];
    iconName: string;
    order: number;
    published: boolean;
  }>;
  testimonials: Array<{
    id: string;
    clientName: string;
    clientRole: string;
    company: string;
    quote: string;
    avatarUrl?: string;
    rating: number;
    order: number;
    published: boolean;
  }>;
  resume: {
    title: string;
    version: string;
    fileUrl: string;
    isActive: boolean;
  };
  socialLinks: Array<{
    id: string;
    platform: string;
    label: string;
    url: string;
    iconName: string;
    order: number;
    published: boolean;
  }>;
  contact: {
    email: string;
    phone?: string;
    location: string;
    formEnabled: boolean;
    contactMessage?: string;
  };
  music: Array<{
    id: string;
    title: string;
    artist: string;
    category: string;
    audioUrl: string;
    color: string;
    order: number;
    published: boolean;
  }>;
  navigation: Array<{
    id: string;
    label: string;
    href: string;
    order: number;
    published: boolean;
  }>;
  appearance: {
    theme: string;
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
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    keywords: string;
    ogImage: string;
  };
}

// Fallback Default Content
export const DEFAULT_PORTFOLIO_DATA: PublicPortfolioData = {
  profile: {
    name: "Anannya AK",
    title: "Data Science & Software Engineering",
    headline: "CSE Student — Data Science Specialization",
    bio: "Building high-performance ecosystems at the intersection of logical problem-solving and data-driven insights. Hands-on experience in distributed big data pipelines, machine learning, and secure database architectures.",
    avatarUrl: "profile/profile.jpeg",
    resumeUrl: "resume.pdf",
    location: "Kannur, Kerala, India",
    email: "anannyaak01@gmail.com",
    phone: "+91 0000000000",
    availabilityStatus: "Active CSE Student — Data Science Specialization",
    specialization: "Data Science & ML",
    academicScore: "CGPA: 8.6 / 10",
    industryExpCount: "2 Internships",
  },
  about: {
    narrativeTitle: "Academic Pulse & Identity",
    narrativeBody:
      "I am a B.Tech student specializing in Computer Science and Engineering (Data Science). I thrive at the intersection of logical problem-solving and data-driven insights, with hands-on internship experience in software development, database migration, and Python-based data pipelines.",
    narrativeSub:
      "Passionate about architecting clean data infrastructures, applying machine learning algorithms (regression, classification, clustering, PCA), and writing robust code in Python, Java, SQL, and modern web environments.",
    currentFocus: "Data Science & Engineering",
    collegeName: "St. Thomas College of Engg.",
    cgpa: "8.6 / 10",
    statusBadge: "Active CSE Student",
  },
  skills: [
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
  projects: [
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
  experience: [
    {
      id: "exp_1",
      role: "Software Development Intern",
      company: "Dinesh IT Systems",
      period: "June 2026 - July 2026",
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
      period: "June 2025 - July 2025",
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
  education: [
    {
      id: "edu_1",
      institution: "St. Thomas College of Engineering and Technology, Kannur",
      degree: "B.Tech",
      field: "Computer Science and Engineering (Data Science)",
      period: "2024 - 2028 (Expected)",
      grade: "CGPA: 8.6 / 10",
      badge: "Expected 2028",
      description: "Focusing on distributed big data frameworks, algorithms, and applied machine learning.",
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
      description: "Core coursework in Computer Science, Mathematics, and Physical Sciences.",
      order: 2,
      published: true,
    },
  ],
  certificates: [
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
  achievements: [
    {
      id: "ach_1",
      title: "Top 5% Academic Honor",
      description: "Recognized for outstanding academic achievement in Data Science & Mathematics.",
      date: "2025",
      associatedEvent: "Annual Engineering Honors",
      order: 1,
      published: true,
    },
  ],
  services: [
    {
      id: "srv_1",
      title: "Data Pipelines & Distributed ETL",
      description: "Architecture and optimization of resilient data processing pipelines in Python, PySpark, and SQL.",
      deliverables: ["Automated Ingestion", "Schema Migration", "Data Quality Auditing"],
      iconName: "Database",
      order: 1,
      published: true,
    },
    {
      id: "srv_2",
      title: "Full-Stack Web Engineering",
      description: "Modern, high-performance web applications built with React, TypeScript, Tailwind CSS, and cloud integrations.",
      deliverables: ["Responsive UI/UX", "REST API Architecture", "Database Integration"],
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
  testimonials: [
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
  resume: {
    title: "Anannya AK — Curriculum Vitae",
    version: "2026.1",
    fileUrl: "resume.pdf",
    isActive: true,
  },
  socialLinks: [
    { id: "soc_1", platform: "GitHub", label: "GitHub", url: "https://github.com/Anannyaa97", iconName: "Github", order: 1, published: true },
    { id: "soc_2", platform: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/in/anannya-ak/", iconName: "Linkedin", order: 2, published: true },
    { id: "soc_3", platform: "Email", label: "Email", url: "mailto:anannyaak01@gmail.com", iconName: "Mail", order: 3, published: true },
  ],
  contact: {
    email: "anannyaak01@gmail.com",
    phone: "+91 0000000000",
    location: "Kannur, Kerala, India",
    formEnabled: true,
    contactMessage: "Let's connect and build something impactful.",
  },
  music: [
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
  navigation: [
    { id: "nav_1", label: "Home", href: "#hero", order: 1, published: true },
    { id: "nav_2", label: "About", href: "#about", order: 2, published: true },
    { id: "nav_3", label: "Experience", href: "#experience", order: 3, published: true },
    { id: "nav_4", label: "Projects", href: "#projects", order: 4, published: true },
    { id: "nav_5", label: "Skills", href: "#skills", order: 5, published: true },
    { id: "nav_6", label: "Services", href: "#services", order: 6, published: true },
    { id: "nav_7", label: "Education", href: "#education", order: 7, published: true },
    { id: "nav_8", label: "Contact", href: "#contact", order: 8, published: true },
  ],
  appearance: {
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
  seo: {
    metaTitle: "Anannya AK | Data Science & Software Engineering Portfolio",
    metaDescription: "Portfolio of Anannya AK — CSE Student specializing in Data Science & Software Engineering. Featuring big data pipelines, machine learning models, and modern software development.",
    canonicalUrl: "https://anannya-ak.onrender.com",
    keywords: "Anannya AK, Data Science, Software Engineering, Python, PySpark, Machine Learning, Portfolio, Kannur",
    ogImage: "profile/profile.jpeg",
  },
};

const CACHE_KEY = "portfolio_public_cache";
const CACHE_TTL = 1000 * 60 * 1; // 1 minute cache for fast freshness

const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyg_38Pa8ZBj0iRCCYcColssYsOcVLHLmfizVcWiPFMDtVguZUeVqldCnqeS32wZZofjQ/exec";

function getVisualTypeForProject(slugOrId: string = ""): "chart" | "terminal" | "hotel" | "hardware" | "web" | "migration" {
  const s = slugOrId.toLowerCase();
  if (s.includes("hospital") || s.includes("analysis") || s.includes("chart")) return "chart";
  if (s.includes("cyber") || s.includes("phishing") || s.includes("sentry") || s.includes("terminal")) return "terminal";
  if (s.includes("hotel") || s.includes("booking")) return "hotel";
  if (s.includes("riscv") || s.includes("cache") || s.includes("hardware")) return "hardware";
  if (s.includes("ieee") || s.includes("web") || s.includes("portal")) return "web";
  if (s.includes("migration") || s.includes("database") || s.includes("db")) return "migration";
  return "web";
}

/**
 * Fetch portfolio content dynamically with cache-busting and session storage
 */
export async function fetchPublicPortfolioData(forceRefresh = false): Promise<PublicPortfolioData> {
  const apiUrl =
    import.meta.env.VITE_PORTFOLIO_API_URL ||
    import.meta.env.VITE_APPS_SCRIPT_URL ||
    DEFAULT_APPS_SCRIPT_URL;

  // If not forcing refresh, check session cache
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && data) {
          return data;
        }
      }
    } catch (e) {}
  } else {
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {}
  }

  try {
    const timestamp = Date.now().toString();
    const response = await fetch(`${apiUrl}?action=portfolio&_t=${timestamp}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      const merged = mergeWithDefaults(result.data);
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: merged, timestamp: Date.now() })
        );
      } catch (e) {}
      return merged;
    }
  } catch (err) {
    console.warn("Public API fetch error, falling back gracefully to verified default portfolio content:", err);
  }

  return DEFAULT_PORTFOLIO_DATA;
}

/**
 * Merge remote API payload with defaults to guarantee all required fields exist
 */
function mergeWithDefaults(remote: any): PublicPortfolioData {
  if (!remote || typeof remote !== "object") {
    return DEFAULT_PORTFOLIO_DATA;
  }

  // 1. Profile Mapping
  const rawProfileList = remote.Profile || remote.profile;
  const rawProfile = Array.isArray(rawProfileList) ? rawProfileList[0] : (typeof rawProfileList === "object" ? rawProfileList : null);
  const profile = rawProfile
    ? {
        name: rawProfile.name || DEFAULT_PORTFOLIO_DATA.profile.name,
        title: rawProfile.designation || rawProfile.title || DEFAULT_PORTFOLIO_DATA.profile.title,
        headline: rawProfile.tagline || rawProfile.headline || DEFAULT_PORTFOLIO_DATA.profile.headline,
        bio: rawProfile.bio || DEFAULT_PORTFOLIO_DATA.profile.bio,
        avatarUrl: rawProfile.profile_image || rawProfile.avatarUrl || DEFAULT_PORTFOLIO_DATA.profile.avatarUrl,
        resumeUrl: rawProfile.resume_url || rawProfile.resumeUrl || DEFAULT_PORTFOLIO_DATA.profile.resumeUrl,
        location: rawProfile.location || DEFAULT_PORTFOLIO_DATA.profile.location,
        email: rawProfile.email || DEFAULT_PORTFOLIO_DATA.profile.email,
        phone: rawProfile.phone || DEFAULT_PORTFOLIO_DATA.profile.phone,
        availabilityStatus: rawProfile.availability || rawProfile.availabilityStatus || DEFAULT_PORTFOLIO_DATA.profile.availabilityStatus,
        specialization: rawProfile.specialization || DEFAULT_PORTFOLIO_DATA.profile.specialization,
        academicScore: rawProfile.academicScore || DEFAULT_PORTFOLIO_DATA.profile.academicScore,
        industryExpCount: rawProfile.industryExpCount || DEFAULT_PORTFOLIO_DATA.profile.industryExpCount,
      }
    : DEFAULT_PORTFOLIO_DATA.profile;

  // 2. About Mapping
  const rawAboutList = remote.About || remote.about;
  const rawAbout = Array.isArray(rawAboutList) ? rawAboutList[0] : (typeof rawAboutList === "object" ? rawAboutList : null);
  const about = rawAbout
    ? {
        narrativeTitle: rawAbout.title || rawAbout.narrativeTitle || DEFAULT_PORTFOLIO_DATA.about.narrativeTitle,
        narrativeBody: rawAbout.description || rawAbout.narrativeBody || DEFAULT_PORTFOLIO_DATA.about.narrativeBody,
        narrativeSub: rawAbout.narrativeSub || (Array.isArray(rawAboutList) && rawAboutList[1]?.description ? rawAboutList[1].description : DEFAULT_PORTFOLIO_DATA.about.narrativeSub),
        currentFocus: rawAbout.currentFocus || DEFAULT_PORTFOLIO_DATA.about.currentFocus,
        collegeName: rawAbout.collegeName || DEFAULT_PORTFOLIO_DATA.about.collegeName,
        cgpa: rawAbout.cgpa || DEFAULT_PORTFOLIO_DATA.about.cgpa,
        statusBadge: rawAbout.statusBadge || DEFAULT_PORTFOLIO_DATA.about.statusBadge,
      }
    : DEFAULT_PORTFOLIO_DATA.about;

  // 3. Skills Mapping
  const rawSkills = remote.Skills || remote.skills;
  const skills = Array.isArray(rawSkills) && rawSkills.length > 0
    ? rawSkills
        .filter((s: any) => !s.status || String(s.status).toLowerCase() === "published" || s.published !== false)
        .map((s: any) => ({
          id: String(s.id || s.skill_name || Math.random()),
          name: s.skill_name || s.name || "Skill",
          category: s.category || "General",
          proficiency: Number(s.proficiency) || 85,
          iconName: s.icon || s.iconName || "Code",
          order: Number(s.display_order || s.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.skills;

  // 4. Projects Mapping
  const rawProjects = remote.Projects || remote.projects;
  const projects = Array.isArray(rawProjects) && rawProjects.length > 0
    ? rawProjects
        .filter((p: any) => !p.status || String(p.status).toLowerCase() === "published" || p.published !== false)
        .map((p: any) => {
          let techs: string[] = [];
          if (Array.isArray(p.technologies)) {
            techs = p.technologies;
          } else if (typeof p.technologies === "string") {
            try {
              const parsed = JSON.parse(p.technologies);
              techs = Array.isArray(parsed) ? parsed : p.technologies.split(",").map((t: string) => t.trim());
            } catch (e) {
              techs = p.technologies.split(",").map((t: string) => t.trim()).filter(Boolean);
            }
          }
          return {
            id: String(p.id || p.slug || p.title),
            title: p.title || "Project",
            category: p.category || "Development",
            description: p.description || "",
            shortDescription: p.short_description || p.shortDescription || p.description?.substring(0, 90) + "...",
            technologies: techs.length > 0 ? techs : ["Development"],
            githubUrl: p.github_url || p.githubUrl,
            liveUrl: p.live_url || p.liveUrl,
            thumbnailUrl: p.thumbnail || p.thumbnailUrl,
            visualType: p.visualType || getVisualTypeForProject(p.slug || p.id),
            statLabel: p.statLabel || (p.featured ? "Featured" : undefined),
            statValue: p.statValue,
            featured: p.featured === true || p.featured === "true" || p.featured === 1,
            order: Number(p.display_order || p.order) || 1,
            published: true,
          };
        })
    : DEFAULT_PORTFOLIO_DATA.projects;

  // 5. Experience Mapping
  const rawExperience = remote.Experience || remote.experience;
  const experience = Array.isArray(rawExperience) && rawExperience.length > 0
    ? rawExperience
        .filter((e: any) => !e.status || String(e.status).toLowerCase() === "published" || e.published !== false)
        .map((e: any) => {
          let descList: string[] = [];
          if (Array.isArray(e.description)) {
            descList = e.description;
          } else if (typeof e.description === "string") {
            descList = e.description.split("\n").map((d: string) => d.trim()).filter(Boolean);
          }
          let techList: string[] = [];
          if (Array.isArray(e.technologies)) {
            techList = e.technologies;
          } else if (typeof e.technologies === "string") {
            techList = e.technologies.split(",").map((t: string) => t.trim()).filter(Boolean);
          }
          const period = (e.start_date || "") + (e.end_date ? ` - ${e.end_date}` : (e.currently_working ? " - Present" : ""));
          return {
            id: String(e.id || Math.random()),
            role: e.position || e.role || "Role",
            company: e.organization || e.company || "Organization",
            period: period || e.period || "2025 - Present",
            type: e.employment_type || e.type || "Internship Protocol",
            description: descList.length > 0 ? descList : [e.description || ""],
            technologies: techList,
            iconName: e.icon || e.iconName || "Terminal",
            accent: e.accent || "emerald",
            order: Number(e.display_order || e.order) || 1,
            published: true,
          };
        })
    : DEFAULT_PORTFOLIO_DATA.experience;

  // 6. Education Mapping
  const rawEducation = remote.Education || remote.education;
  const education = Array.isArray(rawEducation) && rawEducation.length > 0
    ? rawEducation
        .filter((ed: any) => !ed.status || String(ed.status).toLowerCase() === "published" || ed.published !== false)
        .map((ed: any) => ({
          id: String(ed.id || Math.random()),
          institution: ed.institution || "Institution",
          degree: ed.degree || "Degree",
          field: ed.course || ed.field || "Computer Science",
          period: (ed.start_year || "") + (ed.end_year ? ` - ${ed.end_year}` : ""),
          grade: ed.grade || "",
          badge: ed.badge || (ed.end_year?.includes("Expected") ? "Expected" : "Graduated"),
          description: ed.description || "",
          order: Number(ed.display_order || ed.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.education;

  // 7. Certificates Mapping
  const rawCerts = remote.Certificates || remote.certificates;
  const certificates = Array.isArray(rawCerts) && rawCerts.length > 0
    ? rawCerts
        .filter((c: any) => !c.status || String(c.status).toLowerCase() === "published" || c.published !== false)
        .map((c: any) => ({
          id: String(c.id || Math.random()),
          title: c.title || "Certificate",
          issuer: c.issuing_organization || c.issuer || "Organization",
          issueYear: c.issue_date || c.issueYear || "2025",
          credentialUrl: c.verification_url || c.credentialUrl,
          fileUrl: c.certificate_file || c.fileUrl,
          order: Number(c.display_order || c.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.certificates;

  // 8. Achievements Mapping
  const rawAchievements = remote.Achievements || remote.achievements;
  const achievements = Array.isArray(rawAchievements) && rawAchievements.length > 0
    ? rawAchievements
        .filter((a: any) => !a.status || String(a.status).toLowerCase() === "published" || a.published !== false)
        .map((a: any) => ({
          id: String(a.id || Math.random()),
          title: a.title || "Achievement",
          description: a.description || "",
          associatedEvent: a.event || a.associatedEvent,
          date: a.achievement_date || a.date || "2025",
          imageUrl: a.image_url || a.imageUrl,
          order: Number(a.display_order || a.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.achievements;

  // 9. Services Mapping
  const rawServices = remote.Services || remote.services;
  const services = Array.isArray(rawServices) && rawServices.length > 0
    ? rawServices
        .filter((s: any) => !s.status || String(s.status).toLowerCase() === "published" || s.published !== false)
        .map((s: any) => {
          let dels: string[] = [];
          if (Array.isArray(s.deliverables)) {
            dels = s.deliverables;
          } else if (typeof s.deliverables === "string") {
            dels = s.deliverables.split(",").map((d: string) => d.trim()).filter(Boolean);
          }
          return {
            id: String(s.id || Math.random()),
            title: s.title || "Service",
            description: s.description || "",
            deliverables: dels,
            iconName: s.icon || s.iconName || "Code",
            order: Number(s.display_order || s.order) || 1,
            published: true,
          };
        })
    : DEFAULT_PORTFOLIO_DATA.services;

  // 10. Testimonials Mapping
  const rawTestimonials = remote.Testimonials || remote.testimonials;
  const testimonials = Array.isArray(rawTestimonials) && rawTestimonials.length > 0
    ? rawTestimonials
        .filter((t: any) => !t.status || String(t.status).toLowerCase() === "published" || t.published !== false)
        .map((t: any) => ({
          id: String(t.id || Math.random()),
          clientName: t.client_name || t.clientName || "Academic Colleague",
          clientRole: t.client_role || t.clientRole || "Mentor",
          company: t.company || "",
          quote: t.quote || "",
          avatarUrl: t.avatar_url || t.avatarUrl,
          rating: Number(t.rating) || 5,
          order: Number(t.display_order || t.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.testimonials;

  // 11. Resume Mapping
  const rawResumeList = remote.Resume || remote.resume;
  const rawResume = Array.isArray(rawResumeList) ? rawResumeList[0] : (typeof rawResumeList === "object" ? rawResumeList : null);
  const resume = rawResume
    ? {
        title: rawResume.title || DEFAULT_PORTFOLIO_DATA.resume.title,
        version: rawResume.version || DEFAULT_PORTFOLIO_DATA.resume.version,
        fileUrl: rawResume.file_url || rawResume.fileUrl || DEFAULT_PORTFOLIO_DATA.resume.fileUrl,
        isActive: rawResume.is_active !== false && rawResume.isActive !== false,
      }
    : DEFAULT_PORTFOLIO_DATA.resume;

  // 12. Social Links Mapping
  const rawSocial = remote.SocialLinks || remote.socialLinks;
  const socialLinks = Array.isArray(rawSocial) && rawSocial.length > 0
    ? rawSocial
        .filter((s: any) => !s.status || String(s.status).toLowerCase() === "published" || s.published !== false)
        .map((s: any) => ({
          id: String(s.id || Math.random()),
          platform: s.platform || "Link",
          label: s.username || s.label || s.platform || "Profile",
          url: s.url || "#",
          iconName: s.icon || s.iconName || s.platform || "Globe",
          order: Number(s.display_order || s.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.socialLinks;

  // 13. Contact Mapping
  const rawContactList = remote.Contact || remote.contact;
  const rawContact = Array.isArray(rawContactList) ? rawContactList[0] : (typeof rawContactList === "object" ? rawContactList : null);
  const contact = rawContact
    ? {
        email: rawContact.email || DEFAULT_PORTFOLIO_DATA.contact.email,
        phone: rawContact.phone || DEFAULT_PORTFOLIO_DATA.contact.phone,
        location: rawContact.location || DEFAULT_PORTFOLIO_DATA.contact.location,
        formEnabled: true,
        contactMessage: rawContact.contact_message || rawContact.contactMessage || DEFAULT_PORTFOLIO_DATA.contact.contactMessage,
      }
    : DEFAULT_PORTFOLIO_DATA.contact;

  // 14. Music Mapping
  const rawMusic = remote.Music || remote.music;
  const music = Array.isArray(rawMusic) && rawMusic.length > 0
    ? rawMusic
        .filter((m: any) => m.enabled === true || String(m.enabled).toLowerCase() === "true" || m.enabled === 1 || m.status === "published")
        .map((m: any) => ({
          id: String(m.id || Math.random()),
          title: m.title || "Track",
          artist: m.artist || "Artist",
          category: m.category || "Ambient Soundscape",
          audioUrl: m.audio_url || m.audioUrl,
          color: m.color || "#50C878",
          order: Number(m.display_order || m.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.music;

  // 15. Navigation Mapping
  const rawNav = remote.Navigation || remote.navigation;
  const navigation = Array.isArray(rawNav) && rawNav.length > 0
    ? rawNav
        .filter((n: any) => n.visible === true || String(n.visible).toLowerCase() === "true" || n.visible === 1 || n.status === "published")
        .map((n: any) => ({
          id: String(n.id || Math.random()),
          label: n.display_label || n.label || n.section_name || "Section",
          href: (n.section_id || n.href || "#hero").startsWith("#") ? (n.section_id || n.href) : `#${n.section_id || n.href}`,
          order: Number(n.display_order || n.order) || 1,
          published: true,
        }))
    : DEFAULT_PORTFOLIO_DATA.navigation;

  // 16. Appearance Mapping
  const rawAppearance = remote.Appearance || remote.appearance;
  let appearance = { ...DEFAULT_PORTFOLIO_DATA.appearance };
  if (Array.isArray(rawAppearance)) {
    rawAppearance.forEach((row: any) => {
      const k = row.setting_key || row.key;
      const v = row.setting_value !== undefined ? row.setting_value : row.value;
      if (k && v !== undefined) {
        if (v === "true" || v === true) (appearance as any)[k] = true;
        else if (v === "false" || v === false) (appearance as any)[k] = false;
        else (appearance as any)[k] = v;
      }
    });
  } else if (typeof rawAppearance === "object" && rawAppearance !== null) {
    appearance = { ...appearance, ...rawAppearance };
  }

  // 17. SEO Mapping
  const rawSeoList = remote.SEOSettings || remote.seo;
  const rawSeo = Array.isArray(rawSeoList) ? rawSeoList[0] : (typeof rawSeoList === "object" ? rawSeoList : null);
  const seo = rawSeo
    ? {
        metaTitle: rawSeo.meta_title || rawSeo.metaTitle || DEFAULT_PORTFOLIO_DATA.seo.metaTitle,
        metaDescription: rawSeo.meta_description || rawSeo.metaDescription || DEFAULT_PORTFOLIO_DATA.seo.metaDescription,
        canonicalUrl: rawSeo.canonical_url || rawSeo.canonicalUrl || DEFAULT_PORTFOLIO_DATA.seo.canonicalUrl,
        keywords: rawSeo.keywords || DEFAULT_PORTFOLIO_DATA.seo.keywords,
        ogImage: rawSeo.og_image || rawSeo.ogImage || DEFAULT_PORTFOLIO_DATA.seo.ogImage,
      }
    : DEFAULT_PORTFOLIO_DATA.seo;

  return {
    profile,
    about,
    skills,
    projects,
    experience,
    education,
    certificates,
    achievements,
    services,
    testimonials,
    resume,
    socialLinks,
    contact,
    music,
    navigation,
    appearance,
    seo,
  };
}

/**
 * Send Contact Message to Google Apps Script Backend
 */
export async function submitContactMessage(formData: {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const apiUrl =
    import.meta.env.VITE_PORTFOLIO_API_URL ||
    import.meta.env.VITE_APPS_SCRIPT_URL ||
    DEFAULT_APPS_SCRIPT_URL;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "submitContactForm",
        data: formData,
      }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: true, message: "Transmission received." };
  }
}
