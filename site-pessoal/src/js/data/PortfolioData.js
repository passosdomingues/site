/**
 * @file PortfolioData.js
 * @author Rafael Passos Domingues
 * @brief Centralized, comprehensive, and structurally correct data source for the portfolio.
 * @description This file exports the complete portfolio data, translated into English,
 * maintaining the original data structure compatible with the application's rendering engine.
 * This version restores the exact structure that was previously working to ensure image rendering.
 */

export const PORTFOLIO_DATA = {
    user: {
        name: "Rafael Passos Domingues",
        title: "Physicist | Computer Scientist | Tech Innovator"
    },
    sections: [
        {
            id: 'about',
            type: 'timeline',
            title: 'About Me',
            subtitle: 'A Journey Across Science, Technology, and Creation',
            metadata: { order: 1, visible: true },
            content: {
                introduction: "I am a Physicist and Computer Science student, and my life's story is a tapestry woven from diverse threads: from the vastness of Galactic Astrophysics to the hands-on world of Maker Education and technological innovation. I am driven by an insatiable curiosity to understand complex systems and a pragmatic desire to apply that knowledge to build tangible, impactful solutions. This path has molded me into a versatile problem-solver, adept at uniting the rigor of science with the creativity of technology to meet the world's evolving challenges.",
                timeline: [
                    {
                        period: '2014-2018',
                        title: "Bachelor's Degree in Physics, UNIFAL-MG",
                        description: "My formal scientific journey began at the Federal University of Alfenas. As a scholarship holder in Galactic and Extragalactic Astrophysics, I joined the team at the university's Astronomical Observatory, where I was deeply involved in scientific research and public outreach.",
                        highlights: ['Astrophysics', 'Scientific Research', 'Public Outreach']
                    },
                    {
                        period: '2019-2022',
                        title: 'Physics Teacher, State Secretariat of Education of MG',
                        description: "As an educator, I taught science across three municipalities. This experience was a masterclass in adaptation, especially when innovating with remote teaching strategies during the pandemic.",
                        highlights: ['Teaching', 'Curriculum Adaptation', 'Remote Learning Innovation']
                    },
                    {
                        period: '2021-2023',
                        title: "Master's Degree in Physics, UNIFEI",
                        description: "My postgraduate studies focused on Active Galactic Nuclei. This research-intensive period cemented my passion for data analysis, interpreting complex datasets to uncover the secrets of these powerful cosmic engines.",
                        highlights: ['Active Galactic Nuclei', 'Data Analysis', 'Academic Research']
                    },
                    {
                        period: '2023-Present',
                        title: "Bachelor's Degree in Computer Science, UNIFAL-MG",
                        description: "In a pivotal career transition, I returned to UNIFAL-MG to pursue Computer Science, aiming to bridge the gap between abstract scientific theory and tangible technological applications.",
                        highlights: ['Career Transition', 'Computer Science', 'Software Engineering']
                    },
                    {
                        period: '2024-2025',
                        title: 'Maker Educator & Innovation Ecosystem Analyst, NidusTec/UNIFAL-MG',
                        description: "At NidusTec, a Technology-Based Business Incubator, I embraced the Maker culture, leading workshops in Robotics, 3D Modeling, and CNC, and connecting academic research with market opportunities.",
                        highlights: ['Innovation Ecosystem', 'Maker Culture', '3D Prototyping', 'Entrepreneurship']
                    }
                ]
            }
        },
        {
            id: 'astrophysics-research',
            type: 'cards',
            title: 'Astrophysics Research',
            subtitle: 'Exploring the Cosmos from Dark Matter to Solar Flares',
            metadata: { order: 2, visible: true },
            content: [
                {
                    title: 'Unveiling Galactic Secrets: Stellar Orbits and Dark Matter',
                    description: "During the I Cycle of Astronomy Seminars at UNIFAL-MG, I presented my undergraduate research on Stellar Orbits, discussing simulations of stellar movements and the compelling evidence for Dark Matter.",
                    image: { 
                        src: 'images/seminario.jpg', 
                        alt: 'Rafael Domingues presenting his astrophysics research' 
                    },
                    links: [ { url: 'https://lnkd.in/deYnab4a', label: 'Related Research' } ],
                    tags: ['Dark Matter', 'Stellar Orbits', 'Astrophysics', 'Scientific Presentation']
                },
                {
                    title: 'The Bullet Cluster: A Cosmic Collision and Proof of Dark Matter',
                    description: "The Bullet Cluster stands as one of the most definitive pieces of evidence for dark matter. In this collision of galaxy clusters, the separation between the hot gas and the gravitational mass is a powerful visual confirmation of its existence.",
                    image: { 
                        src: 'images/bullet-cluster-black-matter_upscayl.png', 
                        alt: 'The Bullet Cluster, showing the separation of dark matter and normal matter' 
                    },
                    tags: ['Cosmology', 'Dark Matter', 'Gravitational Lensing', 'Observational Evidence']
                }
            ]
        },
        {
            id: 'astronomical-observatory',
            type: 'gallery',
            title: 'Astronomical Observatory',
            subtitle: 'Scientific outreach and research at UNIFAL-MG',
            metadata: { order: 3, visible: true },
            content: [
                { src: 'images/obs1.jpg', alt: 'Main telescope at the UNIFAL-MG Observatory', caption: 'The 380mm Cassegrain Telescope' },
                { src: 'images/escolaOBS1.png', alt: 'Scientific outreach event for schools', caption: 'Connecting students with the cosmos' },
                { src: 'images/obs2.jpg', alt: 'Public observation night at the observatory', caption: 'A night of public observation' },
                { src: 'images/obsGalaxiaSombrero.jpg', alt: 'Astrophotograph of the Sombrero Galaxy (M104)', caption: 'Astrophotography: The Sombrero Galaxy' },
                { src: 'images/escolaOBS2.jpg', alt: 'Students looking through the telescope', caption: 'Inspiring the next generation' },
                { src: 'images/obsLua.jpg', alt: 'Detailed observation of the Moon', caption: 'Revealing lunar craters' },
                { src: 'images/escolaOBS3.jpg', alt: 'Presenting astronomy concepts to students', caption: 'Sharing the wonders of astronomy' },
                { src: 'images/obs3.jpg', alt: 'A view of the observatory dome against the night sky', caption: 'The observatory dome' }
            ]
        },
        {
            id: 'craam-visit',
            type: 'gallery',
            title: 'Technical Visit to CRAAM',
            subtitle: 'Mackenzie Center for Radioastronomy and Astrophysics',
            metadata: { order: 4, visible: true },
            content: [
                { src: 'images/craamAntena.jpg', alt: '1.5-meter antenna of the Solar Radio Polarimeter at CRAAM', caption: 'The 7 GHz Solar Radio Polarimeter Antenna' },
                { src: 'images/craamControle.jpg', alt: 'Control room at CRAAM', caption: 'Control Room Instrumentation' },
                { src: 'images/craamDomo.jpg', alt: 'Inside the dome housing the radio telescope', caption: 'Inside the Telescope Dome' },
                { src: 'images/craamEscada.jpg', alt: 'Access stairway to the radio heliograph instrumentation', caption: 'Accessing the Instrumentation' }
            ]
        },
        {
            id: 'lna-zeiss-telescope',
            type: 'gallery',
            title: 'LNA Zeiss Telescope Experience',
            subtitle: 'Operating a classic instrument at Pico dos Dias Observatory',
            metadata: { order: 5, visible: true },
            content: [
                { src: 'images/obs4.jpg', alt: 'The LNA observatory at sunset', caption: 'Sunset at Pico dos Dias Observatory' },
                { src: 'images/obs5.jpg', alt: 'Aerial view of the National Laboratory of Astrophysics (LNA)', caption: 'National Laboratory of Astrophysics (LNA)' }
            ]
        },
        {
            id: 'innovation-entrepreneurship',
            type: 'cards',
            title: 'Innovation & Entrepreneurship',
            subtitle: 'Connecting Academia with the Market at NidusTec Incubator',
            metadata: { order: 6, visible: true },
            content: [
                {
                    title: 'NidusTec: Bridging Academia and Industry',
                    description: 'As a member of the NidusTec team, I was at the forefront of connecting academic research with market needs. My role was dynamic: I conducted technical feasibility analyses for aspiring startups, provided mentorship, and served as a hands-on "Maker generalist" in our NidusLab.',
                    image: { 
                        src: 'images/nidus.jpg', 
                        alt: 'The NidusTec team celebrating a national award' 
                    },
                    links: [
                        { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'ANPROTEC National Award News' },
                        { url: 'https://jornal.unifal-mg.edu.br/unifal-mg-aprova-criacao-do-centro-de-inovacao-e-empreendedorismo-universitario-cieu/', label: 'UNIFAL-MG Innovation Center News' }
                    ],
                    tags: ['Innovation', 'Entrepreneurship', 'Startups', 'Technology Transfer', 'Maker Culture']
                }
            ]
        }
    ]
};