// ==== CONFIGURAÇÃO DE METAS GERAIS ====
const metasGerais = {
  contas: 30,
  receita: 27500
};

// ==== DADOS DOS CONSULTORES ====
const consultores = [
  { nome: "Marcelo", contas: 8, receita: 6800 },
  { nome: "Gabriel", contas: 6, receita: 5400 },
  { nome: "Leticia", contas: 7, receita: 5500 },
  { nome: "Glaucia", contas: 3, receita: 2700 }
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

// ==== DASHBOARD ====
function gerarDashboard() {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = "";

  const totalContas = consultores.reduce((sum, c) => sum + c.contas, 0);
  const totalReceita = consultores.reduce((sum, c) => sum + c.receita, 0);

  const progressoContas = Math.min(100, (totalContas / metasGerais.contas) * 100);
  const progressoReceita = Math.min(100, (totalReceita / metasGerais.receita) * 100);

  const cards = [
    {
      titulo: "Contas Realizadas",
      valor: totalContas,
      barra: progressoContas
    },
    {
      titulo: "Meta de Contas",
      valor: metasGerais.contas
    },
    {
      titulo: "Faltam para Meta (Contas)",
      valor: Math.max(0, metasGerais.contas - totalContas),
      alerta: true
    },
    {
      titulo: "Receita Realizada",
      valor: `R$ ${totalReceita.toFixed(2)}`,
      barra: progressoReceita
    },
    {
      titulo: "Meta de Receita",
      valor: `R$ ${metasGerais.receita.toFixed(2)}`
    },
    {
      titulo: "Faltam para Meta (Receita)",
      valor: `R$ ${Math.max(0, metasGerais.receita - totalReceita).toFixed(2)}`,
      alerta: true
    }
  ];

  cards.forEach(c => {
    cardsContainer.innerHTML += `
      <div class="card${c.alerta ? ' alerta' : ''}">
        <h3>${c.titulo}</h3>
        <p>${c.valor}</p>
        ${c.barra !== undefined ? `<div class='progress'><div class='progress-bar' style='width:${c.barra}%;'></div></div>` : ""}
      </div>
    `;
  });

  gerarRankings();
}

// ==== RANKINGS ====
function gerarRankings() {
  const rankingContas = [...consultores].sort((a, b) => b.contas - a.contas);
  const rankingReceita = [...consultores].sort((a, b) => b.receita - a.receita);

  const ulContas = document.getElementById("rankingContas");
  const ulReceita = document.getElementById("rankingReceita");
  ulContas.innerHTML = "";
  ulReceita.innerHTML = "";

  rankingContas.forEach((c, i) => {
    const porcentagemContas = Math.min(100, (c.contas / metasGerais.contas) * 100);
    ulContas.innerHTML += `
      <li class="ranking-card">
        <h4>${getEmoji(i)} ${c.nome} (${i + 1} Lugar)</h4>
        <p>${c.contas} contas</p>
        <p>Falta: ${Math.max(0, metasGerais.contas - c.contas)}</p>
        <div class='progress'><div class='progress-bar' style='width:${porcentagemContas}%;'></div></div>
      </li>
    `;
  });

  rankingReceita.forEach((c, i) => {
    const porcentagemReceita = Math.min(100, (c.receita / metasGerais.receita) * 100);
    ulReceita.innerHTML += `
      <li class="ranking-card">
        <h4>${getEmoji(i)} ${c.nome} (${i + 1} Lugar)</h4>
        <p>R$ ${c.receita.toFixed(2)}</p>
        <p>Falta: R$ ${Math.max(0, metasGerais.receita - c.receita).toFixed(2)}</p>
        <div class='progress'><div class='progress-bar' style='width:${porcentagemReceita}%;'></div></div>
      </li>
    `;
  });
}

function getEmoji(index) {
  return index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏆";
}
