// Configurações e Dados do Dashboard
const CONFIG = {
    metaValor: 5000,
    metaContas: 5,
    comissaoPercentual: 0.15
};

/**
 * DADOS DOS CONSULTORES
 */
const consultoresInternos = [
    { nome: "Beatriz", valorAdesao: 0, qtdContas: 0 },
    { nome: "Michael", valorAdesao: 5399, qtdContas: 7 },
    { nome: "Maria", valorAdesao: 800, qtdContas: 1 },
];

const consultoresExternos = [
    { nome: "Nivaldo", valorAdesao: 5000, qtdContas: 3 },
    { nome: "Marco", valorAdesao: 1700, qtdContas: 6 }
    { nome: "Kaly", valorAdesao: 1000, qtdContas: 1 }
];

/**
 * LISTA DE CONTRATOS FECHADOS (Conforme imagem enviada)
 */
const contratosFechados = [
    { empresa: "BM SHOP CELL", valor: 999, vendedor: "Michael - Interno" },
    { empresa: "MAIS CASE CELULARES", valor: 0, vendedor: "Marco - Externo" },
    { empresa: "ELETROMYX", valor: 3000, vendedor: "Nivaldo - Externo" },
    { empresa: "CASA DO PISO", valor: 1000, vendedor: "Nivaldo - Externo" },
    { empresa: "BAIANO MOVEIS", valor: 1000, vendedor: "Nivaldo - Externo" },
    { empresa: "CONTINENTAL VARIEDADES", valor: 0, vendedor: "Marco - Externo" },
    { empresa: "ELETROCELL CELULARES", valor: 0, vendedor: "Marco - Externo" },
    { empresa: "PIMENTA CELL", valor: 0, vendedor: "Marco - Externo" },
    { empresa: "MAISA CLOSET", valor: 550, vendedor: "Michael - Interno" },
    { empresa: "GO CELL CELULARES", valor: 700, vendedor: "Marco - Externo" },
    { empresa: "CICERO COLCHÕES", valor: 1150, vendedor: "Michael - Interno" },
    { empresa: "JR BIKES", valor: 1000, vendedor: "Marco - Externo" },
    { empresa: "VALENTE MOVEIS IRITUIA", valor: 675, vendedor: "Michael - Interno" },
    { empresa: "VALENTE MOVEIS CAPITAO POCO", valor: 675, vendedor: "Michael - Interno" }
];

// Ícones SVG
const icons = {
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
    const contratosTable = document.getElementById('contratos-body');

    // Listas Laterais
    internosList.innerHTML = consultoresInternos.map(c => `
        <div class="list-item">
            <div class="item-info">
                <span class="name">${c.nome}</span>
                <span class="sub-value">${c.qtdContas} contas</span>
            </div>
            <span class="value">${formatCurrency(c.valorAdesao)}</span>
        </div>
    `).join('');

    externosList.innerHTML = consultoresExternos.map(c => `
        <div class="list-item">
            <div class="item-info">
                <span class="name">${c.nome}</span>
                <span class="sub-value">${c.qtdContas} contas</span>
            </div>
            <span class="value">${formatCurrency(c.valorAdesao)}</span>
        </div>
    `).join('');

    // Tabela de Contratos
    contratosTable.innerHTML = contratosFechados.map(c => `
        <tr>
            <td>${c.empresa}</td>
            <td>${formatCurrency(c.valor)}</td>
            <td><span class="vendedor-tag">${c.vendedor}</span></td>
        </tr>
    `).join('');

    // Cards de Metas
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
                        ${bateuMeta ? formatCurrency(comissao) : 'Em progresso'}
                    </div>
                </div>
                <div class="progress-section">
                    <div class="bar-container">
                        <div class="bar-info"><span>Adesão</span> <span>${formatCurrency(c.valorAdesao)}</span></div>
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

    // Totais
    const totalInternoAdesao = consultoresInternos.reduce((acc, c) => acc + c.valorAdesao, 0);
    const totalInternoContas = consultoresInternos.reduce((acc, c) => acc + c.qtdContas, 0);
    const totalExternoAdesao = consultoresExternos.reduce((acc, c) => acc + c.valorAdesao, 0);
    const totalExternoContas = consultoresExternos.reduce((acc, c) => acc + c.qtdContas, 0);

    document.getElementById('total-interno-adesao').textContent = formatCurrency(totalInternoAdesao);
    document.getElementById('total-interno-contas').textContent = totalInternoContas;
    document.getElementById('total-externo-adesao').textContent = formatCurrency(totalExternoAdesao);
    document.getElementById('total-externo-contas').textContent = totalExternoContas;
}

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
    document.getElementById('theme-toggle').innerHTML = icons.sun;
    renderDashboard();
});
