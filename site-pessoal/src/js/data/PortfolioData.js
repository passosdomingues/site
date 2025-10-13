/**
 * @file PortfolioData.js
 * @author Rafael Passos Domingues
 * @brief Centralized content data for the portfolio website sections.
 * @description Contains all static content including detailed professional journey,
 * research projects, innovation initiatives, and educational experiences.
 */

export const PORTFOLIO_DATA = {
    sections: [
        {
            id: 'about',
            type: 'timeline',
            title: 'About Me',
            subtitle: 'An Interdisciplinary Journey in Science and Technology',
            metadata: { 
                visible: true, 
                order: 1,
                priority: 1,
                icon: 'atom',
                backgroundColor: 'var(--color-surface)'
            },
            content: {
                introduction: 'Physicist and Computer Scientist passionate about astrophysics research, data analysis, and technological innovation. My journey is a blend of academic research and practical application, always driven by curiosity about how the universe works and how we can use technology to solve real-world problems.',
                timeline: [
                    { 
                        period: '2014-2018', 
                        title: "Bachelor's Degree in Physics, UNIFAL-MG", 
                        description: 'My academic journey began with a Bachelor\'s Degree in Physics at UNIFAL-MG. During this period, I immersed myself in the fascinating world of Galactic and Extragalactic Astrophysics, participating in research and contributing to scientific outreach at the UNIFAL-MG Astronomical Observatory. This experience ignited my passion for understanding the cosmos and communicating complex scientific concepts.',
                        highlights: ['Galactic and Extragalactic Astrophysics', 'Scientific Outreach', 'Astronomical Observation'] 
                    },
                    { 
                        period: '2019-2022', 
                        title: 'Physics Teacher, State Dept. of Education of MG', 
                        description: 'After graduation, I dedicated myself to education, teaching Physics in three municipalities of Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles.',
                        highlights: ['Science Education', 'Experimental Physics', 'Pedagogical Innovation'] 
                    },
                    { 
                        period: '2021-2023', 
                        title: "Master's Degree in Physics, UNIFEI", 
                        description: 'My Master\'s in Physics at UNIFEI focused on Active Galactic Nuclei, a field where I developed a deep appreciation for data analysis. This research experience solidified my interest in extracting insights from complex datasets, laying the foundation for my future ventures in data science.',
                        highlights: ['AGN Research', 'Advanced Data Analysis', 'Scientific Computing'] 
                    },
                    { 
                        period: '2023-Present', 
                        title: "Bachelor's Degree in Computer Science, UNIFAL-MG", 
                        description: 'In 2023, I embarked on a new academic path, pursuing a Bachelor\'s Degree in Computer Science at UNIFAL-MG. This transition reflects my commitment to bridging the gap between theoretical physics and practical technological solutions. Concurrently, I joined the NidusTec/UNIFAL-MG Technology-Based Business Incubator, connecting academia with the market and fostering innovation.',
                        highlights: ['Software Development', 'Data Science', 'Machine Learning', 'Academia-Industry Connection'] 
                    },
                    { 
                        period: '2024-2025', 
                        title: 'Innovation Educator, NidusTec/UNIFAL-MG', 
                        description: 'At NidusTec, I embraced the role of Maker Educator, leading robotics, 3D modeling, and CNC workshop projects. This experience allowed me to apply computer graphics and image processing techniques in multidisciplinary prototypes, addressing institutional infrastructure needs and exploring research in Innovation, Entrepreneurship, Production Engineering, and Industry 4.0. I developed MVPs with market potential, demonstrating my ability to transform ideas into tangible solutions.',
                        highlights: ['Entrepreneurship', 'Technology Transfer', 'Maker Education', '3D Modeling and CNC', 'Robotics', 'Innovation Management'] 
                    }
                ],
                currentFocus: 'Currently, I am a Computer Science student, specializing in image processing and computer graphics. My focus is on applying my knowledge in multidisciplinary interfaces that combine Machine Learning, Deep Learning, Natural Language Processing (NLP), Convolutional Neural Networks (CNNs), and Large Language Models (LLMs), with a keen interest in exploring their integration with Smart Contracts and blockchain technologies.',
                reflection: 'My journey, seemingly disparate at first glance, is a testament to the power of interdisciplinary thinking. The convergence of physics, astrophysics, education, and computer science has equipped me with a unique perspective. I see myself not just as a Physicist or a Developer, but as a problem-solver who leverages diverse knowledge to create impactful solutions. This trajectory has shaped me into an applicator of knowledge, constantly seeking to unite science and technology to meet the evolving demands of the world.',
                summary: 'My journey is a testament to interdisciplinary thinking. The convergence of physics, astrophysics, education, and computer science has equipped me with a unique perspective to leverage diverse knowledge and create impactful solutions.'
            }
        },
        {
            id: 'astrophysics-research',
            type: 'cards',
            title: 'Astrophysics Research',
            subtitle: 'Exploring the Cosmos from Dark Matter to Solar Flares',
            metadata: { 
                visible: true, 
                order: 2,
                priority: 2,
                icon: 'galaxy',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: [
                {
                    id: 'dark-matter-research',
                    title: 'Unveiling the Invisible: My Journey in Dark Matter Research',
                    description: 'My research in Dark Matter began with a deep dive into galactic rotation curves. The anomalous velocities of stars in galactic halos presented a profound enigma: either the laws of gravity needed revision, or a vast amount of invisible matter was at play. This led me to explore the concept of Dark Matter, a mysterious substance that interacts gravitationally but not electromagnetically. A crucial moment in my understanding came from studying the Bullet Cluster, a cosmic collision where gravitational lensing revealed a mass distribution far greater than visible matter. The separation of ordinary and dark matter during this collision provided compelling visual evidence for the existence of Dark Matter. I had the privilege of presenting these findings at the First Cycle of Astronomy Seminars at UNIFAL-MG, transforming years of observation into theoretical rigor and sharing the frontiers of cosmology with a captivated audience.',
                    image: { 
                        src: 'public/images/bullet-cluster-black-matter_upscayl.png', 
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
                    description: 'This image captures a significant moment: a lecture I delivered at the First Cycle of Astronomy Seminars at UNIFAL-MG. My presentation focused on Stellar Orbits in the Galaxy, where I shared simulations of stellar movements based on mass distribution models and numerical solutions for stellar accelerations, velocities, and positions in the Milky Way. I discussed the evidence that led to the postulates of Dark Matter and Modified Gravity, particularly highlighting the Rotation Curves of galaxies.',
                    image: { 
                        src: 'public/images/seminario.jpg', 
                        alt: 'Astronomy seminar presentation on stellar orbits and dark matter',
                        caption: 'Presentation on Stellar Orbits and Dark Matter at UNIFAL-MG Seminar (2019)'
                    },
                    tags: ['Scientific Outreach', 'Academic Events', 'Stellar Dynamics', 'Dark Matter', 'Public Speaking'],
                    status: 'completed',
                    date: '2019-11-20'
                },
                {
                    id: 'ccc-tl-cosmology',
                    title: 'Exploring Alternative Cosmologies: CCC+TL and Baryon Acoustic Oscillations',
                    description: 'Beyond Dark Matter, my curiosity extends to alternative cosmological models. A recent study in "The Astrophysical Journal" on "Testing CCC+TL Cosmology with Baryon Acoustic Oscillation Features" offers a fascinating perspective. It proposes that the universe\'s forces weaken as it expands, creating an illusion of dark energy driving accelerated expansion. On galactic scales, this variation in forces within gravitationally bound systems could explain the "extra gravity" attributed to dark matter.',
                    links: [
                        { url: 'https://lnkd.in/dwsKCSbM', label: 'The Astrophysical Journal Publication', type: 'external' }
                    ],
                    tags: ['Cosmology', 'Dark Energy', 'Dark Matter', 'Baryon Acoustic Oscillation', 'Theoretical Physics'],
                    status: 'published',
                    date: '2024-01-01'
                }
            ]
        },
        {
            id: 'astronomical-observatory',
            type: 'gallery',
            title: 'Astronomical Observatory',
            subtitle: 'Scientific outreach and research at UNIFAL-MG',
            metadata: { 
                visible: true, 
                order: 3,
                priority: 2,
                icon: 'telescope-outline',
                backgroundColor: 'var(--color-surface)'
            },
            content: [
                {
                    id: 'unifal-observatory-outreach',
                    title: 'A Window to the Universe: Scientific Outreach and Research at UNIFAL-MG',
                    description: 'During my time as a member of the UNIFAL-MG Astronomical Observatory team (2015 to 2018), I had the privilege of connecting over 2,000 visitors from Alfenas and the surrounding region to the wonders of the cosmos. As a science communicator, I used our magnificent 380mm Cassegrain telescope to reveal the impressive craters of the Moon, the majestic rings of Saturn, the Galilean moons of Jupiter, and the beauty of star clusters. These experiences, shared with colleagues like José Carlos da Silva and Professor Artur Justiniano, reinforced my belief in open science and non-formal education.',
                    image: { 
                        src: 'public/images/observatorio-unifal.jpg', 
                        alt: 'UNIFAL-MG Astronomical Observatory with a Cassegrain telescope',
                        caption: 'UNIFAL-MG Astronomical Observatory: Inspiring the next generation of scientists'
                    },
                    tags: ['Scientific Outreach', 'Astronomy', 'Public Engagement', 'Cassegrain Telescope'],
                    status: 'completed',
                    date: '2018-12-01'
                },
                {
                    id: 'observatory-astrophotography',
                    title: 'Astrophotography and Exoplanet Research at UNIFAL-MG Observatory',
                    description: 'Beyond public outreach, the UNIFAL-MG Observatory was a center for research and astrophotography. I witnessed and contributed to significant achievements, including the pioneering work of my colleague José Carlos in detecting the transit of exoplanet WASP-76b. My own efforts in astrophotography led me to capture impressive images, such as the Sombrero Galaxy (M104/NGC 4594) in a 34-minute exposure and the spiral arms of the Southern Pinwheel Galaxy (M83/NGC 5236).',
                    images: [
                        { 
                            src: 'obsLua.jpg', 
                            alt: 'Moon observation', 
                            caption: 'Detailed view of the Moon captured at UNIFAL-MG Observatory' 
                        },
                        { 
                            src: 'public/images/obsGalaxiaSombrero.jpg', 
                            alt: 'Sombrero Galaxy', 
                            caption: 'Sombrero Galaxy (M104/NGC 4594) captured through astrophotography' 
                        }
                    ],
                    highlights: [
                        'Contribution to exoplanet transit detection (WASP-76b)',
                        'Deep-sky object astrophotography (Sombrero Galaxy, Southern Pinwheel Galaxy)',
                        'Conducted practical astronomy classes and observed Comet C/2020 F3 (NEOWISE)'
                    ],
                    date: '2015-2020'
                }
            ]
        },
        {
            id: 'craam-visit',
            type: 'gallery',
            title: 'CRAAM Visit',
            subtitle: 'Mackenzie Center for Radioastronomy and Astrophysics',
            metadata: { 
                visible: true, 
                order: 4,
                priority: 3,
                icon: 'satellite-dish',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: [
                {
                    id: 'craam-radio-polarimeter',
                    title: 'Exploring Solar Radio Astronomy at CRAAM: A Deep Dive into Instrumentation',
                    description: 'In 2019, shortly after completing my Physics degree at UNIFAL-MG, I had the distinct honor of visiting CRAAM (Mackenzie Center for Radio Astronomy and Astrophysics). The highlight was the opportunity to learn and operate the 7 GHz Solar Radio Polarimeter, a critical instrument for monitoring our host star. Guided by colleague Raphael Cesar Pimenta and engineer Amauri Shossei Kudaka, I gained invaluable insights into the intricate electronic and computational systems that process solar data.',
                    images: [
                        { 
                            src: 'public/images/craamAntena.jpg', 
                            alt: 'Solar Radio Polarimeter antenna at CRAAM', 
                            caption: '7 GHz Solar Radio Polarimeter (CRAAM)' 
                        },
                        { 
                            src: 'public/images/craamControle.jpg', 
                            alt: 'CRAAM control room', 
                            caption: 'CRAAM Control Room: Inspecting electronic and computational systems' 
                        },
                        { 
                            src: 'public/images/craamDomo.jpg', 
                            alt: 'Inside CRAAM dome', 
                            caption: 'Inside CRAAM Dome: 1.5-meter antenna' 
                        }
                    ],
                    highlights: [
                        'Operated the 7 GHz Solar Radio Polarimeter',
                        'Gained insights into solar activity monitoring and magnetic property analysis',
                        'Explored complex data acquisition and processing in radio astronomy'
                    ],
                    date: '2019'
                }
            ]
        },
        {
            id: 'lna-zeiss-telescope',
            type: 'gallery',
            title: 'LNA Zeiss Telescope Experience',
            subtitle: 'Operating a classic instrument at Pico dos Dias Observatory',
            metadata: { 
                visible: true, 
                order: 5,
                priority: 3,
                icon: 'telescope-solid',
                backgroundColor: 'var(--color-surface)'
            },
            content: [
                {
                    id: 'lna-zeiss-operation',
                    title: 'Operating the Historic Zeiss Telescope at LNA: A Journey Through Time and Science',
                    description: 'During my Physics course at UNIFAL-MG (2014-2018), I had the extraordinary opportunity to operate, for two nights in 2016, a truly special instrument at the National Astrophysics Laboratory (LNA/OPD). This was a historic Zeiss, acquired from former East Germany in the 1960s/70s through fascinating negotiations involving coffee. This classic Cassegrain telescope, with its parabolic primary and hyperbolic secondary, features an f/12.5 focal ratio and requires manual pointing.',
                    images: [
                        { 
                            src: 'public/images/obs4.jpg', 
                            alt: 'LNA Observatory at sunset', 
                            caption: 'Pico dos Dias Observatory (LNA) at sunset, a serene setting for scientific discovery' 
                        },
                        { 
                            src: 'public/images/obs5.jpg', 
                            alt: 'Aerial view of LNA Observatory', 
                            caption: 'Aerial view of National Astrophysics Laboratory (LNA), showing its impressive infrastructure' 
                        }
                    ],
                    highlights: [
                        'Operated a historic Zeiss Cassegrain telescope for photometry and polarimetry',
                        'Gained practical experience in astronomical data collection and instrument calibration',
                        'Immersion in the scientific legacy of one of Brazil\'s leading observatories'
                    ],
                    date: '2016'
                }
            ]
        },
        {
            id: 'education-experience',
            type: 'timeline',
            title: 'Education Experience',
            subtitle: 'Teaching and educational material development',
            metadata: { 
                visible: true, 
                order: 6,
                priority: 2,
                icon: 'graduation-hat',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: {
                timeline: [
                    {
                        period: '2016-2018',
                        title: 'Teaching Assistant, Physics Department at UNIFAL-MG',
                        description: 'During my undergraduate studies, I served as a Teaching Assistant in the Physics Department at UNIFAL-MG. This role was fundamental to the development of my pedagogical skills, as I was responsible for laboratory instruction for undergraduate physics courses, developing experimental protocols, and providing mentoring and academic support to students.',
                        highlights: [
                            'Provided laboratory instruction and academic support to undergraduate physics students',
                            'Developed and refined experimental protocols for physics courses',
                            'Mentored students, promoting deeper understanding of scientific concepts'
                        ]
                    },
                    {
                        period: '2017-2018',
                        title: 'Educational Material Developer, UNIFAL-MG Astronomical Observatory',
                        description: 'My passion for astronomy extended to educational outreach at the UNIFAL-MG Astronomical Observatory. As an Educational Material Developer, I led the creation of engaging astronomy education materials and played a key role in developing and coordinating public outreach programs and workshops.',
                        highlights: [
                            'Created and implemented astronomy education materials for public outreach',
                            'Developed and coordinated successful public outreach programs and workshops',
                            'Reached over 500 students, fostering scientific curiosity and innovative teaching methodologies'
                        ]
                    },
                    {
                        period: '2019-2022',
                        title: 'Physics Teacher, State Department of Education of Minas Gerais',
                        description: 'After my undergraduate studies, I dedicated myself to education, teaching Physics in three municipalities of Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles.',
                        highlights: [
                            'Taught Physics in three municipalities, adapting curriculum to diverse student needs',
                            'Developed innovative teaching strategies, including virtual laboratories and interactive online content',
                            'Successfully navigated the challenges of remote education during 2020-2022, ensuring continuous learning'
                        ]
                    }
                ]
            }
        },
        {
            id: 'innovation-entrepreneurship',
            type: 'cards',
            title: 'Innovation & Entrepreneurship',
            subtitle: 'Connecting Academia with the Market at NidusTec Incubator',
            metadata: { 
                visible: true, 
                order: 7,
                priority: 2,
                icon: 'idea',
                backgroundColor: 'var(--color-surface)'
            },
            content: [
                {
                    id: 'nidustec-incubator-experience',
                    title: 'NidusTec Business Incubator: Connecting Academia and Entrepreneurship',
                    description: 'In 2023, I began a new academic journey, pursuing a Bachelor\'s Degree in Computer Science at UNIFAL-MG (2023–2029). Concurrently, I had the invaluable opportunity to join the team at the NidusTec/UNIFAL-MG Technology-Based Business Incubator (2024–2025). This period was transformative, allowing me to transition from operational tasks to strategic contributions. As a Maker generalist, I led Robotics, 3D Modeling, and CNC workshop projects, applying Computer Graphics and Image Processing techniques to develop multidisciplinary prototypes.',
                    image: { 
                        src: 'public/images/nidus.jpg', 
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
                        { url: 'https://jornal.unifal-mg.edu.br/capacitacoes-promovidas-pela-agencia-de-inovacao-e-a-incubadora-de-empresas-no-mes-de-junho-estimulam-a-cultura-empreendedora-e-a-inovacao-tecnologica-junto-a-comunidade/', label: 'UNIFAL-MG News: June Training', type: 'external' }
                    ],
                    date: '2024-2025'
                },
                {
                    id: 'anprotec-award',
                    title: 'ANPROTEC National Award for Innovative Entrepreneurship: Recognizing Excellence',
                    description: 'A significant highlight of my involvement with NidusTec was the recognition received at the ANPROTEC National Award for Innovative Entrepreneurship. This prestigious award, specifically the Adelino Medeiros Trophy for "Incubator of Companies," celebrates programs that successfully foster new innovative ventures.',
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
                    description: 'My contributions to the innovation ecosystem also extended to academic publication. I co-authored a paper titled "Development of Methodology for Measuring the Impacts and Validating the Implementation of the CERNE Model in Technology-Based Business Incubators." This research, presented at the 34th ANPROTEC Conference, focused on refining metrics and validating the effectiveness of the CERNE model.',
                    links: [
                        { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'ANPROTEC Award News', type: 'external' }
                    ],
                    tags: ['Publication', 'ANPROTEC', 'CERNE Model', 'Incubators', 'Entrepreneurship', 'Research'],
                    status: 'published',
                    date: '2024-12-04'
                }
            ]
        },
        {
            id: 'deep-learning-projects',
            type: 'cards',
            title: 'Deep Learning Projects',
            subtitle: 'Applying ML/DL to medical imaging and astrophysics',
            metadata: { 
                visible: true, 
                order: 8,
                priority: 1,
                icon: 'brain-outline',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: [
                {
                    id: 'elliptical-galaxy-brightness-profiles',
                    title: 'Elliptical Galaxy Brightness Profiles: Unveiling Galactic Structures with the De Vaucouleurs Model',
                    description: 'In 2021, during my Master\'s in Physics at UNIFEI, I had the enriching opportunity to delve into Extragalactic Astrophysics. A significant project involved fitting brightness profiles of elliptical galaxies using the classic De Vaucouleurs profile (1991). I selected galaxies NGC 3522 and NGC 5628 from VizieR data, applying specific filters for declination, magnitude, redshift, and morphological classification.',
                    tags: ['Astrophysics', 'Extragalactic Astrophysics', 'Galaxy Morphology', 'Data Analysis', 'Python', 'Astropy', 'SDSS', 'VizieR'],
                    status: 'completed',
                    date: '2021'
                },
                {
                    id: 'medical-image-diagnosis',
                    title: 'Deep Learning for Medical Image Diagnosis: A Journey in Skin Cancer Detection',
                    description: 'My exploration in Machine Learning and Deep Learning led me to a compelling application: skin cancer diagnosis from medical images. Using reference datasets like ISIC 2018 Challenge and HAM10000, I developed a comprehensive pipeline integrating Astropy and Photutils for radial brightness extraction, t-SNE for dimensionality reduction, Random Forest as a baseline, and CNNs in Keras/TensorFlow.',
                    links: [
                        { url: 'https://lnkd.in/dcUAP2gw', label: 'Kaggle Notebook [Code]', type: 'external' },
                        { url: 'https://lnkd.in/d5jSmE2H', label: 'Dataset Reference [Paper]', type: 'external' }
                    ],
                    tags: ['Deep Learning', 'Medical Imaging', 'Skin Cancer Diagnosis', 'Machine Learning', 'CNNs', 'Data Science', 'Astropy', 'Photutils', 'Keras', 'TensorFlow'],
                    status: 'ongoing',
                    date: '2021-Present'
                }
            ]
        },
        {
            id: 'skills',
            type: 'skills',
            title: 'Skills and Competencies',
            subtitle: 'Knowledge areas and technologies',
            metadata: { 
                visible: true, 
                order: 9,
                priority: 2,
                icon: 'gears',
                backgroundColor: 'var(--color-surface)'
            },
            content: {
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
            }
        },
        {
            id: 'hobbies',
            type: 'cards',
            title: 'Hobbies and Interests',
            subtitle: 'Activities that inspire and recharge me',
            metadata: { 
                visible: true, 
                order: 10,
                priority: 4,
                icon: 'puzzle-piece',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: {
                description: 'Beyond my academic and professional activities, I cultivate a variety of hobbies that enrich my life and provide new perspectives. These activities are not just pastimes but integral parts of who I am.',
                items: [
                    {
                        id: 'gardening',
                        title: 'Gardening',
                        description: 'I find immense joy in cultivating a vegetable garden, a practice that connects me with nature and teaches me patience and resilience. It\'s a tangible way to see the results of care and dedication.',
                        icon: 'leaf',
                        image: 'public/images/hobbies/gardening.jpg'
                    },
                    {
                        id: 'reading',
                        title: 'Reading',
                        description: 'I am an avid reader of science fiction, fantasy, and popular science. Books are my gateway to new worlds and ideas, fueling my imagination and passion for learning.',
                        icon: 'book-open',
                        image: 'public/images/hobbies/reading.jpg'
                    },
                    {
                        id: 'tinkering',
                        title: 'DIY Projects and Electronics',
                        description: 'As a hands-on person, I love tinkering with electronics, building circuits, and working on DIY projects. This maker spirit is a constant source of creativity and problem-solving.',
                        icon: 'tools',
                        image: 'public/images/hobbies/tinkering.jpg'
                    },
                    {
                        id: 'astrophotography',
                        title: 'Astrophotography',
                        description: 'Combining my love for astronomy and technology, I enjoy capturing images of the night sky. It\'s a challenging but rewarding hobby that allows me to share the beauty of the cosmos with others.',
                        icon: 'camera',
                        image: 'public/images/hobbies/astrophotography.jpg'
                    }
                ]
            }
        }
    ],
    projects: [
        {
            id: 'interactive-portfolio-website',
            title: 'Interactive Portfolio Website: A Digital Reflection',
            description: 'This personal portfolio website is a testament to my journey and skills, built with a modern, minimalist, and responsive design philosophy. It uses pure JavaScript, strictly adhering to the MVC architecture pattern, to ensure modularity, maintainability, and dynamic content delivery.',
            technologies: ['JavaScript', 'CSS3', 'HTML5', 'MVC Architecture', 'Vite (Build Tool)', 'GitHub Pages (Deployment)'],
            status: 'completed',
            repository: 'https://passosdomingues.github.io/webappshowcase/site/main.html',
            liveDemo: 'https://passosdomingues.github.io/webappshowcase/site/main.html',
            features: [
                'Responsive Design across all devices',
                'Optimized Performance for fast loading times',
                'Accessibility Compliance for inclusive user experience',
                'Dynamic Content Loading with storytelling approach',
                'Modular MVC Architecture for scalability and maintainability',
                'Retro-futuristic UI/UX elements with classic typography'
            ]
        }
    ],
    experiences: []
};