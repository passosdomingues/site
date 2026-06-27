/**
 * @file index.js
 * @brief Barrel de exportações dos renderers.
 * @description Importar daqui para acessar qualquer renderer:
 *              import { renderCards, renderTimeline, renderIcon } from './renderers/index.js';
 *
 * Para adicionar um novo tipo de seção:
 *   1. Crie RendererNovo.js nesta pasta
 *   2. Exporte-o aqui
 *   3. Registre no ViewManager.js
 */
export { renderTimeline }        from './TimelineRenderer.js';
export { renderMetrics }         from './MetricsRenderer.js';
export { renderCards }           from './CardsRenderer.js';
export { renderSkills }          from './SkillsRenderer.js';
export { renderGallery }         from './GalleryRenderer.js';
export { renderIcon, SVG_ICONS } from './SvgIcons.js';
