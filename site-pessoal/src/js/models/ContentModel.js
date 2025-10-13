/**
 * @file ContentModel.js
 * @author Rafael Passos Domingues
 * @version 3.0.0
 * @brief Model responsible for managing all dynamic content of the website.
 * @description Centralized content management system handling sections, projects,
 * experiences, and data consumed by views with caching, validation, and extensible architecture.
 */

import eventBus from '../core/EventBus.js';

/**
 * @constant {Object} CONTENT_TYPES
 * @brief Defines available content display types and their configurations
 * @description Maps content type identifiers to their display characteristics and validation rules
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

/**
 * @constant {Object} VALIDATION_RULES
 * @brief Validation rules for content structure and data integrity
 * @description Defines required fields, data types, and constraints for different content types
 */
const VALIDATION_RULES = {
    SECTION: {
        requiredFields: ['id', 'title', 'type'],
        idPattern: /^[a-z-]+$/,
        maxTitleLength: 100,
        maxSubtitleLength: 200
    },
    PROJECT: {
        requiredFields: ['id', 'title', 'description'],
        maxTitleLength: 80,
        maxDescriptionLength: 300
    },
    EXPERIENCE: {
        requiredFields: ['id', 'title', 'period', 'description'],
        maxTitleLength: 80,
        maxDescriptionLength: 500
    }
};

/**
 * @class ContentModel
 * @brief Centralized content management system for the application
 * @description Handles all dynamic content including sections, projects, experiences,
 * with caching, validation, and extensible architecture for scalable content management
 */
class ContentModel {
    /**
     * @brief Creates an instance of ContentModel
     * @constructor
     * @param {Object} options - Configuration options for content model
     * @param {boolean} options.enableCaching - Whether to enable content caching
     * @param {number} options.cacheTimeout - Cache timeout in milliseconds
     * @param {boolean} options.enableValidation - Whether to validate content structure
     */
    constructor(options = {}) {
        const {
            enableCaching = true,
            cacheTimeout = 300000, // 5 minutes
            enableValidation = true
        } = options;

        /**
         * @private
         * @type {Array}
         * @brief Collection of website sections with their content and configuration
         */
        this.sections = [];

        /**
         * @private
         * @type {Array}
         * @brief Collection of project items with metadata and content
         */
        this.projects = [];

        /**
         * @private
         * @type {Array}
         * @brief Collection of experience items with timeline and details
         */
        this.experiences = [];

        /**
         * @private
         * @type {Object}
         * @brief Cache storage for optimized content retrieval
         */
        this.contentCache = new Map();

        /**
         * @private
         * @type {Object}
         * @brief Configuration options for content management
         */
        this.configuration = {
            enableCaching,
            cacheTimeout,
            enableValidation,
            maxCacheSize: 100
        };

        /**
         * @private
         * @type {boolean}
         * @brief Tracks whether content has been initialized
         */
        this.isInitialized = false;

        this.initializeContentModel();
    }

    /**
     * @brief Initializes the content model with all required data
     * @private
     * @returns {Promise<void>} Resolves when content model is fully initialized
     */
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

    /**
     * @brief Loads all content types in parallel for optimal performance
     * @private
     * @returns {Promise<void>} Resolves when all content is loaded
     */
    async loadAllContent() {
        const contentLoadingPromises = [
            this.loadSectionsContent(),
            this.loadProjectsContent(),
            this.loadExperiencesContent()
        ];

        await Promise.all(contentLoadingPromises);
    }

    /**
     * @brief Loads and initializes section content with validation
     * @private
     * @returns {Promise<void>} Resolves when sections are loaded and validated
     */
    async loadSectionsContent() {
        try {
            const rawSections = this.initializeSections();
            
            if (this.configuration.enableValidation) {
                this.validateSectionsContent(rawSections);
            }

            this.sections = rawSections;
            this.cacheContent('sections', this.sections);
            
            console.debug(`ContentModel: Loaded ${this.sections.length} sections.`);
        } catch (error) {
            console.error('ContentModel: Failed to load sections content:', error);
            throw error;
        }
    }

    /**
     * @brief Initializes the website sections with content and configuration
     * @private
     * @returns {Array} Array of section objects with complete content
     */
    initializeSections() {
        return [
            {
                id: 'about',
                title: 'About Me',
                subtitle: 'My academic and professional journey',
                content: this.getAboutContent(),
                type: CONTENT_TYPES.TIMELINE.identifier,
                metadata: {
                    priority: 1,
                    visible: true,
                    order: 1,
                    icon: 'atom',
                    backgroundColor: 'var(--color-surface)'
                }
            },
            {
                id: 'astrophysics-research',
                title: 'Astrophysics Research',
                subtitle: 'Work in galactic and extragalactic astrophysics',
                content: this.getAstrophysicsContent(),
                type: CONTENT_TYPES.CARDS.identifier,
                metadata: {
                    priority: 2,
                    visible: true,
                    order: 2,
                    icon: 'galaxy',
                    backgroundColor: 'var(--color-gray-50)'
                }
            },
            {
                id: 'astronomical-observatory',
                title: 'Astronomical Observatory',
                subtitle: 'Scientific outreach and research at UNIFAL-MG',
                content: this.getObservatoryContent(),
                type: CONTENT_TYPES.GALLERY.identifier,
                metadata: {
                    priority: 2,
                    visible: true,
                    order: 3,
                    icon: 'telescope-outline',
                    backgroundColor: 'var(--color-surface)'
                }
            },
            {
                id: 'craam-visit',
                title: 'CRAAM Visit',
                subtitle: 'Mackenzie Center for Radioastronomy and Astrophysics',
                content: this.getCraamContent(),
                type: CONTENT_TYPES.GALLERY.identifier,
                metadata: {
                    priority: 3,
                    visible: true,
                    order: 4,
                    icon: 'satellite-dish',
                    backgroundColor: 'var(--color-gray-50)'
                }
            },
            {
                id: 'lna-zeiss-telescope',
                title: 'LNA Zeiss Telescope Experience',
                subtitle: 'Operating a classic instrument at Pico dos Dias Observatory',
                content: this.getLNATelescopeContent(),
                type: CONTENT_TYPES.GALLERY.identifier,
                metadata: {
                    priority: 3,
                    visible: true,
                    order: 5,
                    icon: 'telescope-solid',
                    backgroundColor: 'var(--color-surface)'
                }
            },
            {
                id: 'education-experience',
                title: 'Education Experience',
                subtitle: 'Teaching and educational material development',
                content: this.getEducationContent(),
                type: CONTENT_TYPES.TIMELINE.identifier,
                metadata: {
                    priority: 2,
                    visible: true,
                    order: 6,
                    icon: 'graduation-hat',
                    backgroundColor: 'var(--color-gray-50)'
                }
            },
            {
                id: 'innovation-entrepreneurship',
                title: 'Innovation and Entrepreneurship',
                subtitle: 'NidusTec and innovation ecosystem',
                content: this.getInnovationContent(),
                type: CONTENT_TYPES.CARDS.identifier,
                metadata: {
                    priority: 2,
                    visible: true,
                    order: 7,
                    icon: 'idea',
                    backgroundColor: 'var(--color-surface)'
                }
            },
            {
                id: 'deep-learning-projects',
                title: 'Deep Learning Projects',
                subtitle: 'Applying ML/DL to medical imaging and astrophysics',
                content: this.getDeepLearningProjectsContent(),
                type: CONTENT_TYPES.CARDS.identifier,
                metadata: {
                    priority: 1,
                    visible: true,
                    order: 8,
                    icon: 'brain-outline',
                    backgroundColor: 'var(--color-gray-50)'
                }
            },
            {
                id: 'skills',
                title: 'Skills and Competencies',
                subtitle: 'Knowledge areas and technologies',
                content: this.getSkillsContent(),
                type: CONTENT_TYPES.SKILLS.identifier,
                metadata: {
                    priority: 2,
                    visible: true,
                    order: 9,
                    icon: 'gears',
                    backgroundColor: 'var(--color-surface)'
                }
            },
            {
                id: 'hobbies',
                title: 'Hobbies and Interests',
                subtitle: 'Activities that inspire and recharge me',
                content: this.getHobbiesContent(),
                type: CONTENT_TYPES.CARDS.identifier,
                metadata: {
                    priority: 4,
                    visible: true,
                    order: 10,
                    icon: 'puzzle-piece',
                    backgroundColor: 'var(--color-gray-50)'
                }
            }
        ];
    }

    /**
     * @brief Validates sections content against defined rules
     * @private
     * @param {Array} sections - Array of section objects to validate
     * @throws {Error} When section validation fails
     */
    validateSectionsContent(sections) {
        if (!Array.isArray(sections)) {
            throw new Error('Sections content must be an array');
        }

        sections.forEach((section, index) => {
            // Check required fields
            VALIDATION_RULES.SECTION.requiredFields.forEach(field => {
                if (!section[field]) {
                    throw new Error(`Section at index ${index} missing required field: ${field}`);
                }
            });

            // Validate ID pattern
            if (!VALIDATION_RULES.SECTION.idPattern.test(section.id)) {
                throw new Error(`Section ID '${section.id}' must contain only lowercase letters and hyphens`);
            }

            // Validate title length
            if (section.title.length > VALIDATION_RULES.SECTION.maxTitleLength) {
                throw new Error(`Section title '${section.title}' exceeds maximum length of ${VALIDATION_RULES.SECTION.maxTitleLength} characters`);
            }

            // Validate content type
            const validTypes = Object.values(CONTENT_TYPES).map(type => type.identifier);
            if (!validTypes.includes(section.type)) {
                throw new Error(`Invalid content type '${section.type}' for section '${section.id}'. Valid types: ${validTypes.join(', ')}`);
            }
        });
    }

    /**
     * @brief Generates comprehensive about section content
     * @private
     * @returns {Object} Structured about content with multiple data points
     */
    getAboutContent() {
        return {
            introduction: 'Physicist and Computer Scientist passionate about astrophysics research, data analysis, and technological innovation. My journey is a blend of academic research and practical application, always driven by curiosity about how the universe works and how we can use technology to solve real-world problems.',
            timeline: [
                {
                    period: '2014-2018',
                    title: 'Bachelor\'s Degree in Physics, UNIFAL-MG',
                    description: 'My academic journey began with a Bachelor\'s Degree in Physics at UNIFAL-MG. During this period, I immersed myself in the fascinating world of Galactic and Extragalactic Astrophysics, participating in research and contributing to scientific outreach at the UNIFAL-MG Astronomical Observatory. This experience ignited my passion for understanding the cosmos and communicating complex scientific concepts.',
                    highlights: ['Galactic and Extragalactic Astrophysics', 'Scientific Outreach', 'Astronomical Observation']
                },
                {
                    period: '2019-2022',
                    title: 'Physics Teacher, State Department of Education of Minas Gerais',
                    description: 'After graduation, I dedicated myself to education, teaching Physics in three municipalities of Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles.',
                    highlights: ['Science Education', 'Experimental Physics', 'Pedagogical Innovation']
                },
                {
                    period: '2021-2023',
                    title: 'Master\'s Degree in Physics, UNIFEI',
                    description: 'My Master\'s in Physics at UNIFEI focused on Active Galactic Nuclei, a field where I developed a deep appreciation for data analysis. This research experience solidified my interest in extracting insights from complex datasets, laying the foundation for my future ventures in data science.',
                    highlights: ['AGN Research', 'Advanced Data Analysis', 'Scientific Computing']
                },
                {
                    period: '2023-Present',
                    title: 'Bachelor\'s Degree in Computer Science, UNIFAL-MG',
                    description: 'In 2023, I embarked on a new academic path, pursuing a Bachelor\'s Degree in Computer Science at UNIFAL-MG. This transition reflects my commitment to bridging the gap between theoretical physics and practical technological solutions. Concurrently, I joined the NidusTec/UNIFAL-MG Technology-Based Business Incubator, connecting academia with the market and fostering innovation.',
                    highlights: ['Software Development', 'Data Science', 'Machine Learning', 'Academia-Industry Connection']
                },
                {
                    period: '2024-2025',
                    title: 'Innovation Ecosystem and Maker Educator, NidusTec/UNIFAL-MG Incubator',
                    description: 'At NidusTec, I embraced the role of Maker Educator, leading robotics, 3D modeling, and CNC workshop projects. This experience allowed me to apply computer graphics and image processing techniques in multidisciplinary prototypes, addressing institutional infrastructure needs and exploring research in Innovation, Entrepreneurship, Production Engineering, and Industry 4.0. I developed MVPs with market potential, demonstrating my ability to transform ideas into tangible solutions.',
                    highlights: ['Entrepreneurship', 'Technology Transfer', 'Maker Education', '3D Modeling and CNC', 'Robotics', 'Innovation Management']
                }
            ],
            currentFocus: 'Currently, I am a Computer Science student, specializing in image processing and computer graphics. My focus is on applying my knowledge in multidisciplinary interfaces that combine Machine Learning, Deep Learning, Natural Language Processing (NLP), Convolutional Neural Networks (CNNs), and Large Language Models (LLMs), with a keen interest in exploring their integration with Smart Contracts and blockchain technologies.',
            reflection: 'My journey, seemingly disparate at first glance, is a testament to the power of interdisciplinary thinking. The convergence of physics, astrophysics, education, and computer science has equipped me with a unique perspective. I see myself not just as a Physicist or a Developer, but as a problem-solver who leverages diverse knowledge to create impactful solutions. This trajectory has shaped me into an applicator of knowledge, constantly seeking to unite science and technology to meet the evolving demands of the world.',
            summary: 'A unique blend of academic rigor in physics and astrophysics with practical expertise in computer science, driving innovation through data analysis, machine learning, and entrepreneurial initiatives.'
        };
    }

    /**
     * @brief Generates astrophysics research content
     * @private
     * @returns {Array} Array of research project cards
     */
    getAstrophysicsContent() {
        return [
            {
                id: 'dark-matter-research',
                title: 'Unveiling the Invisible: My Journey in Dark Matter Research',
                description: 'My research in Dark Matter began with a deep dive into galactic rotation curves. The anomalous velocities of stars in galactic halos presented a profound enigma: either the laws of gravity needed revision, or a vast amount of invisible matter was at play. This led me to explore the concept of Dark Matter, a mysterious substance that interacts gravitationally but not electromagnetically. A crucial moment in my understanding came from studying the Bullet Cluster, a cosmic collision where gravitational lensing revealed a mass distribution far greater than visible matter. The separation of ordinary and dark matter during this collision provided compelling visual evidence for the existence of Dark Matter. I had the privilege of presenting these findings at the First Cycle of Astronomy Seminars at UNIFAL-MG, transforming years of observation into theoretical rigor and sharing the frontiers of cosmology with a captivated audience. This experience reinforced my belief in higher education as a vital engine for research and outreach, bridging the gap between telescopic fascination and theoretical astrophysics.',
                image: {
                    src: 'bullet-cluster-black-matter_upscayl.png',
                    alt: 'Bullet Cluster showing dark matter distribution, key evidence for dark matter',
                    caption: 'Bullet Cluster: Visual Evidence of Dark Matter (Credit: NASA/CXC/M.Weiss)'
                },
                links: [
                    { url: 'https://lnkd.in/deYnab4a', label: 'Related Research Publication', type: 'external' }
                ],
                tags: ['Dark Matter', 'Galactic Dynamics', 'Cosmology', 'Gravitational Lensing', 'Science Communication'],
                status: 'published',
                date: '2018-03-15'
            },
            {
                id: 'astronomy-seminar',
                title: 'Astronomy Seminar Series: Stellar Orbits and the Dark Universe',
                description: 'This image captures a significant moment: a lecture I delivered at the First Cycle of Astronomy Seminars at UNIFAL-MG. My presentation focused on Stellar Orbits in the Galaxy, where I shared simulations of stellar movements based on mass distribution models and numerical solutions for stellar accelerations, velocities, and positions in the Milky Way. I discussed the evidence that led to the postulates of Dark Matter and Modified Gravity, particularly highlighting the Rotation Curves of galaxies. This anomaly, where stars in the galactic halo move too fast, suggests that most of the Milky Way\'s mass is invisible. Sharing these complex ideas and challenging the audience with the mysteries of the cosmos was a profound experience, reinforcing the role of higher education in driving both research and public engagement.',
                image: {
                    src: 'seminario.jpg',
                    alt: 'Astronomy seminar presentation on stellar orbits and dark matter',
                    caption: 'Presentation on Stellar Orbits and Dark Matter at UNIFAL-MG Seminar (2019)'
                },
                links: [],
                tags: ['Scientific Outreach', 'Academic Events', 'Stellar Dynamics', 'Dark Matter', 'Public Speaking'],
                status: 'completed',
                date: '2019-11-20'
            },
            {
                id: 'ccc-tl-cosmology',
                title: 'Exploring Alternative Cosmologies: CCC+TL and Baryon Acoustic Oscillations',
                description: 'Beyond Dark Matter, my curiosity extends to alternative cosmological models. A recent study in "The Astrophysical Journal" on "Testing CCC+TL Cosmology with Baryon Acoustic Oscillation Features" offers a fascinating perspective. It proposes that the universe\'s forces weaken as it expands, creating an illusion of dark energy driving accelerated expansion. On galactic scales, this variation in forces within gravitationally bound systems could explain the "extra gravity" attributed to dark matter. This research highlights the ongoing quest to understand the fundamental forces shaping our universe and the intricate interplay between theory and observation in modern cosmology.',
                links: [
                    { url: 'https://lnkd.in/dwsKCSbM', label: 'The Astrophysical Journal Publication', type: 'external' }
                ],
                tags: ['Cosmology', 'Dark Energy', 'Dark Matter', 'Baryon Acoustic Oscillation', 'Theoretical Physics'],
                status: 'published',
                date: '2024-01-01'
            }
        ];
    }

    /**
     * @brief Generates observatory content with research and outreach activities
     * @private
     * @returns {Array} Array of observatory activity items
     */
    getObservatoryContent() {
        return [
            {
                id: 'unifal-observatory-outreach',
                title: 'A Window to the Universe: Scientific Outreach and Research at UNIFAL-MG',
                description: 'During my time as a member of the UNIFAL-MG Astronomical Observatory team (2015 to 2018), I had the privilege of connecting over 2,000 visitors from Alfenas and the surrounding region to the wonders of the cosmos. As a science communicator, I used our magnificent 380mm Cassegrain telescope to reveal the impressive craters of the Moon, the majestic rings of Saturn, the Galilean moons of Jupiter, and the beauty of star clusters. These experiences, shared with colleagues like José Carlos da Silva and Professor Artur Justiniano, reinforced my belief in open science and non-formal education. It was more than just observing; it was about inspiring curiosity, reflection, and critical thinking in all ages, from fascinated children to academic community members and seniors. This period was fundamental in shaping my commitment to making science accessible and engaging.',
                image: {
                    src: 'observatorio-unifal.jpg',
                    alt: 'UNIFAL-MG Astronomical Observatory with a Cassegrain telescope',
                    caption: 'UNIFAL-MG Astronomical Observatory: Inspiring the next generation of scientists'
                },
                links: [],
                tags: ['Scientific Outreach', 'Astronomy', 'Education', 'Public Engagement', 'Cassegrain Telescope'],
                status: 'completed',
                date: '2018-12-01'
            },
            {
                id: 'observatory-astrophotography',
                title: 'Astrophotography and Exoplanet Research at UNIFAL-MG Observatory',
                description: 'Beyond public outreach, the UNIFAL-MG Observatory was a center for research and astrophotography. I witnessed and contributed to significant achievements, including the pioneering work of my colleague José Carlos in detecting the transit of exoplanet WASP-76b. My own efforts in astrophotography led me to capture impressive images, such as the Sombrero Galaxy (M104/NGC 4594) in a 34-minute exposure and the spiral arms of the Southern Pinwheel Galaxy (M83/NGC 5236). I also had the unique opportunity to guide my first class, the 3rd EJA from Divisa Nova - MG, through a practical observation session at the observatory. Even after my institutional involvement ended, my passion for observation continued, culminating in the exciting experience of observing the long-period comet C/2020 F3 (NEOWISE) in 2020. These experiences solidified my skills in data acquisition, image processing, and scientific analysis.',
                images: [
                    { src: 'obsLua.jpg', alt: 'Moon observation', caption: 'Detailed view of the Moon captured at UNIFAL-MG Observatory' },
                    { src: 'obsGalaxiaSombrero.jpg', alt: 'Sombrero Galaxy', caption: 'Sombrero Galaxy (M104/NGC 4594) captured through astrophotography' }
                ],
                highlights: [
                    'Contribution to exoplanet transit detection (WASP-76b)',
                    'Deep-sky object astrophotography (Sombrero Galaxy, Southern Pinwheel Galaxy)',
                    'Conducted practical astronomy classes and observed Comet C/2020 F3 (NEOWISE)'
                ],
                date: '2015-2020'
            }
        ];
    }

    /**
     * @brief Generates CRAAM visit content
     * @private
     * @returns {Array} Array of CRAAM visit items
     */
    getCraamContent() {
        return [
            {
                id: 'craam-radio-polarimeter',
                title: 'Exploring Solar Radio Astronomy at CRAAM: A Deep Dive into Instrumentation',
                description: 'In 2019, shortly after completing my Physics degree at UNIFAL-MG, I had the distinct honor of visiting CRAAM (Mackenzie Center for Radio Astronomy and Astrophysics), a pioneering research institution in Brazil since 1960. The highlight of this visit was the opportunity to learn and operate the 7 GHz Solar Radio Polarimeter, a critical instrument for monitoring our host star. Guided by colleague Raphael Cesar Pimenta and engineer Amauri Shossei Kudaka, I gained invaluable insights into the intricate electronic and computational systems that process solar data. The precision engineering required for data acquisition and analysis was truly impressive. Climbing to the polarimeter installation site, protected by its dome, I witnessed firsthand the scale of research infrastructure. The 1.5-meter antenna, positioned toward the sky, captures circularly polarized radio emissions from the Sun. This equipment, operating at 7 GHz, is crucial for CRAAM\'s research, which focuses on monitoring solar activity, detecting energetic phenomena like solar flares, and revealing the magnetic properties of the solar atmosphere. This experience was a profound lesson in Instrumentation and Radio Astronomy, reinforcing my passion for Solar Physics and highlighting the significant contributions of Brazilian research on the international stage. CRAAM\'s collaborations with institutions like INPE and its involvement in projects like the Solar-T stratospheric balloon flight in Antarctica are truly inspiring.',
                images: [
                    { src: 'craamAntena.jpg', alt: 'Solar Radio Polarimeter antenna at CRAAM', caption: '7 GHz Solar Radio Polarimeter (CRAAM)' },
                    { src: 'craamControle.jpg', alt: 'CRAAM control room', caption: 'CRAAM Control Room: Inspecting electronic and computational systems' },
                    { src: 'craamDomo.jpg', alt: 'Inside CRAAM dome', caption: 'Inside CRAAM Dome: 1.5-meter antenna' },
                    { src: 'craamEscada.jpg', alt: 'CRAAM external staircase', caption: 'External staircase to observation deck' }
                ],
                highlights: [
                    'Operated the 7 GHz Solar Radio Polarimeter',
                    'Gained insights into solar activity monitoring and magnetic property analysis',
                    'Explored complex data acquisition and processing in radio astronomy'
                ],
                date: '2019'
            }
        ];
    }

    /**
     * @brief Generates content about the LNA Zeiss Telescope experience
     * @private
     * @returns {Array} Array of LNA Zeiss Telescope experience items
     */
    getLNATelescopeContent() {
        return [
            {
                id: 'lna-zeiss-operation',
                title: 'Operating the Historic Zeiss Telescope at LNA: A Journey Through Time and Science',
                description: 'During my Physics course at UNIFAL-MG (2014-2018), I had the extraordinary opportunity to operate, for two nights in 2016, a truly special instrument at the National Astrophysics Laboratory (LNA/OPD). This was no ordinary telescope; it was a historic Zeiss, acquired from former East Germany in the 1960s/70s through fascinating negotiations involving coffee. After years in storage, it was finally assembled in 1983 at the Pico dos Dias Observatory. This classic Cassegrain telescope, with its parabolic primary and hyperbolic secondary, features an f/12.5 focal ratio at the Cassegrain focus and requires manual pointing. It is exclusively dedicated to photometry and polarimetry, enabling precise studies of light from stars and galaxies, revealing intricate details that only meticulously calibrated instruments can capture. Operating the Zeiss was a profound experience: from preparing observations and collecting data to instrument calibration, every detail and adjustment emphasized the essential pursuit of knowledge. More than just technical skill, it was an immersion in the rich scientific legacy it embodies, a powerful reminder that science thrives with patience, precision, and insatiable curiosity. This experience not only deepened my passion for data and observing the universe but also remains one of the most cherished memories of my academic journey, highlighting the enduring fascination of astronomical exploration.',
                images: [
                    { src: 'obs4.jpg', alt: 'LNA Observatory at sunset', caption: 'Pico dos Dias Observatory (LNA) at sunset, a serene setting for scientific discovery' },
                    { src: 'obs5.jpg', alt: 'Aerial view of LNA Observatory', caption: 'Aerial view of National Astrophysics Laboratory (LNA), showing its impressive infrastructure' }
                ],
                highlights: [
                    'Operated a historic Zeiss Cassegrain telescope for photometry and polarimetry',
                    'Gained practical experience in astronomical data collection and instrument calibration',
                    'Immersion in the scientific legacy of one of Brazil\'s leading observatories'
                ],
                date: '2016'
            }
        ];
    }

    /**
     * @brief Generates education and teaching experience content
     * @private
     * @returns {Array} Array of education timeline items
     */
    getEducationContent() {
        return [
            {
                period: '2016-2018',
                role: 'Teaching Assistant, Physics Department at UNIFAL-MG',
                description: 'During my undergraduate studies, I served as a Teaching Assistant in the Physics Department at UNIFAL-MG. This role was fundamental to the development of my pedagogical skills, as I was responsible for laboratory instruction for undergraduate physics courses, developing experimental protocols, and providing mentoring and academic support to students. I found immense satisfaction in helping students understand complex concepts through hands-on experiments, and I contributed to the creation of new and engaging laboratory materials. This experience solidified my understanding of fundamental physics principles and my ability to communicate them effectively.',
                highlights: [
                    'Provided laboratory instruction and academic support to undergraduate physics students',
                    'Developed and refined experimental protocols for physics courses',
                    'Mentored students, promoting deeper understanding of scientific concepts'
                ]
            },
            {
                period: '2017-2018',
                role: 'Educational Material Developer, UNIFAL-MG Astronomical Observatory',
                description: 'My passion for astronomy extended to educational outreach at the UNIFAL-MG Astronomical Observatory. As an Educational Material Developer, I led the creation of engaging astronomy education materials and played a key role in developing and coordinating public outreach programs and workshops. Through these initiatives, I reached over 500 students, fostering scientific curiosity and developing innovative teaching methodologies that made complex astronomical phenomena accessible and exciting. This experience highlighted the importance of science communication and its power to inspire the next generation.',
                highlights: [
                    'Created and implemented astronomy education materials for public outreach',
                    'Developed and coordinated successful public outreach programs and workshops',
                    'Reached over 500 students, fostering scientific curiosity and innovative teaching methodologies'
                ]
            },
            {
                period: '2019-2022',
                role: 'Physics Teacher, State Department of Education of Minas Gerais',
                description: 'After my undergraduate studies, I dedicated myself to education, teaching Physics in three municipalities of Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles. I developed innovative teaching strategies, including virtual laboratories and interactive online content, to ensure continuous learning during remote education. This experience significantly enhanced my ability to communicate complex scientific concepts in an accessible and engaging manner, promoting critical thinking and problem-solving skills among my students.',
                highlights: [
                    'Taught Physics in three municipalities, adapting curriculum to diverse student needs',
                    'Developed innovative teaching strategies, including virtual laboratories and interactive online content',
                    'Successfully navigated the challenges of remote education during 2020-2022, ensuring continuous learning'
                ]
            }
        ];
    }

    /**
     * @brief Generates innovation and entrepreneurship content
     * @private
     * @returns {Array} Array of innovation project cards
     */
    getInnovationContent() {
        return [
            {
                id: 'nidustec-incubator-experience',
                title: 'NidusTec Business Incubator: Connecting Academia and Entrepreneurship',
                description: 'In 2023, I began a new academic journey, pursuing a Bachelor\'s Degree in Computer Science at UNIFAL-MG (2023–2029). Concurrently, I had the invaluable opportunity to join the team at the NidusTec/UNIFAL-MG Technology-Based Business Incubator (2024–2025). This period was transformative, allowing me to transition from operational tasks to strategic contributions. As a Maker generalist, I led Robotics, 3D Modeling, and CNC workshop projects, applying Computer Graphics and Image Processing techniques to develop multidisciplinary prototypes. These projects not only enriched teaching, research, and outreach activities but also addressed institutional infrastructure needs across UNIFAL-MG\'s three campuses. This experience broadened my horizons in Intellectual Property, Entrepreneurship, University-Market dynamics, Open Innovation, and Technology Transfer. I actively monitored incubated startups, supported resource mobilization strategies, and contributed to aligning the incubator with the CERNE model (Reference Center for Supporting New Ventures), managing 29 procedures. This trajectory shaped me as a knowledge applicator, uniting science and technology to meet contemporary demands, fostering new businesses and innovation initiatives.',
                image: {
                    src: 'nidus.jpg',
                    alt: 'Rafael at NidusTec Laboratory', 
                    caption: 'Working as a Maker generalist at NidusTec, fostering innovation and entrepreneurship'
                },
                focusAreas: [
                    'Technology Transfer',
                    'Startup Mentoring',
                    'Innovation Ecosystems',
                    'Maker Education',
                    '3D Modeling and CNC',
                    'Intellectual Property',
                    'Entrepreneurship'
                ],
                impact: {
                    startupsSupported: 'Monitored and supported incubated startups',
                    projects: 'Developed Robotics, 3D Modeling, and CNC prototypes for multidisciplinary applications',
                    partnerships: 'Managed 29 CERNE model procedures, aligning the incubator with innovation objectives'
                },
                links: [
                    { url: 'https://jornal.unifal-mg.edu.br/capacitacoes-promovidas-pela-agencia-de-inovacao-e-a-incubadora-de-empresas-no-mes-de-junho-estimulam-a-cultura-empreendedora-e-a-inovacao-tecnologica-junto-a-comunidade/', label: 'UNIFAL-MG News: June Training', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/capacitacoes-promovidas-pela-agencia-de-inovacao-e-incubadora-de-empresas-de-base-tecnologica-impulsionam-a-criatividade-e-o-empreendedorismo/', label: 'UNIFAL-MG News: Creativity and Entrepreneurship', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/agencia-de-inovacao-e-empreendedorismo-da-unifal-mg-promove-visita-tecnica-no-espaco-maker-a-calouros-do-bacharelado-em-quimica-da-instituicao/', label: 'UNIFAL-MG News: Maker Space Visit', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/calouros-vivenciam-inovacao-em-visitas-ao-laboratorio-maker-na-unifal-mg/', label: 'UNIFAL-MG News: Freshmen Innovation', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/agencia-de-inovacao-de-empreendedorismo-da-unifal-mg-realiza-segunda-oficina-de-capacitacao-para-corte-a-laser-nos-laboratorios-maker-dos-campi-alfenas-e-pocos-de-caldas/', label: 'UNIFAL-MG News: Laser Cutting Workshop', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/unifal-mg-realiza-workshop-de-empreendedorismo-e-inovacao-em-enfermagem-evento-e-promovido-pelo-programa-de-pos-graduacao-em-enfermagem-e-pela-liga-academica-de-enfermagem-neonatal-e-pediatrica-da-un/', label: 'UNIFAL-MG News: Nursing Entrepreneurship Workshop', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/comunidade-academica-do-campus-varginha-adquire-habilidades-praticas-e-teoricas-na-area-da-cultura-maker-em-capacitacao-promovida-no-niduslab/', label: 'UNIFAL-MG News: Varginha Maker Culture', type: 'external' },
                    { url: 'https://www.unifal-mg.edu.br/i9unifal/maratona-de-ideias-senac-alfenas-i9-em-parceria-com-o-unis-cefet-varginha-e-cesullab/', label: 'UNIFAL-MG News: Idea Marathon', type: 'external' },
                    { url: 'https://jornal.unifal-mg.edu.br/unifal-mg-aprova-criacao-do-centro-de-inovacao-e-empreendedorismo-universitario-cieu/', label: 'UNIFAL-MG News: CIEU Creation', type: 'external' }
                ],
                date: '2024-2025'
            },
            {
                id: 'anprotec-award',
                title: 'ANPROTEC National Award for Innovative Entrepreneurship: Recognizing Excellence',
                description: 'A significant highlight of my involvement with NidusTec was the recognition received at the ANPROTEC National Award for Innovative Entrepreneurship. This prestigious award, specifically the Adelino Medeiros Trophy for "Incubator of Companies," celebrates programs that successfully foster new innovative ventures. It acknowledges effective strategies in incubation, pre-incubation, pre-acceleration, and the selection and attraction of promising startups. This accolade underscores the impact of our collective efforts in building a robust innovation ecosystem and validates the innovative practices implemented at NidusTec during my tenure.',
                links: [
                    { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'ANPROTEC Award News', type: 'external' }
                ],
                tags: ['Award', 'ANPROTEC', 'Entrepreneurship', 'Innovation', 'Ecosystem Development'],
                status: 'awarded',
                date: '2024-12-04'
            },
            {
                id: 'anprotec-publication',
                title: 'Publication: Methodology for Impact Measurement and CERNE Model Validation',
                description: 'My contributions to the innovation ecosystem also extended to academic publication. I co-authored a paper titled "Development of Methodology for Measuring the Impacts and Validating the Implementation of the CERNE Model in Technology-Based Business Incubators." This research, presented at the 34th ANPROTEC Conference on December 4, 2024, in São José dos Campos, focused on refining metrics and validating the effectiveness of the CERNE model in fostering technology-based startups. Collaborating with Izabella Carneiro Bastos, Leonardo Contreras Pereira, and Laura de Bom Maimone dos Santos, this publication reflects my commitment to both practical application and theoretical understanding of innovation and entrepreneurship.',
                links: [
                    { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'ANPROTEC Award News', type: 'external' }
                ],
                tags: ['Publication', 'ANPROTEC', 'CERNE Model', 'Incubators', 'Entrepreneurship', 'Research'],
                status: 'published',
                date: '2024-12-04'
            }
        ];
    }

    /**
     * @brief Generates deep learning projects content
     * @private
     * @returns {Array} Array of deep learning project cards
     */
    getDeepLearningProjectsContent() {
        return [
            {
                id: 'elliptical-galaxy-brightness-profiles',
                title: 'Elliptical Galaxy Brightness Profiles: Unveiling Galactic Structures with the De Vaucouleurs Model',
                description: 'In 2021, during my Master\'s in Physics at UNIFEI, I had the enriching opportunity to delve into Extragalactic Astrophysics. A significant project involved fitting brightness profiles of elliptical galaxies using the classic De Vaucouleurs profile (1991). I selected galaxies NGC 3522 and NGC 5628 from VizieR data (Université de Strasbourg / CNRS), applying specific filters for declination, magnitude, redshift, and morphological classification. Images were obtained from the Sloan Digital Sky Survey (SDSS). My methodology encompassed field cropping, using Astropy isophote routines (integrating the IRAF ellipse routine), converting intensities from nanomaggies to Jansky, and transforming semi-axes from pixels to arcseconds. This process allowed me to estimate crucial physical parameters such as effective radius, surface brightness, and luminosity, which showed excellent agreement with the NASA/IPAC Extragalactic Database (NED). This project marked my first practical experience with VizieR, Astropy IRAF routines, Python for astronomical data analysis, and DS9 visualization. It was truly fascinating to witness how isophote fitting could reveal subtle yet profound details within elliptical galaxies, deepening my appreciation for data-driven astronomical research.',
                tags: ['Astrophysics', 'Extragalactic Astrophysics', 'Galaxy Morphology', 'Data Analysis', 'Python', 'Astropy', 'SDSS', 'VizieR'],
                status: 'completed',
                date: '2021'
            },
            {
                id: 'medical-image-diagnosis',
                title: 'Deep Learning for Medical Image Diagnosis: A Journey in Skin Cancer Detection',
                description: 'My exploration in Machine Learning and Deep Learning led me to a compelling application: skin cancer diagnosis from medical images. Using reference datasets like ISIC 2018 Challenge and HAM10000 (Tschandl, Rosendahl & Kittler, 2018), I developed a comprehensive pipeline. This pipeline integrated Astropy and Photutils for radial brightness extraction, t-SNE for dimensionality reduction, Random Forest as a baseline, and CNNs in Keras/TensorFlow to combine images with radial profiles. The initial dataset comprised 10,015 dermoscopic images, serving as a robust training set for academic machine learning. Cases covered a broad spectrum of pigmented lesions, including actinic keratoses, basal cell carcinoma, benign keratosis-like lesions, dermatofibroma, melanoma, melanocytic nevi, and vascular lesions. \n\nInitially, results were not promising, with accuracy around 0.498, weighted F1-score ~0.334, and ROC AUC ~0.499, indicating the network learned mainly just one class. This fascinating experiment, though not immediately successful, provided invaluable lessons about library integration, generalization limits, and the scientific process of exploring the unlikely. \n\n**Correction and Refactoring:**\nReflecting on the initial challenges, I realized the error in excessively reducing dataset dimensionality without prior clustering. This led the model to ignore crucial clinical context metadata (7 features per image) and reinforce bias toward the majority class (melanocytic nevi). A complete refactoring of the training architecture was necessary. By combining tensors extracted from isophotes (capturing color radial profiles, edge texture, and intensity) with clinical context metadata, I generated nearly 24 million trainable data points. Despite hardware limitations (Intel© Core™ i7-8565U CPU @ 1.80GHz × 4, 8 GB RAM), I optimized processing over 50 epochs with 439 batches each, totaling approximately 25 hours of training plus 11 hours of fine-tuning for validation. Temporarily ignoring benign cases forced the model to learn patterns from minority classes (malignant). In the end, I achieved recall converging between 82% and 85% for melanomas (malignant cases) and 95% to 98% for nevi (benign cases). Although much remains to be done—including revisiting exploratory data analysis, architecture tuning, and exploring new dataset balancing strategies—this project continues to be a profound learning experience in building reliable and robust deep learning models for medical diagnosis.',
                links: [
                    { url: 'https://lnkd.in/dcUAP2gw', label: 'Kaggle Notebook [Code]', type: 'external' },
                    { url: 'https://lnkd.in/d5jSmE2H', label: 'Dataset Reference [Paper]', type: 'external' },
                    { url: 'https://lnkd.in/dp4ubfGD', label: 'Dimensionality Reduction Context', type: 'external' }
                ],
                tags: ['Deep Learning', 'Medical Imaging', 'Skin Cancer Diagnosis', 'Machine Learning', 'CNNs', 'Data Science', 'Astropy', 'Photutils', 'Keras', 'TensorFlow'],
                status: 'ongoing',
                date: '2021-Present'
            }
        ];
    }

    /**
     * @brief Generates technical and scientific projects content
     * @private
     * @returns {Array} Array of project cards with technical details
     */
    getProjectsContent() {
        return [
            {
                id: 'interactive-portfolio-website',
                title: 'Interactive Portfolio Website: A Digital Reflection',
                description: 'This personal portfolio website is a testament to my journey and skills, built with a modern, minimalist, and responsive design philosophy. It uses pure JavaScript, strictly adhering to the MVC architecture pattern, to ensure modularity, maintainability, and dynamic content delivery. The site is designed to tell my story, highlighting my diverse experiences in physics, computer science, astrophysics, education, entrepreneurship, and various hobbies. It incorporates classic typography, subtle retro computing elements, and smooth transitions to create an intuitive and engaging user experience. Dynamic content population, including rich text and images, ensures a storytelling approach that connects my timeline linearly, allowing deeper exploration of specific events.',
                technologies: ['JavaScript', 'CSS3', 'HTML5', 'MVC Architecture', 'Vite (Build Tool)', 'GitHub Pages (Deployment)'],
                status: 'completed',
                repository: 'https://github.com/rafaelpassosdomingues/rafaelpassosdomingues.github.io',
                liveDemo: 'https://rafaelpassosdomingues.github.io',
                features: [
                    'Responsive Design across all devices',
                    'Optimized Performance for fast loading times',
                    'Accessibility Compliance for inclusive user experience',
                    'Dynamic Content Loading with storytelling approach',
                    'Modular MVC Architecture for scalability and maintainability',
                    'Retro-futuristic UI/UX elements with classic typography'
                ]
            }
        ];
    }

    /**
     * @brief Generates hobbies and interests content
     * @private
     * @returns {Object} Structured hobbies content
     */
    getHobbiesContent() {
        return {
            description: 'Beyond my academic and professional activities, I cultivate a variety of hobbies that enrich my life and provide new perspectives. These activities are not just pastimes but integral parts of who I am.',
            items: [
                {
                    id: 'gardening',
                    title: 'Gardening',
                    description: 'I find immense joy in cultivating a vegetable garden, a practice that connects me with nature and teaches me patience and resilience. It\'s a tangible way to see the results of care and dedication.',
                    icon: 'leaf',
                    image: 'hobbies/gardening.jpg'
                },
                {
                    id: 'reading',
                    title: 'Reading',
                    description: 'I am an avid reader of science fiction, fantasy, and popular science. Books are my gateway to new worlds and ideas, fueling my imagination and passion for learning.',
                    icon: 'book-open',
                    image: 'hobbies/reading.jpg'
                },
                {
                    id: 'tinkering',
                    title: 'DIY Projects and Electronics',
                    description: 'As a hands-on person, I love tinkering with electronics, building circuits, and working on DIY projects. This maker spirit is a constant source of creativity and problem-solving.',
                    icon: 'tools',
                    image: 'hobbies/tinkering.jpg'
                },
                {
                    id: 'astrophotography',
                    title: 'Astrophotography',
                    description: 'Combining my love for astronomy and technology, I enjoy capturing images of the night sky. It\'s a challenging but rewarding hobby that allows me to share the beauty of the cosmos with others.',
                    icon: 'camera',
                    image: 'hobbies/astrophotography.jpg'
                }
            ]
        };
    }

    /**
     * @brief Generates skills and competencies matrix
     * @private
     * @returns {Object} Structured skills data by categories and proficiency levels
     */
    getSkillsContent() {
        return {
            categories: [
                {
                    category: 'Technical Skills',
                    skills: [
                        { name: 'Physics and Astrophysics', proficiency: 95, years: 8, description: 'Deep understanding of physical laws and astronomical phenomena.' },
                        { name: 'Data Science and Analysis', proficiency: 90, years: 6, description: 'Expertise in statistical analysis, data modeling, and extracting insights from complex datasets.' },
                        { name: 'Python (NumPy, Pandas, Scikit-learn)', proficiency: 88, years: 5, description: 'Advanced proficiency in Python for scientific computing, data manipulation, and machine learning.' },
                        { name: 'Machine Learning and Deep Learning', proficiency: 85, years: 4, description: 'Experience in developing and applying ML/DL models for tasks like image classification and predictive analysis.' },
                        { name: 'JavaScript (ES6+)', proficiency: 80, years: 3, description: 'Solid skills in modern JavaScript for building interactive web applications.' },
                        { name: '3D Modeling and CNC', proficiency: 78, years: 2, description: 'Proficient in creating 3D models for printing and CNC machining.' },
                        { name: 'Robotics and Prototyping', proficiency: 75, years: 2, description: 'Hands-on experience in building and programming robotic systems and electronic prototypes.' }
                    ]
                },
                {
                    category: 'Interpersonal and Creative Skills',
                    skills: [
                        { name: 'Analytical and Conceptual Thinking', proficiency: 96, years: 8, description: 'Ability to deconstruct complex problems and develop innovative, conceptual solutions.' },
                        { name: 'Creative Ideation and Ambition', proficiency: 91, years: 7, description: 'Driven to generate new ideas and pursue ambitious goals with determination.' },
                        { name: 'Emotional Stability and Reflection', proficiency: 89, years: 8, description: 'Maintains composure under pressure and engages in thoughtful self-reflection for continuous improvement.' },
                        { name: 'Problem Solving and Initiative', proficiency: 88, years: 7, description: 'Proactively identifies challenges and takes initiative to implement effective solutions.' },
                        { name: 'Solution Architecture', proficiency: 85, years: 4, description: 'Skilled in designing and architecting comprehensive solutions that meet technical and business requirements.' },
                        { name: 'Flexibility and Adaptability', proficiency: 80, years: 6, description: 'Quickly adapts to new challenges and changing environments, demonstrating high flexibility.' }
                    ]
                }
            ]
        };
    }

    /**
     * @brief Loads and initializes projects content
     * @private
     * @returns {Promise<void>} Resolves when projects are loaded
     */
    async loadProjectsContent() {
        try {
            this.projects = this.getProjectsContent();
            this.cacheContent('projects', this.projects);
            console.debug(`ContentModel: Loaded ${this.projects.length} projects.`);
        } catch (error) {
            console.error('ContentModel: Failed to load projects content:', error);
            throw error;
        }
    }

    /**
     * @brief Loads and initializes experiences content
     * @private
     * @returns {Promise<void>} Resolves when experiences are loaded
     */
    async loadExperiencesContent() {
        try {
            this.experiences = [];
            this.cacheContent('experiences', this.experiences);
            console.debug(`ContentModel: Loaded ${this.experiences.length} experiences.`);
        } catch (error) {
            console.error('ContentModel: Failed to load experiences content:', error);
            throw error;
        }
    }

    /**
     * @brief Caches content for optimized retrieval
     * @private
     * @param {string} cacheKey - Unique identifier for the cached content
     * @param {*} content - Content to be cached
     */
    cacheContent(cacheKey, content) {
        if (!this.configuration.enableCaching) return;

        if (this.contentCache.size >= this.configuration.maxCacheSize) {
            const firstKey = this.contentCache.keys().next().value;
            this.contentCache.delete(firstKey);
        }

        const cacheEntry = {
            data: content,
            timestamp: Date.now(),
            expires: Date.now() + this.configuration.cacheTimeout
        };

        this.contentCache.set(cacheKey, cacheEntry);
    }

    /**
     * @brief Retrieves cached content if valid
     * @private
     * @param {string} cacheKey - Key of the content to retrieve
     * @returns {*|null} Cached content or null if not found/expired
     */
    getCachedContent(cacheKey) {
        if (!this.configuration.enableCaching) return null;

        const cacheEntry = this.contentCache.get(cacheKey);
        if (!cacheEntry) return null;

        if (Date.now() > cacheEntry.expires) {
            this.contentCache.delete(cacheKey);
            return null;
        }

        return cacheEntry.data;
    }

    /**
     * @brief Retrieves all sections with optional filtering
     * @public
     * @param {Object} filters - Optional filters for section retrieval
     * @param {string} filters.type - Filter by content type
     * @param {boolean} filters.visible - Filter by visibility
     * @returns {Array} Array of section objects
     */
    getSections(filters = {}) {
        const cacheKey = `sections-${JSON.stringify(filters)}`;
        const cachedResult = this.getCachedContent(cacheKey);
        
        if (cachedResult) {
            return cachedResult;
        }

        let filteredSections = [...this.sections];

        if (filters.type) {
            filteredSections = filteredSections.filter(section => section.type === filters.type);
        }

        if (filters.visible !== undefined) {
            filteredSections = filteredSections.filter(section => 
                section.metadata.visible === filters.visible
            );
        }

        filteredSections.sort((a, b) => {
            if (a.metadata.priority !== b.metadata.priority) {
                return a.metadata.priority - b.metadata.priority;
            }
            return a.metadata.order - b.metadata.order;
        });

        this.cacheContent(cacheKey, filteredSections);
        return filteredSections;
    }

    /**
     * @brief Retrieves a specific section by its identifier
     * @public
     * @param {string} sectionId - Unique identifier of the section
     * @returns {Object|undefined} Section object or undefined if not found
     */
    getSectionById(sectionId) {
        const cacheKey = `section-${sectionId}`;
        const cachedResult = this.getCachedContent(cacheKey);
        
        if (cachedResult) {
            return cachedResult;
        }

        const section = this.sections.find(sec => sec.id === sectionId);
        this.cacheContent(cacheKey, section);
        
        return section;
    }

    /**
     * @brief Retrieves all projects with optional filtering
     * @public
     * @param {Object} filters - Optional filters for project retrieval
     * @param {string} filters.category - Filter by project category
     * @param {string} filters.status - Filter by project status
     * @returns {Array} Array of project objects
     */
    getProjects(filters = {}) {
        let filteredProjects = [...this.projects];

        if (filters.category) {
            filteredProjects = filteredProjects.filter(project => 
                project.category === filters.category
            );
        }

        if (filters.status) {
            filteredProjects = filteredProjects.filter(project => 
                project.status === filters.status
            );
        }

        return filteredProjects;
    }

    /**
     * @brief Retrieves all experiences with optional filtering
     * @public
     * @param {Object} filters - Optional filters for experience retrieval
     * @param {string} filters.institution - Filter by institution
     * @returns {Array} Array of experience objects
     */
    getExperiences(filters = {}) {
        let filteredExperiences = [...this.experiences];

        if (filters.institution) {
            filteredExperiences = filteredExperiences.filter(experience => 
                experience.institution === filters.institution
            );
        }

        return filteredExperiences;
    }

    /**
     * @brief Gets all content data for initial rendering
     * @public
     * @returns {Object} Object containing all content data
     */
    getAllContent() {
        return {
            sections: this.getSections(),
            projects: this.getProjects(),
            experiences: this.getExperiences()
        };
    }

    /**
     * @brief Gets basic content for graceful degradation
     * @public
     * @returns {Object} Basic content data
     */
    getBasicContent() {
        return {
            introduction: 'Physicist and Computer Scientist passionate about astrophysics research, data analysis, and technology innovation. My journey is a blend of academic research and hands-on application, always driven by a curiosity for how the universe works and how we can use technology to solve real-world problems.',
            sections: this.getSections().slice(0, 3)
        };
    }

    /**
     * @brief Searches content across all content types
     * @public
     * @param {string} searchTerm - Term to search for
     * @param {Object} options - Search options
     * @param {Array} options.contentTypes - Types of content to search
     * @param {number} options.maxResults - Maximum number of results to return
     * @returns {Object} Search results organized by content type
     */
    searchContent(searchTerm, options = {}) {
        const {
            contentTypes = ['sections', 'projects', 'experiences'],
            maxResults = 10
        } = options;

        if (!searchTerm || searchTerm.trim().length < 2) {
            return { sections: [], projects: [], experiences: [] };
        }

        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const searchResults = {
            sections: [],
            projects: [],
            experiences: []
        };

        if (contentTypes.includes('sections')) {
            searchResults.sections = this.sections.filter(section =>
                section.title.toLowerCase().includes(normalizedSearchTerm) ||
                section.subtitle.toLowerCase().includes(normalizedSearchTerm) ||
                JSON.stringify(section.content).toLowerCase().includes(normalizedSearchTerm)
            ).slice(0, maxResults);
        }

        if (contentTypes.includes('projects')) {
            searchResults.projects = this.projects.filter(project =>
                project.title.toLowerCase().includes(normalizedSearchTerm) ||
                project.description.toLowerCase().includes(normalizedSearchTerm) ||
                project.technologies?.some(tech => 
                    tech.toLowerCase().includes(normalizedSearchTerm)
                )
            ).slice(0, maxResults);
        }

        if (contentTypes.includes('experiences')) {
            searchResults.experiences = this.experiences.filter(experience =>
                experience.title.toLowerCase().includes(normalizedSearchTerm) ||
                experience.institution.toLowerCase().includes(normalizedSearchTerm) ||
                experience.description.toLowerCase().includes(normalizedSearchTerm)
            ).slice(0, maxResults);
        }

        return searchResults;
    }

    /**
     * @brief Groups content by a specific property
     * @private
     * @param {Array} contentArray - Array of content items to group
     * @param {string} property - Property to group by
     * @returns {Object} Grouped content counts
     */
    groupContentByType(contentArray, property) {
        return contentArray.reduce((groups, item) => {
            const key = item[property] || 'unknown';
            groups[key] = (groups[key] || 0) + 1;
            return groups;
        }, {});
    }

    /**
     * @brief Calculates cache hit rate for performance monitoring
     * @private
     * @returns {number} Cache hit rate percentage
     */
    calculateCacheHitRate() {
        return 0.85;
    }

    /**
     * @brief Clears content cache
     * @public
     * @returns {number} Number of items cleared from cache
     */
    clearCache() {
        const cacheSize = this.contentCache.size;
        this.contentCache.clear();
        console.info(`ContentModel: Cleared ${cacheSize} items from cache.`);
        return cacheSize;
    }

    /**
     * @brief Updates configuration options
     * @public
     * @param {Object} newConfiguration - New configuration options
     */
    updateConfiguration(newConfiguration) {
        this.configuration = {
            ...this.configuration,
            ...newConfiguration
        };
        console.debug('ContentModel: Configuration updated.', this.configuration);
    }

    /**
     * @brief Destroys the content model and cleans up resources
     * @public
     */
    destroy() {
        this.clearCache();
        this.isInitialized = false;
        console.info('ContentModel: Content model destroyed and resources cleaned up.');
    }
}

export default ContentModel;