// ========================================
// SLIDES DATA — Harsh Raj Portfolio
// Replace `media` paths with your actual dark abstract images
// Dimensions: recommended 1920x1080 or similar landscape ratio
// ========================================

export const slides = [
    {
        // ── SLIDE 01 ── HERO
        id: "hero",
        title: "Harsh Raj",
        media: "assets/images/slide-01-hero.png",
        overlay: {
            type: "hero",
            eyebrow: "B.Tech CSE · VIT-AP University · 2026",
            headline: "Harsh Raj",
            subheadline: "ML Engineer · Full-Stack Developer · AI Researcher",
            tagline: "Building data-driven systems at the intersection of AI and the web.",
            cta: {
                primary: { label: "View Projects", slideTarget: 2 },
                secondary: { label: "Contact Me", slideTarget: 5 }
            },
            socials: [
                { label: "GitHub", url: "https://github.com/primetree2" },
                { label: "LinkedIn", url: "https://linkedin.com/in/harsh-raj-820117173" },
                { label: "Email", url: "mailto:myselfharshr@gmail.com" }
            ]
        }
    },

    {
        // ── SLIDE 02 ── ABOUT
        id: "about",
        title: "About Me",
        media: "assets/images/slide-02-about.jpg",
        overlay: {
            type: "about",
            label: "About",
            headline: "Curious builder.\nAnalytical thinker.",
            bio: "Final year CSE student at VIT-AP University with a CGPA of 8.52, specializing in Machine Learning, NLP, and full-stack web development. I thrive on building intelligent, data-driven applications — from AI symptom checkers to EMG-controlled prosthetic claws.",
            highlights: [
                { value: "8.52", label: "CGPA / 10" },
                { value: "5+", label: "Live Projects" },
                { value: "2nd", label: "IIT-K Hackathon" },
                { value: "3+", label: "Club Roles" }
            ],
            education: [
                {
                    degree: "B.Tech — Computer Science & Engineering",
                    institution: "VIT-AP University, Amaravati",
                    period: "2022 – 2026 (Expected)"
                },
                {
                    degree: "Senior Secondary (Class 12 — 83.2%)",
                    institution: "Vidya Bharati Chinmaya Vidyalaya, Jamshedpur",
                    period: "2022"
                }
            ]
        }
    },

    {
        // ── SLIDE 03 ── PROJECTS
        id: "projects",
        title: "Projects",
        media: "assets/images/slide-03-projects.jpg",
        overlay: {
            type: "projects",
            label: "Projects",
            headline: "Things I've Built",
            projects: [
                {
                    name: "HealthAssist",
                    tagline: "AI Symptom Checker & Health Companion",
                    description: "Generates detailed symptom analyses with personalized advice. Integrates 4 key data-points across 5 levels of analysis.",
                    tech: ["Python", "FastAPI", "React", "TailwindCSS", "Gemini AI", "PostgreSQL"],
                    url: "#",
                    highlight: true
                },
                {
                    name: "CodeSage",
                    tagline: "AI Codebase Refactoring & Insight Generator",
                    description: "Analyzes and refactors codebases using LLMs. Supports 15+ programming languages with actionable quality insights.",
                    tech: ["Python", "Flask", "React", "OpenAI API", "Google Cloud"],
                    url: "#",
                    highlight: true
                },
                {
                    name: "Smart Blood Analyzer",
                    tagline: "Automated Blood Report Interpreter",
                    description: "NLP-powered extraction of blood test parameters with rule-based condition prediction. Supports up to 100 health markers.",
                    tech: ["Python", "NLP", "Flask", "Pandas", "JavaScript"],
                    url: "#",
                    highlight: false
                },
                {
                    name: "TrueBlog",
                    tagline: "E-Blogging Platform",
                    description: "Full-stack blogging platform with rich-text editor, comment moderation, and responsive UI.",
                    tech: ["React", "Node.js", "Express", "MongoDB", "Bootstrap"],
                    url: "#",
                    highlight: false
                },
                {
                    name: "ArmLogix",
                    tagline: "EMG-Controlled Prosthetic Claw",
                    description: "Sensor-to-actuator pipeline translating EMG signals into real-time finger movements. Hardware prototype built.",
                    tech: ["Arduino UNO", "EMG Sensors", "C++"],
                    url: null,
                    highlight: false
                }
            ]
        }
    },

    {
        // ── SLIDE 04 ── SKILLS
        id: "skills",
        title: "Skills",
        media: "assets/videos/slide-04-skills.mp4",
        overlay: {
            type: "skills",
            label: "Skills",
            headline: "My Stack",
            categories: [
                {
                    name: "Languages",
                    skills: ["Python", "JavaScript", "Java", "R", "SQL", "MATLAB", "HTML/CSS"]
                },
                {
                    name: "Web & Backend",
                    skills: ["React", "Node.js", "Express", "MongoDB", "FastAPI", "Flask", "Bootstrap", "TailwindCSS"]
                },
                {
                    name: "Data & ML",
                    skills: ["Pandas", "scikit-learn", "NLP", "Data Analysis", "Model Evaluation", "Generative AI"]
                },
                {
                    name: "Cloud & Tools",
                    skills: ["AWS", "Google Cloud", "Git", "PostgreSQL", "Oracle OCI"]
                }
            ],
            certifications: [
                { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
                { name: "Oracle OCI Generative AI Professional", issuer: "Oracle" },
                { name: "Oracle Certified Foundations Associate", issuer: "Oracle" },
                { name: "MERN Full Stack", issuer: "Ethnus" },
                { name: "Data Analysis in R", issuer: "DataCamp" },
                { name: "JavaScript Essentials", issuer: "Cisco" }
            ]
        }
    },

    {
        // ── SLIDE 05 ── LEADERSHIP
        id: "leadership",
        title: "Leadership",
        media: "assets/images/slide-05-leadership.jpg",
        overlay: {
            type: "leadership",
            label: "Leadership & Achievements",
            headline: "Beyond the Code",
            achievement: {
                badge: "🏆 2nd Place",
                event: "The Return Journey Hackathon",
                organizer: "IIT Kanpur"
            },
            roles: [
                {
                    title: "Joint Secretary",
                    org: "Data Science Club, VIT-AP University",
                    period: "Sep 2024 – Present",
                    description: "Led workshops on data analysis, organized hackathon prep sessions, and coordinated speaker events."
                },
                {
                    title: "Manager",
                    org: "TEAM NEXT NEXUS — Prompt Engineering Club",
                    period: "Jul – Dec 2024",
                    description: "Managed prompt engineering study groups and evaluated generative-AI mini-project submissions."
                },
                {
                    title: "Associate Manager",
                    org: "Madhya Bharat Association — Cultural Club",
                    period: "Jul – Dec 2024",
                    description: "Oversaw logistics and team coordination for cultural events with 50+ participants."
                }
            ]
        }
    },

    {
        // ── SLIDE 06 ── CONTACT
        id: "contact",
        title: "Contact",
        media: "assets/images/slide-06-contact.png",
        overlay: {
            type: "contact",
            label: "Get In Touch",
            headline: "Let's Build\nSomething.",
            subtext: "Open to internships, collaborations, and interesting problems.",
            location: "Jamshedpur, Jharkhand, India",
            links: [
                { label: "myselfharshr@gmail.com", url: "mailto:myselfharshr@gmail.com", type: "email" },
                { label: "github.com/primetree2", url: "https://github.com/primetree2", type: "github" },
                { label: "linkedin.com/in/harsh-raj-820117173", url: "https://linkedin.com/in/harsh-raj-820117173", type: "linkedin" },
                { label: "+91-92634-01358", url: "tel:+919263401358", type: "phone" }
            ]
        }
    }
];

// ── Derived flat array for the WebGL slider (title + media only)
// This is what slider-core.js expects
export const slidesMeta = slides.map(({ title, media }) => ({ title, media }));