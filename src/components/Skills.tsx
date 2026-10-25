import React from "react";
import { 
  Code, 
  Database, 
  LineChart, 
  Globe, 
  Terminal, 
  Cpu, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  description: string;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming Languages",
    icon: <Code className="w-5 h-5 text-[#50C878]" />,
    description: "Core languages for systems, analytical computing, and software development.",
    skills: ["Python", "Java", "C"],
  },
  {
    title: "Databases & Storage",
    icon: <Database className="w-5 h-5 text-[#D1F2EB]" />,
    description: "Relational persistence, data modeling, schema migrations, and queries.",
    skills: ["MySQL", "PostgreSQL", "JDBC", "SQL Optimization"],
  },
  {
    title: "Data Analysis & ML",
    icon: <LineChart className="w-5 h-5 text-[#50C878]" />,
    description: "Statistical modeling, preprocessing, feature engineering, and ML paradigms.",
    skills: ["Pandas", "NumPy", "Matplotlib", "Regression & Classification", "Clustering & PCA"],
  },
  {
    title: "Web Technologies",
    icon: <Globe className="w-5 h-5 text-[#D1F2EB]" />,
    description: "Front-end structure, styling, dynamic scripting, and responsive design.",
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive UI/UX"],
  },
  {
    title: "Development Tools",
    icon: <Terminal className="w-5 h-5 text-[#50C878]" />,
    description: "Modern version control, editor toolchains, and collaborative workflows.",
    skills: ["Git", "GitHub", "VS Code", "SRS Documentation"],
  },
  {
    title: "CS Fundamentals",
    icon: <Cpu className="w-5 h-5 text-[#D1F2EB]" />,
    description: "Foundational computer science principles applied in system designs.",
    skills: ["Data Structures & Algorithms", "OOP Principles", "DBMS Concepts", "Operating Systems"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Technical Competencies
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Core Technical Stack
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Curated skillset verified through hands-on academic coursework, production internships, and project implementations.
        </p>
      </div>

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            className="p-6 rounded-3xl bg-[#141416] border border-white/10 hover:border-[#50C878]/30 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_30px_rgba(80,200,120,0.08)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold font-display text-white">
                  {cat.title}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {cat.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-zinc-200 hover:border-[#50C878]/40 hover:bg-[#0B6E4F]/20 hover:text-[#D1F2EB] transition-all cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#50C878]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
