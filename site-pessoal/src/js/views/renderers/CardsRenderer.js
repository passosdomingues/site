/**
 * @file CardsRenderer.js
 * @brief Renderiza seções do tipo "cards" (projetos, publicações, PI, etc.).
 * @description Módulo puro: recebe array de cards, retorna HTML string.
 *              Suporta: highlight badge, links externos, tags, status, data.
 *              Para mudar a aparência de qualquer card: editar só este arquivo.
 */

function esc(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

/** Mapeia status → CSS class para cor da bolinha */
function statusClass(status) {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s.includes('registro')) return 'status-em-registro';
    if (s.includes('pesquisa')) return 'status-pesquisa';
    if (s.includes('ativo') || s.includes('ongoing')) return 'status-ativo';
    if (s.includes('publicado') || s.includes('premiado')) return 'status-ativo';
    return '';
}

/**
 * @param {Array} content - Array de objetos card
 * @returns {string} HTML string
 */
export function renderCards(content) {
    if (!Array.isArray(content) || !content.length) return '';

    const cards = content.map((item, idx) => {
        const linksHtml = item.links?.length ? `
            <div class="card-links">
                ${item.links.map(l => `
                    <a href="${esc(l.url)}"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="${esc(l.label)}">
                        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                        ${esc(l.label)}
                    </a>
                `).join('')}
            </div>
        ` : '';

        const tagsHtml = item.tags?.length ? `
            <div class="tags-container" aria-label="Tecnologias">
                ${item.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
            </div>
        ` : '';

        return `
            <article class="card animate-on-scroll"
                     style="transition-delay:${idx * 0.07}s"
                     aria-label="${esc(item.title)}">
                ${item.highlight
                    ? `<div class="card-highlight-badge" aria-label="Destaque"><i class="fas fa-bookmark" aria-hidden="true"></i> ${esc(item.highlight)}</div>`
                    : ''}
                <h3 class="card-title">${esc(item.title)}</h3>
                <p class="card-description">${esc(item.description)}</p>
                ${linksHtml}
                ${tagsHtml}
                <footer class="card-meta">
                    <span class="card-date">${esc(item.date || '')}</span>
                    <span class="card-status ${statusClass(item.status)}"
                          aria-label="Status: ${esc(item.status || '')}">
                        ${esc(item.status || '')}
                    </span>
                </footer>
            </article>
        `;
    }).join('');

    return `<div class="cards-grid" role="list">${cards}</div>`;
}
