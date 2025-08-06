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

// === Utilidades Gerais ===
const $ = (id) => document.getElementById(id);

// === Configurações ===
const consultores = ["Leticia", "Glaucia", "Marcelo", "Gabriel"];
const cores = ["#007AFF", "#FF9500", "#34C759", "#AF52DE"];

// === Função: Carregar Dashboard ===
async function carregarDashboard() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let totais = {};
  consultores.forEach(c => totais[c] = 0);
  dados.forEach(d => {
    if (totais[d.consultor] !== undefined) {
      totais[d.consultor] += d.valor;
    }
  });

  // Ordenar para ranking
  const ranking = Object.entries(totais).sort((a, b) => b[1] - a[1]);

  // Ranking HTML
  const rankingDiv = $("ranking");
  rankingDiv.innerHTML = "";
  ranking.forEach(([nome, valor], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    rankingDiv.innerHTML += `<div><strong>${emoji} ${nome}</strong>: R$ ${valor.toFixed(2)}</div>`;
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
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => `R$ ${v}` }
        }
      }
    }
  });
}

// === Função: Carregar Implantadas ===
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
    if (ranking[d.consultor]) ranking[d.consultor]++;
    else ranking[d.consultor] = 1;
  });

  $("totalSemana").innerText = total.toFixed(2);
  $("contasImplantadas").innerText = contas;
  $("diferencaSemana").innerText = "+10%"; // Exemplo fixo

  const rankingDiv = $("rankingFechamentos");
  rankingDiv.innerHTML = "<h3>Ranking de Fechamentos</h3>";
  Object.entries(ranking)
    .sort((a, b) => b[1] - a[1])
    .forEach(([nome, qtde], i) => {
      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      rankingDiv.innerHTML += `<div>${medalha} ${nome}: ${qtde} contas</div>`;
    });
}

// === Função: Painéis dos Consultores ===
async function carregarPainelConsultores() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  const container = document.querySelector(".consultor-cards");
  container.innerHTML = "";

  consultores.forEach((nome, idx) => {
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

// === Função: Salvar Venda ===
async function salvarVenda() {
  const consultor = $("inputConsultor").value;
  const valor = parseFloat($("inputValor").value);

  if (!consultor || isNaN(valor)) return alert("Preencha todos os campos corretamente.");

  const novaVenda = {
    consultor,
    valor,
    data: new Date().toISOString()
  };

  const docId = Date.now().toString();
  await setDoc(doc(db, "vendasSemana", docId), novaVenda);

  alert("Venda salva com sucesso!");
  carregarDashboard();
  carregarImplantadas();
  carregarPainelConsultores();
}

// === Navegação entre seções ===
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    const alvo = btn.getAttribute("data-target");
    $(alvo).style.display = "block";

    if (alvo === "implantadas") carregarImplantadas();
    if (alvo === "painelConsultores") carregarPainelConsultores();
  });
});

// === Inicialização ===
window.addEventListener("load", () => {
  carregarDashboard();
});

window.salvarVenda = salvarVenda;
