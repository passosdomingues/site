/**
 * @file competencias.js
 * @brief Dados da seção Competências Técnicas (skills com barras de progresso).
 */
export const COMPETENCIAS = {
    id: 'competencias',
    title: 'Competências Técnicas',
    subtitle: 'Stack tecnológico e nível de domínio',
    type: 'skills',
    metadata: { order: 10, visible: true },
    content: [
        {
            category: 'Linguagens e Frameworks',
            skills: [
                { name: 'Python',                proficiency: 95, description: 'Simulações científicas, análise de dados astrofísicos, Deep Learning, visão computacional e automação de manufatura.' },
                { name: 'Java / Spring Boot',    proficiency: 85, description: 'Desenvolvimento de sistemas corporativos (NEVA, MakerFlow) com princípios MVC e integração com bancos de dados.' },
                { name: 'JavaScript / TypeScript', proficiency: 85, description: 'Aplicações web SPA, utilitários client-side e este portfólio com arquitetura MVC.' },
                { name: 'C / C++',              proficiency: 70, description: 'Instrumentação astronômica, robótica e simulação física de baixo nível.' },
                { name: 'SQL',                  proficiency: 80, description: 'Modelagem de dados, JDBC, JPA e integração com Spring Boot.' },
                { name: 'LaTeX',                proficiency: 90, description: 'Documentação acadêmica, materiais didáticos e redação científica.' }
            ]
        },
        {
            category: 'IA & Ciência de Dados',
            skills: [
                { name: 'TensorFlow / PyTorch',        proficiency: 90, description: 'U-Net para segmentação médica, CNNs para classificação de galáxias, modelos aplicados à manufatura.' },
                { name: 'Scikit-learn',                proficiency: 95, description: 'ML clássico para análise exploratória, diagnósticos e validação de modelos.' },
                { name: 'Pandas / NumPy / Matplotlib', proficiency: 98, description: 'Toolkit essencial para análise de dados astronômicos e científicos.' },
                { name: 'Neo4j (Graph DB)',            proficiency: 88, description: 'Mapeamento de relacionamentos complexos em ecossistemas de inovação e manufatura.' },
                { name: 'Elasticsearch',               proficiency: 80, description: 'Busca e indexação de dados em sistemas de gestão.' },
                { name: 'OpenCV',                      proficiency: 85, description: 'Processamento de imagens para geração de G-code e controle de cortadoras laser.' }
            ]
        },
        {
            category: 'Manufatura & Hardware',
            skills: [
                { name: 'G-code & CNC',       proficiency: 85, description: 'Geração e edição de G-code para corte a laser, fresamento e impressão 3D.' },
                { name: 'Controladora RUIDA', proficiency: 80, description: 'Integração direta com controladoras RUIDA para envio de arquivos de corte a laser.' },
                { name: 'Impressão 3D',       proficiency: 88, description: 'Modelagem, fatiamento e fabricação de protótipos funcionais no NidusLab.' },
                { name: 'Desenho 3D',         proficiency: 80, description: 'Modelagem 3D para prototipagem rápida e validação de produtos.' }
            ]
        },
        {
            category: 'Infraestrutura & Ferramentas',
            skills: [
                { name: 'Git / GitHub',            proficiency: 95, description: 'Controle de versão, CI/CD com GitHub Actions e colaboração em projetos.' },
                { name: 'Docker',                  proficiency: 75, description: 'Containerização de ambientes de desenvolvimento e produção.' },
                { name: 'Linux / Shell Scripting', proficiency: 85, description: 'Ambiente principal de desenvolvimento, automação e administração de sistemas.' },
                { name: 'Power BI / ETL',          proficiency: 78, description: 'Dashboards e pipelines de dados para gestão de incubadoras e startups.' },
                { name: 'GitHub Actions / Vite',   proficiency: 82, description: 'Pipelines de CI/CD e bundling moderno para aplicações web.' }
            ]
        },
        {
            category: 'Inovação & Propriedade Intelectual',
            skills: [
                { name: 'Modelo CERNE',           proficiency: 95, description: 'Gestão de 29 processos de incubação, contribuindo para certificação CERNE 2 da NidusTec.' },
                { name: 'Busca de Anterioridade', proficiency: 88, description: 'Prospecção tecnológica sistemática com Espacenet, Google Patents e Derwent Innovation.' },
                { name: 'Redação de Ativos de PI', proficiency: 82, description: 'Estruturação técnica de pedidos de patente e registros de software junto ao INPI.' },
                { name: 'TRL & Roadmaps Tecnológicos', proficiency: 90, description: 'Diagnóstico de maturidade tecnológica e elaboração de roadmaps para startups.' }
            ]
        }
    ]
};
