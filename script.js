// Configurações e Dados do Dashboard
const CONFIG = {
    metaValor: 5000,
    metaContas: 5,
    comissaoPercentual: 0.15
};

// Dados dos Consultores - VOCÊ PODE ATUALIZAR ESTES VALORES DIRETAMENTE AQUI
const consultoresInternos = [
    { id: 1, nome: "Maria Luiza", valorAdesao: 5200, qtdContas: 6 },
    { id: 2, nome: "Michael", valorAdesao: 3500, qtdContas: 3 },
    { id: 3, nome: "Beatriz", valorAdesao: 4800, qtdContas: 5 }
];

const consultoresExternos = [
    { id: 4, nome: "Nivaldo", valorAdesao: 7000, qtdContas: 8 },
    { id: 5, nome: "Marco", valorAdesao: 4200, qtdContas: 4 }
];

// Ícones SVG
const icons = {
    user: `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    external: `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`
};

// Formatação de Moeda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Função para calcular progresso
const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
};

// Renderizar Consultores na Lista Superior
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
                <div class="card-header">
                    <span class="name">${c.nome}</span>
                    <span class="commission-badge ${bateuMeta ? 'visible' : ''}">
                        Comissão: ${formatCurrency(comissao)}
                    </span>
                </div>
                
                <div class="progress-group">
                    <!-- Progresso R$ -->
                    <div class="progress-item">
                        <div class="progress-label">
                            <span>Adesão: ${formatCurrency(c.valorAdesao)}</span>
                            <span class="remaining">${faltaValor > 0 ? 'Falta ' + formatCurrency(faltaValor) : 'Meta batida!'}</span>
                        </div>
                        <div class="bar-bg">
                            <div class="bar-fill ${progressoValor >= 100 ? 'complete' : ''}" style="width: ${progressoValor}%"></div>
                        </div>
                    </div>

                    <!-- Progresso Contas -->
                    <div class="progress-item">
                        <div class="progress-label">
                            <span>Contas: ${c.qtdContas}</span>
                            <span class="remaining">${faltaContas > 0 ? 'Faltam ' + faltaContas : 'Meta batida!'}</span>
                        </div>
                        <div class="bar-bg">
                            <div class="bar-fill ${progressoContas >= 100 ? 'complete' : ''}" style="width: ${progressoContas}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Definir data atual
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR', dateOptions);
    
    renderConsultantLists();
    renderGoalCards();
});
