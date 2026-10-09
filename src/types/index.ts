export type Language = 'en' | 'de' | 'fr' | 'auto';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  audioBase64?: string | null;
  language?: string;
  source?: 'live' | 'standard';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  category: 'luxury' | 'marketing' | 'hospitality' | 'associative';
}

export interface EducationItem {
  id: string;
  period: string;
  institution: string;
  degree: string;
  details?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  highlightBadge?: string;
}

export interface SkillGroup {
  category: string;
  items: { name: string; level?: string }[];
}

export interface InterestItem {
  title: string;
  description: string;
}
