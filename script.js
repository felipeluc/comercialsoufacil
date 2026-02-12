// Configurações e Dados do Dashboard
const CONFIG = {
    metaValor: 5000,
    metaContas: 5,
    comissaoPercentual: 0.15
};

/**
 * DADOS ATUALIZADOS CONFORME A TABELA ENVIADA
 */
const consultoresInternos = [
    { nome: "Gabriel", valorAdesao: 0, qtdContas: 0 },
    { nome: "Michael", valorAdesao: 5000, qtdContas: 6 }, // Assinado: 3, Contas: 5 (Vou usar 'Assinado' como base de fechamento)
    { nome: "Glaucia", valorAdesao: 0, qtdContas: 0 },
    { nome: "Angela", valorAdesao: 0, qtdContas: 0 }
];

const consultoresExternos = [
    { nome: "Nivaldo", valorAdesao: 5000, qtdContas: 3 },
    { nome: "Marco", valorAdesao: 1700, qtdContas: 5 }
];

// Ícones SVG Premium
const icons = {
    user: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    external: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const calculateProgress = (current, target) => {
    return target === 0 ? 0 : Math.min((current / target) * 100, 100);
};

function renderDashboard() {
    const internosList = document.getElementById('internos-list');
    const externosList = document.getElementById('externos-list');
    const goalsGrid = document.getElementById('goals-grid');

    // Lista de Consultores (Resumo Lateral)
    internosList.innerHTML = consultoresInternos.map(c => `
        <div class="list-item">
            <span class="name">${c.nome}</span>
            <span class="value">${formatCurrency(c.valorAdesao)}</span>
        </div>
    `).join('');

    externosList.innerHTML = consultoresExternos.map(c => `
        <div class="list-item">
            <span class="name">${c.nome}</span>
            <span class="value">${formatCurrency(c.valorAdesao)}</span>
        </div>
    `).join('');

    // Cards de Metas (Grid Principal)
    goalsGrid.innerHTML = consultoresInternos.map(c => {
        const progressoValor = calculateProgress(c.valorAdesao, CONFIG.metaValor);
        const progressoContas = calculateProgress(c.qtdContas, CONFIG.metaContas);
        const bateuMeta = c.valorAdesao >= CONFIG.metaValor && c.qtdContas >= CONFIG.metaContas;
        const comissao = bateuMeta ? c.valorAdesao * CONFIG.comissaoPercentual : 0;

        return `
            <div class="goal-card">
                <div class="card-header">
                    <span class="card-name">${c.nome}</span>
                    <div class="badge ${bateuMeta ? 'success' : ''}">
                        ${bateuMeta ? 'Comissão: ' + formatCurrency(comissao) : 'Em progresso'}
                    </div>
                </div>
                <div class="progress-section">
                    <div class="bar-container">
                        <div class="bar-info"><span>Adesão</span> <span>${formatCurrency(c.valorAdesao)} / ${formatCurrency(CONFIG.metaValor)}</span></div>
                        <div class="bar-bg"><div class="bar-fill ${progressoValor >= 100 ? 'done' : ''}" style="width: ${progressoValor}%"></div></div>
                    </div>
                    <div class="bar-container">
                        <div class="bar-info"><span>Contas</span> <span>${c.qtdContas} / ${CONFIG.metaContas}</span></div>
                        <div class="bar-bg"><div class="bar-fill ${progressoContas >= 100 ? 'done' : ''}" style="width: ${progressoContas}%"></div></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Totais do Mês
    const totalAdesao = [...consultoresInternos, ...consultoresExternos].reduce((acc, c) => acc + c.valorAdesao, 0);
    const totalContas = [...consultoresInternos, ...consultoresExternos].reduce((acc, c) => acc + c.qtdContas, 0);
    document.getElementById('total-adesao').textContent = formatCurrency(totalAdesao);
    document.getElementById('total-contas').textContent = totalContas;
}

// Alternar Tema
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        btn.innerHTML = icons.sun;
    } else {
        body.setAttribute('data-theme', 'light');
        btn.innerHTML = icons.moon;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('theme-toggle').innerHTML = icons.sun; // Começa no dark por padrão
    renderDashboard();
});
