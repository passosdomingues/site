/**
 * @file SkillsRenderer.js
 * @brief Renderiza seções do tipo "skills" (categorias com barras de progresso).
 * @description Módulo puro: recebe array de categorias, retorna HTML string.
 *              As barras de progresso são animadas via IntersectionObserver no ViewManager.
 *              Para adicionar uma skill: editar PortfolioData.js.
 *              Para mudar o visual das barras: editar este arquivo + components.css.
 */

function esc(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

/**
 * @param {Array<{category, skills: Array<{name, proficiency, description, links}>}>} content
 * @returns {string} HTML string
 */
export function renderSkills(content) {
    if (!Array.isArray(content) || !content.length) return '';

    const categories = content.map(cat => {
        const skills = cat.skills.map(skill => {
            const hasPct = typeof skill.proficiency === 'number';

            const linksHtml = skill.links?.length ? `
                <div class="skill-links">
                    ${skill.links.map(l =>
                        `<a href="${esc(l.url)}"
                             target="_blank"
                             rel="noopener noreferrer">${esc(l.label)}</a>`
                    ).join(' · ')}
                </div>
            ` : '';

            return `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${esc(skill.name)}</span>
                        ${hasPct ? `<span class="skill-percent">${skill.proficiency}%</span>` : ''}
                    </div>
                    ${hasPct ? `
                        <div class="skill-bar" role="progressbar"
                             aria-valuenow="${skill.proficiency}"
                             aria-valuemin="0"
                             aria-valuemax="100"
                             aria-label="${esc(skill.name)}: ${skill.proficiency}%">
                            <div class="skill-progress"
                                 data-proficiency="${skill.proficiency}"
                                 style="width:0%">
                            </div>
                        </div>
                    ` : ''}
                    <p class="skill-description">${esc(skill.description)}</p>
                    ${linksHtml}
                </div>
            `;
        }).join('');

        return `
            <div class="skill-category">
                <h3 class="category-title">${esc(cat.category)}</h3>
                <div class="skills-list">${skills}</div>
            </div>
        `;
    }).join('');

    return `<div class="skills-categories">${categories}</div>`;
}
