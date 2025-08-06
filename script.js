// === Firebase Config ===
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

// === Helpers ===
const $ = (id) => document.getElementById(id);
function showPopup(msg) {
  const el = $("popupMsg");
  el.innerText = msg;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 3000);
}

// === Login ===
window.addEventListener("load", () => {
  const loginBtn = $("btnEntrar");
  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }
});

function login() {
  const user = $("userSelect").value;
  const pass = $("password").value;

  if (!user || pass !== user + "1234") {
    alert("Login inválido");
    return;
  }

  $("loginScreen").style.display = "none";
  $("mainApp").style.display = "flex";

  if (user === "Felipe" || user === "Carol") {
    $("adminMenu").style.display = "block";
  }

  carregarDashboard(user);
}

// === Navegação entre menus ===
document.querySelectorAll(".menu-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".menu-item").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach((sec) => (sec.style.display = "none"));
    const alvo = btn.getAttribute("data-target");
    $(alvo).style.display = "block";
  });
});

// === Dashboard ===
async function carregarDashboard(usuario) {
  const metasSnap = await getDoc(doc(db, "metas", "geral"));
  const metas = metasSnap.exists() ? metasSnap.data() : { contas: 0, receita: 0, vendas: 0 };

  const snap = await getDoc(doc(db, "vendasSemana", usuario));
  const dados = snap.exists() ? snap.data() : { contas: 0, receita: 0, vendas: 0 };

  const cards = [
    { titulo: "Contas Realizadas", valor: dados.contas },
    { titulo: "Receita Gerada", valor: `R$ ${dados.receita.toFixed(2)}` },
    { titulo: "Vendas", valor: `R$ ${dados.vendas.toFixed(2)}` },
    { titulo: "Meta de Contas", valor: metas.contas },
    { titulo: "Meta de Receita", valor: `R$ ${metas.receita.toFixed(2)}` },
    { titulo: "Meta de Vendas", valor: `R$ ${metas.vendas.toFixed(2)}` },
    { titulo: "Contas Restantes", valor: Math.max(0, metas.contas - dados.contas) },
    { titulo: "Receita Restante", valor: `R$ ${Math.max(0, metas.receita - dados.receita).toFixed(2)}` },
    { titulo: "Vendas Restantes", valor: `R$ ${Math.max(0, metas.vendas - dados.vendas).toFixed(2)}` }
  ];

  const container = $("cardsMetas");
  container.innerHTML = "";
  cards.forEach((c) => {
    container.innerHTML += `
      <div class="card">
        <h3>${c.titulo}</h3>
        <p>${c.valor}</p>
      </div>
    `;
  });
}

// === Admin - Salvar metas ===
window.salvarMetas = async function () {
  const contas = parseInt($("metaContas").value);
  const receita = parseFloat($("metaReceita").value);
  const vendas = parseFloat($("metaVendas").value);

  if (isNaN(contas) || isNaN(receita) || isNaN(vendas)) {
    alert("Preencha todos os campos com valores válidos.");
    return;
  }

  await setDoc(doc(db, "metas", "geral"), { contas, receita, vendas });

  showPopup("Metas salvas com sucesso.");
  carregarDashboard($("userSelect").value);
};
