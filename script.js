// ==== METAS POR CONSULTOR ====
const metasConsultores = {
  Leticia: { contas: 7, receita: 5500 },
  Marcelo: { contas: 7, receita: 5500 },
  Gabriel: { contas: 7, receita: 5500 },
  Glaucia: { contas: 7, receita: 5500 }
};

// ==== METAS GERAIS ====
const metasGerais = {
  contas: 28,
  receita: 22000,
  vendas: 1500000,
  rentabilidade: 870000
};

// ==== DADOS DOS CONSULTORES ====
const consultores = [
  { nome: "Leticia", contas: 5, receita: 4700, vendas: 29552, rentabilidade: 0 },
  { nome: "Marcelo", contas: 3, receita: 1500, vendas: 9678, rentabilidade: 0 },
  { nome: "Gabriel", contas: 1, receita: 455, vendas: 23973, rentabilidade: 0 },
  { nome: "Glaucia", contas: 1, receita: 500, vendas: 13555, rentabilidade: 0 }
];

// ==== DADOS VENDAS MENSAL ====
const vendasMesPassado = 90000;
const vendasMesAtual = 120000;

// ==== LOGIN ====
window.login = function () {
  const user = document.getElementById("userSelect").value;
  const pass = document.getElementById("password").value;

  if (!user || pass !== user + "1234") {
    alert("Login inválido");
    return;
  }

  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("mainApp").style.display = "block";

  gerarDashboard();
};

// ==== DASHBOARD COMERCIAL ====
function gerarDashboard() {
  const implantacaoContainer = document.getElementById("cardsImplantacao");
  const faturamentoContainer = document.getElementById("cardsFaturamento");

  implantacaoContainer.innerHTML = "";
  faturamentoContainer.innerHTML = "";

  const totalContas = consultores.reduce((sum, c) => sum + c.contas, 0);
  const totalReceita = consultores.reduce((sum, c) => sum + c.receita, 0);
  const totalVendas = consultores.reduce((sum, c) => sum + c.vendas, 0);
  const totalRentabilidade = consultores.reduce((sum, c) => sum + c.rentabilidade, 0);

  // Cards coluna Por Implantação
  implantacaoContainer.innerHTML += criarCard("Contas Realizadas", `${totalContas} / ${metasGerais.contas}`, totalContas / metasGerais.contas * 100);
  implantacaoContainer.innerHTML += criarCard("Receita Realizada", `R$ ${totalReceita.toFixed(2)} / R$ ${metasGerais.receita}`, totalReceita / metasGerais.receita * 100);

  // Ranking de Vendas dentro da coluna Por Implantação
  implantacaoContainer.innerHTML += `
    <div class="card">
      <h4>🏅 Ranking de Vendas</h4>
      <div id="rankingVendas"></div>
    </div>
  `;

  // Cards coluna Por Faturamento
  faturamentoContainer.innerHTML += criarCard("Vendas", `R$ ${totalVendas.toFixed(2)} / R$ ${metasGerais.vendas}`, totalVendas / metasGerais.vendas * 100);
  faturamentoContainer.innerHTML += criarCard("Rentabilidade", `R$ ${totalRentabilidade.toFixed(2)} / R$ ${metasGerais.rentabilidade}`, totalRentabilidade / metasGerais.rentabilidade * 100);

  // Gráfico dentro da coluna Por Faturamento
  faturamentoContainer.innerHTML += `
    <div class="card">
      <h4>📈 Vendas Gerais por Período</h4>
      <canvas id="graficoVendas"></canvas>
    </div>
  `;

  gerarRanking();
  gerarRankingVendas();
  gerarGraficoVendas();
}

function criarCard(titulo, valor, progresso) {
  return `
    <div class="card">
      <h3>${titulo}</h3>
      <p>${valor}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${Math.min(progresso, 100)}%;"></div>
      </div>
    </div>
  `;
}

// ==== RANKING POR CONTAS E RECEITA ====
function gerarRanking() {
  const rankingContas = [...consultores].sort((a, b) => b.contas - a.contas);
  const rankingReceita = [...consultores].sort((a, b) => b.receita - a.receita);

  const containerContas = document.getElementById("rankingContas");
  const containerReceita = document.getElementById("rankingReceita");

  containerContas.innerHTML = "";
  containerReceita.innerHTML = "";

  rankingContas.forEach((c, i) => {
    const metaContas = metasConsultores[c.nome]?.contas || metasGerais.contas;
    const progresso = Math.min((c.contas / metaContas) * 100, 100);
    containerContas.innerHTML += criarCardConsultor(c, progresso, i + 1, "contas", metaContas);
  });

  rankingReceita.forEach((c, i) => {
    const metaReceita = metasConsultores[c.nome]?.receita || metasGerais.receita;
    const progresso = Math.min((c.receita / metaReceita) * 100, 100);
    containerReceita.innerHTML += criarCardConsultor(c, progresso, i + 1, "receita", metaReceita);
  });
}

function criarCardConsultor(c, progresso, posicao, tipo, meta) {
  const emoji = posicao === 1 ? "🏆" : posicao === 2 ? "🥈" : posicao === 3 ? "🥉" : "🎖️";
  const valor = tipo === "contas" ? `${c.contas} contas` : `R$ ${c.receita.toFixed(2)}`;
  const falta = tipo === "contas" ? `${Math.max(0, meta - c.contas)} contas` : `R$ ${Math.max(0, meta - c.receita).toFixed(2)}`;
  return `
    <div class="consultor-card">
      <h4>${emoji} ${c.nome} (Posição ${posicao})</h4>
      <p><strong>${valor}</strong></p>
      <p class="falta">Faltam: ${falta}</p>
      <div class="progress-bar">
        <div class="progress" style="width: ${progresso}%;"></div>
      </div>
    </div>
  `;
}

// ==== RANKING DE VENDAS COMPACTO ====
function gerarRankingVendas() {
  const ranking = [...consultores].sort((a, b) => b.vendas - a.vendas);
  const container = document.getElementById("rankingVendas");
  container.innerHTML = "";

  ranking.forEach((c, i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    container.innerHTML += `
      <div style="display: flex; justify-content: space-between; font-size: 14px; padding: 2px 0;">
        <span>${emoji} ${c.nome}</span>
        <strong>R$ ${c.vendas.toLocaleString()}</strong>
      </div>
    `;
  });
}

// ==== GRÁFICO DE VENDAS ====
function gerarGraficoVendas() {
  const ctx = document.getElementById("graficoVendas").getContext("2d");
  const cor = vendasMesAtual >= vendasMesPassado ? "green" : "red";

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mês Passado", "Mês Atual"],
      datasets: [{
        label: "Vendas",
        data: [vendasMesPassado, vendasMesAtual],
        borderColor: cor,
        backgroundColor: cor,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `R$ ${ctx.parsed.y.toLocaleString()}`
          }
        }
      }
    }
  });
}
