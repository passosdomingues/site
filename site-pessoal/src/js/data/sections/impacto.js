/**
 * @file impacto.js
 * @brief Dados da seção Impacto & Resultados (metrics cards).
 */
export const IMPACTO = {
    id: 'impacto',
    title: 'Impacto & Resultados',
    subtitle: 'Números que resumem a trajetória recente',
    type: 'metrics',
    metadata: { order: 2, visible: true },
    content: [
        { value: '29',    label: 'Processos CERNE geridos',                    icon: 'cogs'   },
        { value: '64+',   label: 'Protótipos com potencial mercadológico',      icon: 'tools'  },
        { value: '4',     label: 'Startups orientadas (1 internacionalizada)',  icon: 'globe'  },
        { value: '4',     label: 'Softwares em registro no INPI',               icon: 'file'   },
        { value: '750h+', label: 'Certificações e capacitações',                icon: 'award'  },
        { value: '2024',  label: 'Troféu ANPROTEC — Adelino Medeiros',          icon: 'trophy' }
    ]
};
