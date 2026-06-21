// ========================================
// SLIDES DATA — Harsh Raj Portfolio
// Single source of truth for all slide content.
// Slide count is data-driven: counter, navigation,
// and WebGL textures all derive from this array.
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
            subheadline: "AI Engineer · Full-Stack Developer · Researcher",
            tagline: "Building AI-powered applications, developer tools, and full-stack platforms.",
            // Drop a PDF at this path to auto-enable the Resume button.
            resumeUrl: "assets/Harsh-Raj-Resume.pdf",
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
            bio: "Final-year CSE student at VIT-AP University with a CGPA of 8.56, focused on AI-powered applications, developer tools, and full-stack web platforms. Skilled in Python, JavaScript/TypeScript, React, FastAPI and PostgreSQL, with research experience in automated code refactoring and software quality evaluation.",
            highlights: [
                { value: "8.56", label: "CGPA / 10" },
                { value: "6+", label: "Live Projects" },
                { value: "2nd", label: "IIT-K Hackathon" },
                { value: "7", label: "Certifications" }
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
                    name: "Argos",
                    tagline: "Competitive Live Debate Platform",
                    description: "Full-stack debate platform with 2–5 round competitive matches, AI evaluation across 4 scoring dimensions, detection of 10 logical fallacies, real-time multiplayer sync, Google OAuth, and Elo-based ranked matchmaking. 15+ API routes, 8 DB tables, daily AI-generated topics.",
                    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Drizzle ORM", "Gemini AI", "TailwindCSS", "Vercel"],
                    url: "https://argos-indol.vercel.app",
                    highlight: true
                },
                {
                    name: "MergeIQ",
                    tagline: "AI-Powered Pull Request Analyzer",
                    description: "Chrome extension and GitHub App that auto-analyzes every PR with Gemini AI, returning Safe / Review Needed / Risky verdicts with risk flags, summaries, and suggested review questions. Posts analysis comments autonomously via webhook with zero manual interaction.",
                    tech: ["Python", "FastAPI", "Chrome Extension (MV3)", "Gemini 2.5 Flash", "GitHub REST API", "PyJWT", "Railway"],
                    url: "https://web-production-6f4dd.up.railway.app",
                    repo: "https://github.com/primetree2/mergeiq",
                    highlight: true
                },
                {
                    name: "HealthAssist",
                    tagline: "AI Symptom Checker & Health Companion",
                    description: "Web app generating detailed symptom analyses with blood-report context-awareness, personalized advice, and precautions. Integrates 4 key data-points across 5 levels of analysis.",
                    tech: ["Python", "FastAPI", "React", "TailwindCSS", "Google API", "PostgreSQL"],
                    url: "https://health-assist-rose.vercel.app/",
                    highlight: false
                },
                {
                    name: "CodeSage",
                    tagline: "AI Codebase Refactoring & Insight Generator",
                    description: "AI code-base analysis and refactoring system improving code quality and maintainability using Gemini AI and other LLMs. Supports 15+ programming languages; cAST-based refactoring pipeline in development.",
                    tech: ["Python", "Flask", "React", "TailwindCSS", "OpenAI API", "Google Cloud"],
                    url: "https://codesage-724681386895.us-central1.run.app/",
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
            ],
            research: {
                title: "Research",
                heading: "LLMs & Prompt Strategies for Automated Python Code Refactoring",
                description: "Evaluated 4 frontier LLMs and 2 prompt-engineering strategies across 5 benchmark programs. Measured code-quality and documentation improvements using BLEU, ROUGE-L, and Pylint, achieving style-conformance scores of 9.2–9.7 / 10."
            }
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
                    skills: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "HTML/CSS"]
                },
                {
                    name: "Frameworks & Libraries",
                    skills: ["React", "Next.js", "FastAPI", "Flask", "TailwindCSS"]
                },
                {
                    name: "Databases",
                    skills: ["PostgreSQL", "Supabase", "Drizzle ORM"]
                },
                {
                    name: "Tools & Platforms",
                    skills: ["Git", "GitHub", "AWS", "Vercel", "Railway", "Google Cloud", "N8N"]
                },
                {
                    name: "AI / ML",
                    skills: ["Machine Learning", "NLP", "Google API", "OpenAI API", "Prompt Engineering"]
                }
            ],
            certifications: [
                { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", url: "https://github.com/primetree2/cisco-certificate/blob/main/AWS%20Certified%20Cloud%20Practitioner%20certificate.pdf" },
                { name: "Oracle OCI Generative AI Professional", issuer: "Oracle", url: "https://github.com/primetree2/cisco-certificate/blob/main/eCertificate.pdf" },
                { name: "Oracle Certified Foundations Associate", issuer: "Oracle", url: "https://github.com/primetree2/cisco-certificate/blob/main/oracle.pdf" },
                { name: "MERN Full Stack", issuer: "Ethnus", url: "https://github.com/primetree2/cisco-certificate/blob/main/3G3GLRGN.pdf" },
                { name: "Data Analysis in R", issuer: "DataCamp", url: "https://github.com/primetree2/cisco-certificate/blob/main/certificate%20(1)_merged.pdf" },
                { name: "JavaScript Essentials", issuer: "Cisco", url: "https://github.com/primetree2/cisco-certificate/blob/main/22BCE7591_AP2023246000888_DA02.pdf" },
                { name: "Networking Essentials", issuer: "Cisco", url: "https://github.com/primetree2/cisco-certificate/blob/main/cisco%20networking%20essectials.pdf" }
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
                organizer: "GDSC, IIT-Kanpur"
            },
            roles: [
                {
                    title: "Manager",
                    org: "TEAM NEXT NEXUS — Prompt Engineering Club",
                    period: "Jul – Dec 2024",
                    description: "Led prompt-engineering study groups and reviewed generative-AI mini-project submissions, facilitating collaborative learning and technical discussions."
                },
                {
                    title: "Associate Manager",
                    org: "Madhya Bharat Association — Cultural Club",
                    period: "Jul – Dec 2024",
                    description: "Oversaw event logistics and team coordination for cultural events with 50+ participants."
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
export const slidesMeta = slides.map(({ title, media }) => ({ title, media }));
