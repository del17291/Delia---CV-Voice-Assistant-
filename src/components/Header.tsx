import React from 'react';
import { Mail, Phone, MapPin, Sparkles, Volume2, Globe } from 'lucide-react';
import { DELIA_PROFILE } from '../data/cvData';
import deliaPortrait from '../assets/images/delia_portrait_1791558678198.jpg';

interface HeaderProps {
  activeTab: 'assistant' | 'cv';
  setActiveTab: (tab: 'assistant' | 'cv') => void;
  isLiveActive: boolean;
  isSpeaking: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isLiveActive,
  isSpeaking,
}) => {
  return (
    <header className="w-full bg-[#0d2f2b] text-[#f4f1ea] border-b border-[#1a4a44] shadow-md">
      {/* Top Bar with Status and Language Capabilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 border-b border-[#163f3a] flex flex-wrap items-center justify-between text-xs tracking-wider uppercase">
        <div className="flex items-center gap-3 text-[#d3be9e]">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#e5cfab]" />
            Official Voice Assistant: <strong className="text-white tracking-widest">Lilou</strong>
          </span>
          <span className="text-[#3b6b64]">•</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[#b8c9c5] normal-case">
            <Globe className="w-3 h-3 text-[#d3be9e]" />
            Trilingual: English • Deutsch • Français
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-normal">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSpeaking
                  ? 'bg-emerald-400 animate-ping'
                  : isLiveActive
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="text-[#c1d3cf]">
              {isSpeaking ? 'Lilou Speaking' : isLiveActive ? 'Live Mic Active' : 'Lilou Ready'}
            </span>
          </div>

          <div className="inline-flex rounded-full bg-[#08201d] p-0.5 border border-[#1b4a44]">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'assistant'
                  ? 'bg-[#1b4a44] text-white shadow-sm'
                  : 'text-[#9ab1ad] hover:text-white'
              }`}
            >
              Voice Assistant
            </button>
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'cv'
                  ? 'bg-[#1b4a44] text-white shadow-sm'
                  : 'text-[#9ab1ad] hover:text-white'
              }`}
            >
              Full CV Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Main CV Editorial Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-block">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-[#d3be9e] uppercase block">
                {DELIA_PROFILE.title}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white mt-1">
                {DELIA_PROFILE.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#cfdeda] leading-relaxed max-w-2xl font-light">
              {DELIA_PROFILE.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#b8c9c5]">
              <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#d3be9e]" />
                {DELIA_PROFILE.location}
              </span>
              <a
                href={`mailto:${DELIA_PROFILE.email}`}
                className="inline-flex items-center gap-1.5 hover:text-[#e5cfab] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#d3be9e]" />
                {DELIA_PROFILE.email}
              </a>
              <a
                href={`tel:${DELIA_PROFILE.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 hover:text-[#e5cfab] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#d3be9e]" />
                {DELIA_PROFILE.phone}
              </a>
            </div>
          </div>

          {/* Profile Photo matching CV */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#d3be9e]/60 shadow-xl bg-[#09221f]">
                <img
                  src={deliaPortrait}
                  alt="Délia Melters"
                  className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#09221f] text-[#d3be9e] border border-[#d3be9e]/40 p-1.5 rounded-full shadow-lg">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
