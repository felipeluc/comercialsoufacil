// === Firebase Configuração ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc
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

// === Usuários e Cores ===
const usuarios = ["Marcelo", "Angela", "Gabriel", "Leticia", "Glaucia", "Felipe", "Carol"];
const consultores = ["Leticia", "Glaucia", "Marcelo", "Gabriel"];
const cores = ["#007AFF", "#FF9500", "#34C759", "#AF52DE"];

// === Utilidades ===
const $ = (id) => document.getElementById(id);
let usuarioLogado = "";

// === Login ===
window.onload = () => {
  const loginForm = $("loginForm");
  const userSelect = $("usuarioSelect");
  usuarios.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    userSelect.appendChild(opt);
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = userSelect.value;
    const senha = $("senhaInput").value;
    if (senha === nome.toLowerCase() + "1234") {
      usuarioLogado = nome;
      $("loginScreen").style.display = "none";
      $("mainApp").style.display = "flex";
      if (nome === "Felipe" || nome === "Carol") {
        $("menuAdmin").style.display = "block";
      }
      carregarDashboard();
      carregarImplantadas();
      carregarRanking();
      carregarPainelConsultores();
    } else {
      alert("Senha incorreta");
    }
  });
};

// === Navegação do Menu ===
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    $(target).style.display = "block";
  });
});

// === Dashboard - Análise de Vendas ===
async function carregarDashboard() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let totais = {};
  consultores.forEach(c => totais[c] = 0);
  dados.forEach(d => {
    if (totais[d.consultor]) totais[d.consultor] += d.valor;
  });

  // Ranking
  const ranking = Object.entries(totais).sort((a, b) => b[1] - a[1]);
  const divRanking = $("rankingAnalise");
  divRanking.innerHTML = "";
  ranking.forEach(([nome, valor], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    divRanking.innerHTML += `<div class="card"><strong>${emoji} ${nome}</strong><br>R$ ${valor.toFixed(2)}</div>`;
  });

  // Gráfico
  const ctx = $("graficoConsultores").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: consultores,
      datasets: [{
        label: "Vendas da Semana",
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
}

// === Empresas Implantadas ===
async function carregarImplantadas() {
  const snap = await getDocs(collection(db, "implantadas"));
  const dados = snap.docs.map(doc => doc.data());

  let total = 0;
  let receita = 0;
  let porConsultor = {};
  let estados = {};
  let segmentos = {};

  consultores.forEach(c => porConsultor[c] = 0);

  dados.forEach(d => {
    total++;
    receita += d.receita;
    if (porConsultor[d.consultor]) porConsultor[d.consultor] += d.receita;
    estados[d.estado] = (estados[d.estado] || 0) + 1;
    segmentos[d.segmento] = (segmentos[d.segmento] || 0) + 1;
  });

  $("totalEmpresas").innerText = total;
  $("receitaTotal").innerText = `R$ ${receita.toFixed(2)}`;

  // Receita por consultor
  const divReceita = $("receitaConsultor");
  divReceita.innerHTML = "";
  Object.entries(porConsultor).forEach(([nome, valor]) => {
    divReceita.innerHTML += `<div class="card">${nome}: R$ ${valor.toFixed(2)}</div>`;
  });

  // Estados com mais lojas
  const topEstados = Object.entries(estados).sort((a, b) => b[1] - a[1]);
  const divEstados = $("rankingEstados");
  divEstados.innerHTML = topEstados.map(([uf, qtd]) => `<div class="card">${uf}: ${qtd} lojas</div>`).join("");

  // Segmentos
  const topSegmentos = Object.entries(segmentos).sort((a, b) => b[1] - a[1]);
  const divSeg = $("rankingSegmentos");
  divSeg.innerHTML = topSegmentos.map(([seg, qtd]) => `<div class="card">${seg}: ${qtd}</div>`).join("");
}

// === Ranking ===
async function carregarRanking() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let contasPorConsultor = {};
  let receitaPorConsultor = {};
  consultores.forEach(c => {
    contasPorConsultor[c] = 0;
    receitaPorConsultor[c] = 0;
  });

  dados.forEach(d => {
    contasPorConsultor[d.consultor]++;
    receitaPorConsultor[d.consultor] += d.valor;
  });

  const rankingContas = Object.entries(contasPorConsultor).sort((a, b) => b[1] - a[1]);
  const rankingReceita = Object.entries(receitaPorConsultor).sort((a, b) => b[1] - a[1]);

  $("rankingContas").innerHTML = rankingContas.map(([nome, qtd], i) =>
    `<div class="card">${i === 0 ? "🏆" : "🎖️"} ${nome}: ${qtd} contas</div>`).join("");

  $("rankingReceita").innerHTML = rankingReceita.map(([nome, val], i) =>
    `<div class="card">${i === 0 ? "🏆" : "🎖️"} ${nome}: R$ ${val.toFixed(2)}</div>`).join("");

  // Metas
  const metaSnap = await getDoc(doc(db, "metas", "geral"));
  if (metaSnap.exists()) {
    const meta = metaSnap.data();
    const totalContas = dados.length;
    const totalReceita = dados.reduce((acc, d) => acc + d.valor, 0);

    $("metaContas").innerText = `${totalContas} / ${meta.contas}`;
    $("metaReceita").innerText = `R$ ${totalReceita.toFixed(2)} / R$ ${meta.receita}`;
    $("metaVendas").innerText = `${totalContas} / ${meta.vendas}`;
  }
}

// === Painel dos Consultores ===
async function carregarPainelConsultores() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());
  const container = $("consultorCards");
  container.innerHTML = "";

  consultores.forEach(nome => {
    const vendas = dados.filter(d => d.consultor === nome);
    const total = vendas.reduce((acc, v) => acc + v.valor, 0);

    container.innerHTML += `
      <div class="card">
        <h3>${nome}</h3>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Contas:</strong> ${vendas.length}</p>
        <p><strong>Meta:</strong> R$ 5000</p>
      </div>
    `;
  });
}

// === Admin - Apenas Carol e Felipe ===
$("formAdmin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const metas = {
    contas: parseInt($("metaInputContas").value),
    receita: parseFloat($("metaInputReceita").value),
    vendas: parseInt($("metaInputVendas").value)
  };
  await setDoc(doc(db, "metas", "geral"), metas);
  alert("Metas salvas com sucesso!");
});
