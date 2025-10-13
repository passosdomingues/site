/**
 * @file PortfolioData.js
 * @author Rafael Passos Domingues
 * @brief Centralized content data for the portfolio website
 * @description Contains all static content, texts, images, and metadata
 */

/**
 * @constant {Object} PORTFOLIO_DATA
 * @brief Complete portfolio content structure
 */
export const PORTFOLIO_DATA = {
    sections: [
        {
            id: 'about',
            title: 'About Me',
            subtitle: 'My academic and professional journey',
            type: 'timeline',
            metadata: {
                priority: 1,
                visible: true,
                order: 1,
                icon: 'atom',
                backgroundColor: 'var(--color-surface)'
            },
            content: {
                introduction: 'Physicist and Computer Scientist passionate about astrophysics research, data analysis, and technological innovation. My journey is a blend of academic research and practical application, always driven by curiosity about how the universe works and how we can use technology to solve real-world problems.',
                timeline: [
                    {
                        period: '2014-2018',
                        title: 'Bachelor\'s Degree in Physics, UNIFAL-MG',
                        description: 'My academic journey began with a Bachelor\'s Degree in Physics at UNIFAL-MG. During this period, I immersed myself in the fascinating world of Galactic and Extragalactic Astrophysics, participating in research and contributing to scientific outreach at the UNIFAL-MG Astronomical Observatory.',
                        highlights: ['Galactic and Extragalactic Astrophysics', 'Scientific Outreach', 'Astronomical Observation']
                    },
                    {
                        period: '2019-2022',
                        title: 'Physics Teacher, State Department of Education of Minas Gerais',
                        description: 'After graduation, I dedicated myself to education, teaching Physics in three municipalities of Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences.',
                        highlights: ['Science Education', 'Experimental Physics', 'Pedagogical Innovation']
                    },
                    {
                        period: '2021-2023',
                        title: 'Master\'s Degree in Physics, UNIFEI',
                        description: 'My Master\'s in Physics at UNIFEI focused on Active Galactic Nuclei, a field where I developed a deep appreciation for data analysis.',
                        highlights: ['AGN Research', 'Advanced Data Analysis', 'Scientific Computing']
                    },
                    {
                        period: '2023-Present',
                        title: 'Bachelor\'s Degree in Computer Science, UNIFAL-MG',
                        description: 'In 2023, I embarked on a new academic path, pursuing a Bachelor\'s Degree in Computer Science at UNIFAL-MG.',
                        highlights: ['Software Development', 'Data Science', 'Machine Learning', 'Academia-Industry Connection']
                    },
                    {
                        period: '2024-2025',
                        title: 'Innovation Ecosystem and Maker Educator, NidusTec/UNIFAL-MG Incubator',
                        description: 'At NidusTec, I embraced the role of Maker Educator, leading robotics, 3D modeling, and CNC workshop projects.',
                        highlights: ['Entrepreneurship', 'Technology Transfer', 'Maker Education', '3D Modeling and CNC', 'Robotics']
                    }
                ],
                currentFocus: 'Currently, I am a Computer Science student, specializing in image processing and computer graphics.',
                reflection: 'My journey, seemingly disparate at first glance, is a testament to the power of interdisciplinary thinking.',
                summary: 'A unique blend of academic rigor in physics and astrophysics with practical expertise in computer science.'
            }
        },
        {
            id: 'astrophysics-research',
            title: 'Astrophysics Research',
            subtitle: 'Work in galactic and extragalactic astrophysics',
            type: 'cards',
            metadata: {
                priority: 2,
                visible: true,
                order: 2,
                icon: 'galaxy',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: [
                {
                    id: 'dark-matter-research',
                    title: 'Unveiling the Invisible: My Journey in Dark Matter Research',
                    description: 'My research in Dark Matter began with a deep dive into galactic rotation curves. The anomalous velocities of stars in galactic halos presented a profound enigma.',
                    image: {
                        src: 'bullet-cluster-black-matter_upscayl.png',
                        alt: 'Bullet Cluster showing dark matter distribution',
                        caption: 'Bullet Cluster: Visual Evidence of Dark Matter'
                    },
                    links: [
                        { url: 'https://lnkd.in/deYnab4a', label: 'Related Research Publication', type: 'external' }
                    ],
                    tags: ['Dark Matter', 'Galactic Dynamics', 'Cosmology', 'Gravitational Lensing'],
                    status: 'published',
                    date: '2018-03-15'
                }
            ]
        },
        {
            id: 'deep-learning-projects',
            title: 'Deep Learning Projects',
            subtitle: 'Applying ML/DL to medical imaging and astrophysics',
            type: 'cards',
            metadata: {
                priority: 1,
                visible: true,
                order: 8,
                icon: 'brain-outline',
                backgroundColor: 'var(--color-gray-50)'
            },
            content: [
                {
                    id: 'medical-image-diagnosis',
                    title: 'Deep Learning for Medical Image Diagnosis',
                    description: 'My exploration in Machine Learning and Deep Learning led me to a compelling application: skin cancer diagnosis from medical images.',
                    links: [
                        { url: 'https://lnkd.in/dcUAP2gw', label: 'Kaggle Notebook [Code]', type: 'external' }
                    ],
                    tags: ['Deep Learning', 'Medical Imaging', 'Skin Cancer Diagnosis', 'Machine Learning'],
                    status: 'ongoing',
                    date: '2021-Present'
                }
            ]
        },
        {
            id: 'skills',
            title: 'Skills and Competencies',
            subtitle: 'Knowledge areas and technologies',
            type: 'skills',
            metadata: {
                priority: 2,
                visible: true,
                order: 9,
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
                            { name: 'Python (NumPy, Pandas, Scikit-learn)', proficiency: 88, years: 5, description: 'Advanced proficiency in Python for scientific computing.' }
                        ]
                    },
                    {
                        category: 'Interpersonal and Creative Skills',
                        skills: [
                            { name: 'Analytical and Conceptual Thinking', proficiency: 96, years: 8, description: 'Ability to deconstruct complex problems and develop innovative solutions.' },
                            { name: 'Creative Ideation and Ambition', proficiency: 91, years: 7, description: 'Driven to generate new ideas and pursue ambitious goals.' }
                        ]
                    }
                ]
            }
        }
    ],

    projects: [
        {
            id: 'interactive-portfolio-website',
            title: 'Interactive Portfolio Website',
            description: 'This personal portfolio website built with modern, minimalist, and responsive design philosophy.',
            technologies: ['JavaScript', 'CSS3', 'HTML5', 'MVC Architecture', 'Vite'],
            status: 'completed',
            repository: 'https://github.com/rafaelpassosdomingues/rafaelpassosdomingues.github.io',
            liveDemo: 'https://rafaelpassosdomingues.github.io',
            features: [
                'Responsive Design across all devices',
                'Optimized Performance for fast loading times',
                'Dynamic Content Loading with storytelling approach'
            ]
        }
    ],

    experiences: [],

    hobbies: {
        description: 'Beyond my academic and professional activities, I cultivate a variety of hobbies that enrich my life and provide new perspectives.',
        items: [
            {
                id: 'gardening',
                title: 'Gardening',
                description: 'I find immense joy in cultivating a vegetable garden, a practice that connects me with nature.',
                icon: 'leaf',
                image: 'hobbies/gardening.jpg'
            },
            {
                id: 'reading',
                title: 'Reading',
                description: 'I am an avid reader of science fiction, fantasy, and popular science.',
                icon: 'book-open',
                image: 'hobbies/reading.jpg'
            }
        ]
    }
};