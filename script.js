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

// === Variáveis ===
const consultores = ["Leticia", "Glaucia", "Marcelo", "Gabriel"];
const admins = ["Carol", "Felipe"];

// === Utilidade ===
const $ = (id) => document.getElementById(id);

// === Login ===
window.addEventListener("load", () => {
  $("loginBtn").addEventListener("click", () => {
    const user = $("userSelect").value;
    const password = $("passwordInput").value;

    if (password === user + "1234") {
      $("loginSection").classList.add("hidden");
      $("mainSection").classList.remove("hidden");

      if (admins.includes(user)) {
        document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
      }

      carregarDashboard();
    } else {
      alert("Senha incorreta!");
    }
  });
});

// === Navegação ===
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    const alvo = btn.getAttribute("data-target");
    $(alvo).classList.add("active");

    if (alvo === "vendas") carregarDashboard();
    if (alvo === "implantadas") carregarImplantadas();
    if (alvo === "ranking") carregarRanking();
    if (alvo === "admin") carregarAdmin();
  });
});

// === Dashboard: Análise de Vendas ===
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

  const ctx = $("graficoConsultores").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: consultores,
      datasets: [{
        label: "Vendas da Semana",
        data: consultores.map(c => totais[c]),
        backgroundColor: ["#007AFF", "#FF9500", "#34C759", "#AF52DE"]
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => `R$ ${v}`
          }
        }
      }
    }
  });
}

// === Implantadas ===
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

  $("totalSemana").innerText = `R$ ${total.toFixed(2)}`;
  $("contasImplantadas").innerText = contas;
  $("diferencaSemana").innerText = "+10%"; // Exemplo fixo

  const rankingDiv = $("rankingFechamentos");
  rankingDiv.innerHTML = "";
  Object.entries(ranking)
    .sort((a, b) => b[1] - a[1])
    .forEach(([nome, qtde], i) => {
      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      rankingDiv.innerHTML += `<div>${medalha} ${nome}: ${qtde} contas</div>`;
    });
}

// === Ranking ===
async function carregarRanking() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  const rankingQtd = {};
  const rankingValor = {};

  consultores.forEach(c => {
    rankingQtd[c] = 0;
    rankingValor[c] = 0;
  });

  dados.forEach(d => {
    rankingQtd[d.consultor]++;
    rankingValor[d.consultor] += d.valor;
  });

  const qtdDiv = $("rankingContas");
  const valorDiv = $("rankingReceita");
  qtdDiv.innerHTML = "";
  valorDiv.innerHTML = "";

  Object.entries(rankingQtd).sort((a, b) => b[1] - a[1]).forEach(([nome, qtde], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    qtdDiv.innerHTML += `<div>${emoji} ${nome}: ${qtde} contas</div>`;
  });

  Object.entries(rankingValor).sort((a, b) => b[1] - a[1]).forEach(([nome, val], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    valorDiv.innerHTML += `<div>${emoji} ${nome}: R$ ${val.toFixed(2)}</div>`;
  });

  const metaVendas = 100;
  const metaReceita = 50000;
  const totalContas = dados.length;
  const totalReceita = dados.reduce((acc, d) => acc + d.valor, 0);

  $("metaContas").innerText = `${metaVendas - totalContas} contas para meta`;
  $("metaReceita").innerText = `Faltam R$ ${(metaReceita - totalReceita).toFixed(2)}`;
}

// === Admin: Salvar Vendas ===
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
  carregarRanking();
}

window.salvarVenda = salvarVenda;
// === Login ===
function login() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Preencha usuário e senha.");
    return;
  }

  const senhaCorreta = usuario.toLowerCase() + "1234";

  if (senha !== senhaCorreta) {
    alert("Senha incorreta.");
    return;
  }

  // Ocultar login, mostrar app
  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("userLogado").innerText = "👤 " + usuario;

  // Exibir Admin se for Carol ou Felipe
  const adminSection = document.querySelector(".admin-only");
  if (usuario === "Carol" || usuario === "Felipe") {
    adminSection.classList.remove("hidden");
  } else {
    adminSection.classList.add("hidden");
  }

  // Ativar primeira seção por padrão
  mostrarSecao("analise");
}

// === Navegação entre menus ===
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const alvo = btn.getAttribute("data-target");
    mostrarSecao(alvo);
  });
});

// === Função para alternar seções ===
function mostrarSecao(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
