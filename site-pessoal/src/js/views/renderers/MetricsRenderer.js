/**
 * @file MetricsRenderer.js
 * @brief Renderiza seções do tipo "metrics" (cards de impacto com números).
 * @description Módulo puro: recebe array de métricas, retorna HTML string.
 *              Para adicionar/remover uma métrica: editar só PortfolioData.js.
 *              Para mudar a aparência dos cards: editar só este arquivo.
 */

function esc(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

/**
 * @param {Array<{icon, value, label}>} content
 * @returns {string} HTML string
 */
export function renderMetrics(content) {
    if (!Array.isArray(content) || !content.length) return '';

    const cards = content.map((m, idx) => `
        <div class="metric-card animate-on-scroll"
             style="transition-delay:${idx * 0.08}s"
             role="listitem">
            <span class="metric-icon" aria-hidden="true">${m.icon || '📊'}</span>
            <div class="metric-value">${esc(m.value)}</div>
            <div class="metric-label">${esc(m.label)}</div>
        </div>
    `).join('');

    return `<div class="metrics-grid" role="list" aria-label="Métricas de impacto">${cards}</div>`;
}
