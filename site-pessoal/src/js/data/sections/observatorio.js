/**
 * @file observatorio.js
 * @brief Dados da seção Observatório Astronômico — galeria de imagens.
 */
export const OBSERVATORIO = {
    id: 'observatorio',
    title: 'Observatório Astronômico',
    subtitle: 'Divulgação científica e pesquisa na UNIFAL-MG',
    type: 'gallery',
    metadata: { order: 9, visible: true },
    content: [
        { imageUrl: './images/bullet-cluster-black-matter_upscayl.png', caption: 'Bullet Cluster — distribuição de matéria escura' },
        { imageUrl: './images/seminario.jpg',          caption: 'Seminário de Astronomia — UNIFAL-MG'        },
        { imageUrl: './images/obs1.jpg',               caption: 'Telescópio principal do Observatório UNIFAL-MG' },
        { imageUrl: './images/obs2.jpg',               caption: 'Noite de observação pública'               },
        { imageUrl: './images/obs3.jpg',               caption: 'Registro da Nebulosa de Orion (M42)'       },
        { imageUrl: './images/escolaOBS1.png',         caption: 'Divulgação científica nas escolas'         },
        { imageUrl: './images/escolaOBS2.jpg',         caption: 'Estudantes no telescópio'                  },
        { imageUrl: './images/obs4.jpg',               caption: 'Observatório LNA ao entardecer'            },
        { imageUrl: './images/obs5.jpg',               caption: 'Vista aérea do LNA — Pico dos Dias'        },
        { imageUrl: './images/obsLua.jpg',             caption: 'Observação da Lua'                         },
        { imageUrl: './images/obsGalaxiaSombrero.jpg', caption: 'Galáxia Sombrero (M104)'                   }
    ]
};
