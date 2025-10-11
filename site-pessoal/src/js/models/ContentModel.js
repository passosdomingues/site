/**
 * @file ContentModel.js
 * @author Rafael Passos Domingues
 * @version 4.0.0
 * @brief Model responsible for managing all dynamic content of the website.
 * @description Centralized content management system handling sections, projects,
 *              experiences, and data consumed by views with caching, validation, and extensible architecture.
 */

const CONTENT_TYPES = {
    TIMELINE: {
        identifier: 'timeline',
        displayName: 'Timeline',
        supportsPagination: false,
        maxItems: null,
        layout: 'vertical'
    },
    CARDS: {
        identifier: 'cards',
        displayName: 'Card Grid',
        supportsPagination: true,
        maxItems: 12,
        layout: 'grid'
    },
    GALLERY: {
        identifier: 'gallery',
        displayName: 'Image Gallery',
        supportsPagination: true,
        maxItems: 24,
        layout: 'masonry'
    },
    SKILLS: {
        identifier: 'skills',
        displayName: 'Skills Matrix',
        supportsPagination: false,
        maxItems: null,
        layout: 'matrix'
    }
};

class ContentModel {
    constructor(options = {}) {
        const {
            enableCaching = true,
            cacheTimeout = 300000, // 5 minutes
            enableValidation = true
        } = options;

        this.sections = [];
        this.projects = [];
        this.experiences = [];
        this.contentCache = new Map();
        this.configuration = {
            enableCaching,
            cacheTimeout,
            enableValidation,
            maxCacheSize: 100
        };
        this.isInitialized = false;
        this.initializeContentModel();
    }

    async initializeContentModel() {
        try {
            await this.loadAllContent();
            this.isInitialized = true;
            console.info('ContentModel: Content model successfully initialized.');
        } catch (error) {
            console.error('ContentModel: Failed to initialize content model:', error);
            throw error;
        }
    }

    async loadAllContent() {
        const contentLoadingPromises = [
            this.loadSectionsContent(),
        ];
        await Promise.all(contentLoadingPromises);
    }

    async loadSectionsContent() {
        try {
            const rawSections = this.initializeSections();
            this.sections = rawSections;
            this.cacheContent('sections', this.sections);
            console.debug(`ContentModel: Loaded ${this.sections.length} sections.`);
        } catch (error) {
            console.error('ContentModel: Failed to load sections content:', error);
            throw error;
        }
    }

    initializeSections() {
        return [
            {
                id: 'about',
                title: 'About Me',
                subtitle: 'My academic and professional journey',
                content: this.getAboutContent(),
                type: CONTENT_TYPES.TIMELINE.identifier,
            },
            {
                id: 'astrophysics-research',
                title: 'Astrophysics Research',
                subtitle: 'Work in galactic and extragalactic astrophysics',
                content: this.getAstrophysicsContent(),
                type: CONTENT_TYPES.CARDS.identifier,
            },
            {
                id: 'astronomical-observatory',
                title: 'Astronomical Observatory',
                subtitle: 'Scientific outreach and research at UNIFAL-MG',
                content: this.getObservatoryContent(),
                type: CONTENT_TYPES.GALLERY.identifier,
            },
            {
                id: 'craam-visit',
                title: 'CRAAM Visit',
                subtitle: 'Mackenzie Center for Radioastronomy and Astrophysics',
                content: this.getCraamContent(),
                type: CONTENT_TYPES.GALLERY.identifier,
            },
            {
                id: 'lna-zeiss-telescope',
                title: 'LNA Zeiss Telescope Experience',
                subtitle: 'Operating a classic instrument at Pico dos Dias Observatory',
                content: this.getLnaTelescopeContent(),
                type: CONTENT_TYPES.GALLERY.identifier,
            },
            {
                id: 'education-experience',
                title: 'Education Experience',
                subtitle: 'Teaching and educational material development',
                content: this.getEducationContent(),
                type: CONTENT_TYPES.TIMELINE.identifier,
            },
            {
                id: 'innovation-entrepreneurship',
                title: 'Innovation and Entrepreneurship',
                subtitle: 'NidusTec and innovation ecosystem',
                content: this.getInnovationContent(),
                type: CONTENT_TYPES.CARDS.identifier,
            },
            {
                id: 'deep-learning-projects',
                title: 'Deep Learning Projects',
                subtitle: 'Applying ML/DL to medical imaging and astrophysics',
                content: this.getDeepLearningProjectsContent(),
                type: CONTENT_TYPES.CARDS.identifier,
            },
            {
                id: 'skills',
                title: 'Skills and Competencies',
                subtitle: 'Knowledge areas and technologies',
                content: this.getSkillsContent(),
                type: CONTENT_TYPES.SKILLS.identifier,
            },
            {
                id: 'hobbies',
                title: 'Hobbies and Interests',
                subtitle: 'Activities that inspire and recharge me',
                content: this.getHobbiesContent(),
                type: CONTENT_TYPES.CARDS.identifier,
            }
        ];
    }

    getAboutContent() {
        return {
            introduction: 'Physicist and Computer Scientist passionate about astrophysics research, data analysis, and technological innovation. My journey is a blend of academic research and practical application, always driven by curiosity about how the universe works and how we can use technology to solve real-world problems.',
            timeline: [
                {
                    period: '2014-2018',
                    title: 'Bachelor of Physics, UNIFAL-MG',
                    description: 'My academic journey began with a Bachelor of Physics at UNIFAL-MG. During this period, I delved into the fascinating world of Galactic and Extragalactic Astrophysics, participating in research and contributing to scientific dissemination at the UNIFAL-MG Astronomical Observatory. This experience ignited my passion for understanding the cosmos and communicating complex scientific concepts.',
                    highlights: ['Galactic and Extragalactic Astrophysics', 'Scientific Dissemination', 'Astronomical Observation']
                },
                {
                    period: '2019-2022',
                    title: 'Physics Teacher, State Department of Education of Minas Gerais',
                    description: 'After graduation, I dedicated myself to education, teaching Physics in three municipalities of Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles.',
                    highlights: ['Scientific Education', 'Experimental Physics', 'Pedagogical Innovation']
                },
                {
                    period: '2021-2023',
                    title: 'Master of Physics, UNIFEI',
                    description: 'My Master of Physics at UNIFEI focused on Active Galactic Nuclei, a field where I developed a deep appreciation for data analysis. This research experience solidified my interest in extracting insights from complex datasets, laying the groundwork for my future endeavors in data science.',
                    highlights: ['AGN Research', 'Advanced Data Analysis', 'Scientific Computing']
                },
                {
                    period: '2023-Present',
                    title: 'Bachelor of Computer Science, UNIFAL-MG',
                    description: 'In 2023, I embarked on a new academic path, pursuing a Bachelor of Computer Science at UNIFAL-MG. This transition reflects my commitment to bridging the gap between theoretical physics and technological solutions, and my desire to apply my analytical skills to new challenges.',
                    highlights: ['Career Transition', 'Software Development', 'Data Structures and Algorithms']
                },
                {
                    period: '2024-Present',
                    title: 'NidusTec - Technology-Based Business Incubator',
                    description: 'As part of the NidusTec team, I connect academia and the market, developing Maker projects, robotics, and prototyping. This role has allowed me to evolve as a researcher in Innovation, Entrepreneurship, and Industry 4.0, developing MVP prototypes for software and products with market potential.',
                    highlights: ['Maker Education', 'Robotics and Prototyping', 'Innovation and Entrepreneurship']
                }
            ]
        };
    }

    getAstrophysicsContent() {
        return [
            {
                title: 'Beyond the Telescope: Diving into the Frontier of Galactic Astrophysics at UNIFAL-MG',
                description: 'Looking at the sky through an eyepiece is the first step, but what really moves me is the mystery of Galactic Astrophysics and the large-scale structure of the Universe. This image (taken at the end of 2019) marks a significant moment in my life: a lecture I had the honor of giving at the First Cycle of Seminars in Astronomy at UNIFAL-MG. It was the opportunity to transform years of observation into theoretical rigor and cutting-edge techniques. That night, we went far beyond outreach. My presentation focused on the core of my research developments: Stellar Orbits in the Galaxy. I shared simulations of the movement of stars from models of mass distribution applied to Gauss\'s law of Gravitation and numerical solutions for the accelerations, velocities, and positions of stars in the Milky Way and presented the evidence that led to the postulates of the existence of something invisible: Dark Matter and Modified Gravitation.',
                image: { src: 'seminario.jpg', alt: 'Seminar on Galactic Astrophysics' },
                links: [{ url: 'https://lnkd.in/deYnab4a', label: 'View Paper' }]
            },
            {
                title: 'The Bullet Cluster: A Visual Proof of Dark Matter',
                description: 'Imagine the epic collision of two galaxy clusters. When we measure the total mass by gravitational lensing, we find a mass 20 times greater than the visible matter! And the most impressive thing: the hot gas (the common matter) collides and stays behind, concentrated in the center, while the Dark Matter passes right through, without electromagnetic interaction. It is the most visual and dramatic evidence that this \'mysterious substance\' really exists.',
                image: { src: 'bullet-cluster-black-matter_upscayl.png', alt: 'Bullet Cluster' }
            },
            {
                title: 'A New Interpretation of the Universe Forces',
                description: 'A recent study published in \'The Astrophysical Journal\' brings a new interpretation. \'The forces of the universe, in fact, get weaker on average as it expands,\' explained Gupta. \'This weakening makes it seem like there is a mysterious force driving the accelerated expansion of the universe (which is identified as dark energy). However, at the scales of galaxies and galaxy clusters, the variation of these forces in their gravitationally bound spaces results in extra gravity (which is considered attributed to dark matter).\'',
                links: [{ url: 'https://lnkd.in/dwsKCSbM', label: 'View Paper' }]
            }
        ];
    }

    getObservatoryContent() {
        return [
            { src: 'obs1.jpg', alt: 'Astronomical Observatory Image 1' },
            { src: 'obs2.jpg', alt: 'Astronomical Observatory Image 2' },
            { src: 'obs3.jpg', alt: 'Astronomical Observatory Image 3' },
            { src: 'obs4.jpg', alt: 'Astronomical Observatory Image 4' },
            { src: 'obs5.jpg', alt: 'Astronomical Observatory Image 5' },
            { src: 'obsGalaxiaSombrero.jpg', alt: 'Sombrero Galaxy' },
            { src: 'obsLua.jpg', alt: 'Moon' }
        ];
    }

    getCraamContent() {
        return [
            { src: 'craamAntena.jpg', alt: 'CRAAM Antenna' },
            { src: 'craamControle.jpg', alt: 'CRAAM Control Room' },
            { src: 'craamDomo.jpg', alt: 'CRAAM Dome' },
            { src: 'craamEscada.jpg', alt: 'CRAAM Stairs' }
        ];
    }

    getLnaTelescopeContent() {
        return [
            { src: 'escolaOBS1.png', alt: 'LNA Telescope Image 1' },
            { src: 'escolaOBS2.jpg', alt: 'LNA Telescope Image 2' },
            { src: 'escolaOBS3.jpg', alt: 'LNA Telescope Image 3' },
            { src: 'escolaOBS4.jpg', alt: 'LNA Telescope Image 4' }
        ];
    }

    getEducationContent() {
        return {
            introduction: 'My passion for education goes beyond the classroom. I believe in the power of creating accessible and engaging educational materials to inspire the next generation of scientists and innovators.',
            timeline: [
                {
                    period: '2019-2022',
                    title: 'Physics Teacher, SEE-MG',
                    description: 'I taught Physics in three different cities in Minas Gerais, developing and applying theoretical, experimental, and practical knowledge to the challenges of the 2020-2022 period.',
                    highlights: ['Theoretical and Experimental Teaching', 'Development of Didactic Materials', 'Adaptation to Remote and Hybrid Learning']
                },
                {
                    period: '2020-Present',
                    title: 'Pandefisica',
                    description: 'Creator of the Pandefisica channel, a project for the dissemination of science and scientific education, with a focus on Physics and Astronomy.',
                    highlights: ['Science Communication', 'Video Production', 'Online Community Engagement'],
                    links: [{ url: 'https://sites.google.com/view/pandefisica/', label: 'Visit Pandefisica' }]
                },
                {
                    period: '2021-Present',
                    title: 'Piccinini Virtual',
                    description: 'Development of virtual educational materials and simulations for Physics teaching.',
                    highlights: ['Virtual Laboratories', 'Interactive Simulations', 'E-learning Content Creation']
                }
            ]
        };
    }

    getInnovationContent() {
        return [
            {
                title: 'NidusTec - Incubator of Technology-Based Companies',
                description: 'At NidusTec, I had the opportunity to connect the academic world with the market, developing Maker projects, robotics, and generalist and multidisciplinary prototyping in the spheres of teaching, research, and extension. These challenges led me to develop another research side in Innovation, Entrepreneurship, Production Engineering, and Industry 4.0, having developed MVP prototypes for computer programs and products with market potential during the period.',
                image: { src: 'nidus.jpg', alt: 'NidusTec' }
            },
            {
                title: 'Dev Horizons',
                description: 'A project for the development of innovative software solutions, exploring new technologies and market trends.',
                highlights: ['Software Development', 'Prototyping', 'Market Analysis']
            },
            {
                title: 'Black Hole Simulator',
                description: 'A project that combines physics and computer graphics to create a real-time black hole simulator, exploring concepts of General Relativity.',
                highlights: ['Computer Graphics', 'Physics Simulation', 'Real-Time Rendering']
            }
        ];
    }

    getDeepLearningProjectsContent() {
        return [
            {
                title: 'Medical Image Processing',
                description: 'Application of Deep Learning techniques for the analysis and classification of medical images, aiming to assist in the diagnosis of diseases.',
                highlights: ['CNNs', 'Image Segmentation', 'Data Augmentation']
            },
            {
                title: 'Astrophysical Data Analysis',
                description: 'Use of Machine Learning models to analyze large volumes of astrophysical data, identifying patterns and classifying celestial objects.',
                highlights: ['Machine Learning', 'Big Data', 'Pattern Recognition']
            },
            {
                title: 'NLP for Scientific Articles',
                description: 'Development of NLP models to extract and summarize information from scientific articles, facilitating the literature review process.',
                highlights: ['Natural Language Processing', 'Text Summarization', 'Information Extraction']
            }
        ];
    }

    getSkillsContent() {
        return {
            hardSkills: [
                { name: 'Python', level: 95 },
                { name: 'JavaScript', level: 90 },
                { name: 'C++', level: 85 },
                { name: 'Machine Learning', level: 90 },
                { name: 'Deep Learning', level: 85 },
                { name: 'Data Analysis', level: 95 },
                { name: 'Computer Graphics', level: 80 },
                { name: 'Astrophysics', level: 90 }
            ],
            softSkills: [
                'Problem Solving',
                'Critical Thinking',
                'Communication',
                'Teamwork',
                'Creativity',
                'Adaptability'
            ]
        };
    }

    getHobbiesContent() {
        return [
            {
                title: 'Motorcycle Trail',
                description: 'Exploring trails and nature on two wheels is one of my great passions. The freedom and adrenaline are invigorating.',
                icon: 'motorcycle'
            },
            {
                title: 'Mountain Biking',
                description: 'Off-road mountain biking is a perfect way to combine physical exercise with contact with nature.',
                icon: 'bicycle'
            },
            {
                title: 'Gardening',
                description: 'Cultivating plants and seeing them grow is a relaxing and rewarding activity that connects me with the earth.',
                icon: 'leaf'
            }
        ];
    }

    cacheContent(key, data) {
        if (!this.configuration.enableCaching) return;
        if (this.contentCache.size >= this.configuration.maxCacheSize) {
            const oldestKey = this.contentCache.keys().next().value;
            this.contentCache.delete(oldestKey);
        }
        this.contentCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getCachedContent(key) {
        if (!this.configuration.enableCaching) return null;
        const cached = this.contentCache.get(key);
        if (!cached) return null;
        const isExpired = (Date.now() - cached.timestamp) > this.configuration.cacheTimeout;
        if (isExpired) {
            this.contentCache.delete(key);
            return null;
        }
        return cached.data;
    }

    getSections() {
        return this.getCachedContent('sections') || this.sections;
    }
}

export default ContentModel;

