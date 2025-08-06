// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, setDoc, getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAns0NBLW8JTmLFRuOSLz16tAXrKuox9rU",
  authDomain: "comercial-92085.firebaseapp.com",
  projectId: "comercial-92085",
  storageBucket: "comercial-92085.appspot.com",
  messagingSenderId: "1086266528954",
  appId: "1:1086266528954:web:91dfc7975e79c5cc141e83"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utilitários
const $ = (id) => document.getElementById(id);
const consultores = ["Marcelo", "Angela", "Gabriel", "Leticia", "Glaucia"];
const admins = ["Carol", "Felipe"];
const allUsers = [...consultores, ...admins];
const cores = ["#007AFF", "#FF9500", "#34C759", "#AF52DE", "#5856D6", "#5AC8FA"];

// Login
window.addEventListener("load", () => {
  const loginBtn = $("btnLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const user = $("selectUser").value;
      const senha = $("inputSenha").value;

      if (senha !== user + "1234") return alert("Senha incorreta.");

      $("loginBox").style.display = "none";
      $("dashboard").style.display = "flex";

      if (admins.includes(user)) {
        $("menuAdmin").style.display = "block";
        $("adminSection").style.display = "none";
      }

      carregarDashboard();
    });
  }
});

// Navegação
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const alvo = btn.getAttribute("data-target");

    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    $(alvo).style.display = "block";

    switch (alvo) {
      case "vendasSection": carregarDashboard(); break;
      case "implantadasSection": carregarImplantadas(); break;
      case "rankingSection": carregarRanking(); break;
      case "painelSection": carregarPainelConsultores(); break;
      case "adminSection": carregarAdmin(); break;
    }
  });
});

// Dashboard
async function carregarDashboard() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let totais = {};
  consultores.forEach(c => totais[c] = 0);
  dados.forEach(d => {
    if (totais[d.consultor]) {
      totais[d.consultor] += d.valor;
    }
  });

  // Gráfico
  const ctx = $("graficoConsultores").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: consultores,
      datasets: [{
        label: "Vendas",
        data: consultores.map(c => totais[c]),
        backgroundColor: cores
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => `R$ ${v}` }
        }
      }
    }
  });

  // Ranking
  const ranking = Object.entries(totais).sort((a, b) => b[1] - a[1]);
  const rankingDiv = $("rankingVendas");
  rankingDiv.innerHTML = "";

  ranking.forEach(([nome, valor], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    rankingDiv.innerHTML += `
      <div class="card">
        <h3>${emoji} ${nome}</h3>
        <p>R$ ${valor.toFixed(2)}</p>
      </div>
    `;
  });
}

// Implantadas
async function carregarImplantadas() {
  const snap = await getDocs(collection(db, "implantadas"));
  const dados = snap.docs.map(doc => doc.data());

  let total = 0;
  let receita = 0;
  let porConsultor = {};
  let porEstado = {};
  let porSegmento = {};

  dados.forEach(d => {
    total++;
    receita += d.valor;

    porConsultor[d.consultor] = (porConsultor[d.consultor] || 0) + d.valor;
    porEstado[d.estado] = (porEstado[d.estado] || 0) + 1;
    porSegmento[d.segmento] = (porSegmento[d.segmento] || 0) + 1;
  });

  $("totalEmpresas").innerText = total;
  $("receitaTotal").innerText = `R$ ${receita.toFixed(2)}`;

  const consultorDiv = $("receitaConsultores");
  consultorDiv.innerHTML = "";
  Object.entries(porConsultor).forEach(([nome, valor]) => {
    consultorDiv.innerHTML += `<div class="card"><h3>${nome}</h3><p>R$ ${valor.toFixed(2)}</p></div>`;
  });

  const estadoDiv = $("maisEstados");
  estadoDiv.innerHTML = "";
  Object.entries(porEstado).sort((a, b) => b[1] - a[1]).forEach(([estado, qtd]) => {
    estadoDiv.innerHTML += `<div class="card"><h3>${estado}</h3><p>${qtd} lojas</p></div>`;
  });

  const segmentoDiv = $("rankingSegmentos");
  segmentoDiv.innerHTML = "";
  Object.entries(porSegmento).sort((a, b) => b[1] - a[1]).forEach(([seg, qtd]) => {
    segmentoDiv.innerHTML += `<div class="card"><h3>${seg}</h3><p>${qtd}</p></div>`;
  });
}

// Ranking
async function carregarRanking() {
  const metasSnap = await getDoc(doc(db, "metas", "geral"));
  const metas = metasSnap.exists() ? metasSnap.data() : { contas: 0, receita: 0, vendas: 0 };

  const vendasSnap = await getDocs(collection(db, "vendasSemana"));
  const vendas = vendasSnap.docs.map(doc => doc.data());

  let totalVendas = vendas.length;
  let totalReceita = vendas.reduce((acc, cur) => acc + cur.valor, 0);

  $("metaContas").innerText = `${totalVendas} / ${metas.contas}`;
  $("metaReceita").innerText = `R$ ${totalReceita.toFixed(2)} / R$ ${metas.receita}`;
  $("metaVendas").innerText = `R$ ${totalReceita.toFixed(2)} / R$ ${metas.vendas}`;

  // Ranking contas
  let rankingContas = {};
  vendas.forEach(v => rankingContas[v.consultor] = (rankingContas[v.consultor] || 0) + 1);
  const rankingQtdDiv = $("rankingQtd");
  rankingQtdDiv.innerHTML = "";
  Object.entries(rankingContas).sort((a, b) => b[1] - a[1]).forEach(([nome, qtd], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    rankingQtdDiv.innerHTML += `<div class="card"><h3>${emoji} ${nome}</h3><p>${qtd} contas</p></div>`;
  });

  // Ranking receita
  let rankingReceita = {};
  vendas.forEach(v => rankingReceita[v.consultor] = (rankingReceita[v.consultor] || 0) + v.valor);
  const rankingValorDiv = $("rankingReceita");
  rankingValorDiv.innerHTML = "";
  Object.entries(rankingReceita).sort((a, b) => b[1] - a[1]).forEach(([nome, val], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    rankingValorDiv.innerHTML += `<div class="card"><h3>${emoji} ${nome}</h3><p>R$ ${val.toFixed(2)}</p></div>`;
  });
}

// Painel dos Consultores
async function carregarPainelConsultores() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  const container = $("painelCards");
  container.innerHTML = "";

  consultores.forEach(nome => {
    const vendas = dados.filter(d => d.consultor === nome);
    const total = vendas.reduce((acc, cur) => acc + cur.valor, 0);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${nome}</h3>
      <p>Total: R$ ${total.toFixed(2)}</p>
      <p>Contas: ${vendas.length}</p>
    `;
    container.appendChild(card);
  });
}

// Admin
async function carregarAdmin() {
  $("btnSalvarMetas").addEventListener("click", async () => {
    const contas = parseInt($("metaContasInput").value);
    const receita = parseFloat($("metaReceitaInput").value);
    const vendas = parseFloat($("metaVendasInput").value);

    await setDoc(doc(db, "metas", "geral"), { contas, receita, vendas });
    alert("Metas salvas.");
  });

  $("btnSalvarEstado").addEventListener("click", async () => {
    const estado = $("inputEstado").value;
    const total = parseInt($("inputTotalEstado").value);
    const id = `${estado}_${Date.now()}`;
    await setDoc(doc(db, "estadosComMaisLojas", id), { estado, total });
    alert("Estado salvo.");
  });

  $("btnSalvarSegmento").addEventListener("click", async () => {
    const segmento = $("inputSegmento").value;
    const qtd = parseInt($("inputQtdSegmento").value);
    const id = `${segmento}_${Date.now()}`;
    await setDoc(doc(db, "rankingSegmentos", id), { segmento, qtd });
    alert("Segmento salvo.");
  });
}
