import { ExperienceItem, EducationItem, ProjectItem, SkillGroup, InterestItem } from '../types';

export const DELIA_PROFILE = {
  name: 'Délia Melters',
  title: "MASTER'S STUDENT IN LUXURY, COMMUNICATIONS & PRESTIGE MARKETING",
  tagline:
    'Two years of experience in international marketing and the luxury sports and design sector, fluent in three languages, lived in three countries, with a strong interest in sustainability and tourism, reflected in a 1st-place win in a Europe-wide tourism innovation competition.',
  email: 'del17291@gmail.com',
  phone: '+49 152 26351065',
  location: 'Paris, France',
  assistantName: 'Lilou',
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'kenko',
    role: 'INTERNATIONAL MARKETING WORKING STUDENT',
    company: 'KENKO GmbH',
    location: 'Berlin, Germany',
    period: 'April 2025 – July 2026',
    category: 'marketing',
    highlights: [
      'Supported international marketing activities and projects, including campaign development, social media, and content production.',
      'Contributed to the development of a sub-brand, including brand positioning, photoshoots, video production and editing.',
      'Led the creation and management of its Kickstarter crowdfunding campaign.',
    ],
  },
  {
    id: 'galeries-lafayette',
    role: 'SALES ASSOCIATE – GALERIES LAFAYETTE PARIS (HERCULE STUDIO)',
    company: 'Galeries Lafayette',
    location: 'Paris, France',
    period: 'December 2024',
    category: 'luxury',
    highlights: [
      "Advised high-end customers and showcased Hercule Studio's fitness accessories through visual merchandising in the dedicated Wellness Space.",
      'Used communication skills to drive engagement, successfully boosting brand visibility and holiday sales.',
    ],
  },
  {
    id: 'hercule-internship',
    role: 'MARKETING INTERNSHIP',
    company: 'Hercule Studio SAS',
    location: 'Nice, France',
    period: 'September 2024 – March 2025',
    category: 'luxury',
    highlights: [
      "Supported brand's U.S. expansion (managed entity application, selected a logistics partner).",
      'Benchmarked international markets and created marketing content (videos, ads, social media).',
      'Organized promotional events and represented the brand at luxury fairs, gaining deep insights into the luxury, design, and sports industries.',
    ],
  },
  {
    id: 'esce-association',
    role: 'SOCIAL MEDIA MANAGER – ARTISTIC ASSOCIATION',
    company: 'ESCE Business School',
    location: 'Paris, France',
    period: 'January 2024 – May 2024',
    category: 'associative',
    highlights: [
      'Created engaging and creative Instagram content to promote the association.',
      'Communicated key information and coordinated content from sub-associations, leveraging multitasking skills.',
    ],
  },
  {
    id: 'uckermark',
    role: 'PART-TIME HOSPITALITY EMPLOYEE',
    company: 'Hotel Uckermark - FINE ARTS- Hotel- und Restaurantgesellschaft mbH& KG',
    location: 'Prenzlau, Germany',
    period: 'July 2020 – August 2020',
    category: 'hospitality',
    highlights: [
      'Ensured a pleasant experience for hotel guests through time-efficient work in housekeeping.',
      'Delivered high-level customer service in waitressing events with attention to detail and composure under stress for a four-star hotel standard.',
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: 'master',
    period: '2026 – present',
    institution: 'HWR BERLIN & ESCE PARIS',
    degree: "Double Master's Degree: International Marketing (HWR) & Luxury, Comm. and Prestige Marketing (ESCE)",
    details: 'Dual-degree curriculum bridging German strategic marketing with French haute luxe prestige brand management.',
  },
  {
    id: 'bachelor',
    period: '2022 – 2026',
    institution: 'HWR BERLIN & ESCE PARIS',
    degree: "German-French Double Bachelor's Degree in International Management",
    details: 'Bi-national foundation in cross-border trade, economics, and corporate strategy in Berlin and Paris.',
  },
  {
    id: 'gymnasium',
    period: '2019 – 2022',
    institution: 'Gymnasium Prenzlau',
    degree: 'High-school diploma (Abitur)',
    details: 'Graduated with honors.',
  },
  {
    id: 'exchange',
    period: '2018 – 2019',
    institution: 'Northern High School, Calvert County (USA)',
    degree: 'US Exchange Year',
    details: 'Immersive American high school academic and cultural exchange program.',
  },
  {
    id: 'montessori',
    period: '2009 – 2018',
    institution: 'Montessori Nature School Prenzlau',
    degree: 'Primary & Secondary Education',
    details: 'Independent learning foundation fostering initiative and holistic ecological awareness.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'best-stay',
    title: '1ST PLACE – EUROPE-WIDE TOURISM INNOVATION COMPETITION',
    organization: 'BEST STAY EVENT CROATIA (Sponsored by BWH Hotels & PAVE Europe)',
    date: 'February 2026',
    highlightBadge: '🏆 1st Place Winner',
    description:
      'Developed an innovative sustainable tourism concept for Croatia integrating autonomous mobility into the guest experience, combining eco-conscious travel with smart mobility.',
  },
  {
    id: 'anne-frank',
    title: 'EXHIBITION GUIDE – "DEINE ANNE (FRANK)"',
    organization: 'Anne Frank Zentrum | Prenzlau',
    date: 'February – March 2020',
    description:
      'Conducted educational tours for student groups and visitors, facilitating historical dialogue and civic consciousness.',
  },
];

export const SKILLS: SkillGroup[] = [
  {
    category: 'Languages',
    items: [
      { name: 'German', level: 'Native' },
      { name: 'French', level: 'Fluent (C2)' },
      { name: 'English', level: 'Fluent (C2)' },
      { name: 'Spanish', level: 'Basic (A2)' },
    ],
  },
  {
    category: 'IT & Creative Skills',
    items: [
      { name: 'Microsoft 365' },
      { name: 'Adobe Photoshop' },
      { name: 'iMovie & Video Editing' },
      { name: 'Canva' },
      { name: 'Visual Merchandising' },
      { name: 'Crowdfunding / Kickstarter' },
    ],
  },
];

export const INTERESTS: InterestItem[] = [
  {
    title: 'Cheer-Leading',
    description: 'Captain of the united cheerleading team of all Berlin universities. Spearheaded athletic choreography, team discipline, and morale.',
  },
  {
    title: 'Photography & Videography',
    description: 'Photography class 2018–2019; continued practical execution in commercial brand shoots, styling, and editorial video storytelling.',
  },
  {
    title: 'Music',
    description: 'Pianist for a Gospel Choir (2019–2021). Passionate about rhythm, ensemble harmony, and creative expression.',
  },
  {
    title: 'Nature & Ecology',
    description: 'Part-time work on an organic farm (2020), nurturing a sustained commitment to environmental ethics and sustainable luxury.',
  },
];

export const SUGGESTED_QUESTIONS = [
  {
    lang: 'en',
    category: 'Luxury & Marketing',
    label: 'Hercule Studio & Galeries Lafayette',
    prompt: 'Tell me about your work at Hercule Studio and your role at Galeries Lafayette in Paris.',
  },
  {
    lang: 'en',
    category: 'Innovation',
    label: 'Tourism Innovation Win',
    prompt: 'How did you win 1st place at the Europe-wide tourism innovation competition in Croatia?',
  },
  {
    lang: 'de',
    category: 'Erfahrung',
    label: 'KENKO Kickstarter & Branding',
    prompt: 'Welche Aufgaben hast du bei KENKO in Berlin übernommen und wie sah die Kickstarter-Kampagne aus?',
  },
  {
    lang: 'fr',
    category: 'Formation',
    label: 'Double Diplôme & ESCE Paris',
    prompt: 'Parle-moi de ton double master en marketing de luxe et de ton expérience à Paris.',
  },
  {
    lang: 'en',
    category: 'Leadership',
    label: 'Cheerleading Captaincy',
    prompt: 'What did being Captain of the Berlin universities cheerleading team teach you about leadership?',
  },
  {
    lang: 'de',
    category: 'Sprachen',
    label: 'Dreisprachiges Profil',
    prompt: 'Wie nutzt du deine Dreisprachigkeit (Deutsch, Französisch, Englisch) im Berufsalltag?',
  },
];
