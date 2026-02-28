// Configurações e Dados do Dashboard
const CONFIG = {
    metaValor: 5000,
    metaContas: 5,
    comissaoPercentual: 0.15,
    scrollSpeed: 30 // Segundos para uma volta completa (ajuste conforme necessário)
};

/**
 * DADOS DOS CONSULTORES INTERNOS
 */
const consultoresInternos = [
    { nome: "Beatriz", valorAdesao: 5000, qtdContas: 5 },
    { nome: "Michael", valorAdesao: 6000, qtdContas: 8 },
    { nome: "Maria", valorAdesao: 5048, qtdContas: 8 },
];

/**
 * DADOS DOS CONSULTORES EXTERNOS
 */
const consultoresExternos = [
    { nome: "Nivaldo", valorAdesao: 13500, qtdContas: 11 },
    { nome: "Marco", valorAdesao: 2600, qtdContas: 8 },
    { nome: "Kaly", valorAdesao: 1000, qtdContas: 1 }
];

/**
 * DADOS DE FECHAMENTO DAS EMPRESAS (CARROSSEL)
 * Altere aqui os dados das empresas que aparecem no rodapé
 * Formato da data: "DD/MM/YYYY"
 */
const fechamentoEmpresas = [
    { 
        nome: "BM SHOP CELL", 
        consultas: 120, 
        aprovadas: 85, 
        reprovadas: 35, 
        vendas: 4500.50, 
        data: "25/02/2026" 
    },
    { 
        nome: "MAIS CASE CELULARES", 
        consultas: 95, 
        aprovadas: 60, 
        reprovadas: 35, 
        vendas: 2800.00, 
        data: "26/02/2026" 
    },
    { 
        nome: "ELETROMYX", 
        consultas: 150, 
        aprovadas: 110, 
        reprovadas: 40, 
        vendas: 7200.00, 
        data: "27/02/2026" 
    },
    { 
        nome: "CASA DO PISO", 
        consultas: 80, 
        aprovadas: 55, 
        reprovadas: 25, 
        vendas: 3100.00, 
        data: "27/02/2026" 
    },
    { 
        nome: "BAIANO MOVEIS", 
        consultas: 200, 
        aprovadas: 145, 
        reprovadas: 55, 
        vendas: 12500.00, 
        data: "28/02/2026" 
    },
    { 
        nome: "GO CELL CELULARES", 
        consultas: 65, 
        aprovadas: 40, 
        reprovadas: 25, 
        vendas: 1950.00, 
        data: "28/02/2026" 
    }
];

// Ícones SVG
const icons = {
    sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
};

// Estado do carrossel
let isPlaying = true;

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const calculateProgress = (current, target) => {
    return target === 0 ? 0 : Math.min((current / target) * 100, 100);
};

const extractDateDisplay = (dateString) => {
    // Formato: DD/MM/YYYY -> retorna DD/MM
    const parts = dateString.split('/');
    return `${parts[0]}/${parts[1]}`;
};

function renderDashboard() {
    const externosList = document.getElementById('externos-list');
    const goalsGrid = document.getElementById('goals-grid');
    const tickerContent = document.getElementById('ticker-content');

    // Listas Laterais (Externos)
    externosList.innerHTML = consultoresExternos.map(c => `
        <div class="list-item">
            <div class="item-info">
                <span class="name">${c.nome}</span>
                <span class="sub-value">${c.qtdContas} contas</span>
            </div>
            <span class="value">${formatCurrency(c.valorAdesao)}</span>
        </div>
    `).join('');

    // Cards de Metas (Internos)
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

    // Renderizar Carrossel de Empresas
    const companyCardsHTML = fechamentoEmpresas.map(emp => {
        const dateDisplay = extractDateDisplay(emp.data);
        return `
            <div class="company-card">
                <h3 class="company-name">${emp.nome}</h3>
                <div class="company-date-display">Data: ${dateDisplay}</div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <span class="stat-label">Consultas</span>
                        <span class="stat-value consultas">${emp.consultas}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Aprovadas</span>
                        <span class="stat-value aprovadas">${emp.aprovadas}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Reprovadas</span>
                        <span class="stat-value reprovadas">${emp.reprovadas}</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">Vendas</span>
                        <span class="stat-value vendas">${formatCurrency(emp.vendas)}</span>
                    </div>
                </div>
                <div class="company-date">Fechado em: ${emp.data}</div>
            </div>
        `;
    }).join('');

    // Duplicamos o conteúdo para criar um loop infinito suave
    tickerContent.innerHTML = companyCardsHTML + companyCardsHTML;
    
    // Ajustar velocidade da animação baseada no número de empresas
    tickerContent.style.animation = `scroll ${CONFIG.scrollSpeed}s linear infinite`;

    // Totais Superiores - INTERNOS
    const totalInternoAdesao = consultoresInternos.reduce((acc, c) => acc + c.valorAdesao, 0);
    const totalInternoContas = consultoresInternos.reduce((acc, c) => acc + c.qtdContas, 0);
    
    // Totais Superiores - EXTERNOS
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

function setupPlayPauseControls() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const tickerContent = document.getElementById('ticker-content');

    playBtn.addEventListener('click', () => {
        isPlaying = true;
        tickerContent.classList.remove('paused');
        playBtn.classList.remove('active');
        pauseBtn.classList.add('active');
    });

    pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        tickerContent.classList.add('paused');
        pauseBtn.classList.remove('active');
        playBtn.classList.add('active');
    });
}

function setupImageModal() {
    const bannerTrigger = document.getElementById('banner-trigger');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const bannerImage = document.querySelector('.mini-banner');

    // Abrir modal ao clicar na imagem
    bannerTrigger.addEventListener('click', () => {
        modalImage.src = bannerImage.src;
        imageModal.classList.add('active');
    });

    // Fechar modal ao clicar fora da imagem
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
        }
    });

    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('theme-toggle').innerHTML = icons.sun;
    renderDashboard();
    setupPlayPauseControls();
    setupImageModal();
});
