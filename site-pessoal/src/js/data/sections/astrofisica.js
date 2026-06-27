/**
 * @file astrofisica.js
 * @brief Dados da seção Astrofísica — trajetória histórica (cards).
 * @note O card "Testing CCC+TL Cosmology" (coautoria ApJ) foi removido a pedido do autor.
 */
export const ASTROFISICA = {
    id: 'astrofisica',
    title: 'Astrofísica',
    subtitle: 'Pesquisa galáctica e extragaláctica — a origem da paixão por dados',
    type: 'cards',
    metadata: { order: 8, visible: true },
    content: [
        {
            title: 'Além do Telescópio: Astrofísica Galáctica na UNIFAL-MG',
            description: 'Iniciação científica em astrofísica galáctica com foco em órbitas estelares e matéria escura. O fascínio pelos dados observacionais foi o ponto de partida para a jornada em Ciência da Computação.',
            links: [
                { url: 'https://sciforum.net/paper/view/5868', label: 'Artigo Científico' }
            ],
            tags: ['Matéria Escura', 'Astrofísica Galáctica', 'Órbitas Estelares'],
            status: 'Concluído',
            date: '2019'
        }
    ]
};
