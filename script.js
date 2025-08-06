// === Firebase Configuração ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs
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

// === Utilidades ===
const $ = (id) => document.getElementById(id);
const consultores = ["Leticia", "Glaucia", "Marcelo", "Gabriel"];
const cores = ["#007AFF", "#FF9500", "#34C759", "#AF52DE"];

// === Login ===
function login() {
  const usuario = $("usuario").value;
  const senha = $("senha").value;

  if (!usuario || !senha) {
    alert("Preencha usuário e senha.");
    return;
  }

  const senhaCorreta = usuario.toLowerCase() + "1234";

  if (senha !== senhaCorreta) {
    alert("Senha incorreta.");
    return;
  }

  $("login").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("userLogado").innerText = "👤 " + usuario;

  const adminItems = document.querySelectorAll(".admin-only");
  adminItems.forEach(item => {
    if (usuario === "Carol" || usuario === "Felipe") {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });

  mostrarSecao("analise");
}
window.login = login;

// === Mostrar Seção ===
function mostrarSecao(alvo) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  $(alvo).classList.remove("hidden");

  if (alvo === "analise") carregarDashboard();
  if (alvo === "implantadas") carregarImplantadas();
  if (alvo === "ranking") carregarRanking();
  if (alvo === "painelConsultores") carregarPainelConsultores();
}

// === Navegação ===
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const alvo = btn.getAttribute("data-target");
      mostrarSecao(alvo);
    });
  });
});

// === Dashboard Principal ===
async function carregarDashboard() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let totais = {};
  consultores.forEach(c => totais[c] = 0);
  dados.forEach(d => {
    if (totais[d.consultor]) totais[d.consultor] += d.valor;
  });

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

  const rankingDiv = $("rankingVendas");
  const ranking = Object.entries(totais).sort((a, b) => b[1] - a[1]);
  rankingDiv.innerHTML = "";
  ranking.forEach(([nome, valor], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    rankingDiv.innerHTML += `<div><strong>${emoji} ${nome}</strong>: R$ ${valor.toFixed(2)}</div>`;
  });
}

// === Empresas Implantadas ===
async function carregarImplantadas() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let total = 0;
  let contas = 0;
  let ranking = {};
  consultores.forEach(c => ranking[c] = 0);

  dados.forEach(d => {
    total += d.valor;
    contas++;
    ranking[d.consultor]++;
  });

  $("totalSemana").innerText = total.toFixed(2);
  $("contasImplantadas").innerText = contas;
  $("diferencaSemana").innerText = "+10%"; // fixo por enquanto

  const rankingDiv = $("rankingFechamentos");
  rankingDiv.innerHTML = "";
  Object.entries(ranking).sort((a, b) => b[1] - a[1]).forEach(([nome, qtde], i) => {
    const emoji = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
    rankingDiv.innerHTML += `<div>${emoji} ${nome}: ${qtde} contas</div>`;
  });
}

// === Painel por Consultor ===
async function carregarPainelConsultores() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  const container = document.querySelector(".consultor-cards");
  container.innerHTML = "";

  consultores.forEach(nome => {
    const vendas = dados.filter(d => d.consultor === nome);
    const total = vendas.reduce((acc, v) => acc + v.valor, 0);

    const card = document.createElement("div");
    card.className = "consultor-card";

    card.innerHTML = `
      <h3>${nome}</h3>
      <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
      <p><strong>Contas:</strong> ${vendas.length}</p>
      <p><strong>Meta:</strong> R$ 5000</p>
      <p><strong>Observações:</strong> 🔍</p>
    `;

    container.appendChild(card);
  });
}

// === Ranking (valores e quantidade) ===
async function carregarRanking() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let rankingQuantidade = {};
  let rankingValor = {};

  consultores.forEach(c => {
    rankingQuantidade[c] = 0;
    rankingValor[c] = 0;
  });

  dados.forEach(d => {
    rankingQuantidade[d.consultor]++;
    rankingValor[d.consultor] += d.valor;
  });

  const contagemDiv = $("rankingQuantidade");
  const valorDiv = $("rankingReceita");

  contagemDiv.innerHTML = "";
  valorDiv.innerHTML = "";

  Object.entries(rankingQuantidade).sort((a, b) => b[1] - a[1]).forEach(([nome, qnt], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    contagemDiv.innerHTML += `<div>${emoji} ${nome}: ${qnt} contas</div>`;
  });

  Object.entries(rankingValor).sort((a, b) => b[1] - a[1]).forEach(([nome, valor], i) => {
    const emoji = i === 0 ? "💰" : i === 1 ? "💵" : "💸";
    valorDiv.innerHTML += `<div>${emoji} ${nome}: R$ ${valor.toFixed(2)}</div>`;
  });
}

// === Admin - Salvar Venda ===
async function salvarVenda() {
  const consultor = $("inputConsultor").value;
  const valor = parseFloat($("inputValor").value);

  if (!consultor || isNaN(valor)) {
    alert("Preencha os dados corretamente.");
    return;
  }

  const novaVenda = {
    consultor,
    valor,
    data: new Date().toISOString()
  };

  const docId = Date.now().toString();
  await setDoc(doc(db, "vendasSemana", docId), novaVenda);

  alert("Venda salva!");
  carregarDashboard();
  carregarImplantadas();
  carregarPainelConsultores();
  carregarRanking();
}
window.salvarVenda = salvarVenda;
