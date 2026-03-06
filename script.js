// Configurações e Dados do Dashboard
const CONFIG = {
    produtos: {
        crediario: {
            nome: "Crediário Garantido",
            faixas: [
                { id: 1, producao: 6000, contas: 6, comissao: 0.15, label: "Até R$ 6.000", cor: "#0A84FF" },
                { id: 2, producao: 10000, contas: 10, comissao: 0.175, label: "Até R$ 10.000", cor: "#9D4EDD" },
                { id: 3, producao: 15000, contas: 10, comissao: 0.20, label: "A partir de R$ 15.000", cor: "#30D158" }
            ]
        },
        soufacil: {
            nome: "SouFácil Card",
            faixas: [
                { id: 1, producao: 4000, contas: 4, comissao: 0.15, label: "R$ 4.000", cor: "#0A84FF" },
                { id: 2, producao: 6000, contas: 6, comissao: 0.175, label: "R$ 6.000", cor: "#9D4EDD" },
                { id: 3, producao: 6000, contas: 6, comissao: 0.20, label: "Acima de 6 contas", cor: "#30D158" }
            ]
        },
        cobranca: {
            nome: "Cobrança Terceirizada",
            faixas: [
                { id: 1, producao: 1500, contas: 3, comissao: 0.15, label: "3 contas", cor: "#0A84FF" },
                { id: 2, producao: 2500, contas: 5, comissao: 0.175, label: "5 contas", cor: "#9D4EDD" },
                { id: 3, producao: 2500, contas: 5, comissao: 0.20, label: "Acima de 5 contas", cor: "#30D158" }
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
        uf: "",
        origem: "",
        segmento: "",
        produtos: {
            crediario: { valorAdesao: 0, qtdContas: 0 },
            soufacil: { valorAdesao: 0, qtdContas: 0 },
            cobranca: { valorAdesao: 0, qtdContas: 0 }
        }
    },
    { 
        nome: "Michael", 
        uf: "PR",
        origem: "CASA DOS DADOS",
        segmento: "Moveis",
        produtos: {
            crediario: { valorAdesao: 650, qtdContas: 1 },
            soufacil: { valorAdesao: 0, qtdContas: 0 },
            cobranca: { valorAdesao: 0, qtdContas: 0 }
        }
    },
    { 
        nome: "Maria", 
        uf: "SP",
        origem: "MegaZap",
        segmento: "Construção",
        produtos: {
            crediario: { valorAdesao: 1398, qtdContas: 1 },
            soufacil: { valorAdesao: 0, qtdContas: 0 },
            cobranca: { valorAdesao: 0, qtdContas: 0 }
        }
    },
];

const consultoresExternos = [
    { 
        nome: "Nivaldo", 
        uf: "",
        origem: "",
        segmento: "",
        produtos: {
            crediario: { valorAdesao: 0, qtdContas: 0 },
            soufacil: { valorAdesao: 0, qtdContas: 0 },
            cobranca: { valorAdesao: 0, qtdContas: 0 }
        }
    },
    { 
        nome: "Marco", 
        uf: "",
        origem: "",
        segmento: "",
        produtos: {
            crediario: { valorAdesao: 0, qtdContas: 0 },
            soufacil: { valorAdesao: 0, qtdContas: 0 },
            cobranca: { valorAdesao: 0, qtdContas: 0 }
        }
    },
    { 
        nome: "Kaly", 
        uf: "",
        origem: "",
        segmento: "",
        produtos: {
            crediario: { valorAdesao: 0, qtdContas: 0 },
            soufacil: { valorAdesao: 0, qtdContas: 0 },
            cobranca: { valorAdesao: 0, qtdContas: 0 }
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

/**
 * Calcula a comissão progressiva de um produto
 */
const calculateComissao = (valor, qtdContas, produtoKey) => {
    const faixas = CONFIG.produtos[produtoKey].faixas;
    let comissao = 0;
    let valorAnterior = 0;

    for (let i = 0; i < faixas.length; i++) {
        const faixa = faixas[i];
        const faixaAnterior = i > 0 ? faixas[i - 1] : null;
        const limiteInferior = faixaAnterior ? faixaAnterior.producao : 0;
        const limiteSuperior = faixa.producao;

        if (qtdContas >= faixa.contas) {
            if (valor >= limiteSuperior) {
                // Atingiu completamente esta faixa
                comissao += (limiteSuperior - limiteInferior) * faixa.comissao;
            } else if (valor > limiteInferior) {
                // Atingiu parcialmente
                comissao += (valor - limiteInferior) * faixa.comissao;
                break;
            }
        } else {
            break;
        }
    }

    return comissao;
};

/**
 * Retorna o status de cada faixa (atingida, parcial, não atingida)
 */
const getFaixasStatus = (valor, qtdContas, produtoKey) => {
    const faixas = CONFIG.produtos[produtoKey].faixas;
    const status = [];

    for (let i = 0; i < faixas.length; i++) {
        const faixa = faixas[i];
        const faixaAnterior = i > 0 ? faixas[i - 1] : null;
        const limiteInferior = faixaAnterior ? faixaAnterior.producao : 0;
        const limiteSuperior = faixa.producao;

        let estado = "nao-atingida";
        
        if (qtdContas >= faixa.contas) {
            if (valor >= limiteSuperior) {
                estado = "atingida";
            } else if (valor > limiteInferior) {
                estado = "parcial";
            }
        }

        status.push({
            id: faixa.id,
            cor: faixa.cor,
            estado: estado
        });
    }

    return status;
};

function renderDashboard() {
    const internosList = document.getElementById('internos-list');
    const externosList = document.getElementById('externos-list');
    const goalsGrid = document.getElementById('goals-grid');

    // Listas Laterais
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

    // Cards de Metas
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
 * Renderiza o card de um consultor
 */
function renderConsultorCard(consultor) {
    const produtosKeys = ['crediario', 'soufacil', 'cobranca'];
    let comissaoTotalGeral = 0;

    const produtosHtml = produtosKeys.map(produtoKey => {
        const dados = consultor.produtos[produtoKey];
        const comissao = calculateComissao(dados.valorAdesao, dados.qtdContas, produtoKey);
        const faixasStatus = getFaixasStatus(dados.valorAdesao, dados.qtdContas, produtoKey);

        comissaoTotalGeral += comissao;

        // Renderiza a barra segmentada
        const barraSegmentada = faixasStatus.map(faixa => {
            let bgColor = '#333333';
            let opacity = '0.3';

            if (faixa.estado === 'atingida') {
                bgColor = faixa.cor;
                opacity = '1';
            } else if (faixa.estado === 'parcial') {
                bgColor = faixa.cor;
                opacity = '0.7';
            }

            return `<div class="segmento" style="background-color: ${bgColor}; opacity: ${opacity};"></div>`;
        }).join('');

        return `
            <div class="produto-item">
                <div class="produto-header">
                    <span class="produto-nome">${CONFIG.produtos[produtoKey].nome}</span>
                    <span class="comissao-produto">${formatCurrency(comissao)}</span>
                </div>
                <div class="produto-info">
                    <span class="info-valor">${formatCurrency(dados.valorAdesao)}</span>
                    <span class="info-contas">${dados.qtdContas} contas</span>
                </div>
                <div class="barra-segmentada">
                    ${barraSegmentada}
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

/**
 * Calcula dados para lista por UF
 */
function getDataByUF() {
    const allConsultores = [...consultoresInternos, ...consultoresExternos];
    const ufData = {};
    
    allConsultores.forEach(c => {
        if (!ufData[c.uf]) {
            ufData[c.uf] = 0;
        }
        ufData[c.uf] += Object.values(c.produtos).reduce((sum, p) => sum + p.qtdContas, 0);
    });
    
    return ufData;
}

/**
 * Calcula dados para lista por origem
 */
function getDataByOrigem() {
    const allConsultores = [...consultoresInternos, ...consultoresExternos];
    const origemData = {};
    
    allConsultores.forEach(c => {
        if (!origemData[c.origem]) {
            origemData[c.origem] = 0;
        }
        origemData[c.origem] += Object.values(c.produtos).reduce((sum, p) => sum + p.qtdContas, 0);
    });
    
    return origemData;
}

/**
 * Calcula dados para lista por segmento
 */
function getDataBySegmento() {
    const allConsultores = [...consultoresInternos, ...consultoresExternos];
    const segmentoData = {};
    
    allConsultores.forEach(c => {
        if (!segmentoData[c.segmento]) {
            segmentoData[c.segmento] = 0;
        }
        segmentoData[c.segmento] += 1;
    });
    
    return segmentoData;
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

/**
 * Renderiza o card com listas coloridas por UF, Origem e Segmento
 */
function renderAnalyticsCard() {
    const centerContent = document.querySelector('.center-content');
    
    const ufData = getDataByUF();
    const origemData = getDataByOrigem();
    const segmentoData = getDataBySegmento();
    
    const ufLabels = Object.keys(ufData);
    const ufValues = Object.values(ufData);
    
    const origemLabels = Object.keys(origemData);
    const origemValues = Object.values(origemData);
    
    const segmentoLabels = Object.keys(segmentoData);
    const segmentoValues = Object.values(segmentoData);
    
    // Cores vibrantes para os itens
    const listColors = ['#0A84FF', '#9D4EDD', '#30D158', '#FF9500', '#FF3B30', '#5AC8FA', '#00C7BE', '#FFD60A', '#FF453A', '#64B5F6'];
    
    const analyticsHTML = `
        <section class="analytics-section">
            <div class="section-title">
                <h2>Analise de Contas Fechadas</h2>
            </div>
            <div class="analytics-grid">
                <div class="analytics-card">
                    <h3>Por UF</h3>
                    <div id="uf-list" class="colored-list"></div>
                </div>
                <div class="analytics-card">
                    <h3>Por Origem</h3>
                    <div id="origem-list" class="colored-list"></div>
                </div>
                <div class="analytics-card">
                    <h3>Por Segmento</h3>
                    <div id="segmento-list" class="colored-list"></div>
                </div>
            </div>
        </section>
    `;
    
    centerContent.insertAdjacentHTML('beforeend', analyticsHTML);
    
    // Renderizar lista de UF
    const ufList = document.getElementById('uf-list');
    ufList.innerHTML = ufLabels.map((uf, idx) => `
        <div class="colored-item" style="--item-color: ${listColors[idx % listColors.length]}">
            <div class="item-color-bar"></div>
            <div class="item-content">
                <span class="item-label">${uf}</span>
                <span class="item-value">${ufValues[idx]} conta${ufValues[idx] > 1 ? 's' : ''}</span>
            </div>
        </div>
    `).join('');
    
    // Renderizar lista de Origem
    const origemListEl = document.getElementById('origem-list');
    origemListEl.innerHTML = origemLabels.map((origem, idx) => `
        <div class="colored-item" style="--item-color: ${listColors[(idx + 3) % listColors.length]}">
            <div class="item-color-bar"></div>
            <div class="item-content">
                <span class="item-label">${origem.replace(/_/g, ' ')}</span>
                <span class="item-value">${origemValues[idx]} conta${origemValues[idx] > 1 ? 's' : ''}</span>
            </div>
        </div>
    `).join('');
    
    // Renderizar lista de Segmento
    const segmentoList = document.getElementById('segmento-list');
    segmentoList.innerHTML = segmentoLabels.map((seg, idx) => `
        <div class="colored-item" style="--item-color: ${listColors[(idx + 6) % listColors.length]}">
            <div class="item-color-bar"></div>
            <div class="item-content">
                <span class="item-label">${seg}</span>
                <span class="item-value">${segmentoValues[idx]} empresa${segmentoValues[idx] > 1 ? 's' : ''}</span>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('theme-toggle').innerHTML = icons.sun;
    renderDashboard();
    renderAnalyticsCard();
});
