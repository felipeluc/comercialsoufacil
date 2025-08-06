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
const consultores = ["Marcelo", "Angela", "Gabriel", "Leticia", "Glaucia", "Felipe", "Carol"];
const admins = ["Carol", "Felipe"];
let usuarioLogado = "";

// === LOGIN ===
window.onload = () => {
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = $("usuario").value;
    const senha = $("senha").value;

    if (senha === nome.toLowerCase() + "1234") {
      usuarioLogado = nome;
      $("loginScreen").style.display = "none";
      $("mainApp").style.display = "flex";
      if (admins.includes(nome)) $("adminMenu").style.display = "block";
      carregarTudo();
    } else {
      alert("Senha incorreta.");
    }
  });
};

// === NAVEGAÇÃO ENTRE MENUS ===
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    const alvo = btn.getAttribute("data-target");
    $(alvo).style.display = "block";

    if (alvo === "dashboard") carregarDashboard();
    if (alvo === "implantadas") carregarImplantadas();
    if (alvo === "ranking") carregarRanking();
    if (alvo === "adminPanel") carregarAdminPanel();
  });
});

// === CARREGAR TODAS AS SEÇÕES ===
function carregarTudo() {
  carregarDashboard();
  carregarImplantadas();
  carregarRanking();
}

// === DASHBOARD: Análise de Vendas ===
async function carregarDashboard() {
  const snap = await getDocs(collection(db, "vendas"));
  const dados = snap.docs.map(doc => doc.data());

  const container = $("dashboardCards");
  container.innerHTML = "";

  consultores.forEach(nome => {
    const vendas = dados.filter(v => v.consultor === nome);
    const total = vendas.reduce((sum, v) => sum + v.valor, 0);
    const card = `
      <div class="card">
        <h3>${nome}</h3>
        <p><strong>Receita:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Contas:</strong> ${vendas.length}</p>
      </div>`;
    container.innerHTML += card;
  });
}

// === EMPRESAS IMPLANTADAS ===
async function carregarImplantadas() {
  const snap = await getDocs(collection(db, "vendas"));
  const dados = snap.docs.map(doc => doc.data());

  const container = $("implantadasCards");
  container.innerHTML = "";

  consultores.forEach(nome => {
    const vendas = dados.filter(v => v.consultor === nome);
    const total = vendas.reduce((sum, v) => sum + v.valor, 0);
    const card = `
      <div class="card">
        <h3>${nome}</h3>
        <p><strong>Empresas:</strong> ${vendas.length}</p>
        <p><strong>Receita:</strong> R$ ${total.toFixed(2)}</p>
      </div>`;
    container.innerHTML += card;
  });
}

// === RANKING ===
async function carregarRanking() {
  const snap = await getDocs(collection(db, "vendas"));
  const dados = snap.docs.map(doc => doc.data());

  let rankingQtde = {};
  let rankingValor = {};
  consultores.forEach(c => {
    rankingQtde[c] = 0;
    rankingValor[c] = 0;
  });

  dados.forEach(d => {
    rankingQtde[d.consultor]++;
    rankingValor[d.consultor] += d.valor;
  });

  // Ranking de quantidade
  const containerQ = $("rankingQtde");
  containerQ.innerHTML = "<h3>Fechamentos por Quantidade</h3>";
  Object.entries(rankingQtde).sort((a, b) => b[1] - a[1]).forEach(([nome, qtde], i) => {
    const medalha = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    containerQ.innerHTML += `<div>${medalha} <strong>${nome}</strong>: ${qtde} contas</div>`;
  });

  // Ranking de valor
  const containerV = $("rankingValor");
  containerV.innerHTML = "<h3>Fechamentos por Receita</h3>";
  Object.entries(rankingValor).sort((a, b) => b[1] - a[1]).forEach(([nome, valor], i) => {
    const medalha = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    containerV.innerHTML += `<div>${medalha} <strong>${nome}</strong>: R$ ${valor.toFixed(2)}</div>`;
  });
}

// === ADMIN: Painel para Cadastro de Vendas ===
async function carregarAdminPanel() {
  $("adminForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const consultor = $("adminConsultor").value;
    const valor = parseFloat($("adminValor").value);

    if (!consultor || isNaN(valor)) {
      alert("Preencha corretamente.");
      return;
    }

    const novaVenda = {
      consultor,
      valor,
      data: new Date().toISOString()
    };

    const id = Date.now().toString();
    await setDoc(doc(db, "vendas", id), novaVenda);

    alert("Venda salva!");
    $("adminValor").value = "";
    carregarTudo();
  });
}
