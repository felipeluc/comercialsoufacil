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
const admins = ["Carol", "Felipe"];
const cores = ["#007AFF", "#FF9500", "#34C759", "#AF52DE"];
let usuarioLogado = "";

// === LOGIN ===
function login() {
  const usuario = $("usuarioSelect").value;
  const senha = $("senhaInput").value;

  if (senha !== `${usuario.toLowerCase()}1234`) {
    alert("Senha incorreta.");
    return;
  }

  usuarioLogado = usuario;

  $("loginSection").classList.add("hidden");
  $("mainApp").classList.remove("hidden");
  $("userNome").innerText = usuario;

  // Mostrar menus de admin
  if (admins.includes(usuario)) {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
  } else {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
  }

  mostrarSecao("analise");
}

// === Função: Mostrar seção ===
function mostrarSecao(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });

  const alvo = document.getElementById(id);
  if (alvo) alvo.classList.remove("hidden");

  // Carregamentos específicos
  if (id === "analise") carregarDashboard();
  if (id === "implantadas") carregarImplantadas();
  if (id === "ranking") carregarRanking();
  if (id === "painelConsultores") carregarPainelConsultores();
}

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

  const ranking = Object.entries(totais).sort((a, b) => b[1] - a[1]);

  const rankingDiv = $("ranking");
  rankingDiv.innerHTML = "";
  ranking.forEach(([nome, valor], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    rankingDiv.innerHTML += `<div><strong>${emoji} ${nome}</strong>: R$ ${valor.toFixed(2)}</div>`;
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
  $("diferencaSemana").innerText = "+10%"; // Exemplo

  const rankingDiv = $("rankingFechamentos");
  rankingDiv.innerHTML = "<h3>Ranking de Fechamentos</h3>";
  Object.entries(ranking)
    .sort((a, b) => b[1] - a[1])
    .forEach(([nome, qtde], i) => {
      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      rankingDiv.innerHTML += `<div>${medalha} ${nome}: ${qtde} contas</div>`;
    });
}

// === Função: Ranking Geral ===
function carregarRanking() {
  // Aqui você pode carregar metas e mostrar quanto falta para bater as metas
  // Exemplo fixo:
  $("metaVendas").innerText = "R$ 50.000,00";
  $("metaContas").innerText = "100 contas";
  $("metaReceita").innerText = "R$ 30.000,00";
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

// === Função: Salvar Venda (Admin) ===
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

// === Iniciar sistema ===
window.addEventListener("DOMContentLoaded", () => {
  // Ativa os botões do menu
  document.querySelectorAll(".menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const alvo = btn.getAttribute("data-target");
      mostrarSecao(alvo);
    });
  });
});

window.login = login;
window.salvarVenda = salvarVenda;
window.mostrarSecao = mostrarSecao;
