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
            metadata: { visible: true, order: 1 },
            content: {
                introduction: 'Physicist and Computer Scientist passionate about astrophysics research, data analysis, and technological innovation. My journey is a blend of academic research and practical application, always driven by curiosity about how the universe works and how we can use technology to solve real-world problems.',
                timeline: [
                    { period: '2014-2018', title: "Bachelor's Degree in Physics, UNIFAL-MG", description: 'Immersed myself in Galactic and Extragalactic Astrophysics, contributing to research and scientific outreach at the UNIFAL-MG Astronomical Observatory.', highlights: ['Astrophysics', 'Scientific Outreach', 'Observation'] },
                    { period: '2019-2022', title: 'Physics Teacher, State Dept. of Education of MG', description: 'Dedicated myself to education, teaching Physics and adapting scientific knowledge to diverse audiences, especially during the challenging 2020-2022 period.', highlights: ['Science Education', 'Pedagogical Innovation'] },
                    { period: '2021-2023', title: "Master's Degree in Physics, UNIFEI", description: 'Focused on Active Galactic Nuclei, developing a deep appreciation for data analysis and laying the foundation for my ventures into data science.', highlights: ['AGN Research', 'Advanced Data Analysis', 'Scientific Computing'] },
                    { period: '2023-Present', title: "Bachelor's Degree in Computer Science, UNIFAL-MG", description: 'Bridging the gap between theoretical physics and practical technological solutions. Joined the NidusTec/UNIFAL-MG Incubator to connect academia with the market.', highlights: ['Software Development', 'Data Science', 'Machine Learning'] },
                    { period: '2024-2025', title: 'Innovation Educator, NidusTec/UNIFAL-MG', description: 'Led robotics, 3D modeling, and CNC projects as a Maker Educator, developing multidisciplinary prototypes and transforming ideas into tangible solutions.', highlights: ['Entrepreneurship', 'Maker Education', 'Innovation Management'] }
                ],
                summary: 'My journey is a testament to interdisciplinary thinking. The convergence of physics, astrophysics, education, and computer science has equipped me with a unique perspective to leverage diverse knowledge and create impactful solutions.'
            }
        },
        {
            id: 'astrophysics-research',
            type: 'gallery',
            title: 'Astrophysics Research & Outreach',
            subtitle: 'Exploring the Cosmos from Dark Matter to Solar Flares',
            metadata: { visible: true, order: 2 },
            content: [
                {
                    title: 'Dark Matter Research',
                    description: 'My research began with galactic rotation curves, leading to an exploration of Dark Matter. Studying the Bullet Cluster provided compelling visual evidence, which I presented at the First Cycle of Astronomy Seminars at UNIFAL-MG.',
                    image: { src: 'public/images/bullet-cluster-black-matter_upscayl.png', alt: 'Bullet Cluster showing dark matter distribution' },
                    tags: ['Dark Matter', 'Cosmology', 'Gravitational Lensing']
                },
                {
                    title: 'UNIFAL-MG Astronomical Observatory',
                    description: 'As a science communicator from 2015 to 2018, I connected over 2,000 visitors to the cosmos using our 380mm Cassegrain telescope, making science accessible and inspiring curiosity in all ages.',
                    image: { src: 'public/images/observatorio-unifal.jpg', alt: 'UNIFAL-MG Astronomical Observatory' },
                    tags: ['Scientific Outreach', 'Astronomy', 'Public Engagement']
                },
                {
                    title: 'Solar Radio Astronomy at CRAAM',
                    description: 'In 2019, I visited CRAAM and operated the 7 GHz Solar Radio Polarimeter, gaining invaluable insights into solar data processing and the precision engineering required for radio astronomy.',
                    image: { src: 'public/images/craamAntena.jpg', alt: 'Solar Radio Polarimeter antenna at CRAAM' },
                    tags: ['Radio Astronomy', 'Solar Physics', 'Instrumentation']
                },
                {
                    title: 'Operating the Historic LNA Zeiss Telescope',
                    description: 'In 2016, I had the extraordinary opportunity to operate a historic Zeiss telescope at the National Astrophysics Laboratory (LNA), gaining hands-on experience in photometry, polarimetry, and instrument calibration.',
                    image: { src: 'public/images/obs4.jpg', alt: 'LNA Observatory at sunset' },
                    tags: ['Observational Astronomy', 'Photometry', 'Data Collection']
                }
            ]
        },
        {
            id: 'innovation-entrepreneurship',
            type: 'cards',
            title: 'Innovation & Entrepreneurship',
            subtitle: 'Connecting Academia with the Market at NidusTec Incubator',
            metadata: { visible: true, order: 3 },
            content: [
                {
                    title: 'NidusTec Business Incubator (2024-2025)',
                    description: 'As a Maker generalist, I led Robotics, 3D Modeling, and CNC projects, developing multidisciplinary prototypes and supporting incubated startups. This role expanded my expertise in Intellectual Property, Technology Transfer, and Open Innovation.',
                    tags: ['Technology Transfer', 'Startup Mentoring', 'Maker Education'],
                    status: 'Completed',
                    date: '2025-01-01',
                    links: [{ label: 'UNIFAL-MG News', url: 'https://jornal.unifal-mg.edu.br/capacitacoes-promovidas-pela-agencia-de-inovacao-e-a-incubadora-de-empresas-no-mes-de-junho-estimulam-a-cultura-empreendedora-e-a-inovacao-tecnologica-junto-a-comunidade/' }]
                },
                {
                    title: 'ANPROTEC National Award for Innovative Entrepreneurship',
                    description: 'A highlight of my time at NidusTec was receiving the prestigious Adelino Medeiros Trophy for "Incubator of Companies," recognizing our success in fostering new innovative ventures and building a robust innovation ecosystem.',
                    tags: ['Award', 'ANPROTEC', 'Innovation Ecosystems'],
                    status: 'Awarded',
                    date: '2024-12-04',
                    links: [{ label: 'Award News', url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/' }]
                },
                {
                    title: 'Academic Publication on CERNE Model Validation',
                    description: 'I co-authored and presented research on a methodology for measuring the impacts of the CERNE model in technology-based incubators at the 34th ANPROTEC Conference, contributing to the theoretical understanding of innovation.',
                    tags: ['Publication', 'Research', 'CERNE Model', 'Entrepreneurship'],
                    status: 'Published',
                    date: '2024-12-04',
                    links: [{ label: 'Conference Proceedings', url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/' }]
                }
            ]
        }
    ]
};