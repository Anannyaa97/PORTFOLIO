/**
 * Static Portfolio Data Module
 * Provides static, verified portfolio data for high-performance offline rendering.
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

export const PORTFOLIO_DATA = DEFAULT_PORTFOLIO_DATA;
export default PORTFOLIO_DATA;
