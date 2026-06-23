/**
 * @file TimelineRenderer.js
 * @brief Renderiza seções do tipo "timeline".
 * @description Módulo puro: recebe dados, retorna HTML string.
 *              Editar a aparência da timeline = editar só este arquivo.
 */

/**
 * @param {string} text
 * @returns {string}
 */
function esc(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

/**
 * @param {Object} content - { timeline: Array }
 * @returns {string} HTML string
 */
export function renderTimeline(content) {
    if (!content?.timeline?.length) return '<p>Nenhum dado de trajetória.</p>';

    const items = content.timeline.map((item, idx) => `
        <div class="timeline-item animate-on-scroll" style="transition-delay:${idx * 0.1}s">
            <div class="timeline-icon" aria-hidden="true">${item.icon || '📌'}</div>
            <div class="timeline-content">
                <div class="timeline-period">${esc(item.period)}</div>
                <h3 class="timeline-title">${esc(item.title)}</h3>
                <p class="timeline-description">${esc(item.description)}</p>
                ${item.highlights?.length ? `
                    <div class="highlights-list" aria-label="Destaques">
                        ${item.highlights.map(h => `<span class="highlight-tag">${esc(h)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

    return `<div class="timeline" role="list">${items}</div>`;
}
