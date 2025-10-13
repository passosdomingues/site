/**
 * @file PortfolioData.js
 * @author Rafael Passos Domingues
 * @brief Centralized data source for the portfolio content.
 * @description This file exports a structured object containing all the text,
 * images, and metadata for each section of the portfolio website, translated into English.
 */

export const PORTFOLIO_DATA = {
    user: {
        name: "Rafael Passos Domingues",
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
            title: 'About Me',
            subtitle: 'My Journey Through Physics, Education, and Technology',
            type: 'timeline',
            metadata: { order: 1, visible: true },
            content: {
                introduction: "As a Physicist and Computer Science student, my journey is a convergence of diverse fields: from Galactic Astrophysics to Maker Education and technological innovation. I am driven by a passion for understanding complex systems and applying knowledge to create tangible, impactful solutions. My path has shaped me into a versatile problem-solver, uniting science and technology to meet the world's evolving demands.",
                timeline: [
                    {
                        period: 'Early Years',
                        title: 'Early Life in Alfenas & First Jobs',
                        description: "Grew up in Alfenas, Minas Gerais. Early on, I worked various jobs, including as a bricklayer's assistant, waiter, and gardener, experiences that built a strong work ethic.",
                        highlights: ['Hard Work', 'Resilience', 'Early Experiences']
                    },
                    {
                        period: '2014-2018',
                        title: "Bachelor's Degree in Physics, UNIFAL-MG",
                        description: 'As a student of Galactic and Extragalactic Astrophysics, I joined the team at the Astronomical Observatory of UNIFAL-MG, where I was actively involved in scientific outreach.',
                        highlights: ['Astrophysics', 'Scientific Research', 'Public Outreach']
                    },
                    {
                        period: '2019-2022',
                        title: 'Physics Teacher, SEE-MG',
                        description: 'I taught theoretical, experimental, and practical science in three municipalities in Minas Gerais (Divisa Nova, Paraguaçu, Soledade de Minas), adapting to the challenges of remote education during the pandemic.',
                        highlights: ['Teaching', 'Didactic Development', 'Remote Learning Adaptation']
                    },
                    {
                        period: '2021-2023',
                        title: "Master's Degree in Physics, UNIFEI",
                        description: "My research on Active Galactic Nuclei during my Master's at UNIFEI ignited a special passion for data analysis and interpretation.",
                        highlights: ['Active Galactic Nuclei', 'Data Analysis', 'Academic Research']
                    },
                    {
                        period: '2023-Present',
                        title: "Bachelor's Degree in Computer Science, UNIFAL-MG",
                        description: 'In 2023, I made a career transition to Computer Science, seeking to bridge the gap between theoretical science and practical technology.',
                        highlights: ['Career Transition', 'Computer Science', 'Software Development']
                    },
                    {
                        period: '2024-2025',
                        title: 'Maker Educator & Innovation Ecosystem, NidusTec/UNIFAL-MG',
                        description: 'Joined the team at NidusTec, a Technology-Based Business Incubator, where I acted as a Maker generalist, leading projects in Robotics, 3D Modeling, and CNC workshops, connecting academia with the market.',
                        highlights: ['Innovation', 'Entrepreneurship', 'Maker Culture', '3D Prototyping']
                    }
                ],
                currentFocus: "I am currently a Computer Science student specializing in image processing and computer graphics. My focus is on applying my knowledge in multidisciplinary interfaces that combine Machine Learning, Deep Learning, NLP, CNNs, and LLMs, and I am now exploring integration with Smart Contracts."
            }
        },
        {
            id: 'astrophysics-research',
            title: 'Astrophysics Research',
            subtitle: 'From Galactic Mysteries to Solar Phenomena',
            type: 'cards',
            metadata: { order: 2, visible: true },
            content: [
                {
                    title: 'Diving into Galactic Astrophysics: Dark Matter and Stellar Orbits',
                    description: 'At the I Cycle of Astronomy Seminars at UNIFAL-MG, I presented my research on Stellar Orbits, discussing simulations of star movements and the compelling evidence for Dark Matter, such as the epic collision of the Bullet Cluster, where gravitational lensing reveals a mass 20 times greater than visible matter.',
                    image: {
                        src: 'images/seminario.jpg',
                        alt: 'Rafael Domingues presenting at an astronomy seminar'
                    },
                    links: [ { url: 'https://lnkd.in/deYnab4a', label: 'Related Research' } ],
                    tags: ['Dark Matter', 'Stellar Orbits', 'Astrophysics', 'Scientific Presentation'],
                    status: 'Completed',
                    date: '2019'
                },
                {
                    title: 'The Bullet Cluster: A Visual Proof of Dark Matter',
                    description: 'The Bullet Cluster provides one of the most dramatic pieces of evidence for dark matter. In this collision of galaxy clusters, the hot gas (ordinary matter) collides and slows down, while the dark matter passes through without interaction. This separation, observed through gravitational lensing, is a powerful confirmation of its existence.',
                    image: {
                        src: 'images/bullet-cluster-black-matter_upscayl.png',
                        alt: 'The Bullet Cluster, showing the separation of dark matter and normal matter'
                    },
                    tags: ['Cosmology', 'Dark Matter', 'Gravitational Lensing'],
                    status: 'Research Topic',
                    date: 'Ongoing Study'
                }
            ]
        },
        {
            id: 'astronomical-observatory',
            title: 'A Window to the Universe',
            subtitle: 'Scientific Outreach and Research at UNIFAL-MG (2015-2018)',
            type: 'gallery',
            metadata: { order: 3, visible: true },
            content: [
                { src: 'images/obs1.jpg', alt: 'Main telescope at the UNIFAL-MG Observatory', caption: 'The 380mm Cassegrain Telescope' },
                { src: 'images/escolaOBS1.png', alt: 'Scientific outreach event for schools', caption: 'Connecting students with the cosmos' },
                { src: 'images/obs2.jpg', alt: 'Public observation night at the observatory', caption: 'A night of public observation' },
                { src: 'images/obsGalaxiaSombrero.jpg', alt: 'Astrophotograph of the Sombrero Galaxy (M104)', caption: 'Astrophotography: The Sombrero Galaxy' },
                { src: 'images/escolaOBS2.jpg', alt: 'Students looking through the telescope', caption: 'Inspiring the next generation' },
                { src: 'images/obsLua.jpg', alt: 'Detailed observation of the Moon', caption: 'Revealing lunar craters' },
                { src: 'images/escolaOBS3.jpg', alt: 'Presenting astronomy concepts to students', caption: 'Sharing the wonders of astronomy' },
                { src: 'images/obs3.jpg', alt: 'A view of the observatory dome against the night sky', caption: 'The observatory dome' },
                { src: 'images/escolaOBS4.jpg', alt: 'Group of students at an observatory event', caption: 'School visit to the observatory' }
            ]
        },
        {
            id: 'craam-visit',
            title: 'Technical Visit to CRAAM',
            subtitle: 'Exploring the Brazilian Solar Radio Polarimeter',
            type: 'gallery',
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
            title: 'Experience at LNA',
            subtitle: 'Operating a classic instrument at Pico dos Dias Observatory',
            type: 'gallery',
            metadata: { order: 5, visible: true },
            content: [
                { src: 'images/obs4.jpg', alt: 'The LNA observatory at sunset', caption: 'Sunset at Pico dos Dias Observatory' },
                { src: 'images/obs5.jpg', alt: 'Aerial view of the National Laboratory of Astrophysics (LNA)', caption: 'National Laboratory of Astrophysics (LNA)' }
            ]
        },
        {
            id: 'innovation-entrepreneurship',
            title: 'Innovation and Entrepreneurship',
            subtitle: 'My work at NidusTec and the innovation ecosystem',
            type: 'cards',
            metadata: { order: 6, visible: true },
            content: [
                {
                    title: 'NidusTec - Technology-Based Business Incubator',
                    description: 'As part of the NidusTec team, I bridged academia and the market, helping transform innovative projects into successful startups. My role involved technical feasibility analysis, mentoring, and developing prototypes in our Maker Lab.',
                    image: {
                        src: 'images/nidus.jpg',
                        alt: 'NidusTec team receiving an award'
                    },
                    links: [
                        { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'ANPROTEC National Award News' },
                        { url: 'https://jornal.unifal-mg.edu.br/unifal-mg-aprova-criacao-do-centro-de-inovacao-e-empreendedorismo-universitario-cieu/', label: 'UNIFAL-MG Innovation Center News' }
                    ],
                    tags: ['Innovation', 'Entrepreneurship', 'Startups', 'Technology Transfer'],
                    status: 'Completed',
                    date: '2024-2025'
                }
            ]
        },
        {
            id: 'hobbies',
            title: 'Hobbies & Passions',
            subtitle: 'Beyond science and code',
            type: 'cards',
            metadata: { order: 7, visible: true },
            content: [
                 {
                    title: 'Motorcycling & Mountain Biking',
                    description: 'I have a passion for trail riding on my motorcycle and off-road mountain biking, exploring nature and embracing challenges.',
                    image: {
                        src: 'images/perfilMid.png', // Placeholder, suggest a photo of a bike or trail
                        alt: 'A mountain bike on a trail'
                    },
                    tags: ['Motorcycle', 'Mountain Biking', 'Off-road', 'Outdoors'],
                }
            ]
        }
    ]
};