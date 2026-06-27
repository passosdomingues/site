import{e as v}from"./mvc-core-4ea594ed.js";const m={university:"fa-solid fa-graduation-cap",teacher:"fa-solid fa-chalkboard-user",graduate:"fa-solid fa-user-graduate",code:"fa-solid fa-code",rocket:"fa-solid fa-rocket",cogs:"fa-solid fa-gear",tools:"fa-solid fa-screwdriver-wrench",globe:"fa-solid fa-globe",file:"fa-solid fa-file-lines",award:"fa-solid fa-award",trophy:"fa-solid fa-trophy",bookmark:"fa-solid fa-bookmark",link:"fa-solid fa-arrow-up-right-from-square",github:"fa-brands fa-github",linkedin:"fa-brands fa-linkedin",whatsapp:"fa-brands fa-whatsapp",gitBranch:"fa-solid fa-code-branch",envelope:"fa-solid fa-envelope",lattes:"fa-solid fa-id-card",accessibility:"fa-solid fa-universal-access",adjust:"fa-solid fa-circle-half-stroke",eyeSlash:"fa-solid fa-eye-slash",menu:"fa-solid fa-bars",close:"fa-solid fa-xmark",star:"fa-solid fa-star",plus:"fa-solid fa-plus"};function d(i,e=""){return`<i class="${m[i]||"fa-solid fa-circle-question"} icon-accent${e?" "+e:""}" aria-hidden="true"></i>`}new Proxy(m,{get(i,e){return e in i?d(e):""}});function f(i){if(!i)return"";const e=document.createElement("div");return e.textContent=i,e.innerHTML}function b(i){var t;return(t=i==null?void 0:i.timeline)!=null&&t.length?`<div class="timeline" role="list">${i.timeline.map((s,a)=>{var r;const n=d(s.icon,"timeline-fa-icon");return`
            <div class="timeline-item animate-on-scroll" style="transition-delay:${a*.1}s">
                <div class="timeline-icon" aria-hidden="true">${n}</div>
                <div class="timeline-content">
                    <div class="timeline-period">${f(s.period)}</div>
                    <h3 class="timeline-title">${f(s.title)}</h3>
                    <p class="timeline-description">${f(s.description)}</p>
                    ${(r=s.highlights)!=null&&r.length?`
                        <div class="highlights-list" aria-label="Destaques">
                            ${s.highlights.map(l=>`<span class="highlight-tag">${f(l)}</span>`).join("")}
                        </div>
                    `:""}
                </div>
            </div>
        `}).join("")}</div>`:"<p>Nenhum dado de trajetória.</p>"}function p(i){if(!i)return"";const e=document.createElement("div");return e.textContent=i,e.innerHTML}function $(i){return!Array.isArray(i)||!i.length?"":`<div class="metrics-grid" role="list" aria-label="Métricas de impacto">${i.map((t,s)=>{const a=d(t.icon,"metric-fa-icon");return`
            <div class="metric-card animate-on-scroll"
                 style="transition-delay:${s*.08}s"
                 role="listitem">
                <span class="metric-icon" aria-hidden="true">${a}</span>
                <div class="metric-value">${p(t.value)}</div>
                <div class="metric-label">${p(t.label)}</div>
            </div>
        `}).join("")}</div>`}function c(i){if(!i)return"";const e=document.createElement("div");return e.textContent=i,e.innerHTML}function y(i){if(!i)return"";const e=i.toLowerCase();return e.includes("registro")||e.includes("trâmite")?"status-em-registro":e.includes("pesquisa")?"status-pesquisa":e.includes("ativo")||e.includes("ongoing")||e.includes("contínuo")||e.includes("produção")||e.includes("publicado")||e.includes("premiado")||e.includes("concluído")||e.includes("registrado")?"status-ativo":""}function w(i){return!Array.isArray(i)||!i.length?"":`<div class="cards-grid" role="list">${i.map((t,s)=>{var r,l;const a=(r=t.links)!=null&&r.length?`
            <div class="card-links">
                ${t.links.map(o=>`
                     <a href="${c(o.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="${c(o.label)}">
                         ${d("link","card-link-icon")}
                         ${c(o.label)}
                     </a>
                `).join("")}
            </div>
        `:"",n=(l=t.tags)!=null&&l.length?`
            <div class="tags-container" aria-label="Tecnologias">
                ${t.tags.map(o=>`<span class="tag">${c(o)}</span>`).join("")}
            </div>
        `:"";return`
            <article class="card animate-on-scroll"
                     style="transition-delay:${s*.07}s"
                     aria-label="${c(t.title)}">
                 ${t.highlight?`<div class="card-highlight-badge" aria-label="Destaque">${d("bookmark","card-badge-icon")} ${c(t.highlight)}</div>`:""}
                <h3 class="card-title">${c(t.title)}</h3>
                <p class="card-description">${c(t.description)}</p>
                ${a}
                ${n}
                <footer class="card-meta">
                    <span class="card-date">${c(t.date||"")}</span>
                    <span class="card-status ${y(t.status)}"
                          aria-label="Status: ${c(t.status||"")}">
                        ${c(t.status||"")}
                    </span>
                </footer>
            </article>
        `}).join("")}</div>`}function h(i){if(!i)return"";const e=document.createElement("div");return e.textContent=i,e.innerHTML}function E(i){return!Array.isArray(i)||!i.length?"":`<div class="skills-categories">${i.map(t=>{const s=t.skills.map(a=>{var l;const n=typeof a.proficiency=="number",r=(l=a.links)!=null&&l.length?`
                <div class="skill-links">
                    ${a.links.map(o=>`<a href="${h(o.url)}"
                             target="_blank"
                             rel="noopener noreferrer">${h(o.label)}</a>`).join(" · ")}
                </div>
            `:"";return`
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${h(a.name)}</span>
                        ${n?`<span class="skill-percent">${a.proficiency}%</span>`:""}
                    </div>
                    ${n?`
                        <div class="skill-bar" role="progressbar"
                             aria-valuenow="${a.proficiency}"
                             aria-valuemin="0"
                             aria-valuemax="100"
                             aria-label="${h(a.name)}: ${a.proficiency}%">
                            <div class="skill-progress"
                                 data-proficiency="${a.proficiency}"
                                 style="width:0%">
                            </div>
                        </div>
                    `:""}
                    <p class="skill-description">${h(a.description)}</p>
                    ${r}
                </div>
            `}).join("");return`
            <div class="skill-category">
                <h3 class="category-title">${h(t.category)}</h3>
                <div class="skills-list">${s}</div>
            </div>
        `}).join("")}</div>`}function u(i){if(!i)return"";const e=document.createElement("div");return e.textContent=i,e.innerHTML}function L(i){var e;return`
        <div class="gallery-item-featured" role="article">
            ${i.imageUrl?`
                <img src="${u(i.imageUrl)}"
                     alt="${u(i.caption||"")}"
                     class="gallery-featured-image"
                     loading="lazy">
            `:""}
            <div class="gallery-featured-info">
                ${i.caption?`<div class="gallery-featured-title">${u(i.caption)}</div>`:""}
                ${i.description?`<p class="gallery-featured-desc">${u(i.description)}</p>`:""}
                ${(e=i.links)!=null&&e.length?`
                    <div class="gallery-featured-links">
                        ${i.links.map(t=>`
                            <a href="${u(t.url)}"
                               target="_blank"
                               rel="noopener noreferrer">${u(t.label)}</a>
                        `).join("")}
                    </div>
                `:""}
            </div>
        </div>
    `}function k(i){return`
        <div class="gallery-item" role="listitem">
            <img src="${u(i.imageUrl||"")}"
                 alt="${u(i.caption||"")}"
                 class="gallery-image"
                 loading="lazy">
            ${i.caption?`<div class="gallery-caption">${u(i.caption)}</div>`:""}
        </div>
    `}function H(i){var r;if(!Array.isArray(i)||!i.length)return"";const[e,...t]=i,s=(e==null?void 0:e.description)||((r=e==null?void 0:e.links)==null?void 0:r.length);return`
        <div class="gallery-grid" role="list">
            ${s?L(e):""}
            ${(s?t:i).map(k).join("")}
        </div>
    `}class _{constructor(e={}){this.container=e.container,this.eventBus=e.eventBus||v,this.renderers={timeline:b,metrics:$,cards:w,skills:E,gallery:H},this._setupScrollReveal(),this.setupEventListeners()}setupEventListeners(){this.eventBus.subscribe("section:updated",({sectionId:e,newContent:t})=>{this.renderSection({id:e,...t})})}renderSection(e){if(!this.container){console.error("ViewManager: container não disponível");return}const t=this.renderers[e.type];if(typeof t!="function"){console.warn(`ViewManager: renderer não encontrado para tipo "${e.type}". Tipos suportados: ${Object.keys(this.renderers).join(", ")}`);return}try{const s=this.container.children.length+1,a=document.createElement("div");a.className="section-wrapper";const n=document.createElement("section");n.id=e.id,n.className=`portfolio-section section--${e.type} animate-on-scroll`,n.innerHTML=`
                <header class="section-header">
                    <div class="section-label">${String(s).padStart(2,"0")}</div>
                    <h2 class="section-title">${this._esc(e.title)}</h2>
                    <p class="section-subtitle">${this._esc(e.subtitle)}</p>
                </header>
                ${t(e.content)}
            `,a.appendChild(n),this.container.appendChild(a),this._observe(n),e.type==="skills"&&n.querySelectorAll(".skill-progress").forEach(r=>r.style.width="0%"),this.eventBus.publish("view:section:rendered",{sectionId:e.id,element:n})}catch(s){console.error(`ViewManager: erro ao renderizar seção "${e.id}"`,s),this.eventBus.publish("view:render:error",{sectionId:e.id,error:s})}}_setupScrollReveal(){this._observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add("visible"),t.target.querySelectorAll(".skill-progress[data-proficiency]").forEach(s=>{s.style.width=s.dataset.proficiency+"%"}))})},{threshold:.06,rootMargin:"0px 0px -40px 0px"})}_observe(e){this._observer.observe(e),e.querySelectorAll(".animate-on-scroll").forEach(t=>this._observer.observe(t))}_esc(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}escapeHtml(e){return this._esc(e)}clear(){this.container&&(this.container.innerHTML="")}destroy(){var e;(e=this._observer)==null||e.disconnect(),this.eventBus.unsubscribe("section:updated",()=>{}),this.clear()}}class g{constructor(e={}){this.container=e.container,this.eventBus=e.eventBus||v,this.isRendered=!1,this.isDestroyed=!1,this.elements=new Map,this.eventHandlers=new Map}async init(){if(this.isDestroyed)throw new Error("BaseView: Cannot initialize a destroyed view.");console.info(`BaseView: Initializing ${this.constructor.name}`)}async render(){if(this.isDestroyed)throw new Error("BaseView: Cannot render a destroyed view.");this.isRendered=!0,console.info(`BaseView: Rendered ${this.constructor.name}`)}async update(e){if(!this.isRendered||this.isDestroyed){console.warn(`BaseView: Cannot update ${this.constructor.name} - not rendered or is destroyed.`);return}console.info(`BaseView: Updated ${this.constructor.name}`,e)}registerElement(e,t){this.elements.set(e,t)}getElement(e){return this.elements.get(e)}addEventListener(e,t,s,a={}){const n=typeof e=="string"?this.getElement(e):e;if(!n){console.warn(`BaseView: Element not found for event listener: ${e}`);return}n.addEventListener(t,s,a);const r=`${typeof e=="string"?e:"direct"}_${t}`;this.eventHandlers.has(r)||this.eventHandlers.set(r,[]),this.eventHandlers.get(r).push({element:n,handler:s,options:a})}removeEventListener(e,t,s){const a=typeof e=="string"?this.getElement(e):e;a&&a.removeEventListener(t,s)}show(){this.container&&(this.container.style.display="",this.container.style.visibility="visible"),this.eventBus.publish("view:shown",{view:this.constructor.name})}hide(){this.container&&(this.container.style.display="none"),this.eventBus.publish("view:hidden",{view:this.constructor.name})}createElement(e,t={},s=""){const a=document.createElement(e);return Object.entries(t).forEach(([n,r])=>{if(n==="className")a.className=r;else if(n==="dataset")Object.entries(r).forEach(([l,o])=>{a.dataset[l]=o});else if(n.startsWith("on")&&typeof r=="function"){const l=n.substring(2).toLowerCase();a.addEventListener(l,r)}else a.setAttribute(n,r)}),s&&(a.textContent=s),a}escapeHtml(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}addClass(e,t){const s=typeof e=="string"?this.getElement(e):e;s&&s.classList.add(t)}removeClass(e,t){const s=typeof e=="string"?this.getElement(e):e;s&&s.classList.remove(t)}toggleClass(e,t){const s=typeof e=="string"?this.getElement(e):e;s&&s.classList.toggle(t)}setText(e,t){const s=typeof e=="string"?this.getElement(e):e;s&&(s.textContent=t)}setHTML(e,t){const s=typeof e=="string"?this.getElement(e):e;s&&(s.innerHTML=t)}destroy(){this.isDestroyed||(this.eventHandlers.forEach(e=>{e.forEach(({element:t,handler:s,options:a})=>{var r;const n=(r=[...t.getAttributeNames()].find(l=>l.startsWith("on")))==null?void 0:r.substring(2);n&&t.removeEventListener(n,s,a)})}),this.eventHandlers.clear(),this.elements.clear(),this.isRendered=!1,this.isDestroyed=!0,console.info(`BaseView: Destroyed ${this.constructor.name}`))}}class T extends g{constructor(e={}){super(e),this.sections=e.sections||[],this._activeLink=null,this._mobileMenuOpen=!1}async init(){await super.init()}async render(){await super.render(),this.container&&(this.container.innerHTML=this.createNavHTML(),this._setupScrollSpy(),this._setupMobileMenu(),this._setupScrollEffect(),this._handleNavClick())}createNavHTML(){const e={sobre:"Trajetória",impacto:"Impacto",projetos:"Projetos","propriedade-intelectual":"PI & INPI",publicacoes:"Publicações",inovacao:"NidusTec","deep-learning":"Deep Learning",astrofisica:"Astrofísica",observatorio:"Observatório",competencias:"Competências"},t=this.sections.filter(s=>{var a;return(a=s.metadata)==null?void 0:a.visible}).sort((s,a)=>{var n,r;return(((n=s.metadata)==null?void 0:n.order)||0)-(((r=a.metadata)==null?void 0:r.order)||0)}).map(s=>{const a=e[s.id]||s.title;return`
                    <li class="nav-item">
                        <a href="#${this.escapeHtml(s.id)}"
                           class="nav-link"
                           data-section="${this.escapeHtml(s.id)}">
                            ${this.escapeHtml(a)}
                        </a>
                    </li>
                `}).join("");return`
            <nav class="nav-container" role="navigation" aria-label="Navegação principal">
                <a href="#hero-section" class="nav-brand" aria-label="Rafael Passos Domingues — Início">
                    Rafael<span>.</span>
                </a>
                <ul class="nav-list" role="list">
                    ${t}
                </ul>
                <button class="nav-mobile-toggle"
                        aria-label="Abrir menu de navegação"
                        aria-expanded="false"
                        id="nav-mobile-btn">
                    ${d("menu")}
                </button>
            </nav>
            <div class="nav-mobile-menu" id="nav-mobile-menu" role="navigation" aria-label="Menu mobile">
                <ul class="nav-list" role="list">
                    ${t}
                </ul>
            </div>
        `}_setupScrollSpy(){const e=this.container.querySelectorAll(".nav-link[data-section]"),t=[...e].map(a=>a.dataset.section).filter(Boolean),s=new IntersectionObserver(a=>{a.forEach(n=>{if(n.isIntersecting){const r=n.target.id;e.forEach(o=>{o.classList.toggle("active",o.dataset.section===r)}),document.querySelectorAll("#nav-mobile-menu .nav-link").forEach(o=>{o.classList.toggle("active",o.dataset.section===r)})}})},{rootMargin:"-40% 0px -55% 0px",threshold:0});t.forEach(a=>{const n=document.getElementById(a);n&&s.observe(n)}),this._scrollObserver=s}_setupScrollEffect(){const e=this.container,t=()=>{e.classList.toggle("scrolled",window.scrollY>40)};window.addEventListener("scroll",t,{passive:!0}),this._scrollHandler=t}_setupMobileMenu(){const e=document.getElementById("nav-mobile-btn"),t=document.getElementById("nav-mobile-menu");!e||!t||(e.addEventListener("click",s=>{s.stopPropagation(),this._mobileMenuOpen=!this._mobileMenuOpen,t.classList.toggle("open",this._mobileMenuOpen),e.setAttribute("aria-expanded",String(this._mobileMenuOpen)),e.innerHTML=this._mobileMenuOpen?d("close"):d("menu")}),document.addEventListener("click",()=>{this._mobileMenuOpen&&(this._mobileMenuOpen=!1,t.classList.remove("open"),e.setAttribute("aria-expanded","false"),e.innerHTML=d("menu"))}))}_handleNavClick(){document.querySelectorAll('.nav-link[href^="#"]').forEach(t=>{t.addEventListener("click",s=>{var n,r;s.preventDefault();const a=document.querySelector(t.getAttribute("href"));if(a){const o=a.getBoundingClientRect().top+window.scrollY-70;window.scrollTo({top:o,behavior:"smooth"})}this._mobileMenuOpen&&((n=document.getElementById("nav-mobile-menu"))==null||n.classList.remove("open"),(r=document.getElementById("nav-mobile-btn"))==null||r.setAttribute("aria-expanded","false"),this._mobileMenuOpen=!1)})})}escapeHtml(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}destroy(){var e,t;(e=this._scrollObserver)==null||e.disconnect(),this._scrollHandler&&window.removeEventListener("scroll",this._scrollHandler),(t=super.destroy)==null||t.call(this)}}class B extends g{constructor(e={}){super(e),this.footerData=e.footerData||{}}async init(){await super.init()}async render(){await super.render(),this.container&&(this.container.innerHTML=this.createFooterHTML())}createFooterHTML(){const{personalInfo:e,socialLinks:t,contact:s}=this.footerData,a=new Date().getFullYear(),r=[{url:t==null?void 0:t.github,icon:"github",label:"GitHub"},{url:t==null?void 0:t.linkedin,icon:"linkedin",label:"LinkedIn"},{url:t==null?void 0:t.lattes,icon:"lattes",label:"Lattes CV"},{url:`mailto:${s==null?void 0:s.email}`,icon:"envelope",label:"E-mail"},{url:s==null?void 0:s.whatsapp,icon:"whatsapp",label:"WhatsApp"}].filter(l=>l.url).map(l=>`
            <li class="footer-social-item">
                <a href="${this.escapeHtml(l.url)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   aria-label="${this.escapeHtml(l.label)}"
                   title="${this.escapeHtml(l.label)}">
                    ${d(l.icon)}
                </a>
            </li>
        `).join("");return`
            <div class="footer-brand-col">
                <div class="footer-brand">
                    Rafael<span>.</span>
                </div>
                <div class="footer-tagline">
                    ${this.escapeHtml((e==null?void 0:e.subtitle)||"T-Shaped Developer")}
                </div>
            </div>
            <ul class="footer-social-links" role="list" aria-label="Links sociais">
                ${r}
            </ul>
            <div class="footer-copyright">
                © ${a} Rafael Passos Domingues<br>
                <small>Alfenas – MG, Brasil</small>
            </div>
        `}escapeHtml(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}}export{B as F,T as N,_ as V,d as r};
//# sourceMappingURL=mvc-views-e3f55312.js.map
