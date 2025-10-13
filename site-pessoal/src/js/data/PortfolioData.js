/**
 * @file PortfolioData.js
 * @author Rafael Passos Domingues
 * @brief Centralized, comprehensive, and structurally correct data source for the portfolio.
 * @description This file exports the complete portfolio data, translated into English,
 * maintaining the original data structure compatible with the application's rendering engine.
 */

export const PORTFOLIO_DATA = {
    user: {
        name: "Rafael Passos Domingues",
        title: "Physicist | Computer Scientist | Tech Innovator",
        socialLinks: {
            github: "https://github.com/passosdomingues",
            linkedin: "https://www.linkedin.com/in/rafaelpassosdomingues/",
            instagram: "https://www.instagram.com/rafaelpassosdomingues/",
            email: "rafaelpassosdomingues@gmail.com"
        }
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
                personalPhilosophy: "My core philosophy is rooted in continuous learning and the synthesis of different fields of knowledge. I believe that the most profound innovations emerge from the intersection of disciplines. Whether it's applying data analysis techniques from physics to a software problem or using an engineering mindset to approach scientific outreach, I strive to break down silos and create holistic solutions.",
                timeline: [
                    {
                        period: 'Early Years',
                        title: 'Formative Experiences in Alfenas, MG',
                        description: "Growing up in Alfenas, Minas Gerais, my early years were shaped by a variety of hands-on jobs. Working as a bricklayer's assistant, waiter, and gardener instilled in me a profound work ethic and a deep-seated resilience that have been foundational to my academic and professional pursuits.",
                        highlights: ['Work Ethic', 'Resilience', 'Practical Skills']
                    },
                    {
                        period: '2014-2018',
                        title: "Bachelor's Degree in Physics, UNIFAL-MG",
                        description: "My formal scientific journey began at the Federal University of Alfenas. As a scholarship holder in Galactic and Extragalactic Astrophysics, I joined the team at the university's Astronomical Observatory, where I was deeply involved in scientific research and public outreach, sharing the wonders of the cosmos with the community.",
                        highlights: ['Astrophysics', 'Scientific Research', 'Public Outreach']
                    },
                    {
                        period: '2019-2022',
                        title: 'Physics Teacher, State Secretariat of Education of MG',
                        description: "As an educator, I taught theoretical, experimental, and practical science across three municipalities (Divisa Nova, Paraguaçu, Soledade de Minas). This experience was a masterclass in adaptation, especially when I had to innovate with remote teaching strategies during the pandemic.",
                        highlights: ['Teaching', 'Curriculum Adaptation', 'Remote Learning Innovation']
                    },
                    {
                        period: '2021-2023',
                        title: "Master's Degree in Physics, UNIFEI",
                        description: "My postgraduate studies at the Federal University of Itajubá focused on Active Galactic Nuclei. This research-intensive period cemented my passion for data analysis, as I spent countless hours interpreting complex datasets to uncover the secrets of these powerful cosmic engines.",
                        highlights: ['Active Galactic Nuclei', 'Data Analysis', 'Academic Research']
                    },
                    {
                        period: '2023-Present',
                        title: "Bachelor's Degree in Computer Science, UNIFAL-MG",
                        description: "In a pivotal career transition, I returned to UNIFAL-MG to pursue Computer Science. My goal is to bridge the gap between abstract scientific theory and tangible technological applications, creating software and systems that solve real-world problems.",
                        highlights: ['Career Transition', 'Computer Science', 'Software Engineering']
                    },
                    {
                        period: '2024-2025',
                        title: 'Maker Educator & Innovation Ecosystem Analyst, NidusTec/UNIFAL-MG',
                        description: "At NidusTec, a Technology-Based Business Incubator, I fully embraced the Maker culture. Acting as a generalist, I led workshops in Robotics, 3D Modeling, and CNC, and played a key role in connecting academic research with market opportunities, fostering a vibrant innovation ecosystem.",
                        highlights: ['Innovation Ecosystem', 'Maker Culture', '3D Prototyping', 'Entrepreneurship']
                    }
                ],
                currentFocus: "Currently, I am deepening my expertise in image processing and computer graphics. My primary focus is on developing multidisciplinary interfaces that leverage Machine Learning, Deep Learning, NLP, CNNs, and LLMs. I am also exploring the integration of these technologies with Smart Contracts to build decentralized, intelligent applications."
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
                    description: "During the I Cycle of Astronomy Seminars at UNIFAL-MG, I presented my undergraduate research on Stellar Orbits. The work involved simulating stellar movements to understand galactic dynamics and discussing the compelling evidence for Dark Matter, exemplified by phenomena like the Bullet Cluster's gravitational lensing, which reveals mass far exceeding what is visible.",
                    image: { src: 'images/seminario.jpg', alt: 'Rafael Domingues presenting his astrophysics research' },
                    links: [ { url: 'https://lnkd.in/deYnab4a', label: 'Related Research' } ],
                    tags: ['Dark Matter', 'Stellar Orbits', 'Astrophysics', 'Scientific Presentation']
                },
                {
                    title: 'The Bullet Cluster: A Cosmic Collision and Proof of Dark Matter',
                    description: "The Bullet Cluster stands as one of the most definitive pieces of evidence for dark matter. In this monumental collision of galaxy clusters, the hot, X-ray emitting gas (ordinary matter) collides and slows, while the dark matter, interacting only through gravity, passes through unimpeded. This clear separation is a powerful visual confirmation of its existence.",
                    image: { src: 'images/bullet-cluster-black-matter_upscayl.png', alt: 'The Bullet Cluster, showing the separation of dark matter (blue) and normal matter (pink)' },
                    tags: ['Cosmology', 'Dark Matter', 'Gravitational Lensing', 'Observational Evidence']
                }
            ]
        },
        {
            id: 'astronomical-observatory',
            type: 'gallery',
            title: 'Astronomical Observatory',
            subtitle: 'Scientific outreach and research at UNIFAL-MG (2015-2018)',
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
            subtitle: 'Exploring the Brazilian Solar Radio Polarimeter',
            metadata: { order: 4, visible: true },
            content: [
                { src: 'images/craamAntena.jpg', alt: '1.5-meter antenna of the Solar Radio Polarimeter at CRAAM', caption: 'The 7 GHz Solar Radio Polarimeter Antenna' },
                { src: 'images/craamControle.jpg', alt: 'Control room at CRAAM', caption: 'Control Room Instrumentation' },
                { src: 'images/craamDomo.jpg', alt: 'Inside the dome housing the radio telescope', caption: 'Inside the Telescope Dome' },
                { src: 'images/craamEscada.jpg', alt: 'Access stairway to the radio heliograph instrumentation', caption: 'Accessing the Instrumentation' }
            ]
        },
        {
            id: 'lna-experience',
            type: 'gallery',
            title: 'Experience at LNA',
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
            subtitle: 'My work at NidusTec and the innovation ecosystem (2024-2025)',
            metadata: { order: 6, visible: true },
            content: [
                {
                    title: 'NidusTec: Bridging Academia and Industry',
                    description: 'As a member of the NidusTec team, I was at the forefront of connecting academic research with market needs. My role was dynamic: I conducted technical feasibility analyses for aspiring startups, provided mentorship to entrepreneurs, and served as a hands-on "Maker generalist" in our NidusLab, developing prototypes and leading workshops.',
                    image: { src: 'images/nidus.jpg', alt: 'The NidusTec team celebrating a national award' },
                    links: [
                        { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'ANPROTEC National Award News' },
                        { url: 'https://jornal.unifal-mg.edu.br/unifal-mg-aprova-criacao-do-centro-de-inovacao-e-empreendedorismo-universitario-cieu/', label: 'UNIFAL-MG Innovation Center News' }
                    ],
                    tags: ['Innovation', 'Entrepreneurship', 'Startups', 'Technology Transfer', 'Maker Culture']
                }
            ]
        }
        // You can add other sections like 'skills', 'hobbies', etc., following the correct structure.
    ]
};