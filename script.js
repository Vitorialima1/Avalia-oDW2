// ================================
// CLASSE PRODUTO
// ================================

class Produto {

    constructor(id, nome, descricao, preco, categoria, imagem) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.imagem = imagem;
    }

}


const Volt = [

    {
        titulo: "A cultura que ocupa espaços e transforma a cidade",
        categoria: "Cultura",
        autor: "Marina Alves",
        data: "05/10/2026",

        imagem:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",

        alt:
            "Público reunido em um show com iluminação colorida"
    },


    {
        titulo: "Novos artistas independentes ganham espaço nos palcos",
        categoria: "Música",
        autor: "Lucas Mendes",
        data: "04/10/2026",

        imagem:
            "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",

        alt:
            "Pessoa cantando em um palco diante de um público"
    },


    {
        titulo: "Tecnologia aproxima jovens da produção audiovisual",
        categoria: "Tecnologia",
        autor: "Rafaela Souza",
        data: "03/10/2026",

        imagem:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",

        alt:
            "Pessoa utilizando um notebook em uma mesa"
    },


    {
        titulo: "Feiras literárias fortalecem novos autores brasileiros",
        categoria: "Literatura",
        autor: "João Oliveira",
        data: "02/10/2026",

        imagem:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",

        alt:
            "Estantes cheias de livros em uma biblioteca"
    },


    {
        titulo: "Cinema nacional recebe novas produções independentes",
        categoria: "Cinema",
        autor: "Camila Santos",
        data: "01/10/2026",

        imagem:
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",

        alt:
            "Sala de cinema com tela iluminada"
    },


    {
        titulo: "Arte urbana transforma muros em galerias a céu aberto",
        categoria: "Cultura",
        autor: "Pedro Lima",
        data: "30/09/2026",

        imagem:
            "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80",

        alt:
            "Mural colorido de arte urbana em uma parede"
    },


    {
        titulo: "Bibliotecas comunitárias criam novos pontos de encontro",
        categoria: "Cidade",
        autor: "Ana Costa",
        data: "29/09/2026",

        imagem:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",

        alt:
            "Pessoa lendo um livro em uma biblioteca"
    },


    {
        titulo: "Criadores digitais reinventam formas de contar histórias",
        categoria: "Tecnologia",
        autor: "Diego Martins",
        data: "28/09/2026",

        imagem:
            "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80",

        alt:
            "Pessoa trabalhando em um computador para produção digital"
    }

];


// ================================
// ITEM DO CARRINHO
// ================================

class ItemCarrinho {

    constructor(produto, quantidade = 1) {
        this.produto = produto;
        this.quantidade = quantidade;
    }

    subtotal() {
        return this.produto.preco * this.quantidade;
    }

}


// ================================
// CARRINHO
// ================================

class Carrinho {

    constructor() {
        this.itens = [];
    }

    adicionar(produto) {

        const item = this.itens.find(
            item => item.produto.id === produto.id
        );

        if (item) {
            item.quantidade++;
        } else {
            this.itens.push(
                new ItemCarrinho(produto)
            );
        }
    }

    aumentar(id) {

        const item = this.itens.find(
            item => item.produto.id === id
        );

        if (item) {
            item.quantidade++;
        }
    }

    diminuir(id) {

        const item = this.itens.find(
            item => item.produto.id === id
        );

        if (!item) return;

        item.quantidade--;

        if (item.quantidade <= 0) {
            this.remover(id);
        }
    }

    remover(id) {

        this.itens = this.itens.filter(
            item => item.produto.id !== id
        );
    }

    limpar() {
        this.itens = [];
    }

    subtotal() {

        return this.itens.reduce(
            (total, item) => total + item.subtotal(),
            0
        );
    }

    taxaEntrega(tipoEntrega) {

        if (tipoEntrega === "delivery") {
            return 2.50;
        }

        return 0;
    }

    total(tipoEntrega) {

        return this.subtotal() +
            this.taxaEntrega(tipoEntrega);
    }

}


// ================================
// PEDIDO
// ================================

class Pedido {

    constructor(cliente, itens, tipoEntrega, total) {

        this.cliente = cliente;
        this.itens = itens;
        this.tipoEntrega = tipoEntrega;
        this.total = total;
        this.status = "Recebido";
        this.data = new Date();

    }

}


// ================================
// GERENCIADOR
// ================================

class Gerenciador {

    constructor() {
        this.produtos = [];
        this.pedidos = [];
    }

    // CREATE

    adicionarProduto(produto) {
        this.produtos.push(produto);
    }

    // READ

    listarProdutos() {
        return this.produtos;
    }

    // UPDATE

    editarProduto(id, dados) {

        const produto = this.produtos.find(
            produto => produto.id === id
        );

        if (!produto) return;

        produto.nome = dados.nome;
        produto.descricao = dados.descricao;
        produto.preco = dados.preco;
        produto.categoria = dados.categoria;
        produto.imagem = dados.imagem;
    }

    // DELETE

    excluirProduto(id) {

        this.produtos = this.produtos.filter(
            produto => produto.id !== id
        );
    }

    adicionarPedido(pedido) {
        this.pedidos.push(pedido);
    }

}


// ================================
// OBJETOS PRINCIPAIS
// ================================

const gerenciador = new Gerenciador();

const carrinho = new Carrinho();


// ================================
// PRODUTOS INICIAIS
// ================================

gerenciador.adicionarProduto(
    new Produto(
        1,
        "Audio",
        "Fone de ouvido",
        25,
        "Lanches",
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"
    )
);

gerenciador.adicionarProduto(
    new Produto(
        2,
        "Audio",
        "Fone de ouvido",
        42,
        "Pizzas",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800"
    )
);

gerenciador.adicionarProduto(
    new Produto(
        3,
        " Especial",
        "Especial",
        35,
        "Massas",
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800"
    )
);


// ================================
// ELEMENTOS HTML
// ================================

const listaProdutos =
    document.getElementById("listaProdutos");

const listaCarrinho =
    document.getElementById("listaCarrinho");

const subtotalElemento =
    document.getElementById("subtotal");

const taxaElemento =
    document.getElementById("taxa");

const totalElemento =
    document.getElementById("total");

const tipoEntrega =
    document.getElementById("tipoEntrega");


// ================================
// READ - MOSTRAR PRODUTOS
// ================================

function mostrarProdutos() {

    listaProdutos.innerHTML = "";

    gerenciador.listarProdutos().forEach(produto => {

        const div = document.createElement("div");

        div.className = "produto";

        div.innerHTML = `

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >

            <h3>${produto.nome}</h3>

            <p>${produto.descricao}</p>

            <p>
                Categoria: ${produto.categoria}
            </p>

            <p class="preco">
                R$ ${produto.preco.toFixed(2)}
            </p>

            <button onclick="adicionarAoCarrinho(${produto.id})">
                Adicionar ao carrinho
            </button>

            <button onclick="editarProduto(${produto.id})">
                Editar
            </button>

            <button onclick="excluirProduto(${produto.id})">
                Excluir
            </button>

        `;

        listaProdutos.appendChild(div);

    });

}


// ================================
// ADICIONAR AO CARRINHO
// ================================

function adicionarAoCarrinho(id) {

    const produto =
        gerenciador.produtos.find(
            produto => produto.id === id
        );

    if (!produto) return;

    carrinho.adicionar(produto);

    atualizarCarrinho();

    alert("Produto adicionado ao carrinho!");

}


// ================================
// MOSTRAR CARRINHO
// ================================

function atualizarCarrinho() {

    listaCarrinho.innerHTML = "";

    carrinho.itens.forEach(item => {

        const div = document.createElement("div");

        div.className = "item-carrinho";

        div.innerHTML = `

            <div>

                <strong>
                    ${item.produto.nome}
                </strong>

                <p>
                    R$ ${item.subtotal().toFixed(2)}
                </p>

            </div>

            <div class="quantidade">

                <button
                    onclick="diminuirItem(${item.produto.id})"
                >
                    -
                </button>

                <span>
                    ${item.quantidade}
                </span>

                <button
                    onclick="aumentarItem(${item.produto.id})"
                >
                    +
                </button>

                <button
                    onclick="removerItem(${item.produto.id})"
                >
                    Remover
                </button>

            </div>
        `;

        listaCarrinho.appendChild(div);

    });

    atualizarTotal();

}


// ================================
// AUMENTAR
// ================================

function aumentarItem(id) {

    carrinho.aumentar(id);

    atualizarCarrinho();

}


// ================================
// DIMINUIR
// ================================

function diminuirItem(id) {

    carrinho.diminuir(id);

    atualizarCarrinho();

}


// ================================
// REMOVER
// ================================

function removerItem(id) {

    const confirmar =
        confirm("Deseja remover este item?");

    if (!confirmar) return;

    carrinho.remover(id);

    atualizarCarrinho();

}


// ================================
// ATUALIZAR TOTAL
// ================================

function atualizarTotal() {

    const subtotal =
        carrinho.subtotal();

    const taxa =
        carrinho.taxaEntrega(
            tipoEntrega.value
        );

    const total =
        carrinho.total(
            tipoEntrega.value
        );

    subtotalElemento.textContent =
        `R$ ${subtotal.toFixed(2)}`;

    taxaElemento.textContent =
        `R$ ${taxa.toFixed(2)}`;

    totalElemento.textContent =
        `R$ ${total.toFixed(2)}`;

}


tipoEntrega.addEventListener(
    "change",
    atualizarTotal
);


// ================================
// CREATE - CADASTRAR PRODUTO
// ================================

document
    .getElementById("formProduto")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const novoProduto =
            new Produto(

                Date.now(),

                document
                    .getElementById("nomeProduto")
                    .value,

                document
                    .getElementById("descricaoProduto")
                    .value,

                Number(
                    document
                        .getElementById("precoProduto")
                        .value
                ),

                document
                    .getElementById("categoriaProduto")
                    .value,

                document
                    .getElementById("imagemProduto")
                    .value
            );

        gerenciador.adicionarProduto(
            novoProduto
        );

        mostrarProdutos();

        this.reset();

        alert("Produto cadastrado com sucesso!");

    });


// ================================
// UPDATE - EDITAR PRODUTO
// ================================

function editarProduto(id) {

    const produto =
        gerenciador.produtos.find(
            produto => produto.id === id
        );

    if (!produto) return;

    const novoNome =
        prompt(
            "Digite o novo nome:",
            produto.nome
        );

    if (!novoNome) return;

    const novoPreco =
        Number(
            prompt(
                "Digite o novo preço:",
                produto.preco
            )
        );

    gerenciador.editarProduto(
        id,
        {
            nome: novoNome,
            descricao: produto.descricao,
            preco: novoPreco,
            categoria: produto.categoria,
            imagem: produto.imagem
        }
    );

    mostrarProdutos();

    alert("Produto atualizado!");

}


// ================================
// DELETE - EXCLUIR PRODUTO
// ================================

function excluirProduto(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este produto?"
        );

    if (!confirmar) return;

    gerenciador.excluirProduto(id);

    mostrarProdutos();

    alert("Produto excluído!");

}


// ================================
// FINALIZAR PEDIDO
// ================================

document
    .getElementById("finalizar")
    .addEventListener("click", function() {

        const nome =
            document
                .getElementById("nomeCliente")
                .value
                .trim();

        if (!nome) {

            alert("Digite o nome do cliente.");

            return;
        }

        if (carrinho.itens.length === 0) {

            alert("Adicione pelo menos um produto.");

            return;
        }

        const pedido =
            new Pedido(

                nome,

                [...carrinho.itens],

                tipoEntrega.value,

                carrinho.total(
                    tipoEntrega.value
                )
            );

        gerenciador.adicionarPedido(
            pedido
        );

        alert(
            `Pedido realizado com sucesso!\n\n` +
            `Cliente: ${pedido.cliente}\n` +
            `Total: R$ ${pedido.total.toFixed(2)}`
        );

        carrinho.limpar();

        atualizarCarrinho();

    });


// ================================
// CARROSSEL
// ================================

let slideAtual = 0;


function mostrarSlide() {

    const produtos =
        gerenciador.produtos;

    if (produtos.length === 0) {

        document.getElementById("slide").innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        return;
    }

    const produto =
        produtos[slideAtual];

    document.getElementById("slide").innerHTML = `

        <img
            src="${produto.imagem}"
            alt="${produto.nome}"
        >

        <h3>${produto.nome}</h3>

        <p>${produto.descricao}</p>

        <strong>
            R$ ${produto.preco.toFixed(2)}
        </strong>

        <br>

        <button
            onclick="adicionarAoCarrinho(${produto.id})"
        >
            Adicionar ao carrinho
        </button>
    `;
}


document
    .getElementById("anterior")
    .addEventListener("click", function() {

        slideAtual--;

        if (slideAtual < 0) {

            slideAtual =
                gerenciador.produtos.length - 1;
        }

        mostrarSlide();

    });


document
    .getElementById("proximo")
    .addEventListener("click", function() {

        slideAtual++;

        if (
            slideAtual >=
            gerenciador.produtos.length
        ) {

            slideAtual = 0;
        }

        mostrarSlide();

    });


// ================================
// INICIALIZAÇÃO
// ================================

mostrarProdutos();

mostrarSlide();

atualizarCarrinho();