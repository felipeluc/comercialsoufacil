// Configurações e Dados do Dashboard
const CONFIG = {
    produtos: {
        crediario: {
            nome: "Crediário Garantido",
            faixas: [
                { producao: 6000, contas: 6, comissao: 0.15 },
                { producao: 10000, contas: 10, comissao: 0.175 },
                { producao: 15000, contas: 10, comissao: 0.20 }
            ]
        },
        soufacil: {
            nome: "SouFácil Card",
            faixas: [
                { producao: 4000, contas: 4, comissao: 0.15 },
                { producao: 6000, contas: 6, comissao: 0.175 },
                { producao: 6000, contas: 6, comissao: 0.20 }
            ]
        },
        cobranca: {
            nome: "Cobrança Terceirizada",
            faixas: [
                { producao: 1500, contas: 3, comissao: 0.15 },
                { producao: 2500, contas: 5, comissao: 0.175 },
                { producao: 2500, contas: 5, comissao: 0.20 }
            ]
        }
    }
};

/**
 * DADOS DOS CONSULTORES
 */
const consultoresInternos = [
    { 
        nome: "Beatriz", 
        produtos: {
            crediario: { valorAdesao: 5000, qtdContas: 5 },
            soufacil: { valorAdesao: 3000, qtdContas: 3 },
            cobranca: { valorAdesao: 1200, qtdContas: 2 }
        }
    },
    { 
        nome: "Michael", 
        produtos: {
            crediario: { valorAdesao: 6000, qtdContas: 8 },
            soufacil: { valorAdesao: 5000, qtdContas: 6 },
            cobranca: { valorAdesao: 2000, qtdContas: 4 }
        }
    },
    { 
        nome: "Maria", 
        produtos: {
            crediario: { valorAdesao: 5048, qtdContas: 8 },
            soufacil: { valorAdesao: 4500, qtdContas: 5 },
            cobranca: { valorAdesao: 1800, qtdContas: 3 }
        }
    },
];

const consultoresExternos = [
    { 
        nome: "Nivaldo", 
        produtos: {
            crediario: { valorAdesao: 13500, qtdContas: 11 },
            soufacil: { valorAdesao: 8000, qtdContas: 8 },
            cobranca: { valorAdesao: 3500, qtdContas: 6 }
        }
    },
    { 
        nome: "Marco", 
        produtos: {
            crediario: { valorAdesao: 2600, qtdContas: 8 },
            soufacil: { valorAdesao: 2000, qtdContas: 4 },
            cobranca: { valorAdesao: 1000, qtdContas: 2 }
        }
    },
    { 
        nome: "Kaly", 
        produtos: {
            crediario: { valorAdesao: 1000, qtdContas: 1 },
            soufacil: { valorAdesao: 500, qtdContas: 1 },
            cobranca: { valorAdesao: 300, qtdContas: 1 }
        }
    }
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

/**
 * Calcula a comissão progressiva de um produto
 */
const calculateComissao = (valor, qtdContas, produtoKey) => {
    const faixas = CONFIG.produtos[produtoKey].faixas;
    let comissao = 0;
    let valorProcessado = 0;

    for (let i = 0; i < faixas.length; i++) {
        const faixa = faixas[i];
        
        // Verifica se atinge a quantidade de contas
        if (qtdContas < faixa.contas) {
            break;
        }

        // Calcula a comissão para esta faixa
        if (i === faixas.length - 1) {
            // Última faixa: tudo que passar da faixa anterior
            if (valor > valorProcessado) {
                comissao += (valor - valorProcessado) * faixa.comissao;
            }
        } else {
            // Faixas intermediárias
            const proximaFaixa = faixas[i + 1];
            const limiteAtual = faixa.producao;
            const proximoLimite = proximaFaixa.producao;

            if (valor >= proximoLimite) {
                comissao += (proximoLimite - limiteAtual) * faixa.comissao;
                valorProcessado = proximoLimite;
            } else if (valor > limiteAtual) {
                comissao += (valor - limiteAtual) * faixa.comissao;
                break;
            }
        }
    }

    return comissao;
};

/**
 * Verifica se atingiu a meta de uma faixa
 */
const verificaMeta = (valor, qtdContas, produtoKey) => {
    const faixas = CONFIG.produtos[produtoKey].faixas;
    
    for (let faixa of faixas) {
        if (valor >= faixa.producao && qtdContas >= faixa.contas) {
            return true;
        }
    }
    return false;
};

/**
 * Obtém a próxima meta a ser atingida
 */
const getProximaMeta = (valor, qtdContas, produtoKey) => {
    const faixas = CONFIG.produtos[produtoKey].faixas;
    
    for (let faixa of faixas) {
        if (valor < faixa.producao || qtdContas < faixa.contas) {
            return faixa;
        }
    }
    return faixas[faixas.length - 1];
};

function renderDashboard() {
    const internosList = document.getElementById('internos-list');
    const externosList = document.getElementById('externos-list');
    const goalsGrid = document.getElementById('goals-grid');

    // Listas Laterais - Totalizando todos os produtos
    internosList.innerHTML = consultoresInternos.map(c => {
        const totalValor = Object.values(c.produtos).reduce((acc, p) => acc + p.valorAdesao, 0);
        const totalContas = Object.values(c.produtos).reduce((acc, p) => acc + p.qtdContas, 0);
        return `
            <div class="list-item">
                <div class="item-info">
                    <span class="name">${c.nome}</span>
                    <span class="sub-value">${totalContas} contas</span>
                </div>
                <span class="value">${formatCurrency(totalValor)}</span>
            </div>
        `;
    }).join('');

    externosList.innerHTML = consultoresExternos.map(c => {
        const totalValor = Object.values(c.produtos).reduce((acc, p) => acc + p.valorAdesao, 0);
        const totalContas = Object.values(c.produtos).reduce((acc, p) => acc + p.qtdContas, 0);
        return `
            <div class="list-item">
                <div class="item-info">
                    <span class="name">${c.nome}</span>
                    <span class="sub-value">${totalContas} contas</span>
                </div>
                <span class="value">${formatCurrency(totalValor)}</span>
            </div>
        `;
    }).join('');

    // Cards de Metas - Internos
    goalsGrid.innerHTML = consultoresInternos.map(consultor => {
        return renderConsultorCard(consultor);
    }).join('');

    // Totais
    const totalInternoAdesao = consultoresInternos.reduce((acc, c) => 
        acc + Object.values(c.produtos).reduce((sum, p) => sum + p.valorAdesao, 0), 0);
    const totalInternoContas = consultoresInternos.reduce((acc, c) => 
        acc + Object.values(c.produtos).reduce((sum, p) => sum + p.qtdContas, 0), 0);
    const totalExternoAdesao = consultoresExternos.reduce((acc, c) => 
        acc + Object.values(c.produtos).reduce((sum, p) => sum + p.valorAdesao, 0), 0);
    const totalExternoContas = consultoresExternos.reduce((acc, c) => 
        acc + Object.values(c.produtos).reduce((sum, p) => sum + p.qtdContas, 0), 0);

    document.getElementById('total-interno-adesao').textContent = formatCurrency(totalInternoAdesao);
    document.getElementById('total-interno-contas').textContent = totalInternoContas;
    document.getElementById('total-externo-adesao').textContent = formatCurrency(totalExternoAdesao);
    document.getElementById('total-externo-contas').textContent = totalExternoContas;
}

/**
 * Renderiza o card de um consultor com suas 3 metas
 */
function renderConsultorCard(consultor) {
    const produtosKeys = ['crediario', 'soufacil', 'cobranca'];
    
    // Calcula comissão total
    let comissaoTotal = 0;
    const produtosHtml = produtosKeys.map(produtoKey => {
        const dados = consultor.produtos[produtoKey];
        const comissao = calculateComissao(dados.valorAdesao, dados.qtdContas, produtoKey);
        const atingiuMeta = verificaMeta(dados.valorAdesao, dados.qtdContas, produtoKey);
        const proximaMeta = getProximaMeta(dados.valorAdesao, dados.qtdContas, produtoKey);
        
        comissaoTotal += comissao;

        const faltaValor = Math.max(0, proximaMeta.producao - dados.valorAdesao);
        const faltaContas = Math.max(0, proximaMeta.contas - dados.qtdContas);
        const progressoValor = calculateProgress(dados.valorAdesao, proximaMeta.producao);
        const progressoContas = calculateProgress(dados.qtdContas, proximaMeta.contas);

        const statusValor = atingiuMeta ? 'meta-atingida' : 'meta-nao-atingida';
        const statusContas = atingiuMeta ? 'meta-atingida' : 'meta-nao-atingida';

        return `
            <div class="produto-meta">
                <div class="produto-header">
                    <span class="produto-nome">${CONFIG.produtos[produtoKey].nome}</span>
                    <span class="comissao-badge ${statusValor}">${formatCurrency(comissao)}</span>
                </div>
                <div class="meta-item">
                    <div class="meta-label">
                        <span>Faturamento</span>
                        <span class="meta-valores">${formatCurrency(dados.valorAdesao)} / ${formatCurrency(proximaMeta.producao)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${statusValor}" style="width: ${progressoValor}%"></div>
                    </div>
                    <span class="meta-falta ${statusValor}">Faltam ${formatCurrency(faltaValor)}</span>
                </div>
                <div class="meta-item">
                    <div class="meta-label">
                        <span>Contas</span>
                        <span class="meta-valores">${dados.qtdContas} / ${proximaMeta.contas}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${statusContas}" style="width: ${progressoContas}%"></div>
                    </div>
                    <span class="meta-falta ${statusContas}">Faltam ${faltaContas} contas</span>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="goal-card">
            <div class="card-header">
                <span class="card-name">${consultor.nome}</span>
                <div class="comissao-total">${formatCurrency(comissaoTotal)}</div>
            </div>
            <div class="produtos-container">
                ${produtosHtml}
            </div>
        </div>
    `;
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
