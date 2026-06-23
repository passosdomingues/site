/**
 * @file GalleryRenderer.js
 * @brief Renderiza seções do tipo "gallery" (grade de imagens com legenda).
 * @description Módulo puro: recebe array de itens de galeria, retorna HTML string.
 *              O primeiro item se torna "destaque" automaticamente se tiver description ou links.
 *              Para adicionar imagens: editar PortfolioData.js.
 *              Para mudar o grid ou hover: editar este arquivo + components.css.
 */

function esc(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

/**
 * Renderiza o item em destaque (com descrição e links externos).
 * @param {Object} item
 * @returns {string}
 */
function renderFeatured(item) {
    return `
        <div class="gallery-item-featured" role="article">
            ${item.imageUrl ? `
                <img src="${esc(item.imageUrl)}"
                     alt="${esc(item.caption || '')}"
                     class="gallery-featured-image"
                     loading="lazy">
            ` : ''}
            <div class="gallery-featured-info">
                ${item.caption
                    ? `<div class="gallery-featured-title">${esc(item.caption)}</div>`
                    : ''}
                ${item.description
                    ? `<p class="gallery-featured-desc">${esc(item.description)}</p>`
                    : ''}
                ${item.links?.length ? `
                    <div class="gallery-featured-links">
                        ${item.links.map(l => `
                            <a href="${esc(l.url)}"
                               target="_blank"
                               rel="noopener noreferrer">${esc(l.label)}</a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Renderiza item padrão da grade.
 * @param {Object} item
 * @returns {string}
 */
function renderGridItem(item) {
    return `
        <div class="gallery-item" role="listitem">
            <img src="${esc(item.imageUrl || '')}"
                 alt="${esc(item.caption || '')}"
                 class="gallery-image"
                 loading="lazy">
            ${item.caption
                ? `<div class="gallery-caption">${esc(item.caption)}</div>`
                : ''}
        </div>
    `;
}

/**
 * @param {Array} content - Array de itens de galeria
 * @returns {string} HTML string
 */
export function renderGallery(content) {
    if (!Array.isArray(content) || !content.length) return '';

    const [first, ...rest] = content;

    // Primeiro item com conteúdo rico → destaque; senão, vai para a grade normal
    const hasFeaturedContent = first?.description || first?.links?.length;
    const featuredHtml = hasFeaturedContent ? renderFeatured(first) : '';
    const gridItems = hasFeaturedContent ? rest : content;

    return `
        <div class="gallery-grid" role="list">
            ${featuredHtml}
            ${gridItems.map(renderGridItem).join('')}
        </div>
    `;
}
