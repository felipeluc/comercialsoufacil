const metas = {
  contas: 30,
  receita: 27500
};

const consultores = [
  { nome: "Leticia", contas: 7, receita: 5500, metaContas: 10, metaReceita: 7000 },
  { nome: "Gabriel", contas: 12, receita: 11000, metaContas: 12, metaReceita: 12000 },
  { nome: "Marcelo", contas: 8, receita: 6500, metaContas: 10, metaReceita: 8000 },
  { nome: "Glaucia", contas: 3, receita: 4000, metaContas: 8, metaReceita: 6000 }
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

  const faltamContas = Math.max(0, metas.contas - totalContas);
  const faltamReceita = Math.max(0, metas.receita - totalReceita);

  const progressoContas = Math.min(100, (totalContas / metas.contas) * 100);
  const progressoReceita = Math.min(100, (totalReceita / metas.receita) * 100);

  cardsContainer.innerHTML += `
    <div class="card">
      <h3>Contas Realizadas</h3>
      <p>${totalContas}</p>
      <div class="progress-bar"><div style="width:${progressoContas}%;"></div></div>
    </div>

    <div class="card">
      <h3>Meta de Contas</h3>
      <p>${metas.contas}</p>
    </div>

    <div class="card warning">
      <h3>Faltam para Meta (Contas)</h3>
      <p>${faltamContas}</p>
      <div class="progress-bar"><div style="width:${100 - progressoContas}%; background:#ff4d4d;"></div></div>
    </div>

    <div class="card">
      <h3>Receita Realizada</h3>
      <p>R$ ${totalReceita.toFixed(2)}</p>
      <div class="progress-bar"><div style="width:${progressoReceita}%;"></div></div>
    </div>

    <div class="card">
      <h3>Meta de Receita</h3>
      <p>R$ ${metas.receita.toFixed(2)}</p>
    </div>

    <div class="card warning">
      <h3>Faltam para Meta (Receita)</h3>
      <p>R$ ${faltamReceita.toFixed(2)}</p>
      <div class="progress-bar"><div style="width:${100 - progressoReceita}%; background:#ff4d4d;"></div></div>
    </div>
  `;

  gerarRankings();
}

// ==== RANKINGS ====
function gerarRankings() {
  const ulContas = document.getElementById("rankingContas");
  const ulReceita = document.getElementById("rankingReceita");

  const contasRank = [...consultores].sort((a, b) => b.contas - a.contas);
  const receitaRank = [...consultores].sort((a, b) => b.receita - a.receita);

  ulContas.innerHTML = "";
  ulReceita.innerHTML = "";

  contasRank.forEach((c, index) => {
    const porcentagemContas = Math.min(100, (c.contas / c.metaContas) * 100);
    const medalha = getEmoji(index);

    ulContas.innerHTML += `
      <li class="consultor-card">
        <h4>${medalha} ${c.nome} (${index + 1}º lugar)</h4>
        <p>Contas: ${c.contas}</p>
        <p>Meta: ${c.metaContas}</p>
        <p>Falta: ${Math.max(0, c.metaContas - c.contas)}</p>
        <div class="progress-bar"><div style="width:${porcentagemContas}%;"></div></div>
      </li>
    `;
  });

  receitaRank.forEach((c, index) => {
    const porcentagemReceita = Math.min(100, (c.receita / c.metaReceita) * 100);
    const medalha = getEmoji(index);

    ulReceita.innerHTML += `
      <li class="consultor-card">
        <h4>${medalha} ${c.nome} (${index + 1}º lugar)</h4>
        <p>Receita: R$ ${c.receita.toFixed(2)}</p>
        <p>Meta: R$ ${c.metaReceita.toFixed(2)}</p>
        <p>Falta: R$ ${Math.max(0, c.metaReceita - c.receita).toFixed(2)}</p>
        <div class="progress-bar"><div style="width:${porcentagemReceita}%;"></div></div>
      </li>
    `;
  });
}

function getEmoji(index) {
  return ["🏆", "🥇", "🥈", "🥉"][index] || "";
}
