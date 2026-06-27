/**
 * @file projetos.js
 * @brief Dados da seção Projetos de Software (cards).
 */
export const PROJETOS = {
    id: 'projetos',
    title: 'Projetos de Software',
    subtitle: 'Soluções desenvolvidas para inovação, manufatura e educação',
    type: 'cards',
    metadata: { order: 3, visible: true },
    content: [
        {
            title: 'NEVA — Sistema de Gestão Integrada de Incubadoras (CERNE)',
            description: 'Software corporativo para gestão de práticas e processos do Modelo CERNE em incubadoras. Centraliza o acompanhamento de empresas, indicadores e auditoria de maturidade para certificação.',
            links: [],
            tags: ['Java', 'Spring Boot', 'CERNE', 'Gestão de Inovação', 'INPI'],
            status: 'Em Registro',
            date: '2024–2025'
        },
        {
            title: 'LaserCutImageConversor — Conversão Inteligente para Laser CNC',
            description: 'Conversor e fatiador de imagens raster em modelos vetoriais otimizados para gravação e corte em máquinas laser CO2 controladas por placas RUIDA. Gera G-code diretamente via OpenCV. Processo INPI: BR 51 2025 006158-7.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/utilities/CNCImageConversor.html', label: 'Demo Online' }
            ],
            tags: ['Python', 'OpenCV', 'G-code', 'RUIDA', 'Laser CNC', 'INPI'],
            status: 'Registrado — INPI',
            date: '2024–2025',
            highlight: 'BR 51 2025 006158-7'
        },
        {
            title: '3DPrintSculptor — Vetorização e Relevo para Impressão 3D',
            description: 'Ferramenta utilitária de computação gráfica para conversão de imagens bidimensionais em modelos tridimensionais (relevos e esculturas) prontos para fatiadores e impressão 3D.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/utilities/3DPrintScultor.html', label: 'Demo Online' }
            ],
            tags: ['Python', 'Computação Gráfica', 'Impressão 3D', 'STL'],
            status: 'Em Registro',
            date: '2024–2025'
        },
        {
            title: 'Oráculo CERNE — Motor de Busca com Okapi BM25',
            description: 'Motor de busca inteligente client-side baseado no algoritmo Okapi BM25. Desenvolvido para indexar as práticas e regulamentos do Modelo CERNE, com busca preditiva, did-you-mean, autocomplete e destaque semântico.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/utilities/oraculoCerne.html', label: 'Demo Online' }
            ],
            tags: ['JavaScript', 'BM25', 'Autocomplete', 'CERNE', 'Inovação'],
            status: 'Ativo',
            date: '2025'
        },
        {
            title: 'Busca Contexto PDF — Extrator Semântico de Documentos',
            description: 'Utilitário de leitura e busca avançada em múltiplos arquivos PDF. Analisa e fragmenta os textos do documento em parágrafos estruturados, permitindo buscas de contexto extremamente inteligentes e ordenação por relevância via BM25.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/utilities/buscaContextoPDFs.html', label: 'Demo Online' }
            ],
            tags: ['JavaScript', 'PDF.js', 'BM25', 'Semantic Search', 'Client-Side'],
            status: 'Ativo',
            date: '2025'
        },
        {
            title: 'Calculadora TRL & CRL — Avaliação de Maturidade de Startups',
            description: 'Sistema interativo de avaliação de prontidão tecnológica (Technology Readiness Level) e maturidade de mercado (Customer Readiness Level). Mapeia graficamente o progresso de soluções inovadoras.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/utilities/calculadora_trl_crl.html', label: 'Demo Online' }
            ],
            tags: ['JavaScript', 'TRL', 'CRL', 'Inovação', 'Maturidade'],
            status: 'Ativo',
            date: '2025'
        },
        {
            title: 'busHour — Grade e Rotas de Transporte Público de Alfenas',
            description: 'Painel inteligente de transporte urbano integrando horários de partidas, trajetos de 13 linhas integradas e cálculo de ETA (Tempo Estimado de Chegada) em tempo real, otimizado para mobile.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/utilities/busHour.html', label: 'Demo Online' }
            ],
            tags: ['JavaScript', 'Google Maps', 'UX/UI', 'Mobile First'],
            status: 'Ativo',
            date: '2025'
        },
        {
            title: 'MakerFlow — Gestão de Espaços Maker (Makerspace)',
            description: 'Plataforma para administração de laboratórios maker: cadastro de usuários, agendamento de equipamentos (impressoras 3D, cortadoras laser) e registro de projetos e consumo de insumos.',
            links: [],
            tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Gestão Maker'],
            status: 'Em Registro',
            date: '2024–2025'
        },
        {
            title: 'LLM para Manufatura Generativa',
            description: 'Modelo de linguagem especializado em modelagem e fatiamento 3D. Permite tradução de comandos em linguagem natural diretamente para código G-code integrado ao fatiamento.',
            links: [
                { url: 'https://youtu.be/4R1Z92z-zNs', label: 'Apresentação em Vídeo' }
            ],
            tags: ['LLM', 'Gemini API', 'G-code', 'RUIDA', 'Manufatura Generativa'],
            status: 'Pesquisa Aplicada',
            date: '2024–2025'
        },
        {
            title: 'WebApp Showcase — Hub de Utilitários Browser-Based',
            description: 'Catálogo de aplicações client-side leves e focadas em privacidade. Centraliza mais de 45 ferramentas para desenvolvedores, pesquisadores e gestão de inovação.',
            links: [
                { url: 'https://passosdomingues.github.io/webappshowcase/site/main.html', label: 'Ver Showcase' }
            ],
            tags: ['JavaScript', 'HTML5', 'CSS3', 'Client-Side'],
            status: 'Ativo',
            date: '2023–presente'
        }
    ]
};
