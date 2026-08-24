
/* =========================================================
   NÃO ALTERADO — API
========================================================= */

const API_PRODUTOS = '/api/produtos';
const API_PEDIDOS = '/api/mercadopago/pedidos';


function formatarMoeda(v){
  return Number(v).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}


function formatarData(iso){
  if(!iso) return '—';

  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


function formatarDataSimples(iso){
  if(!iso) return '—';

  return new Date(iso).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });
}


function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}


/* =========================================================
   ABAS
========================================================= */

const abaBtns = document.querySelectorAll('.aba-btn');

const paineis = {
  produtos: document.getElementById('painel-produtos'),
  pedidos: document.getElementById('painel-pedidos'),
};


abaBtns.forEach((btn) => {

  btn.addEventListener('click', () => {

    abaBtns.forEach((b) => b.classList.remove('ativa'));
    btn.classList.add('ativa');

    Object.values(paineis).forEach((p) => {
      p.classList.remove('ativo');
    });

    paineis[btn.dataset.aba].classList.add('ativo');

    /*
     * Mantém também o estado visual da sidebar.
     * Não altera a lógica das APIs.
     */
    document
      .querySelectorAll('.sidebar-nav button')
      .forEach((b) => b.classList.remove('ativo'));

    const sidebarBtn = document.querySelector(
      `.sidebar-nav button[data-aba="${btn.dataset.aba}"]`
    );

    if(sidebarBtn){
      sidebarBtn.classList.add('ativo');
    }

    if(
      btn.dataset.aba === 'pedidos' &&
      pedidosCarregados === false
    ){
      carregarPedidos();
    }

  });

});


/* =========================================================
   SIDEBAR
========================================================= */

document
  .querySelectorAll('.sidebar-nav button')
  .forEach((btn) => {

    btn.addEventListener('click', () => {

      const aba = document.querySelector(
        `.aba-btn[data-aba="${btn.dataset.aba}"]`
      );

      if(aba){
        aba.click();
      }

    });

  });


/* =========================================================
   PRODUTOS
========================================================= */

const form = document.getElementById('form-produto');
const formTitulo = document.getElementById('form-titulo');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelarEdicao =
  document.getElementById('btn-cancelar-edicao');

const formMsg = document.getElementById('form-msg');

const campoId = document.getElementById('produto-id');
const campoNome = document.getElementById('produto-nome');
const campoDescricao =
  document.getElementById('produto-descricao');

const campoPreco = document.getElementById('produto-preco');
const campoPrecoAntigo =
  document.getElementById('produto-preco-antigo');

const campoEstoque =
  document.getElementById('produto-estoque');

const campoAtivo =
  document.getElementById('produto-ativo');

const estadoProdutosEl =
  document.getElementById('estado-produtos');

const produtosWrapEl =
  document.getElementById('produtos-wrap');

const contagemProdutosEl =
  document.getElementById('contagem-produtos');


function mostrarFormMsg(msg, tipo){

  formMsg.textContent = msg;

  formMsg.className =
    'form-msg ' + (tipo || '');

}


function entrarModoEdicao(produto){

  campoId.value = produto.id;
  campoNome.value = produto.nome;
  campoDescricao.value = produto.descricao || '';
  campoPreco.value = produto.preco;
  campoPrecoAntigo.value = produto.preco_antigo || '';
  campoEstoque.value = produto.estoque;
  campoAtivo.checked = !!produto.ativo;

  formTitulo.textContent = 'Editar produto';

  btnSalvar.textContent =
    'Salvar alterações';

  btnCancelarEdicao.hidden = false;

  mostrarFormMsg('');

  campoNome.focus();

}


function sairModoEdicao(){

  form.reset();

  campoId.value = '';

  campoAtivo.checked = true;

  formTitulo.textContent =
    'Novo produto';

  btnSalvar.textContent =
    'Adicionar produto';

  btnCancelarEdicao.hidden = true;

  mostrarFormMsg('');

}


btnCancelarEdicao.addEventListener(
  'click',
  sairModoEdicao
);


form.addEventListener(
  'submit',
  async (evento) => {

    evento.preventDefault();

    const id = campoId.value;

    const payload = {

      nome: campoNome.value.trim(),

      descricao:
        campoDescricao.value.trim(),

      preco:
        Number(campoPreco.value),

      precoAntigo:
        campoPrecoAntigo.value
          ? Number(campoPrecoAntigo.value)
          : null,

      estoque:
        Number(campoEstoque.value),

      ativo:
        campoAtivo.checked,

    };


    if(!payload.nome){

      mostrarFormMsg(
        'Informe o nome do produto.',
        'erro'
      );

      return;

    }


    if(
      payload.precoAntigo !== null &&
      payload.precoAntigo <= payload.preco
    ){

      mostrarFormMsg(
        'O preço antigo deve ser maior que o preço atual.',
        'erro'
      );

      return;

    }


    btnSalvar.disabled = true;

    mostrarFormMsg(
      id
        ? 'salvando alterações…'
        : 'adicionando produto…'
    );


    try{

      const url =
        id
          ? `${API_PRODUTOS}/${id}`
          : API_PRODUTOS;

      const metodo =
        id
          ? 'PUT'
          : 'POST';


      const resp = await fetch(
        url,
        {
          method: metodo,

          headers:{
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload),
        }
      );


      const dados =
        await resp.json();


      if(!resp.ok){

        throw new Error(
          dados.erro ||
          'Não foi possível salvar o produto.'
        );

      }


      mostrarFormMsg(
        id
          ? 'produto atualizado.'
          : 'produto adicionado.',
        'ok'
      );


      sairModoEdicao();

      carregarProdutos();


    }catch(erro){

      console.error(erro);

      mostrarFormMsg(
        erro.message,
        'erro'
      );

    }finally{

      btnSalvar.disabled = false;

    }

  }
);


async function carregarProdutos(){

  try{

    const resp =
      await fetch(
        API_PRODUTOS + '?todos=1'
      );


    if(!resp.ok){

      throw new Error(
        'Falha ao buscar produtos.'
      );

    }


    const produtos =
      await resp.json();


    renderizarProdutos(produtos);


  }catch(erro){

    console.error(erro);

    estadoProdutosEl.className =
      'estado erro';

    estadoProdutosEl.textContent =
      'não foi possível carregar os produtos. verifique se o servidor está no ar.';

    produtosWrapEl.innerHTML = '';

    produtosWrapEl.appendChild(
      estadoProdutosEl
    );

  }

}


function renderizarProdutos(produtos){

  if(
    !Array.isArray(produtos) ||
    produtos.length === 0
  ){

    produtosWrapEl.innerHTML =
      '<div class="estado">nenhum produto cadastrado ainda</div>';

    contagemProdutosEl.textContent = '';

    return;

  }


  contagemProdutosEl.textContent =
    produtos.length + ' item(ns)';


  const linhas = produtos.map((p) => `

    <tr
      class="${p.ativo ? '' : 'inativo'}"
      data-id="${p.id}"
    >

      <td class="cel-nome">

        <div class="nome">

          ${escapeHtml(p.nome)}

          ${
            p.ativo
              ? ''
              : '<span class="tag-inativo">inativo</span>'
          }

        </div>

        ${
          p.descricao
            ? `<div class="descricao">
                ${escapeHtml(p.descricao)}
               </div>`
            : ''
        }

      </td>


      <td class="cel-preco">

        ${
          p.desconto_percentual
            ? `<div class="preco-antigo">
                 de ${formatarMoeda(p.preco_antigo)}
               </div>`
            : ''
        }

        <div class="preco-atual">

          ${formatarMoeda(p.preco)}

          ${
            p.desconto_percentual
              ? `<span class="badge-desconto">
                   ↓ ${p.desconto_percentual}%
                 </span>`
              : ''
          }

        </div>

      </td>


      <td class="cel-estoque">
        ${p.estoque}
      </td>


      <td class="cel-acoes">

        <button
          type="button"
          class="link-acao"
          data-acao="editar"
        >
          editar
        </button>

        <button
          type="button"
          class="link-acao excluir"
          data-acao="excluir"
        >
          excluir
        </button>

      </td>

    </tr>

  `).join('');


  produtosWrapEl.innerHTML = `

    <table>

      <thead>

        <tr>
          <th>Produto</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th></th>
        </tr>

      </thead>

      <tbody>
        ${linhas}
      </tbody>

    </table>

  `;


  produtosWrapEl
    .querySelectorAll('tr[data-id]')
    .forEach((linha) => {

      const id =
        linha.dataset.id;

      const produto =
        produtos.find(
          (p) =>
            String(p.id) === id
        );


      linha
        .querySelector(
          '[data-acao="editar"]'
        )
        .addEventListener(
          'click',
          () => {

            entrarModoEdicao(produto);

            window.scrollTo({
              top:0,
              behavior:'smooth'
            });

          }
        );


      linha
        .querySelector(
          '[data-acao="excluir"]'
        )
        .addEventListener(
          'click',
          () => {

            excluirProduto(
              id,
              produto.nome
            );

          }
        );

    });

}


async function excluirProduto(id, nome){

  if(
    !confirm(
      `Remover "${nome}" do catálogo?`
    )
  ) return;


  try{

    const resp =
      await fetch(
        `${API_PRODUTOS}/${id}`,
        {
          method:'DELETE'
        }
      );


    const dados =
      await resp.json();


    if(!resp.ok){

      throw new Error(
        dados.erro ||
        'Não foi possível remover o produto.'
      );

    }


    carregarProdutos();


  }catch(erro){

    console.error(erro);

    alert(erro.message);

  }

}


/* =========================================================
   PEDIDOS
========================================================= */

const pedidosWrapEl =
  document.getElementById('pedidos-wrap');

const estadoPedidosEl =
  document.getElementById('estado-pedidos');

const contagemPedidosEl =
  document.getElementById('contagem-pedidos');

const filtrosPedidosEl =
  document.getElementById('filtros-pedidos');

const btnAtualizarPedidos =
  document.getElementById(
    'btn-atualizar-pedidos'
  );


let pedidos = [];

let filtroPedidoAtual = 'todos';

let pedidosCarregados = false;

let pedidoAbertoId = null;


function classeBadge(status){

  if(!status) return 'outro';

  const chave =
    status.toLowerCase();

  const permitidos = [

    'pendente',
    'approved',
    'aprovado',
    'rejected',
    'rejeitado',
    'cancelled',
    'cancelado',
    'in_process',
    'em_processo'

  ];

  return permitidos.includes(chave)
    ? chave
    : 'outro';

}


async function carregarPedidos(){

  estadoPedidosEl.className =
    'estado';

  estadoPedidosEl.textContent =
    'carregando pedidos…';

  pedidosWrapEl.innerHTML = '';

  pedidosWrapEl.appendChild(
    estadoPedidosEl
  );


  try{

    const resp =
      await fetch(API_PEDIDOS);


    if(!resp.ok){

      throw new Error(
        'Falha ao buscar pedidos.'
      );

    }


    pedidos =
      await resp.json();

    pedidosCarregados = true;

    renderizarPedidos();


  }catch(erro){

    console.error(erro);

    estadoPedidosEl.className =
      'estado erro';

    estadoPedidosEl.textContent =
      'não foi possível carregar os pedidos. verifique se o servidor está no ar.';

  }

}


function renderizarPedidos(){

  const filtrados =
    filtroPedidoAtual === 'todos'

      ? pedidos

      : pedidos.filter(
          (p) =>
            (p.status_pagamento || '')
              .toLowerCase() ===
            filtroPedidoAtual
        );


  if(
    !Array.isArray(pedidos) ||
    pedidos.length === 0
  ){

    pedidosWrapEl.innerHTML =
      '<div class="estado">nenhum pedido registrado ainda</div>';

    contagemPedidosEl.textContent = '';

    return;

  }


  if(filtrados.length === 0){

    pedidosWrapEl.innerHTML =
      '<div class="estado">nenhum pedido com esse status</div>';

    contagemPedidosEl.textContent =
      '0 de ' + pedidos.length;

    return;

  }


  contagemPedidosEl.textContent =
    filtrados.length +
    ' de ' +
    pedidos.length;


  const linhas =
    filtrados.map((p) => {

      const aberta =
        String(p.id) ===
        String(pedidoAbertoId);


      return `

        <tr
          class="linha-pedido ${aberta ? 'aberta' : ''}"
          data-id="${p.id}"
        >

          <td class="cel-toggle">
            <span class="seta">▶</span>
          </td>


          <td class="cel-id">
            #${p.id}
          </td>


          <td class="cel-nome">

            <div class="nome">
              ${escapeHtml(
                p.nome_completo || '—'
              )}
            </div>

            <div class="descricao">
              ${escapeHtml(
                p.email || ''
              )}
            </div>

          </td>


          <td class="cel-preco">
            ${formatarMoeda(
              p.valor_total
            )}
          </td>


          <td>

            <span
              class="badge ${classeBadge(
                p.status_pagamento
              )}"
            >
              ${
                p.status_pagamento ||
                'sem status'
              }
            </span>

          </td>


          <td class="cel-data-criacao">
            ${formatarData(
              p.criado_em
            )}
          </td>

        </tr>


        <tr
          class="linha-detalhe ${aberta ? 'aberta' : ''}"
          data-detalhe-id="${p.id}"
        >

          <td colspan="6">

            <div class="detalhe-conteudo">


              <div class="detalhe-secao">

                <div class="detalhe-titulo">
                  Comprador
                </div>


                <div class="detalhe-grid">

                  <div class="detalhe-item">

                    <div class="rotulo">
                      CPF/CNPJ
                    </div>

                    <div class="valor mono">
                      ${escapeHtml(
                        p.cpf_cnpj || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Telefone
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.telefone || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Data de nascimento
                    </div>

                    <div class="valor">
                      ${formatarDataSimples(
                        p.data_nascimento
                      )}
                    </div>

                  </div>

                </div>

              </div>


              <div class="detalhe-secao">

                <div class="detalhe-titulo">
                  Endereço de entrega
                </div>


                <div class="detalhe-grid">


                  <div class="detalhe-item">

                    <div class="rotulo">
                      CEP
                    </div>

                    <div class="valor mono">
                      ${escapeHtml(
                        p.cep || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      País
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.pais || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Cidade / Estado
                    </div>

                    <div class="valor">

                      ${escapeHtml(
                        p.cidade || '—'
                      )}

                      ${
                        p.estado
                          ? ' / ' +
                            escapeHtml(
                              p.estado
                            )
                          : ''
                      }

                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Bairro
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.bairro || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Rua / Número
                    </div>

                    <div class="valor">

                      ${escapeHtml(
                        p.rua || '—'
                      )},

                      ${escapeHtml(
                        p.numero || '—'
                      )}

                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Complemento
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.complemento || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Ponto de referência
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.ponto_referencia || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Destinatário
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.nome_destinatario || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Telefone de entrega
                    </div>

                    <div class="valor">
                      ${escapeHtml(
                        p.telefone_entrega || '—'
                      )}
                    </div>

                  </div>


                </div>

              </div>


              <div class="detalhe-secao">

                <div class="detalhe-titulo">
                  Itens do pedido
                </div>


                <div class="detalhe-itens">

                  ${
                    Array.isArray(p.itens) &&
                    p.itens.length > 0

                      ? p.itens.map(
                          (item) => `

                            <div class="item-linha">

                              <span>
                                ${escapeHtml(
                                  item.titulo
                                )}

                                ×

                                ${item.quantidade}
                              </span>

                              <span class="mono">
                                ${formatarMoeda(
                                  item.preco
                                )}
                              </span>

                            </div>

                          `
                        ).join('')

                      : `
                        <div class="detalhe-item"
                             style="padding:13px">

                          <div class="valor">
                            itens não disponíveis
                          </div>

                        </div>
                      `
                  }

                </div>

              </div>


              <div class="detalhe-secao">

                <div class="detalhe-grid">


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Payment ID
                    </div>

                    <div class="valor mono">
                      ${escapeHtml(
                        p.payment_id || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Preference ID
                    </div>

                    <div class="valor mono">
                      ${escapeHtml(
                        p.preference_id || '—'
                      )}
                    </div>

                  </div>


                  <div class="detalhe-item">

                    <div class="rotulo">
                      Criado em
                    </div>

                    <div class="valor mono">
                      ${formatarData(
                        p.criado_em
                      )}
                    </div>

                  </div>


                </div>

              </div>


            </div>

          </td>

        </tr>

      `;

    }).join('');


  pedidosWrapEl.innerHTML = `

    <table>

      <thead>

        <tr>

          <th></th>
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Valor</th>
          <th>Status</th>
          <th>Data</th>

        </tr>

      </thead>


      <tbody>
        ${linhas}
      </tbody>

    </table>

  `;


  pedidosWrapEl
    .querySelectorAll('.linha-pedido')
    .forEach((linha) => {

      linha.addEventListener(
        'click',
        () => {

          const id =
            linha.dataset.id;

          pedidoAbertoId =
            pedidoAbertoId === id
              ? null
              : id;

          renderizarPedidos();

        }
      );

    });

}


filtrosPedidosEl.addEventListener(
  'click',
  (evento) => {

    const botao =
      evento.target.closest(
        '.filtro-btn'
      );

    if(!botao) return;


    filtrosPedidosEl
      .querySelectorAll('.filtro-btn')
      .forEach(
        (b) =>
          b.classList.remove('ativo')
      );


    botao.classList.add('ativo');

    filtroPedidoAtual =
      botao.dataset.status;

    pedidoAbertoId = null;

    renderizarPedidos();

  }
);


btnAtualizarPedidos.addEventListener(
  'click',
  carregarPedidos
);


/* =========================================================
   INÍCIO
========================================================= */

carregarProdutos();

