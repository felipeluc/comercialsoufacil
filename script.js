// ==== METAS GERAIS ====
const metasGerais = {
  contas: 30,
  receita: 20000
};

// ==== DADOS DOS CONSULTORES ====
const consultores = [
  { nome: "Leticia", contas: 7, receita: 5500 },
  { nome: "Marcelo", contas: 10, receita: 8000 },
  { nome: "Gabriel", contas: 5, receita: 4000 },
  { nome: "Glaucia", contas: 8, receita: 6000 }
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
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const totalContas = consultores.reduce((sum, c) => sum + c.contas, 0);
  const totalReceita = consultores.reduce((sum, c) => sum + c.receita, 0);

  const progressoContas = Math.min((totalContas / metasGerais.contas) * 100, 100);
  const progressoReceita = Math.min((totalReceita / metasGerais.receita) * 100, 100);

  const cards = [
    {
      titulo: "Contas Realizadas",
      valor: `${totalContas} / ${metasGerais.contas}`,
      progresso: progressoContas
    },
    {
      titulo: "Receita Realizada",
      valor: `R$ ${totalReceita.toFixed(2)} / R$ ${metasGerais.receita}`,
      progresso: progressoReceita
    }
  ];

  cards.forEach(c => {
    container.innerHTML += `
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
    const progresso = Math.min((c.contas / metasGerais.contas) * 100, 100);
    containerContas.innerHTML += criarCardConsultor(c, progresso, i + 1, "contas");
  });

  rankingReceita.forEach((c, i) => {
    const progresso = Math.min((c.receita / metasGerais.receita) * 100, 100);
    containerReceita.innerHTML += criarCardConsultor(c, progresso, i + 1, "receita");
  });
}

// ==== CARD DE CONSULTOR ====
function criarCardConsultor(c, progresso, posicao, tipo) {
  const emoji = posicao === 1 ? "🏆" : posicao === 2 ? "🥈" : posicao === 3 ? "🥉" : "🎖️";
  const meta = tipo === "contas" ? metasGerais.contas : metasGerais.receita;
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
