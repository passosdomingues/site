/**
 * @file publicacoes.js
 * @brief Dados da seção Publicações e Prêmios (cards).
 * @note O card do Astrophysical Journal (coautoria) foi removido a pedido do autor.
 */
export const PUBLICACOES = {
    id: 'publicacoes',
    title: 'Publicações e Prêmios',
    subtitle: 'Reconhecimentos e contribuições ao ecossistema de inovação',
    type: 'cards',
    metadata: { order: 5, visible: true },
    content: [
        {
            title: 'Prêmio Nacional ANPROTEC 2024 — Troféu Adelino Medeiros (Bronze)',
            description: 'Reconhecimento nacional pelo trabalho desenvolvido na NidusTec/UNIFAL-MG, na categoria de inovação empreendedora. Premiação realizada em São José dos Campos.',
            links: [
                { url: 'https://anprotec.org.br/site/2024/12/premio-nacional-anprotec-de-empreendedorismo-inovador-2024-revela-vencedores-em-sao-jose-dos-campos/', label: 'Notícia ANPROTEC' }
            ],
            tags: ['ANPROTEC', 'Inovação', 'Empreendedorismo', 'Prêmio Nacional'],
            status: 'Premiado',
            date: '2024'
        },
        {
            title: 'Artigo — 34ª ANPROTEC: Metodologia para Medição dos Impactos do Modelo CERNE',
            description: 'Desenvolvimento de metodologia para medição dos impactos e validação da implementação do Modelo CERNE. Artigo técnico publicado nos anais da 34ª ANPROTEC.',
            links: [],
            tags: ['CERNE', 'Metodologia', 'Incubação', 'Publicação Técnica'],
            status: 'Publicado',
            date: '2024'
        },
        {
            title: 'Relato de Boas Práticas — 34ª ANPROTEC: Agência I9 · UNIFAL-MG',
            description: 'Relato de boas práticas referente à gestão da Agência de Inovação e Empreendedorismo da UNIFAL-MG, apresentado na conferência nacional da ANPROTEC.',
            links: [],
            tags: ['ANPROTEC', 'Boas Práticas', 'Agência I9', 'Gestão'],
            status: 'Publicado',
            date: '2024'
        }
    ]
};
