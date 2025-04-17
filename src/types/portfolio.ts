// Types for portfolio data structure
export interface PortfolioItem {
  title: string;
  content: string;
}

export interface PortfolioData {
  [key: string]: PortfolioItem;
}

export interface PortfolioMetadata {
  version: string;
  lastUpdated: string;
  author: string;
  theme: string;
}

export interface NavigationConfig {
  style: string;
  showIcons: boolean;
  animationSpeed: string;
}

export interface DisplayConfig {
  typingEffect: boolean;
  typingSpeed: number;
  showCursor: boolean;
  terminalPrompt: string;
}

export interface PortfolioConfig {
  navigation: NavigationConfig;
  display: DisplayConfig;
}

// Content types
export interface SectionContent {
  header: string;
  [key: string]: unknown;
}

// About section
export interface AboutContent extends SectionContent {
  introduction: string;
  bio: string;
  highlights: string[];
  interests?: string[];
  currentLocation?: string;
}

// Skills section
export interface SkillsContent extends SectionContent {
  categories: SkillCategory[];
}

export interface SkillCategory {
  name: string;
  items: (string | SkillItem)[];
}

export interface SkillItem {
  name: string;
  proficiency: string;
  years: number;
}

// Projects section
export interface ProjectsContent extends SectionContent {
  projects: Project[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  linkText: string;
  featured: boolean;
  year: number;
  isPrivate?: boolean;
  status?: 'completed' | 'in-progress' | 'planned' | 'archived';
}

// Contact section
export interface ContactContent extends SectionContent {
  introduction: string;
  channels: ContactChannel[];
  availability?: string;
}

export interface ContactChannel {
  type: 'email' | 'linkedin' | 'github' | 'gitlab' | 'phone' | 'substack';
  value: string;
  link: string;
  icon: string;
}

// Experience section
export interface Job {
  company: string;
  position: string;
  period: string;
  achievements: string[];
}

// Education section
export interface Degree {
  degree: string;
  major: string;
  institution: string;
  achievements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  platform: string;
}

// Component props types
export interface ContentDisplayProps {
  content: string;
  speed?: number;
  onTypingStateChange?: (isTyping: boolean) => void;
}

export interface IntroScreenProps {
  onComplete: () => void;
}

export interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  sections: string[];
}

export interface VisitorCounterProps {
  className?: string;
}