import imgBulletCluster from '../images/bullet-cluster-black-matter_upscayl.png';
import imgCraamAntena from '../images/craamAntena.jpg';
import imgCraamControle from '../images/craamControle.jpg';
import imgCraamDomo from '../images/craamDomo.jpg';
import imgCraamEscada from '../images/craamEscada.jpg';
import imgEscolaOBS1 from '../images/escolaOBS1.png';
import imgEscolaOBS2 from '../images/escolaOBS2.jpg';
import imgEscolaOBS3 from '../images/escolaOBS3.jpg';
import imgEscolaOBS4 from '../images/escolaOBS4.jpg';
import imgNidus from '../images/nidus.jpg';
import imgObs1 from '../images/obs1.jpg';
import imgObs2 from '../images/obs2.jpg';
import imgObs3 from '../images/obs3.jpg';
import imgObs4 from '../images/obs4.jpg';
import imgObs5 from '../images/obs5.jpg';
import imgObsGalaxiaSombrero from '../images/obsGalaxiaSombrero.jpg';
import imgObsLua from '../images/obsLua.jpg';
import imgPerfilMid from '../images/perfilMid.png';
import imgSeminario from '../images/seminario.jpg';

class ContentModel {
    constructor() {
        this.sections = [];
        this.isInitialized = false;
    }

    async initializeContentModel() {
        try {
            this.sections = this.initializeSections();
            this.isInitialized = true;
            console.info('ContentModel: Content model initialized successfully');
        } catch (error) {
            console.error('ContentModel: Initialization failed:', error);
            throw error;
        }
    }

    initializeSections() {
        return [
            {
                id: 'about',
                title: 'About Me',
                subtitle: 'My academic and professional journey',
                type: 'timeline',
                content: this.getAboutContent(),
                metadata: { order: 1, visible: true }
            },
            {
                id: 'astrophysics-research',
                title: 'Astrophysics Research',
                subtitle: 'Work in galactic and extragalactic astrophysics',
                type: 'cards',
                content: this.getAstrophysicsContent(),
                metadata: { order: 2, visible: true }
            },
            {
                id: 'astronomical-observatory',
                title: 'Astronomical Observatory',
                subtitle: 'Scientific outreach and research at UNIFAL-MG',
                type: 'gallery',
                content: this.getObservatoryContent(),
                metadata: { order: 3, visible: true }
            },
            {
                id: 'craam-visit',
                title: 'CRAAM Visit',
                subtitle: 'Mackenzie Center for Radio Astronomy and Astrophysics',
                type: 'gallery',
                content: this.getCraamContent(),
                metadata: { order: 4, visible: true }
            },
            {
                id: 'lna-zeiss-telescope',
                title: 'LNA Zeiss Telescope Experience',
                subtitle: 'Operating a classic instrument at Pico dos Dias Observatory',
                type: 'gallery',
                content: this.getLnaTelescopeContent(),
                metadata: { order: 5, visible: true }
            },
            {
                id: 'education-experience',
                title: 'Education Experience',
                subtitle: 'Teaching and educational material development',
                type: 'timeline',
                content: this.getEducationContent(),
                metadata: { order: 6, visible: true }
            },
            {
                id: 'innovation-entrepreneurship',
                title: 'Innovation and Entrepreneurship',
                subtitle: 'NidusTec and innovation ecosystem',
                type: 'cards',
                content: this.getInnovationContent(),
                metadata: { order: 7, visible: true }
            },
            {
                id: 'deep-learning-projects',
                title: 'Deep Learning Projects',
                subtitle: 'Applying ML/DL to medical imaging and astrophysics',
                type: 'cards',
                content: this.getDeepLearningProjectsContent(),
                metadata: { order: 8, visible: true }
            },
            {
                id: 'skills',
                title: 'Skills and Competencies',
                subtitle: 'Knowledge areas and technologies',
                type: 'skills',
                content: this.getSkillsContent(),
                metadata: { order: 9, visible: true }
            }
        ];
    }

    getAboutContent() {
        return {
            timeline: [
                {
                    period: '2014-2018',
                    title: 'Bachelor\'s in Physics, UNIFAL-MG',
                    description: 'My academic journey began with a Bachelor\'s in Physics at UNIFAL-MG. During this period, I dove into the fascinating world of Galactic and Extragalactic Astrophysics, participating in research that gave me a solid foundation in scientific methodology and complex data analysis.',
                    highlights: ['Astrophysics', 'Scientific Initiation', 'Data Analysis']
                },
                {
                    period: '2019-2022',
                    title: 'Physics Teacher, State Department of Education of Minas Gerais',
                    description: 'After graduation, I dedicated myself to education, teaching Physics in three municipalities in Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles.',
                    highlights: ['Scientific Education', 'Experimental Physics', 'Pedagogical Innovation']
                },
                {
                    period: '2021-2023',
                    title: 'Master\'s in Physics, UNIFEI',
                    description: 'My Master\'s in Physics at UNIFEI focused on Active Galactic Nuclei, a field where I developed a deep appreciation for data analysis. This research experience solidified my interest in extracting insights from complex datasets, laying the groundwork for my future endeavors in data science.',
                    highlights: ['AGN Research', 'Advanced Data Analysis', 'Scientific Computing']
                },
                {
                    period: '2023-Present',
                    title: 'Bachelor\'s in Computer Science, UNIFAL-MG',
                    description: 'In 2023, I embarked on a new academic path, pursuing a Bachelor\'s in Computer Science at UNIFAL-MG. This transition reflects my commitment to bridging theoretical physics and practical technological solutions. Concurrently, I joined the NidusTec/UNIFAL-MG Technology-Based Business Incubator, connecting academia with the market and fostering innovation.',
                    highlights: ['Software Development', 'Data Science', 'Machine Learning', 'Academia-Industry Connection']
                },
                {
                    period: '2024-2025',
                    title: 'Innovation Ecosystem and Maker Educator, NidusTec/UNIFAL-MG',
                    description: 'At NidusTec, I embraced the role of Maker Educator, leading projects in Robotics, 3D Modeling, and CNC workshops. This experience allowed me to apply computer graphics and image processing techniques in multidisciplinary prototypes, addressing institutional infrastructure needs and exploring research in Innovation, Entrepreneurship, Production Engineering, and Industry 4.0. I developed MVPs with market potential, demonstrating my ability to turn ideas into tangible solutions.',
                    highlights: ['Entrepreneurship', 'Technology Transfer', 'Maker Education', '3D Modeling and CNC', 'Robotics', 'Innovation Management']
                }
            ]
        };
    }

    getAstrophysicsContent() {
        return [
            {
                title: 'Unveiling the Invisible: My Journey in Dark Matter Research',
                description: 'My research in Dark Matter began with a deep dive into galactic rotation curves. The anomalous velocities of stars in galactic halos presented a profound enigma: either the laws of gravity needed revision, or a vast amount of invisible matter was at play. This led me to explore the concept of Dark Matter, a mysterious substance that interacts gravitationally but not electromagnetically. A crucial moment in my understanding came from studying the Bullet Cluster, a cosmic collision where gravitational lensing revealed a mass distribution far exceeding visible matter. The separation of ordinary and dark matter during this collision provided compelling visual evidence for the existence of Dark Matter. I had the privilege of presenting these findings at the First Cycle of Astronomy Seminars at UNIFAL-MG, turning years of observation into theoretical rigor and sharing the frontiers of cosmology with a captivated audience. This experience reinforced my belief in higher education as a vital engine for research and extension, bridging the gap between telescopic fascination and theoretical astrophysics.',
                image: {
                    src: imgBulletCluster,
                    alt: 'Bullet Cluster showing dark matter distribution',
                    caption: 'Bullet Cluster: Visual evidence of Dark Matter (Credit: NASA/CXC/M.Weiss)'
                },
                links: [
                    { url: 'https://lnkd.in/deYnab4a', label: 'Related Research Publication', type: 'external' }
                ],
                tags: ['Dark Matter', 'Galactic Dynamics', 'Cosmology', 'Gravitational Lensing', 'Scientific Communication'],
                status: 'published',
                date: '2018-03-15'
            },
            {
                title: 'Astronomy Seminar Series: Stellar Orbits and the Dark Universe',
                description: 'This image captures a significant moment: a lecture I delivered at the First Cycle of Astronomy Seminars at UNIFAL-MG. My presentation focused on Stellar Orbits in the Galaxy, where I shared simulations of stellar motions based on mass distribution models and numerical solutions for accelerations, velocities, and stellar positions in the Milky Way. I discussed the evidence that led to the postulates of Dark Matter and Modified Gravity, particularly highlighting the Rotation Curves of galaxies. This anomaly, where stars in the galactic halo move too fast, suggests that most of the Milky Way\'s mass is invisible. Sharing these complex ideas and challenging the audience with the mysteries of the cosmos was a profound experience, reinforcing the role of higher education in driving both research and public engagement.',
                image: {
                    src: imgSeminario,
                    alt: 'Astronomy seminar presentation on stellar orbits and dark matter',
                    caption: 'Presentation on Stellar Orbits and Dark Matter at UNIFAL-MG Seminar (2019)'
                },
                links: [],
                tags: ['Scientific Outreach', 'Academic Events', 'Stellar Dynamics', 'Dark Matter', 'Public Speaking'],
                status: 'completed',
                date: '2019-11-20'
            },
            {
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

    getObservatoryContent() {
        return [
            { imageUrl: imgObs1, caption: 'Main dome of the UNIFAL-MG Astronomical Observatory' },
            { imageUrl: imgObs2, caption: 'Public observation night at the observatory' },
            { imageUrl: imgObs3, caption: 'Recording of the Orion Nebula (M42)' },
            { imageUrl: imgObs4, caption: 'Research and extension team at the observatory' },
            { imageUrl: imgObs5, caption: 'Observatory dome under the starry sky' },
            { imageUrl: imgEscolaOBS1, caption: 'Scientific outreach lecture for schools' },
            { imageUrl: imgEscolaOBS2, caption: 'Students observing the Sun with a solar filter' },
            { imageUrl: imgEscolaOBS3, caption: 'Engaging with students during an outreach event' },
            { imageUrl: imgEscolaOBS4, caption: 'Hands-on astronomy activity with school groups' },
            { imageUrl: imgObsLua, caption: 'Detailed view of the Moon captured at the observatory' },
            { imageUrl: imgObsGalaxiaSombrero, caption: 'Sombrero Galaxy (M104) captured through astrophotography' }
        ];
    }

    getCraamContent() {
        return [
            { imageUrl: imgCraamAntena, caption: '7 GHz Solar Radio Polarimeter antenna at CRAAM' },
            { imageUrl: imgCraamControle, caption: 'Control room at CRAAM' },
            { imageUrl: imgCraamDomo, caption: 'Inside the CRAAM dome with the 1.5-meter antenna' },
            { imageUrl: imgCraamEscada, caption: 'External staircase to the observation deck' }
        ];
    }

    getLnaTelescopeContent() {
        return [
            { imageUrl: imgObs4, caption: 'LNA Observatory at sunset' },
            { imageUrl: imgObs5, caption: 'Aerial view of the National Astrophysics Laboratory (LNA)' }
        ];
    }

    getEducationContent() {
        return {
            timeline: [
                {
                    period: '2016-2018',
                    title: 'Teaching Assistant, Physics Department, UNIFAL-MG',
                    description: 'During my undergraduate studies, I served as a Teaching Assistant in the Physics Department at UNIFAL-MG. This role was fundamental to developing my pedagogical skills, as I was responsible for laboratory instruction for undergraduate physics courses, developing experimental protocols, and providing academic mentoring and support to students. I found immense satisfaction in helping students understand complex concepts through hands-on experiments, and I contributed to the creation of new and engaging laboratory materials. This experience solidified my understanding of fundamental physics principles and my ability to communicate them effectively.',
                    highlights: [
                        'Provided laboratory instruction and academic support to undergraduate physics students',
                        'Developed and refined experimental protocols for physics courses',
                        'Mentored students, fostering a deeper understanding of scientific concepts'
                    ]
                },
                {
                    period: '2017-2018',
                    title: 'Educational Material Developer, UNIFAL-MG Astronomical Observatory',
                    description: 'My passion for astronomy extended to educational outreach at the UNIFAL-MG Astronomical Observatory. As an Educational Material Developer, I led the creation of engaging astronomy education materials and played a key role in developing and coordinating public outreach programs and workshops. Through these initiatives, I reached over 500 students, fostering scientific curiosity and developing innovative teaching methodologies that made complex astronomical phenomena accessible and exciting. This experience highlighted the importance of scientific communication and its power to inspire the next generation.',
                    highlights: [
                        'Created and implemented astronomy education materials for public outreach',
                        'Developed and coordinated successful public outreach programs and workshops',
                        'Reached over 500 students, fostering scientific curiosity and innovative teaching methodologies'
                    ]
                },
                {
                    period: '2019-2022',
                    title: 'Physics Teacher, State Department of Education of Minas Gerais',
                    description: 'After my undergraduate studies, I dedicated myself to education, teaching Physics in three municipalities in Minas Gerais. This role challenged me to adapt scientific knowledge to diverse audiences, especially during the unprecedented period of 2020-2022, where I applied technical expertise to overcome educational obstacles. I developed innovative teaching strategies, including virtual labs and interactive online content, to ensure continuous learning during remote education. This experience significantly enhanced my ability to communicate complex scientific concepts in an accessible and engaging manner, promoting critical thinking and problem-solving skills among my students.',
                    highlights: [
                        'Taught Physics in three municipalities, adapting curriculum to diverse student needs',
                        'Developed innovative teaching strategies, including virtual labs and interactive online content',
                        'Successfully navigated the challenges of remote education during 2020-2022, ensuring continuous learning'
                    ]
                }
            ]
        };
    }

    getInnovationContent() {
        return [
            {
                title: 'NidusTec - Technology-Based Business Incubator',
                description: 'As part of the NidusTec team, I acted as a bridge between academic research and the market, helping to transform innovative projects into successful startups. My role involved technical feasibility analysis of projects, product development mentoring, and the search for emerging technologies with market potential.',
                date: '2021-2023',
                status: 'Completed',
                tags: ['Innovation', 'Entrepreneurship', 'Technology', 'Startups']
            },
            {
                title: 'Development of a Data Analysis System for Precision Agriculture',
                description: 'This project, developed in partnership with a NidusTec startup, created a platform for analyzing drone and sensor data in the field. The system uses machine learning algorithms to optimize the use of resources, such as water and fertilizers, increasing productivity and sustainability in agribusiness.',
                date: '2022',
                status: 'Completed',
                tags: ['Machine Learning', 'Precision Agriculture', 'Python', 'Innovation']
            }
        ];
    }

    getDeepLearningProjectsContent() {
        return [
            {
                title: 'Brain Tumor Segmentation in Magnetic Resonance Images',
                description: 'This project used a U-Net architecture for automatic segmentation of brain tumors in magnetic resonance images. The goal was to create a tool to support medical diagnosis, increasing the accuracy and speed of analysis. The model was trained on a large dataset of medical images and achieved high performance.',
                date: '2023',
                status: 'Completed',
                tags: ['Deep Learning', 'Computer Vision', 'Python', 'TensorFlow', 'Medicine']
            },
            {
                title: 'Morphological Classification of Galaxies with CNNs',
                description: 'Using data from the Galaxy Zoo project, I developed a convolutional neural network to classify galaxies based on their morphology (spiral, elliptical, etc.). The project demonstrated how deep learning can automate classification tasks in large astronomical surveys, accelerating scientific research.',
                date: '2022',
                status: 'Completed',
                tags: ['Deep Learning', 'Astrophysics', 'Python', 'PyTorch', 'Data Science']
            }
        ];
    }

    getSkillsContent() {
        return [
            {
                category: 'Programming Languages',
                skills: [
                    { name: 'Python', proficiency: 95, description: 'Data analysis, ML/DL, automation, web.' },
                    { name: 'JavaScript / TypeScript', proficiency: 85, description: 'Front-end and back-end web development (Node.js).' },
                    { name: 'C/C++', proficiency: 70, description: 'Systems programming and high-performance computing.' },
                    { name: 'SQL', proficiency: 80, description: 'Manipulation and querying of relational databases.' }
                ]
            },
            {
                category: 'Data Science & Machine Learning',
                skills: [
                    { name: 'TensorFlow / PyTorch', proficiency: 90, description: 'Deep Learning frameworks for computer vision and NLP.' },
                    { name: 'Scikit-learn', proficiency: 95, description: 'Classical Machine Learning models.' },
                    { name: 'Pandas / NumPy / Matplotlib', proficiency: 98, description: 'Essential tools for data analysis and visualization.' },
                    { name: 'Image Processing (OpenCV)', proficiency: 85, description: 'Image analysis and manipulation for scientific applications.' }
                ]
            },
            {
                category: 'Tools and Technologies',
                skills: [
                    { name: 'Git / GitHub', proficiency: 95, description: 'Code versioning and collaboration.' },
                    { name: 'Docker', proficiency: 75, description: 'Application containerization for portability and deployment.' },
                    { name: 'Linux / Shell Scripting', proficiency: 85, description: 'System administration and task automation.' },
                    { name: 'Cloud Computing (AWS/GCP)', proficiency: 60, description: 'Basic knowledge of cloud services for computing and storage.' }
                ]
            }
        ];
    }

    getAllSections() {
        return [...this.sections].sort((a, b) => a.metadata.order - b.metadata.order);
    }
}

export default ContentModel;