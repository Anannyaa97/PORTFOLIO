import React, { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, Copy, Check } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "./icons";
import { Button } from "./ui/button";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "Collaboration",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("anannyaak01@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields before dispatching.");
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setStatus("submitting");

    // Client-side simulation with instant mailto preparation
    setTimeout(() => {
      setStatus("success");
      setErrorMessage("");
    }, 600);
  };

  const mailtoUrl = `mailto:anannyaak01@gmail.com?subject=${encodeURIComponent(
    `[Portfolio Inquiry - ${formData.inquiryType}] from ${formData.name || "Colleague"}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.inquiryType}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Initiate Protocol
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          Let's Connect &amp; Collaborate
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
          Interested in data-driven systems, software engineering discussions, or internship opportunities? My inbox is always open.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <h3 className="text-xl font-bold font-display text-white mb-4">
              Direct Contact Channels
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Feel free to reach out directly via email or connect on professional networks for software discussions and collaborations.
            </p>

            <div className="space-y-4">
              {/* Email Card with Copy button */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-[#0B6E4F]/20 text-[#50C878] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Email Address</div>
                    <a
                      href="mailto:anannyaak01@gmail.com"
                      className="text-sm font-mono text-zinc-200 hover:text-[#50C878] transition-colors truncate block"
                    >
                      anannyaak01@gmail.com
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all shrink-0"
                  aria-label="Copy email address"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-[#50C878]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0B6E4F]/20 text-[#D1F2EB] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Location</div>
                  <div className="text-sm font-medium text-zinc-200">
                    Kannur, Kerala, India
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-3">
                Network Profiles:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Anannyaa97"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#50C878]/50 transition-all"
                >
                  <Github className="w-4 h-4 text-[#50C878]" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/anannya-ak/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#50C878]/50 transition-all"
                >
                  <Linkedin className="w-4 h-4 text-[#D1F2EB]" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#141416] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Send a Transmission
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6">
              Complete the parameters below to initiate direct communication.
            </p>

            {status === "success" ? (
              <div className="p-6 rounded-2xl bg-[#0B6E4F]/20 border border-[#50C878]/30 text-center animate-fade-in space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#0B6E4F]/30 text-[#50C878] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-white">Transmission Recorded!</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-md mx-auto">
                    Thank you, <strong className="text-[#50C878]">{formData.name}</strong>. Your signal has been registered. You can also send this message directly via your email client.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a href={mailtoUrl} className="inline-block">
                    <Button size="sm" className="bg-[#50C878] hover:bg-[#50C878]/90 text-[#013220] font-bold">
                      Open in Email App
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setStatus("idle");
                      setFormData({ name: "", email: "", inquiryType: "Collaboration", message: "" });
                    }}
                  >
                    Send Another Transmission
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {status === "error" && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Full Name <span className="text-[#50C878]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#50C878] focus:ring-1 focus:ring-[#50C878] transition-all text-sm"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Email Address <span className="text-[#50C878]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#50C878] focus:ring-1 focus:ring-[#50C878] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label htmlFor="contact-inquiry" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Inquiry Protocol
                  </label>
                  <select
                    id="contact-inquiry"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#50C878] focus:ring-1 focus:ring-[#50C878] transition-all text-sm cursor-pointer"
                  >
                    <option value="Collaboration" className="bg-[#18181b] text-white">Collaboration</option>
                    <option value="Hiring Opportunity" className="bg-[#18181b] text-white">Hiring Opportunity</option>
                    <option value="Networking" className="bg-[#18181b] text-white">Networking</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Message Transmission <span className="text-[#50C878]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Enter project specifications, inquiries, or connection details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#50C878] focus:ring-1 focus:ring-[#50C878] transition-all text-sm resize-none"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "submitting"}
                  className="w-full gap-2 bg-gradient-to-r from-[#50C878] to-[#0B6E4F] hover:from-[#50C878] hover:to-[#50C878] text-[#013220] font-bold text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(80,200,120,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  {status === "submitting" ? "Transmitting..." : "Send Signal"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
