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
        media: "assets/images/slide-01-hero.jpg",
        overlay: {
            type: "hero",
            eyebrow: "B.Tech CSE · VIT-AP University · 2026",
            headline: "Harsh Raj",
            subheadline: "AI Engineer · Full-Stack Developer · Researcher",
            tagline: "Building AI-powered applications, developer tools, and full-stack platforms.",
            cta: {
                primary: { label: "View Projects", slideTarget: 2 },
                secondary: { label: "Contact Me", slideTarget: 5 }
            },
            resume: {
                label: "Download Resume",
                url: "assets/resume_final.pdf"
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
            bio: "Final-year Computer Science student at VIT-AP University (CGPA 8.56) developing AI-powered applications, developer tools, and full-stack web platforms. Skilled in Python, JavaScript/TypeScript, React, FastAPI, PostgreSQL, and cloud deployment, with research experience in automated code refactoring and software-quality evaluation.",
            highlights: [
                { value: "8.56", label: "CGPA / 10" },
                { value: "4+", label: "Live Projects" },
                { value: "2nd", label: "IIT-K Hackathon" },
                { value: "4", label: "Frontier LLMs Evaluated" }
            ],
            education: [
                {
                    degree: "B.Tech — Computer Science & Engineering (SCOPE)",
                    institution: "VIT-AP University, Amaravati",
                    period: "2022 – Sep 2026 (Expected)"
                },
                {
                    degree: "Senior Secondary — Class 12: 83.2% · Class 10: 94.4%",
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
                    description: "Full-stack debate platform with 2–5 round competitive matches, AI evaluation across 4 scoring dimensions and 10 logical-fallacy detections. 15+ API routes, 8 DB tables, real-time multiplayer sync, Google OAuth, and Elo-based ranked matchmaking with daily AI-generated topics.",
                    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Drizzle ORM", "Gemini AI", "TailwindCSS", "Vercel"],
                    url: "https://argos-indol.vercel.app",
                    highlight: true
                },
                {
                    name: "MergeIQ",
                    tagline: "AI-Powered Pull Request Analyzer",
                    description: "Chrome extension + GitHub App that analyzes every pull request with Gemini AI, returning structured verdicts (Safe / Review Needed / Risky), risk flags, summaries and review questions. Pulls live repo context and posts analysis comments autonomously via webhook.",
                    tech: ["Python", "FastAPI", "Chrome MV3", "Gemini 2.5 Flash", "GitHub REST API", "PyJWT", "Railway"],
                    url: "https://web-production-6f4dd.up.railway.app",
                    highlight: true
                },
                {
                    name: "HealthAssist",
                    tagline: "AI Symptom Checker & Health Companion",
                    description: "Web app generating detailed symptom analyses with blood-report context-awareness, plus personalized advice and precautions. Integrates 4 key data-points across 5 levels of analysis.",
                    tech: ["Python", "FastAPI", "React", "TailwindCSS", "Google API", "Generative AI", "PostgreSQL"],
                    url: "https://health-assist-rose.vercel.app/",
                    highlight: false
                },
                {
                    name: "CodeSage",
                    tagline: "AI Codebase Refactoring & Insight Generator",
                    description: "AI codebase analysis and refactoring system that improves code quality and maintainability across 15+ languages using Gemini AI / other LLMs. Includes a research report comparing 5 leading LLMs and a cAST-based refactoring pipeline in progress.",
                    tech: ["Python", "Flask", "React", "Google API", "OpenAI API", "Google Cloud", "LLMs"],
                    url: "https://codesage-724681386895.us-central1.run.app/",
                    highlight: false
                }
            ]
        }
    },

    {
        // ── SLIDE 04 ── SKILLS
        // Note: icons resolve via cdn.simpleicons.org; any 404 falls back
        // to assets/icons/fallback.svg (handled in navigation.js).
        // Skills with `icon: null` render as a clean text-only pill.
        id: "skills",
        title: "Skills",
        media: "",
        overlay: {
            type: "skills",
            label: "Skills",
            headline: "My Stack",

            categories: [
                {
                    name: "Languages",
                    skills: [
                        { name: "Python", icon: "python" },
                        { name: "TypeScript", icon: "typescript" },
                        { name: "JavaScript", icon: "javascript" },
                        { name: "Java", icon: "openjdk" },
                        { name: "SQL", icon: null },
                        { name: "HTML/CSS", icon: "html5" },
                    ]
                },
                {
                    name: "Frameworks & Libraries",
                    skills: [
                        { name: "React", icon: "react" },
                        { name: "Next.js", icon: "nextdotjs" },
                        { name: "FastAPI", icon: "fastapi" },
                        { name: "Flask", icon: "flask" },
                        { name: "TailwindCSS", icon: "tailwindcss" },
                    ]
                },
                {
                    name: "Databases",
                    skills: [
                        { name: "PostgreSQL", icon: "postgresql" },
                        { name: "Supabase", icon: "supabase" },
                        { name: "Drizzle ORM", icon: "drizzle" },
                    ]
                },
                {
                    name: "Tools & Platforms",
                    skills: [
                        { name: "Git", icon: "git" },
                        { name: "GitHub", icon: "github" },
                        { name: "AWS", icon: null },
                        { name: "Vercel", icon: "vercel" },
                        { name: "Railway", icon: "railway" },
                        { name: "Google Cloud", icon: "googlecloud" },
                        { name: "N8N", icon: "n8n" },
                    ]
                },
                {
                    name: "AI / ML",
                    skills: [
                        { name: "Machine Learning", icon: null },
                        { name: "NLP", icon: null },
                        { name: "OpenAI API", icon: "openai" },
                        { name: "Google API", icon: "google" },
                        { name: "Prompt Engineering", icon: null },
                    ]
                }
            ],

            certifications: [
                { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", icon: null },
                { name: "Oracle OCI Generative AI Professional", issuer: "Oracle", icon: null },
                { name: "Oracle Certified Foundations Associate", issuer: "Oracle", icon: null },
                { name: "MERN Full Stack", issuer: "Ethnus", icon: null },
                { name: "Data Analysis in R", issuer: "DataCamp", icon: "datacamp" },
                { name: "JavaScript Essentials", issuer: "Cisco", icon: "cisco" },
                { name: "Networking Essentials", issuer: "Cisco", icon: "cisco" },
            ],
        }
    },
    {
        // ── SLIDE 05 ── LEADERSHIP
        id: "leadership",
        title: "Leadership",
        media: "assets/images/slide-05-leadership.jpg",
        overlay: {
            type: "leadership",
            label: "Leadership, Research & Achievements",
            headline: "Beyond the Code",
            achievement: {
                badge: "🏆 2nd Place",
                event: "The Return Journey Hackathon",
                organizer: "GDSC, IIT Kanpur"
            },
            research: {
                title: "Performance Evaluation of LLMs & Prompt Strategies for Automated Python Code Refactoring",
                description: "Evaluated 4 frontier LLMs and 2 prompt-engineering strategies for automated Python code refactoring across 5 benchmark programs. Measured code-quality and documentation improvements using BLEU, ROUGE-L and Pylint, achieving style-conformance scores of 9.2–9.7/10, and identified the most effective refactoring strategies."
            },
            roles: [
                {
                    title: "Manager",
                    org: "TEAM NEXT NEXUS — Prompt Engineering Club",
                    period: "Jul – Dec 2024",
                    description: "Led prompt-engineering study groups and reviewed generative-AI mini-project submissions, facilitating collaborative learning and technical discussions among members."
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
            languages: "English (Proficient) · Hindi (Native)",
            interests: "AI Research · Number Theory · Art / Animation · Content Creation",
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