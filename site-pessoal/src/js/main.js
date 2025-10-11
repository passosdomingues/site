// ===== CONTENT MODEL - VERSÃO COMPLETA E DETALHADA =====
class ContentModel {
    constructor(options = {}) {
        this.sections = [];
        this.contentCache = new Map();
        this.configuration = {
            enableCaching: true,
            cacheTimeout: 300000,
            enableValidation: true,
            maxCacheSize: 100
        };
        this.isInitialized = false;
    }

    async initializeContentModel() {
        try {
            await this.loadAllContent();
            this.isInitialized = true;
            console.info('ContentModel: Modelo de conteúdo inicializado com sucesso');
        } catch (error) {
            console.error('ContentModel: Falha na inicialização:', error);
            throw error;
        }
    }

    async loadAllContent() {
        this.sections = this.initializeSections();
    }

    initializeSections() {
        return [
            {
                id: 'about',
                title: 'Sobre Mim',
                subtitle: 'Minha jornada acadêmica e profissional',
                type: 'timeline',
                content: this.getAboutContent(),
                metadata: { priority: 1, visible: true, order: 1 }
            },
            {
                id: 'astrophysics-research',
                title: 'Pesquisa em Astrofísica',
                subtitle: 'Trabalho em astrofísica galáctica e extragaláctica',
                type: 'cards',
                content: this.getAstrophysicsContent(),
                metadata: { priority: 2, visible: true, order: 2 }
            },
            {
                id: 'astronomical-observatory',
                title: 'Observatório Astronômico',
                subtitle: 'Extensão científica e pesquisa na UNIFAL-MG',
                type: 'gallery',
                content: this.getObservatoryContent(),
                metadata: { priority: 2, visible: true, order: 3 }
            },
            {
                id: 'innovation-entrepreneurship',
                title: 'Inovação e Empreendedorismo',
                subtitle: 'NidusTec e ecossistema de inovação',
                type: 'cards',
                content: this.getInnovationContent(),
                metadata: { priority: 2, visible: true, order: 4 }
            },
            {
                id: 'deep-learning-projects',
                title: 'Projetos de Deep Learning',
                subtitle: 'Aplicando ML/DL em imagens médicas e astrofísica',
                type: 'cards',
                content: this.getDeepLearningProjectsContent(),
                metadata: { priority: 1, visible: true, order: 5 }
            },
            {
                id: 'skills',
                title: 'Habilidades e Competências',
                subtitle: 'Áreas de conhecimento e tecnologias',
                type: 'skills',
                content: this.getSkillsContent(),
                metadata: { priority: 2, visible: true, order: 6 }
            }
        ];
    }

    getAboutContent() {
        return {
            introduction: 'Físico e Cientista da Computação apaixonado por pesquisa em astrofísica, análise de dados e inovação tecnológica. Minha jornada é uma mistura de pesquisa acadêmica e aplicação prática, sempre impulsionada pela curiosidade sobre como o universo funciona e como podemos usar a tecnologia para resolver problemas do mundo real.',
            timeline: [
                {
                    period: '2014-2018',
                    title: 'Bacharelado em Física, UNIFAL-MG',
                    description: 'Minha jornada acadêmica começou com o Bacharelado em Física na UNIFAL-MG. Durante este período, mergulhei no fascinante mundo da Astrofísica Galáctica e Extragaláctica, participando de pesquisas que me deram uma base sólida em metodologia científica e análise de dados complexos.',
                    highlights: ['Astrofísica', 'Iniciação Científica', 'Análise de Dados']
                },
                {
                    period: '2019-2023',
                    title: 'Bacharelado em Ciência da Computação, UNIFAL-MG',
                    description: 'Em busca de ferramentas mais poderosas para a pesquisa científica, cursei Ciência da Computação. Esta formação me proporcionou um profundo conhecimento em algoritmos, estruturas de dados e desenvolvimento de software, permitindo-me construir soluções computacionais para problemas científicos.',
                    highlights: ['Algoritmos', 'Desenvolvimento de Software', 'Inteligência Artificial']
                },
                {
                    period: '2020-Presente',
                    title: 'Pesquisador Colaborador, Observatório Astronômico da UNIFAL-MG',
                    description: 'No observatório, combino minhas duas paixões: astrofísica e computação. Desenvolvo projetos de pesquisa e extensão, incluindo a análise de dados astronômicos e a criação de ferramentas para divulgação científica. Este trabalho me permite estar na vanguarda da pesquisa e, ao mesmo tempo, compartilhar o conhecimento com o público.',
                    highlights: ['Pesquisa', 'Extensão', 'Divulgação Científica']
                }
            ]
        };
    }

    getAstrophysicsContent() {
        return [
            {
                title: 'Análise de Populações Estelares em Galáxias',
                description: 'Este projeto foca na análise de populações estelares em galáxias distantes usando dados do telescópio Hubble. Desenvolvi um pipeline de processamento de imagens e análise de dados em Python para extrair informações sobre a idade e a metalicidade das estrelas.',
                date: '2022',
                status: 'Concluído',
                tags: ['Python', 'Astrofísica', 'Processamento de Imagem', 'Hubble']
            },
            {
                title: 'Modelagem de Discos de Acréscimo em Buracos Negros',
                description: 'Utilizando simulações hidrodinâmicas, este trabalho investiga a estrutura e a dinâmica dos discos de acréscimo ao redor de buracos negros supermassivos. O objetivo é entender como esses discos alimentam os buracos negros e influenciam a evolução das galáxias.',
                date: '2023',
                status: 'Em andamento',
                tags: ['Simulação', 'Astrofísica Teórica', 'Python', 'HPC']
            },
            {
                title: 'Detecção de Exoplanetas com Redes Neurais',
                description: 'Este projeto explora o uso de redes neurais convolucionais (CNNs) para detectar trânsitos de exoplanetas em curvas de luz de telescópios como o Kepler e o TESS. A abordagem de deep learning visa aumentar a eficiência e a precisão da detecção em grandes volumes de dados.',
                date: '2024',
                status: 'Em andamento',
                tags: ['Deep Learning', 'Python', 'TensorFlow', 'Astrofísica']
            }
        ];
    }
    
    getObservatoryContent() {
        // Mock de dados de imagens. Substitua pelos caminhos reais das suas imagens.
        // As imagens devem estar na pasta `public/` para que o Vite as copie para a `dist/`
        return [
            {
                imageUrl: './images/obs1.jpg',
                caption: 'Telescópio principal do Observatório da UNIFAL-MG'
            },
            {
                imageUrl: './images/obs2.jpg',
                caption: 'Noite de observação aberta ao público'
            },
            {
                imageUrl: './images/obs3.jpg',
                caption: 'Registro da Nebulosa de Órion (M42)'
            },
            {
                imageUrl: './images/obs4.jpg',
                caption: 'Equipe de pesquisa e extensão do observatório'
            },
            {
                imageUrl: './images/obs5.jpg',
                caption: 'Cúpula do observatório sob o céu estrelado'
            },
            {
                imageUrl: './images/seminario.jpg',
                caption: 'Palestra de divulgação científica para escolas'
            }
        ];
    }
    
    getInnovationContent() {
        return [
            {
                title: 'NidusTec - Incubadora de Empresas de Base Tecnológica',
                description: 'Como parte da equipe da NidusTec, atuei na conexão entre a pesquisa acadêmica e o mercado, ajudando a transformar projetos inovadores em startups de sucesso. Minha função envolvia a análise de viabilidade técnica de projetos, mentoria em desenvolvimento de produtos e a busca por tecnologias emergentes com potencial de mercado.',
                date: '2021-2023',
                status: 'Concluído',
                tags: ['Inovação', 'Empreendedorismo', 'Tecnologia', 'Startups']
            },
            {
                title: 'Desenvolvimento de um Sistema de Análise de Dados para Agricultura de Precisão',
                description: 'Este projeto, desenvolvido em parceria com uma startup da NidusTec, criou uma plataforma para análise de dados de drones e sensores em campo. O sistema utiliza algoritmos de machine learning para otimizar o uso de recursos, como água e fertilizantes, aumentando a produtividade e a sustentabilidade no agronegócio.',
                date: '2022',
                status: 'Concluído',
                tags: ['Machine Learning', 'Agricultura de Precisão', 'Python', 'Inovação']
            }
        ];
    }

    getDeepLearningProjectsContent() {
        return [
            {
                title: 'Segmentação de Tumores Cerebrais em Imagens de Ressonância Magnética',
                description: 'Este projeto utilizou uma arquitetura U-Net para a segmentação automática de tumores cerebrais em imagens de ressonância magnética. O objetivo foi criar uma ferramenta de apoio ao diagnóstico médico, aumentando a precisão e a rapidez da análise. O modelo foi treinado em um grande dataset de imagens médicas e alcançou alta performance.',
                date: '2023',
                status: 'Concluído',
                tags: ['Deep Learning', 'Visão Computacional', 'Python', 'TensorFlow', 'Medicina']
            },
            {
                title: 'Classificação Morfológica de Galáxias com CNNs',
                description: 'Utilizando dados do projeto Galaxy Zoo, desenvolvi uma rede neural convolucional para classificar galáxias com base em sua morfologia (espiral, elíptica, etc.). O projeto demonstrou como o deep learning pode automatizar tarefas de classificação em grandes surveys astronômicos, acelerando a pesquisa científica.',
                date: '2022',
                status: 'Concluído',
                tags: ['Deep Learning', 'Astrofísica', 'Python', 'PyTorch', 'Ciência de Dados']
            }
        ];
    }

    getSkillsContent() {
        return [
            {
                category: 'Linguagens de Programação',
                skills: [
                    { name: 'Python', proficiency: 95, description: 'Análise de dados, ML/DL, automação, web.' },
                    { name: 'JavaScript / TypeScript', proficiency: 85, description: 'Desenvolvimento web front-end e back-end (Node.js).' },
                    { name: 'C/C++', proficiency: 70, description: 'Programação de sistemas e computação de alto desempenho.' },
                    { name: 'SQL', proficiency: 80, description: 'Manipulação e consulta de bancos de dados relacionais.' }
                ]
            },
            {
                category: 'Ciência de Dados & Machine Learning',
                skills: [
                    { name: 'TensorFlow / PyTorch', proficiency: 90, description: 'Frameworks de Deep Learning para visão computacional e NLP.' },
                    { name: 'Scikit-learn', proficiency: 95, description: 'Modelos clássicos de Machine Learning.' },
                    { name: 'Pandas / NumPy / Matplotlib', proficiency: 98, description: 'Ferramentas essenciais para análise e visualização de dados.' },
                    { name: 'Processamento de Imagem (OpenCV)', proficiency: 85, description: 'Análise e manipulação de imagens para aplicações científicas.' }
                ]
            },
            {
                category: 'Ferramentas e Tecnologias',
                skills: [
                    { name: 'Git / GitHub', proficiency: 95, description: 'Versionamento de código e colaboração.' },
                    { name: 'Docker', proficiency: 75, description: 'Containerização de aplicações para portabilidade e deploy.' },
                    { name: 'Linux / Shell Scripting', proficiency: 85, description: 'Administração de sistemas e automação de tarefas.' },
                    { name: 'Computação em Nuvem (AWS/GCP)', proficiency: 60, description: 'Conhecimentos básicos em serviços de nuvem para computação e armazenamento.' }
                ]
            }
        ];
    }

    getSectionById(id) {
        return this.sections.find(section => section.id === id);
    }

    getAllSections() {
        return [...this.sections].sort((a, b) => a.metadata.order - b.metadata.order);
    }
}


// ===== VIEW MANAGER - RESPONSÁVEL PELA RENDERIZAÇÃO =====
class ViewManager {
    constructor(sectionsContainer) {
        if (!sectionsContainer) {
            throw new Error("ViewManager: O container de seções é obrigatório.");
        }
        this.container = sectionsContainer;
        this.renderMap = {
            timeline: this.renderTimeline,
            cards: this.renderCards,
            skills: this.renderSkills,
            gallery: this.renderGallery,
        };
    }

    renderSection(section) {
        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        sectionElement.className = `section section--${section.type}`;

        const renderer = this.renderMap[section.type];
        if (typeof renderer !== 'function') {
            console.warn(`ViewManager: Nenhum método de renderização para o tipo "${section.type}".`);
            return;
        }

        const sectionContent = renderer.call(this, section.content);
        
        sectionElement.innerHTML = `
            <div class="section-container">
                <header class="section-header">
                    <h2 class="section-title">${section.title}</h2>
                    <p class="section-subtitle">${section.subtitle}</p>
                </header>
                ${sectionContent}
            </div>
        `;

        this.container.appendChild(sectionElement);
    }

    renderTimeline(content) {
        const timelineItems = content.timeline.map(item => `
            <div class="timeline-item">
                <div class="timeline-period">${item.period}</div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                    <div class="highlights-list">
                        ${item.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        return `<div class="timeline">${timelineItems}</div>`;
    }

    renderCards(content) {
        const cards = content.map(item => `
            <div class="card">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
                <div class="tags-container">
                    ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="card-meta">
                    <span class="card-date">${item.date}</span>
                    <span class="card-status">${item.status}</span>
                </div>
            </div>
        `).join('');

        return `<div class="cards-grid">${cards}</div>`;
    }

    renderSkills(content) {
        const categories = content.map(category => `
            <div class="skill-category">
                <h3 class="category-title">${category.category}</h3>
                <div class="skills-list">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-header">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-proficiency">${skill.proficiency}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.proficiency}%;"></div>
                            </div>
                            <p class="skill-description">${skill.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        return `<div class="skills-categories">${categories}</div>`;
    }
    
    renderGallery(content) {
        const items = content.map(item => `
            <div class="gallery-item">
                <images src="${item.imageUrl}" alt="${item.caption}" class="gallery-image" loading="lazy">
                <div class="gallery-caption">${item.caption}</div>
            </div>
        `).join('');

        return `<div class="gallery-grid">${items}</div>`;
    }
}


// ===== RENDER ENGINE - ORQUESTRADOR PRINCIPAL =====
class RenderEngine {
    constructor() {
        this.contentModel = new ContentModel();
        
        const sectionsContainer = document.getElementById('sections-container');
        if (!sectionsContainer) {
            throw new Error("RenderEngine: Elemento 'sections-container' não encontrado no DOM.");
        }
        this.viewManager = new ViewManager(sectionsContainer);
        
        this.navContainer = document.getElementById('nav-list');
    }

    async initialize() {
        await this.contentModel.initializeContentModel();
        this.renderAll();
        this.setupEventListeners();
        this.hideLoadingOverlay();
    }

    renderAll() {
        this.renderNavigation();
        const sections = this.contentModel.getAllSections();
        sections.forEach(section => {
            if (section.metadata.visible) {
                this.viewManager.renderSection(section);
            }
        });
    }

    renderNavigation() {
        if (!this.navContainer) return;
        
        const sections = this.contentModel.getAllSections();
        const navLinks = sections
            .filter(s => s.metadata.visible)
            .map(section => `
                <li>
                    <a href="#${section.id}" class="nav-link" data-nav-id="${section.id}">
                        ${section.title}
                    </a>
                </li>
            `);
        this.navContainer.innerHTML = navLinks.join('');
    }



    setupEventListeners() {
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        if (!this.navContainer) return;

        const scrollPosition = window.scrollY + 150; // Offset
        const sections = this.contentModel.getAllSections();
        
        let activeSectionId = null;

        for (const section of sections) {
            const sectionElement = document.getElementById(section.id);
            if (sectionElement && scrollPosition >= sectionElement.offsetTop) {
                activeSectionId = section.id;
            }
        }
        
        const links = this.navContainer.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.navId === activeSectionId) {
                link.classList.add('active');
            }
        });
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = new RenderEngine();
        await app.initialize();
        
        // Para debugging
        window.app = app;
        
        console.log('Portfólio carregado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        document.getElementById('loading-overlay').innerHTML = `
            <div style="text-align: center; color: white;">
                <h2>Erro ao carregar</h2>
                <p>Por favor, recarregue a página.</p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 20px;">
                    Recarregar
                </button>
            </div>
        `;
    }
});