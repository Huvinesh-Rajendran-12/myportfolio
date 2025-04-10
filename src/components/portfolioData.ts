// Define types for the structured portfolio data
export interface PortfolioItem {
    title: string;
    content: string; // Content now includes HTML for icons in contact section
}

// Define structure for the main data object
export interface PortfolioData {
    [key: string]: PortfolioItem;
}

// Define types for our JSON structure
interface PortfolioJSON {
    metadata: {
        version: string;
        lastUpdated: string;
        author: string;
        theme: string;
    };
    sections: {
        [key: string]: {
            title: string;
            displayOrder: number;
            icon: string;
            content: SectionContent;
            formatting: {
                useMarkdown: boolean;
                [key: string]: unknown;
            };
        };
    };
    config: {
        navigation: {
            style: string;
            showIcons: boolean;
            animationSpeed: string;
        };
        display: {
            typingEffect: boolean;
            typingSpeed: number;
            showCursor: boolean;
            terminalPrompt: string;
        };
    };
    experience?: {
        jobs: Job[];
    };
    education?: {
        degrees: Degree[];
        certifications: Certification[];
    };
}

// Define types for section content
interface SectionContent {
    header: string;
    [key: string]: unknown;
}

// About section content type
interface AboutContent extends SectionContent {
    introduction: string;
    bio: string;
    highlights: string[];
    interests?: string[];
    currentLocation?: string;
}

// Skills section content type
interface SkillsContent extends SectionContent {
    categories: SkillCategory[];
}

interface SkillCategory {
    name: string;
    items: (string | SkillItem)[];
}

interface SkillItem {
    name: string;
    proficiency: string;
    years: number;
}

// Projects section content type
interface ProjectsContent extends SectionContent {
    projects: Project[];
}

interface Project {
    title: string;
    description: string;
    technologies: string[];
    link: string;
    linkText: string;
    featured: boolean;
    year: number;
    isPrivate?: boolean; // Flag to indicate if this is a private work project
    status?: 'completed' | 'in-progress' | 'planned' | 'archived'; // Project completion status
}

// Contact section content type
interface ContactContent extends SectionContent {
    introduction: string;
    channels: ContactChannel[];
    availability?: string;
}

interface ContactChannel {
    type: 'email' | 'linkedin' | 'github' | 'gitlab' | 'phone' | 'substack';
    value: string;
    link: string;
    icon: string;
}

// Experience section types
interface Job {
    company: string;
    position: string;
    period: string;
    achievements: string[];
}

// Education section types
interface Degree {
    degree: string;
    major: string;
    institution: string;
    achievements: string[];
}

interface Certification {
    name: string;
    issuer: string;
    platform: string;
}

// --- Icon URLs ---
const ICONS = {
    mail: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1haWwiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgeD0iMiIgeT0iNCIgcng9IjIiLz48cGF0aCBkPSJtMjIgNy0xMCA1LTEwLTUiLz48L3N2Zz4=",
    linkedin: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/linkedin.svg",
    github: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/github.svg",
    gitlab: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/gitlab.svg",
    phone: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/phone.svg",
    'file-text': "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/file-text.svg",
    briefcase: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/briefcase.svg",
    graduation: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/graduation-cap.svg"
};

// Import JSON data
import portfolioJSON from '../data/portfolio.json';

// Type assertion for imported JSON
const typedPortfolioJSON = portfolioJSON as unknown as PortfolioJSON;

// Helper function to format about section
function formatAboutSection(data: AboutContent): string {
    const { header, introduction, bio, highlights, interests } = data;
    let content = `## ${header}\n\n${introduction}\n\n${bio}\n\n`;
    
    // Add highlights
    if (highlights && highlights.length > 0) {
        highlights.forEach((highlight: string) => {
            content += `>> ${highlight}\n`;
        });
    }
     
    // Add interests if present
    if (interests && interests.length > 0) {
        content += "Interests: ";
        content += interests.map((interest: string) => `${interest}`).join(', ');
    }
    
    return content;
}

// Helper function to format skills section
function formatSkillsSection(data: SkillsContent): string {
    const { header, categories } = data;
    let content = `## ${header}\n\n`;
    
    if (categories && categories.length > 0) {
        categories.forEach((category: SkillCategory) => {
            content += `${category.name}:\n`;
            
            if (Array.isArray(category.items)) {
                if (typeof category.items[0] === 'string') {
                    // Simple string array
                    category.items.forEach((item) => {
                        if (typeof item === 'string') {
                            content += `> ${item}\n`;
                        }
                    });
                } else {
                    // Array of objects with more details
                    category.items.forEach((item) => {
                        if (typeof item !== 'string') {
                            content += `> ${item.name} (${item.proficiency}, ${item.years} years)\n`;
                        }
                    });
                }
            }
            content += "\n";
        });
    }
    
    return content;
}

// Helper function to format projects section
function formatProjectsSection(data: ProjectsContent): string {
    const { header, projects } = data;
    let content = `## ${header}\n\n`;
    
    if (projects && projects.length > 0) {
        projects.forEach((project: Project) => {
            // Add a private project indicator if applicable
            const privateTag = project.isPrivate ? ' <span class="private-project">[PRIVATE WORK]</span>' : '';
            
            // Add status indicator if available
            let statusTag = '';
            if (project.status) {
                const statusClass = `status-${project.status}`;
                const statusLabel = project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                statusTag = ` <span class="project-status ${statusClass}">[${statusLabel}]</span>`;
            }
            
            content += `* **${project.title}${privateTag}${statusTag}**\n`;
            content += `    > ${project.description}\n`;
            if (project.technologies) {
                content += `    > Technologies: ${project.technologies.join(', ')}\n`;
            }
            
            // Handle links differently for private projects
            if (project.link) {
                if (project.isPrivate) {
                    content += `    > <span class="private-link">${project.linkText} (Private work project)</span>\n`;
                } else {
                    content += `    > <a href="${project.link}" target="_blank">${project.linkText}</a>\n`;
                }
            }
            content += "\n";
        });
    }
    
    return content;
}

// Helper function to format contact section
function formatContactSection(data: ContactContent): string {
    const { header, introduction, channels, availability } = data;
    let content = `## ${header}\n\n${introduction}\n\n`;
    
    if (channels && channels.length > 0) {
        channels.forEach((channel: ContactChannel) => {
            // Use type assertion to ensure TypeScript knows these are valid keys
            const iconKey = channel.type as keyof typeof ICONS;
            const iconSrc = ICONS[iconKey];
            content += `> <a href="${channel.link}" target="_blank"><img src="${iconSrc}" alt="${channel.type}" class="social-icon-img">${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}: ${channel.value}</a>\n`;
        });
    }
    
    if (availability) {
        content += `\n${availability}\n`;
    }
    
    return content;
}

// Helper function to format experience section
function formatExperienceSection(jobs: Job[]): string {
    let content = `## WORK_EXPERIENCE.LOG\n\n`;
    
    if (jobs && jobs.length > 0) {
        jobs.forEach((job: Job) => {
            content += `* **${job.position} @ ${job.company}**\n`;
            content += `    > ${job.period}\n\n`;
            
            if (job.achievements && job.achievements.length > 0) {
                content += `    > Key Achievements:\n`;
                job.achievements.forEach((achievement: string) => {
                    content += `    > - ${achievement}\n`;
                });
            }
            content += "\n";
        });
    }
    
    return content;
}

// Helper function to format education section
function formatEducationSection(degrees: Degree[], certifications: Certification[]): string {
    let content = `## EDUCATION_AND_CERTS.DAT\n\n`;
    
    // Format degrees
    if (degrees && degrees.length > 0) {
        content += `### Academic Background\n\n`;
        degrees.forEach((degree: Degree) => {
            content += `* **${degree.degree}**\n`;
            content += `    > Major: ${degree.major}\n`;
            content += `    > Institution: ${degree.institution}\n`;
            
            if (degree.achievements && degree.achievements.length > 0) {
                content += `    > Achievements: ${degree.achievements.join(', ')}\n`;
            }
            content += "\n";
        });
    }
    
    // Format certifications
    if (certifications && certifications.length > 0) {
        content += `### Certifications\n\n`;
        certifications.forEach((cert: Certification) => {
            content += `* **${cert.name}**\n`;
            content += `    > Issuer: ${cert.issuer}\n`;
            content += `    > Platform: ${cert.platform}\n\n`;
        });
    }
    
    return content;
}

// Process and enhance the portfolio data from JSON
export const portfolioData: PortfolioData = {
    // About section
    "about": {
        title: typedPortfolioJSON.sections.about.title,
        content: formatAboutSection(typedPortfolioJSON.sections.about.content as AboutContent)
    },
    
    // Skills section
    "skills": {
        title: typedPortfolioJSON.sections.skills.title,
        content: formatSkillsSection(typedPortfolioJSON.sections.skills.content as SkillsContent)
    },
    
    // Projects section
    "projects": {
        title: typedPortfolioJSON.sections.projects.title,
        content: formatProjectsSection(typedPortfolioJSON.sections.projects.content as ProjectsContent)
    },
    
    // Contact section
    "contact": {
        title: typedPortfolioJSON.sections.contact.title,
        content: formatContactSection(typedPortfolioJSON.sections.contact.content as ContactContent)
    },
    
    // Experience section
    "experience": {
        title: "WORK_EXPERIENCE.LOG",
        content: typedPortfolioJSON.experience ? formatExperienceSection(typedPortfolioJSON.experience.jobs) : ""
    },
    
    // Education section
    "education": {
        title: "EDUCATION_AND_CERTS.DAT",
        content: typedPortfolioJSON.education ? 
            formatEducationSection(typedPortfolioJSON.education.degrees, typedPortfolioJSON.education.certifications) : ""
    }
};

// Export section keys for navigation mapping if needed elsewhere
// Sort sections strictly by displayOrder
export const sectionKeys = Object.keys(portfolioData).sort((a, b) => {
    // Get displayOrder from the JSON, with fallbacks for sections at root level
    const orderA = typedPortfolioJSON.sections[a]?.displayOrder || 999;
    const orderB = typedPortfolioJSON.sections[b]?.displayOrder || 999;
    return orderA - orderB;
});

// Export config settings for use in other components
export const portfolioConfig = typedPortfolioJSON.config;

// Export metadata for use in other components
export const portfolioMetadata = typedPortfolioJSON.metadata;

