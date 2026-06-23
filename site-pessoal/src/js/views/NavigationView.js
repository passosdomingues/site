import { BaseView } from './BaseView.js';
import { SVG_ICONS } from './renderers/SvgIcons.js';

/**
 * @file NavigationView.js
 * @brief Navegação principal — PT-BR, scroll spy, hamburger mobile.
 */
export class NavigationView extends BaseView {
    constructor(config = {}) {
        super(config);
        this.sections = config.sections || [];
        this._activeLink = null;
        this._mobileMenuOpen = false;
    }

    async init() {
        await super.init();
    }

    async render() {
        await super.render();
        if (!this.container) return;

        this.container.innerHTML = this.createNavHTML();
        this._setupScrollSpy();
        this._setupMobileMenu();
        this._setupScrollEffect();
        this._handleNavClick();
    }

    /* ──────────────────────────────────────────
       HTML
    ────────────────────────────────────────── */
    createNavHTML() {
        // Mapeia IDs de seção → rótulos PT-BR
        const sectionLabels = {
            sobre:                   'Trajetória',
            impacto:                 'Impacto',
            projetos:                'Projetos',
            'propriedade-intelectual': 'PI & INPI',
            publicacoes:             'Publicações',
            inovacao:                'NidusTec',
            'deep-learning':         'Deep Learning',
            astrofisica:             'Astrofísica',
            observatorio:            'Observatório',
            competencias:            'Competências',
        };

        const navItems = this.sections
            .filter(s => s.metadata?.visible)
            .sort((a, b) => (a.metadata?.order || 0) - (b.metadata?.order || 0))
            .map(s => {
                const label = sectionLabels[s.id] || s.title;
                return `
                    <li class="nav-item">
                        <a href="#${this.escapeHtml(s.id)}"
                           class="nav-link"
                           data-section="${this.escapeHtml(s.id)}">
                            ${this.escapeHtml(label)}
                        </a>
                    </li>
                `;
            }).join('');

        return `
            <nav class="nav-container" role="navigation" aria-label="Navegação principal">
                <a href="#hero-section" class="nav-brand" aria-label="Rafael Passos Domingues — Início">
                    Rafael<span>.</span>
                </a>
                <ul class="nav-list" role="list">
                    ${navItems}
                </ul>
                <button class="nav-mobile-toggle"
                        aria-label="Abrir menu de navegação"
                        aria-expanded="false"
                        id="nav-mobile-btn">
                    ${SVG_ICONS.menu}
                </button>
            </nav>
            <div class="nav-mobile-menu" id="nav-mobile-menu" role="navigation" aria-label="Menu mobile">
                <ul class="nav-list" role="list">
                    ${navItems}
                </ul>
            </div>
        `;
    }

    /* ──────────────────────────────────────────
       SCROLL SPY
    ────────────────────────────────────────── */
    _setupScrollSpy() {
        const links = this.container.querySelectorAll('.nav-link[data-section]');
        const sectionIds = [...links].map(l => l.dataset.section).filter(Boolean);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(l => {
                        l.classList.toggle('active', l.dataset.section === id);
                    });
                    // Sync mobile menu
                    const mobileLinks = document.querySelectorAll('#nav-mobile-menu .nav-link');
                    mobileLinks.forEach(l => {
                        l.classList.toggle('active', l.dataset.section === id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        this._scrollObserver = observer;
    }

    /* ──────────────────────────────────────────
       NAVBAR SCROLL EFFECT
    ────────────────────────────────────────── */
    _setupScrollEffect() {
        const navEl = this.container;
        const handler = () => {
            navEl.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', handler, { passive: true });
        this._scrollHandler = handler;
    }

    /* ──────────────────────────────────────────
       MOBILE HAMBURGER
    ────────────────────────────────────────── */
    _setupMobileMenu() {
        const btn = document.getElementById('nav-mobile-btn');
        const menu = document.getElementById('nav-mobile-menu');
        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._mobileMenuOpen = !this._mobileMenuOpen;
            menu.classList.toggle('open', this._mobileMenuOpen);
            btn.setAttribute('aria-expanded', String(this._mobileMenuOpen));
            btn.innerHTML = this._mobileMenuOpen ? SVG_ICONS.close : SVG_ICONS.menu;
        });

        document.addEventListener('click', () => {
            if (this._mobileMenuOpen) {
                this._mobileMenuOpen = false;
                menu.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                btn.innerHTML = SVG_ICONS.menu;
            }
        });
    }

    /* ──────────────────────────────────────────
       SMOOTH SCROLL ON CLICK
    ────────────────────────────────────────── */
    _handleNavClick() {
        const allLinks = document.querySelectorAll('.nav-link[href^="#"]');
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offset = 70; // altura do nav fixo
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
                // Fecha mobile menu se aberto
                if (this._mobileMenuOpen) {
                    document.getElementById('nav-mobile-menu')?.classList.remove('open');
                    document.getElementById('nav-mobile-btn')?.setAttribute('aria-expanded', 'false');
                    this._mobileMenuOpen = false;
                }
            });
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    destroy() {
        this._scrollObserver?.disconnect();
        if (this._scrollHandler) {
            window.removeEventListener('scroll', this._scrollHandler);
        }
        super.destroy?.();
    }
}