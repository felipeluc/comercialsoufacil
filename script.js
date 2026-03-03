// Configurações e Regras de Comissão por Produto
const REGRAS_PRODUTOS = {
    crediario: {
        titulo: "Crediário Garantido",
        faixas: [
            { limiteValor: 6000, limiteContas: 6, comissao: 0.15 },
            { limiteValor: 10000, limiteContas: 10, comissao: 0.175 },
            { limiteValor: Infinity, limiteContas: 10, comissao: 0.20 }
        ]
    },
    soufacilCard: {
        titulo: "SouFácil Card",
        faixas: [
            { limiteValor: 4000, limiteContas: 4, comissao: 0.15 },
            { limiteValor: 6000, limiteContas: 6, comissao: 0.175 },
            { limiteValor: Infinity, limiteContas: 6, comissao: 0.20 }
        ]
    },
    cobranca: {
        titulo: "Cobrança Terceirizada",
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
        nome: "Beatriz", 
        producao: {
            crediario: { valor: 15500, contas: 12 },
            soufacilCard: { valor: 5000, contas: 5 },
            cobranca: { valor: 2000, contas: 4 }
        }
    },
    { 
        nome: "Michael", 
        producao: {
            crediario: { valor: 8000, contas: 7 },
            soufacilCard: { valor: 7500, contas: 8 },
            cobranca: { valor: 3000, contas: 6 }
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

// Ícones SVG
const icons = {
    sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

/**
 * CÁLCULO DE COMISSÃO PROGRESSIVA
 */
function calcularComissaoProgressiva(valorProduzido, faixas) {
    let comissaoTotal = 0;
    let valorRestante = valorProduzido;
    let detalhes = [];

    // Faixa 1
    const v1 = Math.min(valorRestante, faixas[0].limiteValor);
    if (v1 > 0) {
        const c1 = v1 * faixas[0].comissao;
        comissaoTotal += c1;
        valorRestante -= v1;
        detalhes.push({ valor: v1, taxa: faixas[0].comissao * 100 });
    }

    // Faixa 2
    if (valorRestante > 0) {
        const v2 = Math.min(valorRestante, faixas[1].limiteValor - faixas[0].limiteValor);
        const c2 = v2 * faixas[1].comissao;
        comissaoTotal += c2;
        valorRestante -= v2;
        detalhes.push({ valor: v2, taxa: faixas[1].comissao * 100 });
    }

    // Faixa 3
    if (valorRestante > 0) {
        const v3 = valorRestante;
        const c3 = v3 * faixas[2].comissao;
        comissaoTotal += c3;
        detalhes.push({ valor: v3, taxa: faixas[2].comissao * 100 });
    }

    return { total: comissaoTotal, detalhes };
}

function renderDashboard() {
    const internosList = document.getElementById('internos-list');
    const externosList = document.getElementById('externos-list');
    const goalsGrid = document.getElementById('goals-grid');

    // Listas Laterais - Totais por Consultor
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

    // Cards de Performance (Focando nos Internos conforme solicitado)
    goalsGrid.innerHTML = consultoresInternos.map(c => {
        let cardsHTML = '';
        
        for (const [key, produto] of Object.entries(REGRAS_PRODUTOS)) {
            const prod = c.producao[key];
            const result = calcularComissaoProgressiva(prod.valor, produto.faixas);
            
            // Cálculo de progresso baseado na meta máxima (faixa 2 para visualização)
            const metaMax = produto.faixas[1].limiteValor;
            const progresso = Math.min((prod.valor / metaMax) * 100, 100);
            
            cardsHTML += `
                <div class="goal-card product-card">
                    <div class="card-header">
                        <div class="header-main">
                            <span class="consultor-name">${c.nome}</span>
                            <span class="product-title">${produto.titulo}</span>
                        </div>
                        <div class="badge success">
                            ${formatCurrency(result.total)}
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="bar-container">
                            <div class="bar-info">
                                <span>Produção: ${formatCurrency(prod.valor)}</span>
                                <span>${prod.contas} contas</span>
                            </div>
                            <div class="bar-bg">
                                <div class="bar-fill" style="width: ${progresso}%"></div>
                            </div>
                        </div>
                        <div class="commission-breakdown">
                            ${result.detalhes.map(d => `
                                <div class="breakdown-item">
                                    <span class="dot"></span>
                                    ${d.taxa}% sobre ${formatCurrency(d.valor)}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
        return cardsHTML;
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
        btn.innerHTML = icons.sun;
    } else {
        body.setAttribute('data-theme', 'light');
        btn.innerHTML = icons.moon;
    }
}

function setupImageModal() {
    const bannerTrigger = document.getElementById('banner-trigger');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const bannerImage = document.querySelector('.mini-banner');

    if (bannerTrigger) {
        bannerTrigger.addEventListener('click', () => {
            modalImage.src = bannerImage.src;
            imageModal.classList.add('active');
        });
    }

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) imageModal.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('theme-toggle').innerHTML = icons.sun;
    renderDashboard();
    setupImageModal();
});
