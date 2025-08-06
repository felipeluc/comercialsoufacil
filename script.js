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
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SUA_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usuarios = ["Marcelo", "Angela", "Gabriel", "Leticia", "Glaucia", "Felipe", "Carol"];
const admins = ["Carol", "Felipe"];
const consultores = ["Marcelo", "Angela", "Gabriel", "Leticia", "Glaucia"];

let usuarioLogado = "";
let dadosJaSalvos = false;

// === Login ===
window.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("usuarioSelect");
  usuarios.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    userSelect.appendChild(opt);
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = userSelect.value;
    const senha = document.getElementById("senhaInput").value;

    if (senha === nome.toLowerCase() + "1234") {
      usuarioLogado = nome;
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("mainApp").style.display = "block";

      if (admins.includes(nome)) {
        document.getElementById("menuAdmin").style.display = "block";
      }

      carregarAnalise();
    } else {
      alert("Senha incorreta");
    }
  });
});

// === Navegação ===
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(target).style.display = "block";
  });
});

// === Análise de Meta ===
async function carregarAnalise() {
  const metasSnap = await getDoc(doc(db, "metas", "geral"));
  const metas = metasSnap.exists() ? metasSnap.data() : { contas: 0, receita: 0 };

  const vendasSnap = await getDocs(collection(db, "vendasSemana"));
  const vendas = vendasSnap.docs.map(doc => doc.data());

  let totaisPorConsultor = {};
  consultores.forEach(c => totaisPorConsultor[c] = { contas: 0, receita: 0 });

  vendas.forEach(v => {
    if (totaisPorConsultor[v.consultor]) {
      totaisPorConsultor[v.consultor].contas++;
      totaisPorConsultor[v.consultor].receita += v.valor;
    }
  });

  const container = document.getElementById("analiseContainer");
  container.innerHTML = "";

  consultores.forEach(c => {
    const dados = totaisPorConsultor[c];
    const faltaContas = Math.max(0, metas.contas - dados.contas);
    const faltaReceita = Math.max(0, metas.receita - dados.receita);

    container.innerHTML += `
      <div class="card">
        <h3>${c}</h3>
        <p>Contas: ${dados.contas}</p>
        <p>Receita: R$ ${dados.receita.toFixed(2)}</p>
        <p>Faltam Contas: ${faltaContas}</p>
        <p>Faltam Receita: R$ ${faltaReceita.toFixed(2)}</p>
      </div>
    `;
  });

  // Metas gerais
  const totalContas = vendas.length;
  const totalReceita = vendas.reduce((acc, v) => acc + v.valor, 0);

  document.getElementById("metaGeral").innerHTML = `
    <div class="card destaque">
      <h3>Meta Geral</h3>
      <p>Contas: ${totalContas} / ${metas.contas}</p>
      <p>Receita: R$ ${totalReceita.toFixed(2)} / R$ ${metas.receita}</p>
    </div>
  `;
}

// === Admin ===
document.getElementById("adminForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (dadosJaSalvos) return alert("Os dados já foram salvos. Recarregue a página para atualizar.");

  const contas = parseInt(document.getElementById("metaContasInput").value);
  const receita = parseFloat(document.getElementById("metaReceitaInput").value);

  await setDoc(doc(db, "metas", "geral"), { contas, receita });

  dadosJaSalvos = true;
  mostrarPopup("Metas salvas com sucesso!");
});

function mostrarPopup(msg) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.textContent = msg;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}
