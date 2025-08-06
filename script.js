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

// === Utilidades Gerais ===
const $ = (id) => document.getElementById(id);
const consultores = ["Marcelo", "Angela", "Gabriel", "Leticia", "Glaucia", "Felipe", "Carol"];
let usuarioAtual = "";

// === Login ===
window.login = () => {
  const user = $("userSelect").value;
  const senha = $("senhaInput").value;

  if (senha === user.toLowerCase() + "1234") {
    usuarioAtual = user;
    $("loginSection").style.display = "none";
    $("mainApp").style.display = "flex";

    if (user === "Carol" || user === "Felipe") {
      $("adminMenu").style.display = "block";
      $("adminSection").style.display = "block";
    }

    carregarDashboard();
    carregarImplantadas();
    carregarRanking();
    carregarPainelConsultores();
    carregarAdminDados();
  } else {
    alert("Senha incorreta.");
  }
};

// === Navegação entre menus ===
document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    const destino = item.getAttribute("data-target");
    $(destino).style.display = "block";
  });
});

// === Dashboard - Análise de Vendas ===
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

  $("rankingContainer").innerHTML = ranking.map(([nome, valor], i) => {
    const emoji = i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️";
    return `<div class="card"><h3>${emoji} ${nome}</h3><p>R$ ${valor.toFixed(2)}</p></div>`;
  }).join("");

  const ctx = $("graficoVendas").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: consultores,
      datasets: [{
        label: "Vendas da Semana",
        data: consultores.map(c => totais[c]),
        backgroundColor: "#007AFF"
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => `R$ ${v}` }
        }
      }
    }
  });
}

// === Empresas Implantadas ===
async function carregarImplantadas() {
  const snap = await getDocs(collection(db, "implantadas"));
  const dados = snap.docs.map(doc => doc.data());

  let total = dados.length;
  let receita = dados.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  let porConsultor = {};
  consultores.forEach(c => porConsultor[c] = 0);
  dados.forEach(d => {
    if (porConsultor[d.consultor] !== undefined) {
      porConsultor[d.consultor] += d.valor || 0;
    }
  });

  $("totalEmpresas").innerText = total;
  $("receitaTotal").innerText = `R$ ${receita.toFixed(2)}`;

  $("receitaPorConsultor").innerHTML = Object.entries(porConsultor).map(([nome, valor]) => {
    return `<div class="card"><h4>${nome}</h4><p>R$ ${valor.toFixed(2)}</p></div>`;
  }).join("");

  const estadosSnap = await getDocs(collection(db, "estadosComMaisLojas"));
  const segmentosSnap = await getDocs(collection(db, "rankingSegmentos"));

  $("estadosMaisLojas").innerHTML = estadosSnap.docs.map(doc =>
    `<div class="card">${doc.data().estado}: ${doc.data().quantidade}</div>`).join("");

  $("segmentosRanking").innerHTML = segmentosSnap.docs.map(doc =>
    `<div class="card">${doc.data().segmento}: ${doc.data().quantidade}</div>`).join("");
}

// === Ranking ===
async function carregarRanking() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  let porContas = {}, porValor = {};
  consultores.forEach(c => {
    porContas[c] = 0;
    porValor[c] = 0;
  });

  dados.forEach(d => {
    if (porContas[d.consultor] !== undefined) {
      porContas[d.consultor]++;
      porValor[d.consultor] += d.valor;
    }
  });

  $("rankingContas").innerHTML = Object.entries(porContas)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, qtd], i) => {
      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      return `<div class="card">${medalha} ${nome}: ${qtd} contas</div>`;
    }).join("");

  $("rankingReceita").innerHTML = Object.entries(porValor)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, valor], i) => {
      const medalha = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
      return `<div class="card">${medalha} ${nome}: R$ ${valor.toFixed(2)}</div>`;
    }).join("");

  const metasSnap = await getDoc(doc(db, "metas", "geral"));
  const metas = metasSnap.exists() ? metasSnap.data() : { contas: 50, receita: 50000, vendas: 30000 };

  const totalContas = Object.values(porContas).reduce((a, b) => a + b, 0);
  const totalReceita = Object.values(porValor).reduce((a, b) => a + b, 0);

  $("metaContas").innerText = metas.contas - totalContas;
  $("metaReceita").innerText = `R$ ${(metas.receita - totalReceita).toFixed(2)}`;
  $("metaVendas").innerText = `R$ ${(metas.vendas - totalReceita).toFixed(2)}`;
}

// === Painel dos Consultores ===
async function carregarPainelConsultores() {
  const snap = await getDocs(collection(db, "vendasSemana"));
  const dados = snap.docs.map(doc => doc.data());

  $("painelConsultores").innerHTML = consultores.map(nome => {
    const vendas = dados.filter(d => d.consultor === nome);
    const total = vendas.reduce((acc, d) => acc + d.valor, 0);
    return `
      <div class="card">
        <h3>${nome}</h3>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Contas:</strong> ${vendas.length}</p>
        <p><strong>Meta:</strong> R$ 5000</p>
      </div>`;
  }).join("");
}

// === Admin - Salvar dados ===
async function salvarAdminDados() {
  const metas = {
    contas: parseInt($("metaInputContas").value),
    receita: parseFloat($("metaInputReceita").value),
    vendas: parseFloat($("metaInputVendas").value)
  };
  await setDoc(doc(db, "metas", "geral"), metas);

  const estado = $("inputEstado").value;
  const estadoQtd = parseInt($("inputEstadoQtd").value);
  await addDoc(collection(db, "estadosComMaisLojas"), { estado, quantidade: estadoQtd });

  const segmento = $("inputSegmento").value;
  const segmentoQtd = parseInt($("inputSegmentoQtd").value);
  await addDoc(collection(db, "rankingSegmentos"), { segmento, quantidade: segmentoQtd });

  alert("Dados salvos com sucesso!");
  carregarImplantadas();
  carregarRanking();
}

async function carregarAdminDados() {
  const metasSnap = await getDoc(doc(db, "metas", "geral"));
  if (metasSnap.exists()) {
    const metas = metasSnap.data();
    $("metaInputContas").value = metas.contas;
    $("metaInputReceita").value = metas.receita;
    $("metaInputVendas").value = metas.vendas;
  }
}

window.salvarAdminDados = salvarAdminDados;
