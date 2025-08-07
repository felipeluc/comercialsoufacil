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
  vendas: 1500000,           // ← Edite a meta de VENDAS aqui
  rentabilidade: 870000     // ← Edite a meta de RENTABILIDADE aqui
};

// ==== DADOS DOS CONSULTORES ====
const consultores = [
  { nome: "Leticia", contas: 4, receita: 3700, vendas: 29552, rentabilidade: 0000 },
  { nome: "Marcelo", contas: 3, receita: 1500, vendas: 9678, rentabilidade: 0000 },
  { nome: "Gabriel", contas: 1, receita: 455, vendas: 23973, rentabilidade: 0000 },
  { nome: "Glaucia", contas: 1, receita: 500, vendas: 13555, rentabilidade: 0000 }
];

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

  const cardsImplantacao = [
    {
      titulo: "Contas Realizadas",
      valor: `${totalContas} / ${metasGerais.contas}`,
      progresso: Math.min((totalContas / metasGerais.contas) * 100, 100)
    },
    {
      titulo: "Receita Realizada",
      valor: `R$ ${totalReceita.toFixed(2)} / R$ ${metasGerais.receita}`,
      progresso: Math.min((totalReceita / metasGerais.receita) * 100, 100)
    }
  ];

  const cardsFaturamento = [
    {
      titulo: "Vendas",
      valor: `R$ ${totalVendas.toFixed(2)} / R$ ${metasGerais.vendas}`,
      progresso: Math.min((totalVendas / metasGerais.vendas) * 100, 100)
    },
    {
      titulo: "Rentabilidade",
      valor: `R$ ${totalRentabilidade.toFixed(2)} / R$ ${metasGerais.rentabilidade}`,
      progresso: Math.min((totalRentabilidade / metasGerais.rentabilidade) * 100, 100)
    }
  ];

  cardsImplantacao.forEach(c => {
    implantacaoContainer.innerHTML += `
      <div class="card">
        <h3>${c.titulo}</h3>
        <p>${c.valor}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${c.progresso}%;"></div>
        </div>
      </div>
    `;
  });

  cardsFaturamento.forEach(c => {
    faturamentoContainer.innerHTML += `
      <div class="card">
        <h3>${c.titulo}</h3>
        <p>${c.valor}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${c.progresso}%;"></div>
        </div>
      </div>
    `;
  });

  gerarRanking();
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

// ==== CARD DE CONSULTOR ====
function criarCardConsultor(c, progresso, posicao, tipo, meta) {
  const emoji = posicao === 1 ? "🏆" : posicao === 2 ? "🥈" : posicao === 3 ? "🥉" : "🎖️";
  const valor = tipo === "contas" ? `${c.contas} contas` : `R$ ${c.receita.toFixed(2)}`;
  const falta = tipo === "contas"
    ? `${Math.max(0, meta - c.contas)} contas`
    : `R$ ${Math.max(0, meta - c.receita).toFixed(2)}`;

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
