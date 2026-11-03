
// ==========================================
// PANA PROJETOS
// MURAL COM MODERACAO E ATUALIZACAO AUTOMATICA
// ==========================================

// 1. CONFIGURACAO DO SUPABASE
// Use a URL sem /rest/v1 no final.

const SUPABASE_URL = "https://iocmmoymssqlcugcdxbd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Pbz6dwQhkiMsDJbrZ3r6YA_qUCvLJDk";

// 2. MENU ORIGINAL DO SITE

const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");

btn?.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  btn.setAttribute("aria-expanded", aberto);
});

// 3. MURAL DA VIZINHANCA

const form = document.getElementById("form-chat");

if (form) {
  
// CARROSSEL FLUTUANTE DE COMENTARIOS

let comentarioAtual = 0;

const anteriorComentario =
  document.getElementById("comentario-anterior");

const proximoComentario =
  document.getElementById("comentario-proximo");

const contadorComentarios =
  document.getElementById("contador-comentarios");

function atualizarComentarios() {
  const itens = lista.querySelectorAll(".msg");

  if (itens.length === 0) {
    contadorComentarios.textContent = "0 / 0";
    return;
  }

  comentarioAtual =
    ((comentarioAtual % itens.length) + itens.length)
    % itens.length;

  itens.forEach((item, indice) => {
    item.classList.toggle(
      "ativa",
      indice === comentarioAtual
    );
  });

  contadorComentarios.textContent =
    `${comentarioAtual + 1} / ${itens.length}`;
}

function trocarComentario(direcao) {
  comentarioAtual += direcao;
  atualizarComentarios();
}

anteriorComentario?.addEventListener("click", () => {
  trocarComentario(-1);
});

proximoComentario?.addEventListener("click", () => {
  trocarComentario(1);
});

// Trocar automaticamente a cada 6 segundos
setInterval(() => {
  if (!document.hidden) {
    trocarComentario(1);
  }
}, 6000);

  const lista = document.getElementById("mensagens");
  const campoNome = document.getElementById("nome");
  const campoAssunto = document.getElementById("assunto");
  const campoTexto = document.getElementById("texto");
  const botao = form.querySelector('button[type="submit"]');

  const API = `${SUPABASE_URL}/rest/v1/mensagens`;

  const headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Content-Type": "application/json"
  };

  let carregando = false;
  let ultimoEnvio = 0;
  let primeiraCarga = true;

  // 4. EXIBIR UMA MENSAGEM

  function mostrarMensagem(m) {
    const li = document.createElement("li");
    li.className = "msg";

    const nome = document.createElement("strong");
    nome.textContent = m.nome;

    const info = document.createElement("em");

    const data = new Date(m.criado_em);

    const horario = Number.isNaN(data.getTime())
      ? ""
      : data.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short"
        });

    info.textContent = `${m.assunto} · ${horario}`;

    const texto = document.createElement("span");
    texto.textContent = m.texto;

    li.append(nome, info, texto);
    lista.appendChild(li);
  }

  // 5. CARREGAR MENSAGENS APROVADAS

  async function carregarMensagens() {
    if (carregando) return;

    carregando = true;

    try {
      const consulta =
        `${API}?select=id,nome,assunto,texto,criado_em` +
        `&status=eq.aprovada` +
        `&order=criado_em.asc&limit=200`;

      const resposta = await fetch(consulta, {
        method: "GET",
        headers,
        cache: "no-store"
      });

      if (!resposta.ok) {
        throw new Error(
          `Erro ao carregar: ${resposta.status} ` +
          await resposta.text()
        );
      }

      const mensagens = await resposta.json();

      lista.replaceChildren();

      if (mensagens.length === 0) {
        const aviso = document.createElement("li");
        aviso.className = "msg";
        aviso.textContent =
          "Ainda não existem mensagens aprovadas.";
        lista.appendChild(aviso);
      } else {
        mensagens.forEach(mostrarMensagem);
        atualizarComentarios();
      }

      if (primeiraCarga) {
        lista.scrollTop = lista.scrollHeight;
        primeiraCarga = false;
      }

    } catch (erro) {
      console.error("Erro ao atualizar mural:", erro);

      if (primeiraCarga) {
        const aviso = document.createElement("li");
        aviso.className = "msg";
        aviso.textContent =
          "Não foi possível carregar o mural.";
        lista.replaceChildren(aviso);
      }
    } finally {
      carregando = false;
    }
  }

  // 6. ENVIAR NOVA SUGESTAO

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const assunto = campoAssunto.value;
    const texto = campoTexto.value.trim();

    if (!nome || !texto) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (nome.length > 40 || texto.length > 400) {
      alert("A mensagem ultrapassa o limite permitido.");
      return;
    }

    // Intervalo basico entre envios neste navegador
    const agora = Date.now();

    if (agora - ultimoEnvio < 30000) {
      alert("Aguarde 30 segundos antes de enviar novamente.");
      return;
    }

    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
      const resposta = await fetch(API, {
        method: "POST",
        headers: {
          ...headers,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          nome,
          assunto,
          texto,
          status: "pendente"
        })
      });

      if (!resposta.ok) {
        throw new Error(
          `Erro ao enviar: ${resposta.status} ` +
          await resposta.text()
        );
      }

      ultimoEnvio = Date.now();
      campoTexto.value = "";

      alert(
        "Mensagem recebida! Ela será exibida " +
        "após aprovação da equipe."
      );

} catch (erro) {
  console.error("Erro ao enviar mensagem:", erro);

  if (erro.message.includes("linguagem inadequada")) {
    alert(
      "Sua mensagem contém linguagem inadequada. " +
      "Revise o texto e tente novamente."
    );
  } else {
    alert(
      "Não foi possível enviar a mensagem. " +
      "Tente novamente."
    );
  }
} finally {
      botao.disabled = false;
      botao.textContent = "Enviar";
    }
  });

  // 7. ATUALIZACAO AUTOMATICA

  carregarMensagens();

  // Consulta o banco a cada 10 segundos
  setInterval(() => {
    if (!document.hidden) {
      carregarMensagens();
    }
  }, 10000);

  // Atualiza quando o visitante volta para a aba
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      carregarMensagens();
    }
  });
}
