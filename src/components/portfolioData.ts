// Define structure for portfolio items
export interface PortfolioItem {
    title: string;
    content: string; // Content now includes HTML for icons in contact section
}

// Define structure for the main data object
export interface PortfolioData {
    [key: string]: PortfolioItem;
}

// --- Icon URLs ---
const ICONS = {
    mail: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/mail.svg",
    linkedin: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/linkedin.svg",
    github: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/github.svg",
    gitlab: "https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/gitlab.svg"
};

// --- Portfolio Data ---
export const portfolioData: PortfolioData = {
    "about": {
        title: "ABOUT_ME.TXT",
        content: `## ABOUT_ME.TXT\n\nWelcome to my console!\n\nI am a Software Engineer specializing in Machine Learning.\nMy core mission is building intelligent systems from data.\n\n>> Passionate about AI ethics and robust model deployment.\n>> Always learning and exploring new algorithms and techniques.\n>> System time: ${new Date().toLocaleTimeString()}.\n` // Removed location for privacy
    },
    "skills": {
        title: "SKILLS.DAT",
        content: `## SKILLS.DAT\n\nLanguages:\n> Python\n> JavaScript / TypeScript\n> SQL\n\nFrameworks & Libraries:\n> TensorFlow / Keras\n> PyTorch\n> Scikit-learn\n> Pandas / NumPy\n> React / Next.js\n> Node.js\n\nPlatforms & Tools:\n> AWS (SageMaker, EC2, S3)\n> GCP (AI Platform, Compute)\n> Docker\n> Git\n`
    },
    "projects": {
        title: "PROJECTS.LOG",
        content: `## PROJECTS.LOG\n\n* **ML Model Deployment API**\n    > Built a scalable REST API...\n    > <a href="#" target="_blank">ACCESS_LOG://PROJECT_ALPHA</a>\n\n* **Interactive Data Viz Dashboard**\n    > Developed a web application...\n    > <a href="#" target="_blank">ACCESS_LOG://PROJECT_BETA</a>\n\n(Replace #)\n`
    },
    "contact": {
        title: "CONTACT.INF",
        // Inject img tags directly into the content string
        content: `## CONTACT.INF\n\nLet's connect!\n
> <a href="mailto:your_email@example.com"><img src="${ICONS.mail}" alt="Email" class="social-icon-img">Email: your_email@example.com</a>
> <a href="https://linkedin.com/in/your_username" target="_blank"><img src="${ICONS.linkedin}" alt="LinkedIn" class="social-icon-img">LinkedIn: /in/your_username</a>
> <a href="https://github.com/your_username" target="_blank"><img src="${ICONS.github}" alt="GitHub" class="social-icon-img">GitHub: /your_username</a>
> <a href="https://gitlab.com/your_username" target="_blank"><img src="${ICONS.gitlab}" alt="GitLab" class="social-icon-img">GitLab: /your_username</a>

\n(Replace placeholders)\n`
    }
};

// Export section keys for navigation mapping if needed elsewhere
export const sectionKeys = Object.keys(portfolioData);

