// Configurações e Dados do Dashboard
const CONFIG = {
    metaValor: 5000,
    metaContas: 5,
    comissaoPercentual: 0.15
};

/**
 * ATUALIZE OS DADOS ABAIXO PARA REFLETIR OS RESULTADOS ATUAIS
 */
const consultoresInternos = [
    { id: 1, nome: "Maria Luiza", valorAdesao: 5200, qtdContas: 6 },
    { id: 2, nome: "Michael", valorAdesao: 3500, qtdContas: 3 },
    { id: 3, nome: "Beatriz", valorAdesao: 4800, qtdContas: 5 }
];

const consultoresExternos = [
    { id: 4, nome: "Nivaldo", valorAdesao: 7000, qtdContas: 8 },
    { id: 5, nome: "Marco", valorAdesao: 4200, qtdContas: 4 }
];

// Ícones SVG Premium
const icons = {
    user: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    external: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
};

// Formatação de Moeda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Função para calcular progresso
const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
};

// Renderizar Consultores
function renderConsultantLists() {
    const internosList = document.getElementById('internos-list');
    const externosList = document.getElementById('externos-list');

    internosList.innerHTML = consultoresInternos.map(c => `
        <div class="consultant-item">
            <div class="icon-circle">${icons.user}</div>
            <div class="consultant-info">
                <span class="name">${c.nome}</span>
                <span class="stats">${formatCurrency(c.valorAdesao)} • ${c.qtdContas} contas</span>
            </div>
        </div>
    `).join('');

    externosList.innerHTML = consultoresExternos.map(c => `
        <div class="consultant-item">
            <div class="icon-circle">${icons.external}</div>
            <div class="consultant-info">
                <span class="name">${c.nome}</span>
                <span class="stats">${formatCurrency(c.valorAdesao)} • ${c.qtdContas} contas</span>
            </div>
        </div>
    `).join('');
}

// Renderizar Cards de Metas
function renderGoalCards() {
    const goalsGrid = document.getElementById('goals-grid');
    
    goalsGrid.innerHTML = consultoresInternos.map(c => {
        const progressoValor = calculateProgress(c.valorAdesao, CONFIG.metaValor);
        const progressoContas = calculateProgress(c.qtdContas, CONFIG.metaContas);
        
        const bateuMeta = c.valorAdesao >= CONFIG.metaValor && c.qtdContas >= CONFIG.metaContas;
        const comissao = bateuMeta ? c.valorAdesao * CONFIG.comissaoPercentual : 0;
        
        const faltaValor = Math.max(CONFIG.metaValor - c.valorAdesao, 0);
        const faltaContas = Math.max(CONFIG.metaContas - c.qtdContas, 0);

        return `
            <div class="goal-card">
                <div class="card-top">
                    <span class="name">${c.nome}</span>
                    <div class="commission-badge ${bateuMeta ? 'visible' : ''}">
                        + ${formatCurrency(comissao)}
                    </div>
                </div>
                
                <div class="progress-container">
                    <!-- Adesão -->
                    <div class="progress-item">
                        <div class="progress-label">
                            <span class="label-main">Adesão: ${formatCurrency(c.valorAdesao)}</span>
                            <span class="label-sub">${faltaValor > 0 ? 'Falta ' + formatCurrency(faltaValor) : 'Meta batida'}</span>
                        </div>
                        <div class="bar-bg">
                            <div class="bar-fill ${progressoValor >= 100 ? 'complete' : ''}" data-width="${progressoValor}"></div>
                        </div>
                    </div>

                    <!-- Contas -->
                    <div class="progress-item">
                        <div class="progress-label">
                            <span class="label-main">Contas: ${c.qtdContas} / ${CONFIG.metaContas}</span>
                            <span class="label-sub">${faltaContas > 0 ? 'Faltam ' + faltaContas : 'Meta batida'}</span>
                        </div>
                        <div class="bar-bg">
                            <div class="bar-fill ${progressoContas >= 100 ? 'complete' : ''}" data-width="${progressoContas}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Animar as barras após o render
    setTimeout(() => {
        document.querySelectorAll('.bar-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') + '%';
        });
    }, 100);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Definir data atual com estilo iOS
    const now = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-BR', dateOptions);
    
    renderConsultantLists();
    renderGoalCards();
});
