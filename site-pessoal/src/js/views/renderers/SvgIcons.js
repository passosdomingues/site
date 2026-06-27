/**
 * @file SvgIcons.js
 * @brief Registro centralizado de ícones via Font Awesome 6 Free.
 * @description Cada chave mapeia para as classes FA correspondentes.
 *              Uso: renderIcon('rocket') → <i class="fa-solid fa-rocket icon-accent" aria-hidden="true"></i>
 *
 *              Para trocar um ícone: edite apenas o mapeamento abaixo.
 *              A cor segue var(--color-accent) via CSS (.icon-accent).
 */

/** @type {Record<string, string>} chave → classes FA */
export const ICON_MAP = {
    // ── Trajetória (Timeline) ────────────────────────
    university: 'fa-solid fa-graduation-cap',
    teacher:    'fa-solid fa-chalkboard-user',
    graduate:   'fa-solid fa-user-graduate',
    code:       'fa-solid fa-code',
    rocket:     'fa-solid fa-rocket',

    // ── Métricas ─────────────────────────────────────
    cogs:   'fa-solid fa-gear',
    tools:  'fa-solid fa-screwdriver-wrench',
    globe:  'fa-solid fa-globe',
    file:   'fa-solid fa-file-lines',
    award:  'fa-solid fa-award',
    trophy: 'fa-solid fa-trophy',

    // ── Cards / Links ─────────────────────────────────
    bookmark: 'fa-solid fa-bookmark',
    link:     'fa-solid fa-arrow-up-right-from-square',

    // ── Contatos & Redes Sociais ─────────────────────
    github:    'fa-brands fa-github',
    linkedin:  'fa-brands fa-linkedin',
    whatsapp:  'fa-brands fa-whatsapp',
    gitBranch: 'fa-solid fa-code-branch',
    envelope:  'fa-solid fa-envelope',
    lattes:    'fa-solid fa-id-card',

    // ── Acessibilidade ────────────────────────────────
    accessibility: 'fa-solid fa-universal-access',
    adjust:        'fa-solid fa-circle-half-stroke',
    eyeSlash:      'fa-solid fa-eye-slash',

    // ── UI Geral ──────────────────────────────────────
    menu:  'fa-solid fa-bars',
    close: 'fa-solid fa-xmark',
    star:  'fa-solid fa-star',
    plus:  'fa-solid fa-plus'
};

/**
 * Renderiza um ícone FA como string HTML.
 * @param {string} key - Chave do ICON_MAP
 * @param {string} [extraClass=''] - Classes CSS adicionais
 * @returns {string} HTML string do elemento <i>
 */
export function renderIcon(key, extraClass = '') {
    const classes = ICON_MAP[key] || 'fa-solid fa-circle-question';
    return `<i class="${classes} icon-accent${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"></i>`;
}

/**
 * @deprecated Compatibilidade retroativa — use renderIcon() em código novo.
 * Mantido para não quebrar importações de SVG_ICONS existentes durante migração.
 */
export const SVG_ICONS = new Proxy(ICON_MAP, {
    get(target, key) {
        if (key in target) return renderIcon(key);
        return '';
    }
});
