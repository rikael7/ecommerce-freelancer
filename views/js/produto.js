
      // ========
      // Contador
      // ==========
      let tempoRestante = 5 * 60 * 60 * 1000 + 10 * 60 * 1000 + 22 * 1000 + 278;

      const horas = document.getElementById("horas");
      const minutos = document.getElementById("minutos");
      const segundos = document.getElementById("segundos");
      const milliseconds = document.getElementById("milliseconds");

      function atualizarContador() {
        if (tempoRestante <= 0) {
          tempoRestante = 0;
        }

        const h = Math.floor(tempoRestante / (1000 * 60 * 60));
        const m = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((tempoRestante % (1000 * 60)) / 1000);
        const ms = tempoRestante % 1000;

        horas.textContent = String(h).padStart(2, "0");
        minutos.textContent = String(m).padStart(2, "0");
        segundos.textContent = String(s).padStart(2, "0");
        milliseconds.textContent = String(ms).padStart(3, "0");

        if (tempoRestante > 0) {
          tempoRestante -= 10;
          setTimeout(atualizarContador, 10);
        }
      }

      atualizarContador();

      // =====================================================================
      // Dados dos produtos usados nos carrosséis (conteúdo fiel à referência)
      // =====================================================================
      const STAR_FULL =
        '<svg viewBox="0 0 20 20" class="star-full"><polygon points="10,1 12.6,6.9 19,7.5 14.2,11.9 15.6,18.2 10,14.9 4.4,18.2 5.8,11.9 1,7.5 7.4,6.9"/></svg>';
      const STAR_EMPTY =
        '<svg viewBox="0 0 20 20" class="star-empty"><polygon points="10,1 12.6,6.9 19,7.5 14.2,11.9 15.6,18.2 10,14.9 4.4,18.2 5.8,11.9 1,7.5 7.4,6.9"/></svg>';

      function starsHTML(rating) {
        const full = Math.round(rating);
        let html = '<span class="stars">';
        for (let i = 0; i < 5; i++) {
          html += i < full ? STAR_FULL : STAR_EMPTY;
        }
        html += `<span class="rating-num">${rating.toFixed(2).replace(/0$/, "").replace(/\.$/, "")}</span></span>`;
        return html;
      }

      const track1Data = [
        {
          img: "painel-ferramentas",
          turbo: true,
          name: "Painel para Ferramentas 970 x 640 x 20mm com 48 Ganchos...",
          rating: 4.81,
          count: 42,
          price: "189,90",
          pix: "189,90",
          install: "ou R$ 211,00 em 4x R$ 52,75 sem juros no cartão",
        },
        {
          img: "bancada-2000",
          turbo: false,
          name: "Bancada de Trabalho Profissional 2000mm PRESTO-...",
          rating: 4.5,
          count: 26,
          price: "1.469,90",
          install: "ou R$ 1.633,22 em 10x R$ 163,33 sem juros no cartão",
        },
        {
          img: "bancada-gavetas",
          turbo: false,
          name: "Bancada Fechada com 7 Gavetas e Tampo...",
          rating: 4.6,
          count: 16,
          price: "3.049,90",
          install: "ou R$ 3.388,78 em 10x R$ 338,88 sem juros no cartão",
        },
        {
          img: "armario-modulado",
          turbo: false,
          name: "Armario Modulado para Oficina Preto Completo ORK-...",
          rating: 5,
          count: 2,
          price: "10.599,90",
          install: "ou R$ 11.777,67 em 12x R$ 981,48 sem juros no cartão",
        },
        {
          img: "bancada-dark",
          turbo: false,
          name: "Bancada Profissional Fechada Dark 15M PRESTO-91522",
          rating: 4.27,
          count: 15,
          price: "1.909,90",
          install: "ou R$ 2.122,11 em 10x R$ 212,22 sem juros no cartão",
        },
      ];

      const track2Data = [
        {
          img: "bancada-gavetas",
          turbo: false,
          name: "Bancada Fechada com 7 Gavetas e Tampo...",
          rating: 4.6,
          count: 15,
          price: "3.049,90",
          install: "ou R$ 3.388,78 em 10x R$ 338,88 sem juros no cartão",
        },
        {
          img: "armario-modulado",
          turbo: false,
          name: "Armario Modulado para Oficina Preto Completo ORK-...",
          rating: 5,
          count: 2,
          price: "10.599,90",
          install: "ou R$ 11.777,67 em 12x R$ 981,48 sem juros no cartão",
        },
        {
          img: "alicate",
          turbo: true,
          name: "Alicate Universal para Eletricista 8 Pol Profissional Cr...",
          rating: 4.71,
          count: 38,
          price: "60,90",
          install: "ou R$ 67,67 em 2x R$ 33,84 sem juros no cartão",
        },
        {
          img: "alicate",
          turbo: true,
          name: "Alicate Eletricista 6 Polegadas 1000 V VONDER-3662061500",
          rating: 4.73,
          count: 26,
          price: "39,90",
          install: "ou R$ 44,33 em 1x R$ 44,33 sem juros no cartão",
        },
        {
          img: "painel-ferramentas",
          turbo: true,
          name: "Painel para Ferramentas 970 x 640 x 20mm com 48 Ganchos...",
          rating: 4.81,
          count: 42,
          price: "189,90",
          install: "ou R$ 211,00 em 4x R$ 52,75 sem juros no cartão",
        },
      ];

      const track3Data = [
        {
          img: "bancada-2000",
          turbo: false,
          name: "Bancada com 3 Gavetas e Tampo de Madeira...",
          rating: 4.73,
          count: 33,
          price: "1.669,90",
          oldPrice: "2.049,00",
          install: "ou R$ 1.855,44 em 10x R$ 185,55 sem juros no cartão",
        },
        {
          img: "bancada-gavetas",
          turbo: false,
          name: "Bancada Fechada com 7 Gavetas e Tampo...",
          rating: 4.6,
          count: 15,
          price: "3.049,90",
          install: "ou R$ 3.388,78 em 10x R$ 338,88 sem juros no cartão",
        },
        {
          img: "armario-multiuso",
          turbo: false,
          name: "Armário Multiuso Abile 4 Prateleiras 1850 x 900 mm...",
          rating: 4.85,
          count: 33,
          price: "1.869,90",
          oldPrice: "2.207,90",
          install: "ou R$ 2.077,67 em 10x R$ 207,77 sem juros no cartão",
        },
        {
          img: "painel-ferramentas",
          turbo: true,
          name: "Painel para Ferramentas 970 x 640 x 20mm com 48 Ganchos...",
          rating: 4.81,
          count: 42,
          price: "189,90",
          install: "ou R$ 211,00 em 4x R$ 52,75 sem juros no cartão",
        },
        {
          img: "estante-gaveteiro",
          turbo: false,
          name: "Kit Estante Gaveteiro com 49 Gavetas Azuis Nr 3 e 7...",
          rating: 4.64,
          count: 106,
          price: "419,90",
          install: "ou R$ 466,56 em 8x R$ 77,76 sem juros no cartão",
        },
      ];

      function buildCard(p) {
        const turbo = p.turbo
          ? `<span class="tag-turbo"><svg viewBox="0 0 20 20"><polygon points="10,1 12.6,6.9 19,7.5 14.2,11.9 15.6,18.2 10,14.9 4.4,18.2 5.8,11.9 1,7.5 7.4,6.9"/></svg>Entrega TURBO</span>`
          : "";
        const old = p.oldPrice
          ? `<div class="price-old">De R$ ${p.oldPrice}</div>`
          : "";
        return `
  <article class="product-card-item">
    <div class="thumb">
      ${turbo}
      <img src="assets/${p.img}.svg" alt="${p.name}">
    </div>
    <div class="pc-name">${p.name}</div>
    ${starsHTML(p.rating)}<span class="rating-count">(${p.count})</span>
    ${old}
    <div class="pc-price">R$ ${p.price}</div>
    <div class="pc-pix">à vista no <b>Pix ou Boleto</b></div>
    <div class="pc-install">${p.install}</div>
    <div class="pc-footer">
      <div class="qty-selector">
        <button class="qty-dec" aria-label="Diminuir">–</button>
        <input type="text" class="qty-value" value="1" readonly>
        <button class="qty-inc" aria-label="Aumentar">+</button>
      </div>
      <button class="btn-add">Adicionar ao carrinho</button>
    </div>
  </article>`;
      }

      function renderTrack(id, data) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = data.map(buildCard).join("");
      }
      renderTrack("track1", track1Data);
      renderTrack("track2", track2Data);
      renderTrack("track3", track3Data);

      // =====================================================================
      // Seletores de quantidade (delegação de evento, funciona para toda a página)
      // =====================================================================
      document.addEventListener("click", (e) => {
        const dec = e.target.closest(".qty-dec");
        const inc = e.target.closest(".qty-inc");
        if (dec || inc) {
          const wrap = e.target.closest(".qty-selector");
          const input = wrap.querySelector(".qty-value");
          let val = parseInt(input.value, 10) || 1;
          val = inc ? val + 1 : Math.max(1, val - 1);
          input.value = val;
          // atualiza label "Quantidade: X unidade" na buybox principal
          const echo = wrap.parentElement.querySelector(".qty-echo");
          if (echo) echo.textContent = val;
        }
      });

      // =====================================================================
      // Acordeão: "Ver detalhes" dos destaques do produto
      // =====================================================================
      const seeMoreBtn = document.getElementById("seeMoreBtn");
      if (seeMoreBtn) {
        seeMoreBtn.addEventListener("click", () => {
          seeMoreBtn.classList.toggle("open");
          seeMoreBtn.firstChild.textContent = seeMoreBtn.classList.contains(
            "open",
          )
            ? "Ver menos "
            : "Ver detalhes ";
        });
      }

      // Acordeão: Ficha técnica — mostra a linha extra e alterna o texto
      const specMoreBtn = document.getElementById("specMoreBtn");
      if (specMoreBtn) {
        specMoreBtn.addEventListener("click", () => {
          const extras = document.querySelectorAll("#specTable .extra");
          const open = extras[0] && extras[0].style.display !== "none";
          extras.forEach((r) => (r.style.display = open ? "none" : "grid"));
          specMoreBtn.innerHTML = open
            ? 'Ver ficha técnica <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>'
            : 'Ver menos <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>';
        });
      }

      // =====================================================================
      // Carrosséis — navegação por setas com scroll suave
      // =====================================================================
      document.querySelectorAll(".carousel-wrap").forEach((wrap) => {
        const track = wrap.querySelector(".carousel-track");
        const prev = wrap.querySelector(".prev");
        const next = wrap.querySelector(".next");
        const scrollAmount = () => track.clientWidth * 0.8;
        prev.addEventListener("click", () =>
          track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }),
        );
        next.addEventListener("click", () =>
          track.scrollBy({ left: scrollAmount(), behavior: "smooth" }),
        );
      });

      // CEP: máscara simples 00000-000
      const cepInput = document.querySelector(".cep-input input");
      if (cepInput) {
        cepInput.addEventListener("input", () => {
          let v = cepInput.value.replace(/\D/g, "").slice(0, 8);
          if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
          cepInput.value = v;
        });
      }

      // =====================================================================
      // Carrega o produto pela query string (?id=123) consultando a API
      // Endpoint: GET /api/produto/:id
      // Controller retorna: { id, nome, descricao, preco, estoque, ativo }
      // =====================================================================
      const apiStateEl = document.getElementById("apiState");
      const titleEl = document.getElementById("productTitle");
      const productIdEl = document.getElementById("productId");
      const priceEl = document.getElementById("productPrice");
      const priceDetailEl = document.getElementById("priceDetail");
      const descriptionEl = document.getElementById("productDescription");
      const stockEl = document.getElementById("stockInfo");
      const btnComprar = document.getElementById("btnComprar");
      const btnAdicionar = document.getElementById("btnAdicionar");

      function formatarPreco(valor) {
        const numero = Number(valor) || 0;
        const partes = numero
          .toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          .split(",");
        return { inteiro: partes[0], centavos: partes[1] };
      }

      function mostrarEstadoAPI(mensagem, tipo) {
        if (!apiStateEl) return;
        apiStateEl.textContent = mensagem;
        apiStateEl.className = "api-state" + (tipo ? ` is-${tipo}` : "");
        apiStateEl.style.display = mensagem ? "flex" : "none";
      }

      function definirDisponibilidade(disponivel, textoIndisponivel) {
        [btnComprar, btnAdicionar].forEach((btn) => {
          if (!btn) return;
          btn.disabled = !disponivel;
        });
        if (stockEl) {
          if (disponivel) {
            stockEl.style.display = "none";
          } else {
            stockEl.textContent = textoIndisponivel;
            stockEl.className = "stock-info out-of-stock";
            stockEl.style.display = "block";
          }
        }
      }

      function preencherProduto(produto) {
        produtoAtual = produto; // guarda o produto carregado para uso no carrinho

        document.title = `${produto.nome} | Loja do Mecânico`;

        if (titleEl) titleEl.textContent = produto.nome;
        if (productIdEl) productIdEl.textContent = produto.id;

        if (priceEl) {
          const { inteiro, centavos } = formatarPreco(produto.preco);
          priceEl.innerHTML = `R$ ${inteiro}<sup>,${centavos}</sup>`;
        }
        // preço parcelado é apenas ilustrativo — sem regra de negócio vinda da API
        if (priceDetailEl) {
          priceDetailEl.style.display = "none";
        }

        if (descriptionEl) {
          if (produto.descricao) {
            descriptionEl.textContent = produto.descricao;
            descriptionEl.style.display = "block";
          } else {
            descriptionEl.style.display = "none";
          }
        }

        const emEstoque = Number(produto.estoque) > 0;
        const ativo = produto.ativo !== false;

        if (!ativo) {
          definirDisponibilidade(false, "Produto indisponível no momento");
        } else if (!emEstoque) {
          definirDisponibilidade(false, "Produto fora de estoque");
        } else {
          definirDisponibilidade(true);
          if (stockEl && Number(produto.estoque) <= 5) {
            stockEl.textContent = `Últimas ${produto.estoque} unidades em estoque`;
            stockEl.className = "stock-info in-stock";
            stockEl.style.display = "block";
          }
        }
      }

      async function carregarProdutoPorId(id) {
        mostrarEstadoAPI("Carregando produto…", "loading");
        try {
          const resposta = await fetch(
            `/api/produtos/${encodeURIComponent(id)}`,
          );

          if (resposta.status === 404) {
            mostrarEstadoAPI("Produto não encontrado.", "error");
            definirDisponibilidade(false, "Produto não encontrado");
            return;
          }
          if (!resposta.ok) {
            mostrarEstadoAPI("Erro ao buscar produto.", "error");
            return;
          }

          const produto = await resposta.json();
          preencherProduto(produto);
          mostrarEstadoAPI("");
        } catch (erro) {
          console.error("Erro ao buscar produto:", erro);
          mostrarEstadoAPI("Não foi possível conectar à API.", "error");
        }
      }

      (function inicializarBuscaPorQueryParam() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
          carregarProdutoPorId(id);
        }
      })();

      // =====================================================================
      // Carrinho — mesmo esquema usado em loja.html (localStorage "carrinho")
      // =====================================================================
      const CART_KEY = "carrinho";
      let produtoAtual = null;

      function formatBRL(valor) {
        const n = Number(valor) || 0;
        return n.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      function getCarrinho() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
      }

      function salvarCarrinho(carrinho) {
        localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
        renderCartDrawer();
      }

      function adicionarAoCarrinho(produto, quantidade) {
        const carrinho = getCarrinho();
        const existente = carrinho.find((item) => item.id === produto.id);
        if (existente) {
          existente.quantidade += quantidade;
        } else {
          carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco) || 0,
            quantidade,
            imagem: produto.imagem_url || null,
          });
        }
        salvarCarrinho(carrinho);
      }

      function alterarQuantidade(id, delta) {
        const carrinho = getCarrinho();
        const item = carrinho.find((i) => i.id === id);
        if (!item) return;
        item.quantidade += delta;
        if (item.quantidade <= 0) return removerDoCarrinho(id);
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

        if (badge) {
          badge.style.display = totalItens > 0 ? "flex" : "none";
          badge.textContent = totalItens;
        }
        if (totalEl) totalEl.textContent = formatBRL(totalValor);

        if (!body) return;
        if (!carrinho.length) {
          body.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
          return;
        }

        body.innerHTML = carrinho
          .map(
            (item) => `
    <div class="cart-item">
      <div class="ci-thumb">${
        item.imagem ? `<img src="${item.imagem}" alt="${item.nome}">` : "🔧"
      }</div>
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
    </div>`,
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

      function getQuantidadeSelecionada() {
        const input = document.querySelector(".buybox .qty-value");
        return Math.max(1, parseInt(input?.value, 10) || 1);
      }

      if (btnComprar) {
        btnComprar.addEventListener("click", () => {
          if (!produtoAtual) return;
          adicionarAoCarrinho(produtoAtual, getQuantidadeSelecionada());
          window.location.href = "/cart";
        });
      }

      if (btnAdicionar) {
        btnAdicionar.addEventListener("click", () => {
          if (!produtoAtual) return;
          adicionarAoCarrinho(produtoAtual, getQuantidadeSelecionada());
          toggleCartDrawer(true);
        });
      }

      renderCartDrawer();
