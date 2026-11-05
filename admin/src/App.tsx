import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Sidebar, AdminSection } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardHome } from "./pages/DashboardHome";
import { ProfilePage } from "./pages/ProfilePage";
import { AboutPage } from "./pages/AboutPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { EducationPage } from "./pages/EducationPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { TestimonialsPage } from "./pages/TestimonialsPage";
import { ResumePage } from "./pages/ResumePage";
import { SEOPage } from "./pages/SEOPage";
import { MediaManagerPage } from "./pages/MediaManagerPage";
import { NavigationPage } from "./pages/NavigationPage";
import { SocialLinksPage } from "./pages/SocialLinksPage";
import { ContactPage } from "./pages/ContactPage";
import { MusicPlayerPage } from "./pages/MusicPlayerPage";
import { AppearancePage } from "./pages/AppearancePage";
import { WebsitePreviewPage } from "./pages/WebsitePreviewPage";
import { ActivityLogPage } from "./pages/ActivityLogPage";
import { SettingsPage } from "./pages/SettingsPage";
import { apiCall, INITIAL_DATA, getPendingSyncQueue } from "./services/api";
import { SyncAssistantModal } from "./components/SyncAssistantModal";
import { DashboardStats } from "./types";
import { useToast } from "./context/ToastContext";

export function AppContent() {
  const { isAuthorized, logout, loading: authLoading } = useAuth();
  const [currentSection, setCurrentSection] = useState<AdminSection>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [data, setData] = useState<any>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const { error } = useToast();

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    setPendingSyncCount(getPendingSyncQueue().length);
    try {
      const res = await apiCall("getAllAdminData", "GET");
      if (res.data) {
        setData(res.data);
      }
      if (!res.success && res.error) {
        console.warn("Could not synchronize live database:", res.error);
      }
    } catch (err: any) {
      console.warn("Failed to fetch remote data, falling back to cached state:", err);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
      setPendingSyncCount(getPendingSyncQueue().length);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }

    const handleSyncEvent = () => {
      setPendingSyncCount(getPendingSyncQueue().length);
    };

    window.addEventListener("portfolio:synced", handleSyncEvent);
    return () => window.removeEventListener("portfolio:synced", handleSyncEvent);
  }, [isAuthorized, loadData]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 font-mono text-xs">
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping mr-2" />
        Initializing Portfolio CMS Security Layer...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Login />;
  }

  // Section Title Mapping
  const sectionHeaders: Record<AdminSection, { title: string; subtitle?: string }> = {
    dashboard: { title: "Dashboard Overview", subtitle: "Key performance metrics and activity" },
    profile: { title: "Profile Management", subtitle: "Core bio, hero highlights and avatar" },
    about: { title: "About Section", subtitle: "Narrative, focus and education profile" },
    skills: { title: "Skills & Competencies", subtitle: "Technical stack and proficiency" },
    projects: { title: "Projects Showcase", subtitle: "Engineering projects, GitHub and live URLs" },
    experience: { title: "Experience & Roles", subtitle: "Industry internships and responsibilities" },
    education: { title: "Academic Background", subtitle: "Degrees, institutions and performance" },
    certificates: { title: "Certificates & Badges", subtitle: "Verified course completions and credentials" },
    achievements: { title: "Achievements & Honors", subtitle: "Competitions, hackathons and recognitions" },
    services: { title: "Services & Deliverables", subtitle: "Consulting and technical offerings" },
    testimonials: { title: "Testimonials & Reviews", subtitle: "Peer and mentor recommendations" },
    resume: { title: "Resume & Curriculum Vitae", subtitle: "Active resume PDF and document linking" },
    seo: { title: "SEO & Generative Engine Optimization", subtitle: "Search metadata and JSON-LD entity graph" },
    "media-images": { title: "Media Library: Images", subtitle: "Drive assets and image uploads" },
    "media-documents": { title: "Media Library: Documents", subtitle: "PDF resumes, diplomas and certifications" },
    "media-audio": { title: "Media Library: Audio", subtitle: "Audio tracks and background focus soundscapes" },
    navigation: { title: "Navigation Structure", subtitle: "Header menu and anchor links" },
    "social-links": { title: "Social Handles", subtitle: "Network profiles and external links" },
    contact: { title: "Contact Channels", subtitle: "Email, location and transmission parameters" },
    "music-player": { title: "Music Player Hub", subtitle: "Audio tracks, artists and playlist management" },
    appearance: { title: "Appearance & Theme", subtitle: "Visual accents and section visibility toggles" },
    preview: { title: "Live Website Preview", subtitle: "Interactive responsive viewport simulation" },
    "activity-log": { title: "Activity Audit Log", subtitle: "Administrative history and event trails" },
    settings: { title: "System Settings", subtitle: "Google Apps Script endpoint and authentication" },
  };

  const headerInfo = sectionHeaders[currentSection] || { title: "Portfolio CMS" };

  const stats: DashboardStats = data.stats || {
    totalProjects: (data.Projects || []).length,
    publishedProjects: (data.Projects || []).filter((p: any) => p.published).length,
    totalSkills: (data.Skills || []).length,
    totalCertificates: (data.Certificates || []).length,
    totalExperience: (data.Experience || []).length,
    totalServices: (data.Services || []).length,
    totalTestimonials: (data.Testimonials || []).length,
    totalMedia: (data.Media || []).length,
    lastUpdated: new Date().toISOString(),
    recentActivity: data.ActivityLog || [],
    dbConnected: data.dbConnected !== false,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        onLogout={logout}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          pendingSyncCount={pendingSyncCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === "dashboard" && (
            <DashboardHome
              stats={stats}
              onNavigate={setCurrentSection}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              pendingSyncCount={pendingSyncCount}
            />
          )}

          {currentSection === "profile" && (
            <ProfilePage
              profile={data.Profile?.[0] || INITIAL_DATA.Profile[0]}
              onUpdate={(updated) => setData({ ...data, Profile: [updated] })}
              mediaItems={data.Media || []}
            />
          )}

          {currentSection === "about" && (
            <AboutPage
              about={data.About?.[0] || INITIAL_DATA.About[0]}
              onUpdate={(updated) => setData({ ...data, About: [updated] })}
            />
          )}

          {currentSection === "skills" && (
            <SkillsPage
              skills={data.Skills || []}
              onUpdateSkills={(skills) => setData({ ...data, Skills: skills })}
            />
          )}

          {currentSection === "projects" && (
            <ProjectsPage
              projects={data.Projects || []}
              onUpdateProjects={(projects) => setData({ ...data, Projects: projects })}
              mediaItems={data.Media || []}
            />
          )}

          {currentSection === "experience" && (
            <ExperiencePage
              experience={data.Experience || []}
              onUpdateExperience={(exp) => setData({ ...data, Experience: exp })}
            />
          )}

          {currentSection === "education" && (
            <EducationPage
              education={data.Education || []}
              onUpdateEducation={(edu) => setData({ ...data, Education: edu })}
            />
          )}

          {currentSection === "certificates" && (
            <CertificatesPage
              certificates={data.Certificates || []}
              onUpdateCertificates={(certs) => setData({ ...data, Certificates: certs })}
              mediaItems={data.Media || []}
            />
          )}

          {currentSection === "achievements" && (
            <AchievementsPage
              achievements={data.Achievements || []}
              onUpdateAchievements={(ach) => setData({ ...data, Achievements: ach })}
              mediaItems={data.Media || []}
            />
          )}

          {currentSection === "services" && (
            <ServicesPage
              services={data.Services || INITIAL_DATA.Services}
              onUpdateServices={(services) => setData({ ...data, Services: services })}
            />
          )}

          {currentSection === "testimonials" && (
            <TestimonialsPage
              testimonials={data.Testimonials || INITIAL_DATA.Testimonials}
              onUpdateTestimonials={(testimonials) => setData({ ...data, Testimonials: testimonials })}
            />
          )}

          {currentSection === "resume" && (
            <ResumePage
              resume={data.Resume || INITIAL_DATA.Resume}
              onUpdateResume={(resume) => setData({ ...data, Resume: resume })}
              mediaItems={data.Media || []}
            />
          )}

          {currentSection === "seo" && (
            <SEOPage
              seo={data.SEOSettings || INITIAL_DATA.SEOSettings}
              onUpdateSEO={(seo) => setData({ ...data, SEOSettings: seo })}
            />
          )}

          {currentSection === "media-images" && (
            <MediaManagerPage
              mediaItems={data.Media || []}
              onUpdateMedia={(media) => setData({ ...data, Media: media })}
              initialFilter="Images"
            />
          )}

          {currentSection === "media-documents" && (
            <MediaManagerPage
              mediaItems={data.Media || []}
              onUpdateMedia={(media) => setData({ ...data, Media: media })}
              initialFilter="Documents"
            />
          )}

          {currentSection === "media-audio" && (
            <MediaManagerPage
              mediaItems={data.Media || []}
              onUpdateMedia={(media) => setData({ ...data, Media: media })}
              initialFilter="Audio"
            />
          )}

          {currentSection === "navigation" && (
            <NavigationPage
              navigation={data.Navigation || []}
              onUpdateNavigation={(nav) => setData({ ...data, Navigation: nav })}
            />
          )}

          {currentSection === "social-links" && (
            <SocialLinksPage
              socialLinks={data.SocialLinks || []}
              onUpdateSocialLinks={(links) => setData({ ...data, SocialLinks: links })}
            />
          )}

          {currentSection === "contact" && (
            <ContactPage
              contact={data.Contact?.[0] || INITIAL_DATA.Contact[0]}
              onUpdateContact={(contact) => setData({ ...data, Contact: [contact] })}
            />
          )}

          {currentSection === "music-player" && (
            <MusicPlayerPage
              music={data.Music || []}
              onUpdateMusic={(music) => setData({ ...data, Music: music })}
              mediaItems={data.Media || []}
            />
          )}

          {currentSection === "appearance" && (
            <AppearancePage
              appearance={data.Appearance || INITIAL_DATA.Appearance}
              onUpdateAppearance={(app) => setData({ ...data, Appearance: app })}
            />
          )}

          {currentSection === "preview" && <WebsitePreviewPage />}

          {currentSection === "activity-log" && (
            <ActivityLogPage activityLog={data.ActivityLog || []} />
          )}

          {currentSection === "settings" && <SettingsPage onRefreshAllData={loadData} />}
        </main>
      </div>

      {/* Google Sheets CMS Synchronization Hub Modal */}
      <SyncAssistantModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncComplete={loadData}
      />
    </div>
  );
}

export function App() {
  return <AppContent />;
}

export default App;
