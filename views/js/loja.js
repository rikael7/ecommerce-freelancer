/* ===========================================================
   INTEGRAÇÃO COM O BACKEND
   Endpoint: GET /api/mercadopago/produtos
   Ajuste API_BASE se o backend rodar em outra origem/porta.
=========================================================== */
const API_BASE = ""; // ex: "http://localhost:3000" se o front rodar separado do backend
const PRODUCTS_ENDPOINT = API_BASE + "/api/mercadopago/produtos";

function formatBRL(valor) {
  const n = Number(valor) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Monta o preço com "R$" menor separado do valor, maior e mais grosso
function priceHTML(valor) {
  const formatado = formatBRL(valor); // ex: "R$ 2.419,90"
  const partes = formatado.split(/\s+/);
  const simbolo = partes.shift();
  const numero = partes.join(" ");
  return `<span class="price-symbol">${simbolo}</span><span class="price-value">${numero}</span>`;
}

// Gera uma nota fictícia entre 4.1 e 5.0, estável por produto (mesmo id
// sempre resulta na mesma nota, já que a API ainda não tem avaliações reais).
function ratingFicticio(id) {
  const semente = String(id)
    .split("")
    .reduce((soma, ch) => soma + ch.charCodeAt(0), 0);
  const pseudoRandom = Math.abs(Math.sin(semente * 12.9898)) % 1;
  const nota = 4.1 + pseudoRandom * (5.0 - 4.1);
  return Math.round(nota * 10) / 10;
}

// Normaliza o produto vindo da API para o formato real retornado por
// GET /api/mercadopago/produtos:
// { id, nome, descricao, preco, preco_antigo, desconto_percentual, estoque, imagem_url }
function normalizeProduct(p) {
  return {
    id: p.id,
    nome: p.nome ?? "Produto sem nome",
    descricao: p.descricao ?? "",
    preco: p.preco ?? 0,
    precoAntigo: p.preco_antigo ?? null,
    descontoPercentual: p.desconto_percentual ?? null,
    estoque: p.estoque ?? 0,
    imagem: p.imagem_url ?? null,
    rating: ratingFicticio(p.id),
  };
}

function starsHTML(rating) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return `
    <div class="stars-row">
      <div class="stars-outline">★★★★★
        <div class="stars-fill" style="width:${pct}%">★★★★★</div>
      </div>
      <span class="stars-value">${rating.toFixed(1)}</span>
    </div>`;
}

// Redireciona para a página de produto levando o id via query param
function irParaProduto(id) {
  window.location.href = `produto?id=${encodeURIComponent(id)}`;
}

function productCardHTML(p, onNavy) {
  const semEstoque = Number(p.estoque) <= 0;
  const estoqueTag = semEstoque
    ? `<div class="badge-discount" style="background:#8a8a8a;">Indisponível</div>`
    : Number(p.estoque) <= 5
      ? `<div class="badge-discount">Últimas ${p.estoque}</div>`
      : "";
  const temDesconto = p.descontoPercentual != null && p.precoAntigo != null;
  const precoAntigoHTML = temDesconto
    ? `<div class="old-row">
         <span class="old">DE: ${formatBRL(p.precoAntigo)}</span>
         <span class="badge-off">↓ ${p.descontoPercentual}%</span>
       </div>`
    : "";
  const imgHTML = p.imagem
    ? `<img src="${p.imagem}" alt="${p.nome}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'🔧',style:'font-size:32px;opacity:.3;'}))">`
    : `<span style="font-size:32px;opacity:.3;">🔧</span>`;
  return `
    <div class="product-card ${onNavy ? "on-navy" : ""}" data-id="${p.id}">
      ${estoqueTag}
      <div class="img-wrap" onclick="irParaProduto('${p.id}')">${imgHTML}</div>
      <div class="p-body">
        <div class="p-name" onclick="irParaProduto('${p.id}')">${p.nome}</div>
        ${starsHTML(p.rating)}
        <div class="installments" title="${p.descricao}">${p.descricao || ""}</div>
        ${precoAntigoHTML}
        <div class="price">${priceHTML(p.preco)}</div>
        <div class="installments">ou em até 12x no cartão</div>
        <div class="buy-row">
          <input class="qty" type="number" min="1" value="1" ${semEstoque ? "disabled" : ""}>
          <button class="add-btn" onclick="addToCart('${p.id}')" ${semEstoque ? "disabled style='opacity:.5;cursor:not-allowed;'" : ""}>
            ${semEstoque ? "Indisponível" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>`;
}

function renderGrid(containerId, produtos, opts = {}) {
  const el = document.getElementById(containerId);
  if (!produtos.length) {
    el.innerHTML = `<div class="prod-state">Nenhum produto encontrado.</div>`;
    return;
  }
  const list = opts.limit
    ? produtos.slice(opts.offset || 0, (opts.offset || 0) + opts.limit)
    : produtos;
  el.innerHTML = list.map((p) => productCardHTML(p, opts.onNavy)).join("");
}

function addToCart(id) {
  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  if (!card) return;

  const nome = card.querySelector(".p-name")?.textContent?.trim() || "Produto";
  const precoTexto =
    card.querySelector(".price")?.textContent?.trim() || "R$ 0,00";
  const preco =
    Number(
      precoTexto
        .replace(/[^\d,-]/g, "")
        .replace(".", "")
        .replace(",", "."),
    ) || 0;
  const imgEl = card.querySelector(".img-wrap img");
  const imagem = imgEl ? imgEl.getAttribute("src") : null;
  const qtyInput = card.querySelector(".qty");
  const quantidade = Math.max(1, parseInt(qtyInput?.value, 10) || 1);

  const carrinho = getCarrinho();
  const existente = carrinho.find((item) => item.id === id);
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({ id, nome, preco, quantidade, imagem });
  }
  salvarCarrinho(carrinho);

  const btn = card.querySelector(".add-btn");
  if (btn) {
    const textoOriginal = btn.textContent;
    btn.textContent = "Adicionado ✓";
    setTimeout(() => {
      btn.textContent = textoOriginal;
    }, 1200);
  }

  toggleCartDrawer(true);
}

const CART_KEY = "carrinho";

function getCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
  renderCartDrawer();
}

function alterarQuantidade(id, delta) {
  const carrinho = getCarrinho();
  const item = carrinho.find((i) => i.id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) {
    return removerDoCarrinho(id);
  }
  salvarCarrinho(carrinho);
}

function removerDoCarrinho(id) {
  const carrinho = getCarrinho().filter((i) => i.id !== id);
  salvarCarrinho(carrinho);
}

function renderCartDrawer() {
  const carrinho = getCarrinho();
  const body = document.getElementById("cartDrawerBody");
  const totalEl = document.getElementById("cartDrawerTotal");
  const badge = document.getElementById("cartCountBadge");

  const totalItens = carrinho.reduce((soma, i) => soma + i.quantidade, 0);
  const totalValor = carrinho.reduce(
    (soma, i) => soma + i.preco * i.quantidade,
    0,
  );

  if (totalItens > 0) {
    badge.style.display = "flex";
    badge.textContent = totalItens;
  } else {
    badge.style.display = "none";
  }

  totalEl.textContent = formatBRL(totalValor);

  if (!carrinho.length) {
    body.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
    return;
  }

  body.innerHTML = carrinho
    .map(
      (item) => `
    <div class="cart-item">
      <div class="ci-thumb">${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'🔧'}))">` : "🔧"}</div>
      <div class="ci-info">
        <div class="ci-name">${item.nome}</div>
        <div class="ci-price">${formatBRL(item.preco)}</div>
        <div class="ci-controls">
          <button onclick="alterarQuantidade('${item.id}', -1)">−</button>
          <span class="ci-qty">${item.quantidade}</span>
          <button onclick="alterarQuantidade('${item.id}', 1)">+</button>
          <button class="ci-remove" onclick="removerDoCarrinho('${item.id}')">Remover</button>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function toggleCartDrawer(forceOpen) {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !drawer.classList.contains("open");
  drawer.classList.toggle("open", shouldOpen);
  overlay.classList.toggle("open", shouldOpen);
}

async function loadProducts() {
  const grids = [
    "grid-destaque",
    "grid-principais",
    "grid-relampago",
    "grid-frete",
    "grid-descontos",
  ];
  try {
    const res = await fetch(PRODUCTS_ENDPOINT);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const rawList = Array.isArray(data)
      ? data
      : data.produtos || data.data || [];
    const produtos = rawList.map(normalizeProduct);

    if (!produtos.length) {
      grids.forEach((id) => renderGrid(id, []));
      return;
    }

    renderGrid("grid-destaque", produtos, {
      limit: 5,
      offset: 0,
      onNavy: true,
    });
    renderGrid("grid-principais", produtos, { limit: 5, offset: 0 });
    renderGrid("grid-relampago", produtos, {
      limit: 5,
      offset: 5 % produtos.length,
      onNavy: true,
    });
    renderGrid("grid-frete", produtos, { limit: 4, offset: 0 });

    const comDesconto = produtos
      .filter((p) => p.descontoPercentual != null)
      .sort((a, b) => b.descontoPercentual - a.descontoPercentual);
    renderGrid("grid-descontos", comDesconto.length ? comDesconto : produtos, {
      limit: 5,
      offset: 0,
    });
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    grids.forEach((id) => {
      document.getElementById(id).innerHTML =
        `<div class="prod-state">Não foi possível carregar os produtos (${PRODUCTS_ENDPOINT}). Verifique se o backend está rodando e se o CORS está liberado.</div>`;
    });
  }
}

// Contador simples da "Oferta relâmpago" (visual, não persistente)
function startCountdown() {
  let totalSeconds = 6 * 3600 + 41 * 60 + 39;
  const h = document.getElementById("cd-h");
  const m = document.getElementById("cd-m");
  const s = document.getElementById("cd-s");
  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    h.textContent = hh;
    m.textContent = mm;
    s.textContent = ss;
  }, 1000);
}

loadProducts();
startCountdown();
renderCartDrawer();
