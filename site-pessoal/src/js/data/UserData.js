/**
 * @file UserData.js
 * @author Rafael Passos Domingues
 * @brief Dados centralizados do usuário — identidade, contatos e links sociais.
 * @description Fonte única de verdade para informações pessoais e de contato.
 *              Atualizado para refletir identidade profissional atual (2025).
 */

export const USER_DATA = {
    personalInfo: {
        name: 'Rafael Passos Domingues',
        title: 'Desenvolvedor T-Shaped',
        subtitle: 'IA · Manufatura Generativa · Propriedade Intelectual · CERNE',
        location: 'Alfenas — MG, Brasil',
        age: 29,
        summary: `Profissional T-Shaped com atuação na interseção entre arquitetura de dados,
desenvolvimento de software, manufatura aditiva e estratégia de propriedade intelectual.
Especialista no Modelo CERNE, com experiência comprovada na gestão de 29 processos de
incubação, no desenvolvimento de soluções para incubadoras e makerspaces, na criação de
MVPs e na busca de anterioridades. Perfil orientado a resultados, com domínio de ferramentas
digitais, prototipagem, inteligência artificial aplicada e proteção de ativos junto ao INPI.`
    },
    contact: {
        email: 'rafaelpassosdomingues@gmail.com',
        phone: '+55 35 98884-5584',
        whatsapp: 'https://wa.me/5535988845584'
    },
    socialLinks: {
        github: 'https://github.com/passosdomingues',
        linkedin: 'https://www.linkedin.com/in/rafaelpassosdomingues/',
        lattes: 'http://lattes.cnpq.br/2726901051757064',
        instagram: 'https://instagram.com/rafaelpassosdomingues/'
    },
    profileImage: './images/perfilMid.png',
    availability: {
        status: 'Disponível',
        message: 'Disponível para projetos, colaborações e oportunidades'
    }
};