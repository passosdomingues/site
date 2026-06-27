/**
 * @file trajetoria.js
 * @brief Dados da seção Timeline — trajetória acadêmica e profissional.
 */
export const TRAJETORIA = {
    id: 'sobre',
    title: 'Trajetória',
    subtitle: 'Da Física à Inovação Tecnológica',
    type: 'timeline',
    metadata: { order: 1, visible: true },
    content: {
        timeline: [
            {
                period: '2014–2018',
                icon: 'university',
                title: 'Licenciatura em Física — UNIFAL-MG',
                description: 'Atuação em divulgação científica no Observatório Astronômico da UNIFAL-MG (2015–2019). Iniciação científica em Astrofísica Galáctica e Extragaláctica, com foco em análise de dados observacionais.',
                highlights: ['Astrofísica', 'Iniciação Científica', 'Divulgação Científica']
            },
            {
                period: '2019–2022',
                icon: 'teacher',
                title: 'Professor de Física — SEE-MG',
                description: 'Ensino de Física em três municípios mineiros. Desenvolvimento de plataforma de ensino remoto para 640+ alunos durante a pandemia, reconhecida pela Secretaria Estadual de Educação como boa prática.',
                highlights: ['Ensino', 'Plataforma Digital', 'Educação Remota']
            },
            {
                period: '2021–2023',
                icon: 'graduate',
                title: 'Mestrado em Física — UNIFEI',
                description: 'Pesquisa em Núcleos Galácticos Ativos (AGN). Quando adquiri paixão especial por dados e análise computacional, o que catalisou a transição de carreira.',
                highlights: ['AGN', 'Análise de Dados', 'Pesquisa Científica']
            },
            {
                period: '2023–presente',
                icon: 'code',
                title: 'Bacharelado em Ciência da Computação — UNIFAL-MG',
                description: 'Transição de carreira para Ciência da Computação. Bolsista FAPEMIG na Incubadora NidusTec (2024–2025). Foco em Deep Learning, Visão Computacional, Manufatura Generativa e Arquitetura de Software.',
                highlights: ['Transição de Carreira', 'Desenvolvimento de Software', 'Pesquisa Aplicada']
            },
            {
                period: '2024–2025',
                icon: 'rocket',
                title: 'Bolsista CT&I Nível III — FAPEMIG / NidusTec · UNIFAL-MG',
                description: 'Atuação em ambiente de inovação, incubação, prototipagem e apoio a empreendimentos tecnológicos. Gestão de 29 processos do Modelo CERNE. Contribuição para evolução da NidusTec de CERNE 1 para CERNE 2. Desenvolvimento de 64+ protótipos com potencial mercadológico.',
                highlights: ['Modelo CERNE', 'Incubação', 'Prototipagem', 'Manufatura Maker', 'Propriedade Intelectual']
            }
        ]
    }
};
