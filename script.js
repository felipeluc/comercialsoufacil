const metas = {
  contas: 100,
  receita: 50000
};

const consultores = [
  { nome: "Felipe", contas: 20, receita: 12000 },
  { nome: "Carol", contas: 35, receita: 18000 },
  { nome: "Lucas", contas: 25, receita: 15000 }
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

  const cards = [
    { titulo: "Contas Realizadas", valor: totalContas },
    { titulo: "Meta de Contas", valor: metas.contas },
    { titulo: "Faltam para Meta (Contas)", valor: Math.max(0, metas.contas - totalContas) },
    { titulo: "Receita Realizada", valor: `R$ ${totalReceita.toFixed(2)}` },
    { titulo: "Meta de Receita", valor: `R$ ${metas.receita.toFixed(2)}` },
    { titulo: "Faltam para Meta (Receita)", valor: `R$ ${Math.max(0, metas.receita - totalReceita).toFixed(2)}` }
  ];

  cards.forEach(c => {
    cardsContainer.innerHTML += `
      <div class="card">
        <h3>${c.titulo}</h3>
        <p>${c.valor}</p>
      </div>
    `;
  });

  gerarRankings();
}

// ==== RANKINGS ====
function gerarRankings() {
  const contasList = [...consultores].sort((a, b) => b.contas - a.contas);
  const receitaList = [...consultores].sort((a, b) => b.receita - a.receita);

  const ulContas = document.getElementById("rankingContas");
  const ulReceita = document.getElementById("rankingReceita");

  ulContas.innerHTML = contasList.map(c => `<li>${c.nome}: ${c.contas} contas</li>`).join("");
  ulReceita.innerHTML = receitaList.map(c => `<li>${c.nome}: R$ ${c.receita.toFixed(2)}</li>`).join("");
}
