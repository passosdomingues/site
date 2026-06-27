/**
 * @file propriedadeIntelectual.js
 * @brief Dados da seção Propriedade Intelectual (cards).
 */
export const PROPRIEDADE_INTELECTUAL = {
    id: 'propriedade-intelectual',
    title: 'Propriedade Intelectual',
    subtitle: 'Proteção de ativos tecnológicos junto ao INPI',
    type: 'cards',
    metadata: { order: 4, visible: true },
    content: [
        {
            title: 'BR 51 2025 006158-7 — LaserCutImageConversor',
            description: 'Processo de registro de software no INPI referente ao conversor de imagens para corte a laser com integração a controladoras RUIDA e geração de G-code via visão computacional.',
            links: [],
            tags: ['INPI', 'Registro de Software', 'Visão Computacional', 'G-code'],
            status: 'Em Trâmite',
            date: '2025'
        },
        {
            title: 'Portfólio de PI — NidusTec / UNIFAL-MG',
            description: 'Experiência em prospecção tecnológica sistemática, análise de anterioridade e apoio à redação técnica de pedidos de patente. Capacidade de traduzir algoritmos, hardwares e protótipos em ativos de PI com potencial de licenciamento e transferência tecnológica.',
            links: [
                { url: 'https://www.unifal-mg.edu.br/i9unifal/', label: 'Agência I9 — UNIFAL-MG' }
            ],
            tags: ['Busca de Anterioridade', 'Espacenet', 'Derwent Innovation', 'INPI', 'TRL'],
            status: 'Contínuo',
            date: '2024–2025'
        }
    ]
};
