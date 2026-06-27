/**
 * @file PortfolioData.js
 * @author Rafael Passos Domingues
 * @brief Compositor central — agrega os módulos atômicos de cada seção.
 *
 * Para editar uma seção específica, edite apenas o módulo correspondente em ./sections/.
 * Para adicionar uma nova seção:
 *   1. Crie ./sections/minhaSecao.js
 *   2. Importe e adicione ao array PORTFOLIO_DATA.sections abaixo.
 */

import { TRAJETORIA }              from './sections/trajetoria.js';
import { IMPACTO }                 from './sections/impacto.js';
import { PROJETOS }                from './sections/projetos.js';
import { PROPRIEDADE_INTELECTUAL } from './sections/propriedadeIntelectual.js';
import { PUBLICACOES }             from './sections/publicacoes.js';
import { INOVACAO }                from './sections/inovacao.js';
import { DEEP_LEARNING }           from './sections/deepLearning.js';
import { ASTROFISICA }             from './sections/astrofisica.js';
import { OBSERVATORIO }            from './sections/observatorio.js';
import { COMPETENCIAS }            from './sections/competencias.js';

export const PORTFOLIO_DATA = {
    user: {
        name:  'Rafael Passos Domingues',
        title: 'Desenvolvedor T-Shaped | IA · Manufatura · Propriedade Intelectual'
    },
    sections: [
        TRAJETORIA,
        IMPACTO,
        PROJETOS,
        PROPRIEDADE_INTELECTUAL,
        PUBLICACOES,
        INOVACAO,
        DEEP_LEARNING,
        ASTROFISICA,
        OBSERVATORIO,
        COMPETENCIAS
    ]
};