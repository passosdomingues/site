/**
 * @file deepLearning.js
 * @brief Dados da seção Deep Learning & Visão Computacional (cards).
 */
export const DEEP_LEARNING = {
    id: 'deep-learning',
    title: 'Deep Learning & Visão Computacional',
    subtitle: 'Aplicações em medicina, astrofísica e manufatura',
    type: 'cards',
    metadata: { order: 7, visible: true },
    content: [
        {
            title: 'Segmentação de Tumores Cerebrais em Ressonância Magnética',
            description: 'Arquitetura U-Net para segmentação automática de tumores cerebrais em imagens de RM. Projeto desenvolvido como parte da iniciação em Deep Learning aplicado à medicina.',
            links: [
                { url: 'https://youtu.be/11ahe2JBN5c', label: 'Pipeline Completo de ML para Diagnóstico de Câncer' },
                { url: 'https://youtu.be/Sdd98HDahPA', label: 'Redução de Dimensionalidade — Uma Perspectiva Física' }
            ],
            tags: ['Deep Learning', 'U-Net', 'TensorFlow', 'Medicina', 'Python'],
            status: 'Concluído',
            date: '2023'
        },
        {
            title: 'Classificação Morfológica de Galáxias com CNNs',
            description: 'Rede neural convolucional para classificar galáxias por morfologia usando dados do Galaxy Zoo. Interseção entre astrofísica observacional e visão computacional.',
            links: [
                { url: 'https://youtu.be/naBvOJhUAH4', label: 'Simulação Estocástica: M/M/1 e o Universo' }
            ],
            tags: ['CNN', 'PyTorch', 'Astrofísica', 'Galaxy Zoo', 'Python'],
            status: 'Concluído',
            date: '2022'
        },
        {
            title: 'Materialização de Pixels — Laser CNC com Visão Computacional',
            description: 'Da imagem ao corte físico: pipeline completo de visão computacional para geração de G-code e envio a cortadoras laser com controladora RUIDA.',
            links: [
                { url: 'https://youtu.be/4R1Z92z-zNs', label: 'Da Imagem à Matéria — CO₂ Laser & G-code' }
            ],
            tags: ['OpenCV', 'G-code', 'RUIDA', 'Laser CNC', 'Python'],
            status: 'Em Produção',
            date: '2024–2025'
        }
    ]
};
