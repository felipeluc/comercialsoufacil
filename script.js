// Configurações e Dados do Dashboard
const CONFIG = {
    produtos: {
        crediario: {
            nome: "Crediário Garantido",
            faixas: [
                { id: 1, producao: 6000, contas: 6, comissao: 0.15, label: "Até R$ 6.000" },
                { id: 2, producao: 10000, contas: 10, comissao: 0.175, label: "Até R$ 10.000" },
                { id: 3, producao: 15000, contas: 10, comissao: 0.20, label: "A partir de R$ 15.000" }
            ]
        },
        soufacil: {
            nome: "SouFácil Card",
            faixas: [
                { id: 1, producao: 4000, contas: 4, comissao: 0.15, label: "R$ 4.000" },
                { id: 2, producao: 6000, contas: 6, comissao: 0.175, label: "R$ 6.000" },
                { id: 3, producao: 6000, contas: 6, comissao: 0.20, label: "Acima de 6 contas" }
            ]
        },
        cobranca: {
            nome: "Cobrança Terceirizada",
            faixas: [
                { id: 1, producao: 1500, contas: 3, comissao: 0.15, label: "3 contas" },
                { id: 2, producao: 2500, contas: 5, comissao: 0.175, label: "5 contas" },
                { id: 3, producao: 2500, contas: 5, comissao: 0.20, label: "Acima de 5 contas" }
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
 * Calcula as comissões por faixa de um produto
 * Retorna um array com as informações de cada faixa
 */
const calculateFaixasComissao = (valor, qtdContas, produtoKey) => {
    const faixas = CONFIG.produtos[produtoKey].faixas;
    const resultado = [];
    let valorAnterior = 0;
    let comissaoAcumulada = 0;

    for (let i = 0; i < faixas.length; i++) {
        const faixa = faixas[i];
        const faixaAnterior = i > 0 ? faixas[i - 1] : null;
        
        // Determina o intervalo de valores para esta faixa
        const limiteInferior = faixaAnterior ? faixaAnterior.producao : 0;
        const limiteSuperior = faixa.producao;
        
        // Verifica se atingiu a meta de contas para esta faixa
        const atingiuMetaContas = qtdContas >= faixa.contas;
        
        // Calcula quanto de valor está nesta faixa
        let valorNaFaixa = 0;
        let comissaoNaFaixa = 0;
        let atingiuMeta = false;

        if (valor >= limiteSuperior && atingiuMetaContas) {
            // Atingiu completamente esta faixa
            valorNaFaixa = limiteSuperior - limiteInferior;
            comissaoNaFaixa = valorNaFaixa * faixa.comissao;
            atingiuMeta = true;
        } else if (valor > limiteInferior && atingiuMetaContas) {
            // Atingiu parcialmente esta faixa
            valorNaFaixa = valor - limiteInferior;
            comissaoNaFaixa = valorNaFaixa * faixa.comissao;
            atingiuMeta = false;
        } else if (valor >= limiteSuperior && !atingiuMetaContas) {
            // Tem valor mas não tem contas
            valorNaFaixa = limiteSuperior - limiteInferior;
            comissaoNaFaixa = 0;
            atingiuMeta = false;
        }

        comissaoAcumulada += comissaoNaFaixa;

        resultado.push({
            id: faixa.id,
            label: faixa.label,
            comissaoPercentual: (faixa.comissao * 100).toFixed(1),
            limiteInferior: limiteInferior,
            limiteSuperior: limiteSuperior,
            valorNaFaixa: valorNaFaixa,
            comissaoNaFaixa: comissaoNaFaixa,
            atingiuMeta: atingiuMeta,
            atingiuMetaContas: atingiuMetaContas,
            metaContas: faixa.contas,
            qtdContasAtual: qtdContas,
            progresso: calculateProgress(valor, limiteSuperior),
            faltaValor: Math.max(0, limiteSuperior - valor),
            faltaContas: Math.max(0, faixa.contas - qtdContas)
        });
    }

    return {
        faixas: resultado,
        comissaoTotal: comissaoAcumulada,
        valorTotal: valor,
        qtdContasTotal: qtdContas
    };
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
 * Renderiza o card de um consultor com suas 3 metas e faixas de comissão
 */
function renderConsultorCard(consultor) {
    const produtosKeys = ['crediario', 'soufacil', 'cobranca'];
    
    // Calcula comissão total
    let comissaoTotalGeral = 0;
    const produtosHtml = produtosKeys.map(produtoKey => {
        const dados = consultor.produtos[produtoKey];
        const faixasInfo = calculateFaixasComissao(dados.valorAdesao, dados.qtdContas, produtoKey);
        
        comissaoTotalGeral += faixasInfo.comissaoTotal;

        const faixasHtml = faixasInfo.faixas.map(faixa => {
            const statusClass = faixa.atingiuMeta ? 'faixa-atingida' : 'faixa-nao-atingida';
            const progressoValor = calculateProgress(dados.valorAdesao, faixa.limiteSuperior);
            
            return `
                <div class="faixa-item ${statusClass}">
                    <div class="faixa-header">
                        <div class="faixa-info">
                            <span class="faixa-label">${faixa.label}</span>
                            <span class="faixa-percentual">${faixa.comissaoPercentual}%</span>
                        </div>
                        <span class="faixa-comissao">${formatCurrency(faixa.comissaoNaFaixa)}</span>
                    </div>
                    <div class="faixa-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${statusClass}" style="width: ${progressoValor}%"></div>
                        </div>
                        <div class="faixa-details">
                            <span class="faixa-valor">${formatCurrency(faixa.valorNaFaixa)} / ${formatCurrency(faixa.limiteSuperior - faixa.limiteInferior)}</span>
                            <span class="faixa-contas">${faixa.qtdContasAtual} / ${faixa.metaContas} contas</span>
                        </div>
                    </div>
                    <div class="faixa-falta">
                        ${!faixa.atingiuMeta ? `
                            <span class="falta-valor">Faltam ${formatCurrency(faixa.faltaValor)}</span>
                            ${faixa.faltaContas > 0 ? `<span class="falta-contas">+ ${faixa.faltaContas} contas</span>` : ''}
                        ` : `
                            <span class="meta-completa">Meta atingida</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="produto-meta">
                <div class="produto-header">
                    <span class="produto-nome">${CONFIG.produtos[produtoKey].nome}</span>
                    <span class="comissao-produto">${formatCurrency(faixasInfo.comissaoTotal)}</span>
                </div>
                <div class="faixas-container">
                    ${faixasHtml}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="goal-card">
            <div class="card-header">
                <span class="card-name">${consultor.nome}</span>
                <div class="comissao-total">${formatCurrency(comissaoTotalGeral)}</div>
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
