// Configurações e Regras de Comissão por Produto
const REGRAS_PRODUTOS = {
    crediario: {
        titulo: "Crediário Garantido",
        cor: "#0A84FF", // Azul
        faixas: [
            { limiteValor: 6000, limiteContas: 6, comissao: 0.15 },
            { limiteValor: 10000, limiteContas: 10, comissao: 0.175 },
            { limiteValor: Infinity, limiteContas: 10, comissao: 0.20 }
        ]
    },
    soufacilCard: {
        titulo: "SouFácil Card",
        cor: "#FFD60A", // Amarelo/Dourado
        faixas: [
            { limiteValor: 4000, limiteContas: 4, comissao: 0.15 },
            { limiteValor: 6000, limiteContas: 6, comissao: 0.175 },
            { limiteValor: Infinity, limiteContas: 6, comissao: 0.20 }
        ]
    },
    cobranca: {
        titulo: "Cobrança Terceirizada",
        cor: "#30D158", // Verde
        faixas: [
            { limiteValor: 1500, limiteContas: 3, comissao: 0.15 },
            { limiteValor: 2500, limiteContas: 5, comissao: 0.175 },
            { limiteValor: Infinity, limiteContas: 5, comissao: 0.20 }
        ]
    }
};

/**
 * DADOS DOS CONSULTORES
 * Edite aqui os valores produzidos por cada consultor em cada produto
 */
const consultoresInternos = [
    { 
        nome: "Michael", 
        producao: {
            crediario: { valor: 8000, contas: 7 },
            soufacilCard: { valor: 3500, contas: 3 },
            cobranca: { valor: 1200, contas: 2 }
        }
    },
    { 
        nome: "Beatriz", 
        producao: {
            crediario: { valor: 15500, contas: 12 },
            soufacilCard: { valor: 5000, contas: 5 },
            cobranca: { valor: 2000, contas: 4 }
        }
    },
    { 
        nome: "Maria", 
        producao: {
            crediario: { valor: 5000, contas: 4 },
            soufacilCard: { valor: 3000, contas: 3 },
            cobranca: { valor: 1000, contas: 2 }
        }
    }
];

const consultoresExternos = [
    { 
        nome: "Nivaldo", 
        producao: {
            crediario: { valor: 20000, contas: 15 },
            soufacilCard: { valor: 10000, contas: 10 },
            cobranca: { valor: 5000, contas: 8 }
        }
    },
    { 
        nome: "Marco", 
        producao: {
            crediario: { valor: 4000, contas: 3 },
            soufacilCard: { valor: 2000, contas: 2 },
            cobranca: { valor: 800, contas: 1 }
        }
    }
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

/**
 * CÁLCULO DE COMISSÃO PROGRESSIVA E "QUANTO FALTA"
 */
function calcularPerformance(prod, regras) {
    let comissaoTotal = 0;
    let valorRestante = prod.valor;
    let detalhes = [];
    let proximaMeta = null;

    // Cálculo da comissão progressiva
    for (let i = 0; i < regras.faixas.length; i++) {
        const faixa = regras.faixas[i];
        const faixaAnterior = i > 0 ? regras.faixas[i-1] : { limiteValor: 0, limiteContas: 0 };
        const valorNaFaixa = Math.min(valorRestante, faixa.limiteValor - faixaAnterior.limiteValor);
        
        if (valorNaFaixa > 0) {
            comissaoTotal += valorNaFaixa * faixa.comissao;
            valorRestante -= valorNaFaixa;
            detalhes.push({ valor: valorNaFaixa, taxa: faixa.comissao * 100 });
        }

        // Identificar a próxima meta não batida (seja por valor ou por contas)
        if (!proximaMeta && (prod.valor < faixa.limiteValor || prod.contas < faixa.limiteContas) && faixa.limiteValor !== Infinity) {
            proximaMeta = {
                valorFaltante: Math.max(0, faixa.limiteValor - prod.valor),
                contasFaltantes: Math.max(0, faixa.limiteContas - prod.contas),
                taxaAlvo: faixa.comissao * 100
            };
        }
    }

    return { comissaoTotal, detalhes, proximaMeta };
}

function renderDashboard() {
    const internosList = document.getElementById('internos-list');
    const externosList = document.getElementById('externos-list');
    const goalsGrid = document.getElementById('goals-grid');

    // Listas Laterais
    const renderConsultorItem = (c) => {
        const totalAdesao = Object.values(c.producao).reduce((acc, p) => acc + p.valor, 0);
        const totalContas = Object.values(c.producao).reduce((acc, p) => acc + p.contas, 0);
        return `
            <div class="list-item">
                <div class="item-info">
                    <span class="name">${c.nome}</span>
                    <span class="sub-value">${totalContas} contas total</span>
                </div>
                <span class="value">${formatCurrency(totalAdesao)}</span>
            </div>
        `;
    };

    internosList.innerHTML = consultoresInternos.map(renderConsultorItem).join('');
    externosList.innerHTML = consultoresExternos.map(renderConsultorItem).join('');

    // Cards de Performance (3 Cards Principais: Michael, Beatriz, Maria)
    goalsGrid.innerHTML = consultoresInternos.map(c => {
        let produtosHTML = '';
        let totalComissaoConsultor = 0;
        
        for (const [key, regras] of Object.entries(REGRAS_PRODUTOS)) {
            const prod = c.producao[key];
            const perf = calcularPerformance(prod, regras);
            totalComissaoConsultor += perf.comissaoTotal;
            
            const metaMax = regras.faixas[1].limiteValor; // Referência visual para a barra
            const progresso = Math.min((prod.valor / metaMax) * 100, 100);
            
            produtosHTML += `
                <div class="product-item">
                    <div class="product-header">
                        <span class="product-name" style="color: ${regras.cor}">${regras.titulo}</span>
                        <span class="product-value">${formatCurrency(prod.valor)}</span>
                    </div>
                    <div class="product-bar-bg">
                        <div class="product-bar-fill" style="width: ${progresso}%; background-color: ${regras.cor}"></div>
                    </div>
                    <div class="product-footer">
                        <span class="contas-info">${prod.contas} contas</span>
                        ${perf.proximaMeta ? `
                            <span class="missing-info">
                                Falta: <span class="missing-value">${formatCurrency(perf.proximaMeta.valorFaltante)}</span> | 
                                <span class="missing-value">${perf.proximaMeta.contasFaltantes} contas</span>
                            </span>
                        ` : `<span class="meta-reached">Meta Máxima Batida!</span>`}
                    </div>
                </div>
            `;
        }

        return `
            <div class="consultor-card">
                <div class="consultor-card-header">
                    <span class="consultor-card-name">${c.nome}</span>
                    <div class="total-commission-badge">
                        Total: ${formatCurrency(totalComissaoConsultor)}
                    </div>
                </div>
                <div class="consultor-products-list">
                    ${produtosHTML}
                </div>
            </div>
        `;
    }).join('');

    // Totais Superiores
    const calcularTotais = (lista) => {
        return lista.reduce((acc, c) => {
            acc.valor += Object.values(c.producao).reduce((a, p) => a + p.valor, 0);
            acc.contas += Object.values(c.producao).reduce((a, p) => a + p.contas, 0);
            return acc;
        }, { valor: 0, contas: 0 });
    };

    const totaisInternos = calcularTotais(consultoresInternos);
    const totaisExternos = calcularTotais(consultoresExternos);

    document.getElementById('total-interno-adesao').textContent = formatCurrency(totaisInternos.valor);
    document.getElementById('total-interno-contas').textContent = totaisInternos.contas;
    document.getElementById('total-externo-adesao').textContent = formatCurrency(totaisExternos.valor);
    document.getElementById('total-externo-contas').textContent = totaisExternos.contas;
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    if (body.getAttribute('data-theme') === 'light') {
        body.setAttribute('data-theme', 'dark');
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
        body.setAttribute('data-theme', 'light');
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    renderDashboard();
});
