// === CONFIGURAÇÕES DE METAS ===
const metasGerais = {
  contas: 30,
  receita: 27500
};

const consultores = [
  { nome: "Leticia", contas: 7, receita: 5500 },
  { nome: "Glaucia", contas: 4, receita: 4200 },
  { nome: "Marcelo", contas: 10, receita: 12500 },
  { nome: "Gabriel", contas: 6, receita: 4800 }
];

// === LOGIN ===
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
  gerarRanking();
};

// === DASHBOARD COMERCIAL ===
function gerarDashboard() {
  const dashboardContainer = document.getElementById("dashboardCards");
  dashboardContainer.innerHTML = "";

  const totalContas = consultores.reduce((sum, c) => sum + c.contas, 0);
  const totalReceita = consultores.reduce((sum, c) => sum + c.receita, 0);

  const progressoContas = Math.min(100, (totalContas / metasGerais.contas) * 100);
  const progressoReceita = Math.min(100, (totalReceita / metasGerais.receita) * 100);

  const cards = [
    {
      titulo: "Contas Realizadas",
      valor: totalContas,
      progresso: progressoContas
    },
    {
      titulo: "Faltam para Meta (Contas)",
      valor: metasGerais.contas - totalContas,
      progresso: progressoContas
    },
    {
      titulo: "Receita Realizada",
      valor: `R$ ${totalReceita.toFixed(2)}`,
      progresso: progressoReceita
    },
    {
      titulo: "Faltam para Meta (Receita)",
      valor: `R$ ${(metasGerais.receita - totalReceita).toFixed(2)}`,
      progresso: progressoReceita
    }
  ];

  cards.forEach(card => {
    dashboardContainer.innerHTML += `
      <div class="card">
        <h3>${card.titulo}</h3>
        <p>${card.valor}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${card.progresso}%;"></div>
        </div>
      </div>
    `;
  });
}

// === RANKING DE CONSULTORES ===
function gerarRanking() {
  const rankingContainer = document.getElementById("rankingCards");
  rankingContainer.innerHTML = "";

  const ranking = [...consultores].sort((a, b) => b.receita - a.receita);

  ranking.forEach((c, index) => {
    const progressoContas = Math.min(100, (c.contas / metasGerais.contas) * 100);
    const progressoReceita = Math.min(100, (c.receita / metasGerais.receita) * 100);
    const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅";

    rankingContainer.innerHTML += `
      <div class="card consultor-card">
        <h3>${medalha} ${c.nome} (posição ${index + 1})</h3>
        <p><strong>Contas:</strong> ${c.contas}</p>
        <div class="progress-bar small">
          <div class="progress" style="width: ${progressoContas}%;"></div>
        </div>
        <p><strong>Receita:</strong> R$ ${c.receita.toFixed(2)}</p>
        <div class="progress-bar small">
          <div class="progress" style="width: ${progressoReceita}%;"></div>
        </div>
      </div>
    `;
  });
}
