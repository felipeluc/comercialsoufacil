/**
 * DADOS DO DASHBOARD
 * Você pode atualizar os valores abaixo para refletir os resultados reais.
 */
const DASHBOARD_DATA = {
    config: {
        metaAdesao: 5000,
        metaContas: 5,
        comissaoPercentual: 0.15
    },
    consultoresInternos: [
        { nome: "Maria Luiza", adesao: 5200, contas: 6 },
        { nome: "Michael", adesao: 3500, contas: 3 },
        { nome: "Beatriz", adesao: 5000, contas: 5 }
    ],
    consultoresExternos: [
        { nome: "Nivaldo", adesao: 12500, contas: 12 },
        { nome: "Marco", adesao: 8900, contas: 8 }
    ]
};

// Formatação de Moeda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Renderizar Data Atual
const renderDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR', options);
};

// Criar Card de Consultor Externo
const createExternalCard = (consultor) => {
    return `
        <div class="card">
            <div class="card-header">
                <h3>${consultor.nome}</h3>
                <span class="badge badge-external">Externo</span>
            </div>
            <div class="external-stats">
                <div class="stat-item">
                    <span class="stat-value">${formatCurrency(consultor.adesao)}</span>
                    <span class="stat-label">Adesão</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${consultor.contas}</span>
                    <span class="stat-label">Contas</span>
                </div>
            </div>
        </div>
    `;
};

// Criar Card de Consultor Interno com Metas
const createInternalCard = (consultor, config) => {
    const percAdesao = Math.min((consultor.adesao / config.metaAdesao) * 100, 100);
    const percContas = Math.min((consultor.contas / config.metaContas) * 100, 100);
    
    const bateuMeta = consultor.adesao >= config.metaAdesao && consultor.contas >= config.metaContas;
    const comissao = bateuMeta ? consultor.adesao * config.comissaoPercentual : 0;

    const faltaAdesao = Math.max(config.metaAdesao - consultor.adesao, 0);
    const faltaContas = Math.max(config.metaContas - consultor.contas, 0);

    return `
        <div class="card">
            <div class="card-header">
                <h3>${consultor.nome}</h3>
                <span class="badge badge-internal">Interno</span>
            </div>
            
            <div class="progress-group">
                <div class="progress-label">
                    <span>Adesão: ${formatCurrency(consultor.adesao)}</span>
                    <span>${percAdesao.toFixed(0)}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-fill fill-money" style="width: ${percAdesao}%"></div>
                </div>
                <p class="locked" style="margin-top:4px; font-size:11px;">
                    ${faltaAdesao > 0 ? `Falta ${formatCurrency(faltaAdesao)}` : 'Meta atingida!'}
                </p>
            </div>

            <div class="progress-group">
                <div class="progress-label">
                    <span>Contas: ${consultor.contas}</span>
                    <span>${percContas.toFixed(0)}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-fill fill-accounts" style="width: ${percContas}%"></div>
                </div>
                <p class="locked" style="margin-top:4px; font-size:11px;">
                    ${faltaContas > 0 ? `Faltam ${faltaContas} contas` : 'Meta atingida!'}
                </p>
            </div>

            <div class="commission-box">
                <span class="commission-label">Comissão (15%)</span>
                <span class="commission-value">
                    ${bateuMeta ? formatCurrency(comissao) : '<span class="locked">Meta pendente</span>'}
                </span>
            </div>
        </div>
    `;
};

// Inicializar Dashboard
const initDashboard = () => {
    renderDate();
    
    const externalContainer = document.getElementById('external-consultants-container');
    const internalContainer = document.getElementById('internal-consultants-container');

    // Limpar containers antes de renderizar
    externalContainer.innerHTML = '';
    internalContainer.innerHTML = '';

    // Renderizar Externos
    DASHBOARD_DATA.consultoresExternos.forEach(c => {
        externalContainer.innerHTML += createExternalCard(c);
    });

    // Renderizar Internos
    DASHBOARD_DATA.consultoresInternos.forEach(c => {
        internalContainer.innerHTML += createInternalCard(c, DASHBOARD_DATA.config);
    });
};

document.addEventListener('DOMContentLoaded', initDashboard);
