import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Languages,
  Laptop,
  Heart,
  Volume2,
  Copy,
  Check,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import {
  EXPERIENCES,
  EDUCATION,
  PROJECTS,
  SKILLS,
  INTERESTS,
  DELIA_PROFILE,
} from '../data/cvData';

interface CVExplorerProps {
  onAskItem: (prompt: string) => void;
}

export const CVExplorer: React.FC<CVExplorerProps> = ({ onAskItem }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `${DELIA_PROFILE.name} - ${DELIA_PROFILE.title}
${DELIA_PROFILE.tagline}
Contact: ${DELIA_PROFILE.email} | ${DELIA_PROFILE.phone} | ${DELIA_PROFILE.location}

EXPERIENCE:
${EXPERIENCES.map((e) => `• ${e.role} at ${e.company} (${e.period}, ${e.location})\n  ${e.highlights.join(' ')}`).join('\n\n')}

EDUCATION:
${EDUCATION.map((ed) => `• ${ed.degree} - ${ed.institution} (${ed.period})`).join('\n')}

PROJECTS:
${PROJECTS.map((p) => `• ${p.title} - ${p.organization} (${p.date})\n  ${p.description}`).join('\n\n')}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FAF8F5] rounded-3xl border border-[#e5ded4] shadow-sm p-6 sm:p-10 text-[#112421]">
      {/* Top CV Controls */}
      <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-[#ded7cc] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#0d2f2b] font-semibold">
            Curriculum Vitae
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#0d2f2b]">
            Délia Melters — Professional Record
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white border border-[#d8d0c3] text-[#1c3833] hover:bg-[#0d2f2b] hover:text-white transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Dossier</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full CV Text</span>
              </>
            )}
          </button>

          <a
            href={`mailto:${DELIA_PROFILE.email}?subject=Opportunity%20Discussion%20-%20Delia%20Melters`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#0d2f2b] text-[#f4f1ea] hover:bg-[#15453f] transition-all shadow-sm"
          >
            <span>Contact Directly</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Two Column Layout mirroring the CV */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Experience & Projects (7 cols) */}
        <div className="lg:col-span-7 space-y-10">
          {/* SECTION: EXPERIENCE */}
          <section>
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#0d2f2b] mb-6">
              <Briefcase className="w-4 h-4 text-[#0d2f2b]" />
              <h3 className="text-xs font-bold tracking-[0.25em] text-[#0d2f2b] uppercase font-sans">
                Experience
              </h3>
            </div>

            <div className="space-y-6">
              {EXPERIENCES.map((exp) => (
                <div
                  key={exp.id}
                  className="group bg-white p-5 rounded-2xl border border-[#e8e2d8] hover:border-[#0d2f2b] transition-all shadow-xs relative"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-[#0d2f2b] tracking-wide uppercase font-sans">
                        {exp.role}
                      </h4>
                      <div className="text-xs font-medium text-[#41605a]">
                        {exp.company}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onAskItem(
                          `Please tell me all about Délia's experience as ${exp.role} at ${exp.company}.`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#edf4f2] text-[#0d2f2b] hover:bg-[#0d2f2b] hover:text-[#f4f1ea] transition-all"
                      title="Ask Lilou to present this experience"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Ask Lilou</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#758a85] mb-3">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#2b413d] leading-relaxed list-disc list-outside ml-4">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: PROJECTS & ENGAGEMENT */}
          <section>
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#0d2f2b] mb-6">
              <Award className="w-4 h-4 text-[#0d2f2b]" />
              <h3 className="text-xs font-bold tracking-[0.25em] text-[#0d2f2b] uppercase font-sans">
                Projects & Engagement
              </h3>
            </div>

            <div className="space-y-6">
              {PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white p-5 rounded-2xl border border-[#e8e2d8] hover:border-[#0d2f2b] transition-all shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      {proj.highlightBadge && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#143e38] text-[#e8d5b8] mb-1.5 tracking-wider uppercase">
                          {proj.highlightBadge}
                        </span>
                      )}
                      <h4 className="text-sm font-bold text-[#0d2f2b] uppercase font-sans">
                        {proj.title}
                      </h4>
                      <div className="text-xs font-medium text-[#41605a]">
                        {proj.organization} | {proj.date}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onAskItem(
                          `Can you describe the project "${proj.title}" that Délia led or participated in?`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#edf4f2] text-[#0d2f2b] hover:bg-[#0d2f2b] hover:text-[#f4f1ea] transition-all"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Ask Lilou</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#2b413d] leading-relaxed mt-2">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Education, Skills, Interests (5 cols) */}
        <div className="lg:col-span-5 space-y-10">
          {/* SECTION: EDUCATION */}
          <section>
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#0d2f2b] mb-6">
              <GraduationCap className="w-4 h-4 text-[#0d2f2b]" />
              <h3 className="text-xs font-bold tracking-[0.25em] text-[#0d2f2b] uppercase font-sans">
                Education
              </h3>
            </div>

            <div className="space-y-4">
              {EDUCATION.map((edu) => (
                <div
                  key={edu.id}
                  className="bg-white p-4.5 rounded-2xl border border-[#e8e2d8] hover:border-[#0d2f2b] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#8b6f48] mb-1">
                    <span>{edu.period}</span>
                    <button
                      onClick={() =>
                        onAskItem(
                          `Tell me about Délia's degree at ${edu.institution} (${edu.degree}).`
                        )
                      }
                      className="text-[10px] text-[#0d2f2b] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                      Listen
                    </button>
                  </div>
                  <h4 className="text-xs font-bold uppercase text-[#0d2f2b] tracking-wide">
                    {edu.institution}
                  </h4>
                  <div className="text-xs text-[#1f3e39] font-medium mt-0.5">
                    {edu.degree}
                  </div>
                  {edu.details && (
                    <p className="text-[11px] text-[#556e69] mt-1 leading-normal">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: SKILLS */}
          <section>
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#0d2f2b] mb-6">
              <Sparkles className="w-4 h-4 text-[#0d2f2b]" />
              <h3 className="text-xs font-bold tracking-[0.25em] text-[#0d2f2b] uppercase font-sans">
                Skills
              </h3>
            </div>

            <div className="space-y-5">
              {SKILLS.map((grp, idx) => (
                <div key={idx} className="bg-white p-4.5 rounded-2xl border border-[#e8e2d8]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0d2f2b] uppercase tracking-wide mb-3">
                    {grp.category === 'Languages' ? (
                      <Languages className="w-3.5 h-3.5 text-[#0d2f2b]" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-[#0d2f2b]" />
                    )}
                    <span>{grp.category}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {grp.items.map((item, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#f4f1eb] border border-[#ded7cc] text-[#112421]"
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.level && (
                          <span className="text-[10px] text-[#0d2f2b] font-semibold bg-[#e0ded8] px-1.5 py-0.2 rounded-full">
                            {item.level}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: INTERESTS */}
          <section>
            <div className="flex items-center gap-2.5 pb-3 border-b-2 border-[#0d2f2b] mb-6">
              <Heart className="w-4 h-4 text-[#0d2f2b]" />
              <h3 className="text-xs font-bold tracking-[0.25em] text-[#0d2f2b] uppercase font-sans">
                Interests & Leadership
              </h3>
            </div>

            <div className="space-y-3">
              {INTERESTS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-[#e8e2d8] hover:border-[#0d2f2b] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#0d2f2b] uppercase">
                      {item.title}
                    </h4>
                    <button
                      onClick={() =>
                        onAskItem(
                          `How does Délia's passion for ${item.title} enrich her professional work and character?`
                        )
                      }
                      className="text-[10px] text-[#0d2f2b] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                      Ask Lilou
                    </button>
                  </div>
                  <p className="text-xs text-[#3b5550] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
