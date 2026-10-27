// ================================
// CATÁLOGO (array de objetos)
// ================================
const CORES = {
    "Áudio": "#6D28D9",
    "Acessórios": "#0EA5E9",
    "Casa": "#059669",
    "Vestível": "#DB2777"
};

const produtos = [
    { id: 1,  nome: "Fone Bluetooth Aura",       categoria: "Áudio",      preco: 299.90, avaliacao: 4.6 },
    { id: 2,  nome: "Caixa de Som Portátil Pulse", categoria: "Áudio",    preco: 189.90, avaliacao: 4.4 },
    { id: 3,  nome: "Teclado Mecânico K2",       categoria: "Acessórios", preco: 349.90, avaliacao: 4.8 },
    { id: 4,  nome: "Mouse Sem Fio Glide",       categoria: "Acessórios", preco: 129.90, avaliacao: 4.3 },
    { id: 5,  nome: "Smartwatch Fit Move",       categoria: "Vestível",   preco: 459.90, avaliacao: 4.5 },
    { id: 6,  nome: "Carregador Rápido 65W",     categoria: "Acessórios", preco: 149.90, avaliacao: 4.7 },
    { id: 7,  nome: "Luminária LED Lumen",       categoria: "Casa",       preco: 219.90, avaliacao: 4.2 },
    { id: 8,  nome: "Webcam Full HD Clara",      categoria: "Acessórios", preco: 199.90, avaliacao: 4.1 },
    { id: 9,  nome: "Hub USB-C 7 em 1",          categoria: "Acessórios", preco: 259.90, avaliacao: 4.6 },
    { id: 10, nome: "Fone com Fio Studio",       categoria: "Áudio",      preco: 99.90,  avaliacao: 4.0 },
    { id: 11, nome: "Suporte de Notebook Ergo",  categoria: "Casa",       preco: 139.90, avaliacao: 4.5 },
    { id: 12, nome: "Pulseira Fit Band",         categoria: "Vestível",   preco: 179.90, avaliacao: 4.4 }
];

// Imagem gerada em SVG (gradiente + inicial da categoria)
function imagemProduto(produto) {
    const cor = CORES[produto.categoria];
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="#181A2A"/>` +
        `</linearGradient></defs>` +
        `<rect width="400" height="300" fill="url(#g)"/>` +
        `<rect x="140" y="90" width="120" height="120" rx="28" fill="#fff" fill-opacity=".2"/>` +
        `<text x="200" y="175" font-family="Arial" font-size="80" font-weight="700" ` +
        `fill="#fff" text-anchor="middle">${produto.categoria[0]}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// ================================
// ESTADO
// ================================
const CHAVE_CARRINHO = "zapp-carrinho";
const CHAVE_TEMA = "zapp-tema";
const FRETE_GRATIS_ACIMA = 199;
const VALOR_FRETE = 19.90;
const CUPONS = { BEMVINDO10: 0.10 };

let carrinho = [];            // [{ id, quantidade }]
let cupomAtivo = null;
let categoriaAtual = "Todos";

// ================================
// ELEMENTOS
// ================================
const $ = (id) => document.getElementById(id);

const grade = $("grade");
const resultado = $("resultado");
const busca = $("busca");
const ordenar = $("ordenar");
const listaCarrinho = $("listaCarrinho");
const contador = $("contador");
const drawer = $("carrinho");
const overlay = $("overlay");
const toastEl = $("toast");

// ================================
// UTILITÁRIOS
// ================================
const reais = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function estrelas(nota) {
    const cheias = Math.round(nota);
    return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

let toastTimer;
function toast(mensagem) {
    toastEl.textContent = mensagem;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ================================
// CATÁLOGO: filtro, busca e ordenação
// ================================
function produtosVisiveis() {
    const termo = busca.value.trim().toLowerCase();

    const lista = produtos.filter((p) =>
        (categoriaAtual === "Todos" || p.categoria === categoriaAtual) &&
        p.nome.toLowerCase().includes(termo)
    );

    switch (ordenar.value) {
        case "menor":     lista.sort((a, b) => a.preco - b.preco); break;
        case "maior":     lista.sort((a, b) => b.preco - a.preco); break;
        case "avaliacao": lista.sort((a, b) => b.avaliacao - a.avaliacao); break;
    }

    return lista;
}

function renderProdutos() {
    const lista = produtosVisiveis();

    resultado.textContent =
        `${lista.length} produto${lista.length === 1 ? "" : "s"}`;

    if (lista.length === 0) {
        grade.innerHTML = `<p class="empty">Nenhum produto encontrado.</p>`;
        return;
    }

    grade.innerHTML = lista.map((p) => `
        <article class="card">
            <img src="${imagemProduto(p)}"
                 alt="${p.nome}, produto da categoria ${p.categoria}"
                 loading="lazy">
            <div class="card-body">
                <span class="tag" style="background:${CORES[p.categoria]}">${p.categoria}</span>
                <h3>${p.nome}</h3>
                <p class="rating" aria-label="Avaliação ${p.avaliacao} de 5">
                    ${estrelas(p.avaliacao)}<span>${p.avaliacao.toFixed(1)}</span>
                </p>
                <p class="price">${reais(p.preco)}</p>
                <button type="button" class="btn btn-primary" data-add="${p.id}">Adicionar</button>
            </div>
        </article>
    `).join("");
}

function definirCategoria(categoria) {
    categoriaAtual = categoria;

    document.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.toggle("active", chip.dataset.categoria === categoria);
    });

    renderProdutos();
}

// ================================
// CARRINHO
// ================================
function salvarCarrinho() {
    try {
        localStorage.setItem(CHAVE_CARRINHO, JSON.stringify({ carrinho, cupomAtivo }));
    } catch (e) { /* localStorage indisponível */ }
}

function carregarCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
        if (dados && Array.isArray(dados.carrinho)) {
            carrinho = dados.carrinho.filter((i) => produtos.some((p) => p.id === i.id));
            cupomAtivo = dados.cupomAtivo in CUPONS ? dados.cupomAtivo : null;
        }
    } catch (e) { /* dados inválidos */ }
}

function adicionar(id) {
    const item = carrinho.find((i) => i.id === id);

    if (item) item.quantidade++;
    else carrinho.push({ id, quantidade: 1 });

    const produto = produtos.find((p) => p.id === id);
    toast(`${produto.nome} adicionado ao carrinho`);
    atualizarCarrinho();
}

function alterarQuantidade(id, delta) {
    const item = carrinho.find((i) => i.id === id);
    if (!item) return;

    item.quantidade += delta;

    if (item.quantidade <= 0) remover(id);
    else atualizarCarrinho();
}

function remover(id) {
    carrinho = carrinho.filter((i) => i.id !== id);
    atualizarCarrinho();
}

function calcularTotais() {
    const subtotal = carrinho.reduce((soma, item) => {
        const produto = produtos.find((p) => p.id === item.id);
        return soma + produto.preco * item.quantidade;
    }, 0);

    const desconto = cupomAtivo ? subtotal * CUPONS[cupomAtivo] : 0;
    const base = subtotal - desconto;
    const frete = carrinho.length === 0 || base >= FRETE_GRATIS_ACIMA ? 0 : VALOR_FRETE;

    return { subtotal, desconto, frete, total: base + frete };
}

function atualizarCarrinho() {
    // Itens
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = `<p class="empty-cart">Seu carrinho está vazio.</p>`;
    } else {
        listaCarrinho.innerHTML = carrinho.map((item) => {
            const p = produtos.find((prod) => prod.id === item.id);
            return `
                <div class="cart-item">
                    <img src="${imagemProduto(p)}" alt="${p.nome}">
                    <div>
                        <h3>${p.nome}</h3>
                        <p class="unit">${reais(p.preco)} cada</p>
                        <div class="qty">
                            <button type="button" data-menos="${p.id}" aria-label="Diminuir quantidade de ${p.nome}">−</button>
                            <span aria-live="polite">${item.quantidade}</span>
                            <button type="button" data-mais="${p.id}" aria-label="Aumentar quantidade de ${p.nome}">+</button>
                        </div>
                    </div>
                    <div class="side">
                        <span>${reais(p.preco * item.quantidade)}</span>
                        <button type="button" class="remove" data-remover="${p.id}">Remover</button>
                    </div>
                </div>`;
        }).join("");
    }

    // Totais
    const t = calcularTotais();
    $("subtotal").textContent = reais(t.subtotal);
    $("desconto").textContent = "− " + reais(t.desconto);
    $("frete").textContent = t.frete === 0 && carrinho.length > 0 ? "Grátis" : reais(t.frete);
    $("total").textContent = reais(t.total);

    // Contador do ícone
    contador.textContent = carrinho.reduce((soma, i) => soma + i.quantidade, 0);

    salvarCarrinho();
}

// ================================
// DRAWER
// ================================
function abrirCarrinho() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    $("fecharCarrinho").focus();
}

function fecharCarrinho() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    $("btnCarrinho").focus();
}

// ================================
// CUPOM
// ================================
function aplicarCupom() {
    const codigo = $("cupom").value.trim().toUpperCase();
    const msg = $("msgCupom");

    if (codigo in CUPONS) {
        cupomAtivo = codigo;
        msg.textContent = `Cupom ${codigo} aplicado: ${CUPONS[codigo] * 100}% de desconto.`;
        msg.className = "form-msg ok";
    } else {
        cupomAtivo = null;
        msg.textContent = "Cupom inválido.";
        msg.className = "form-msg erro";
    }

    atualizarCarrinho();
}

// ================================
// TEMA CLARO / ESCURO
// ================================
function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    $("btnTema").textContent = tema === "dark" ? "☀️" : "🌙";
}

function iniciarTema() {
    let tema = null;
    try { tema = localStorage.getItem(CHAVE_TEMA); } catch (e) { }

    if (!tema) {
        tema = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    aplicarTema(tema);
}

function alternarTema() {
    const novo = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    aplicarTema(novo);
    try { localStorage.setItem(CHAVE_TEMA, novo); } catch (e) { }
}

// ================================
// EVENTOS
// ================================
grade.addEventListener("click", (e) => {
    const botao = e.target.closest("[data-add]");
    if (botao) adicionar(Number(botao.dataset.add));
});

listaCarrinho.addEventListener("click", (e) => {
    const mais = e.target.closest("[data-mais]");
    const menos = e.target.closest("[data-menos]");
    const rem = e.target.closest("[data-remover]");

    if (mais) alterarQuantidade(Number(mais.dataset.mais), 1);
    if (menos) alterarQuantidade(Number(menos.dataset.menos), -1);
    if (rem) remover(Number(rem.dataset.remover));
});

$("filtros").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) definirCategoria(chip.dataset.categoria);
});

document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => definirCategoria(link.dataset.categoria));
});

busca.addEventListener("input", renderProdutos);
ordenar.addEventListener("change", renderProdutos);

$("btnCarrinho").addEventListener("click", abrirCarrinho);
$("fecharCarrinho").addEventListener("click", fecharCarrinho);
overlay.addEventListener("click", fecharCarrinho);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) fecharCarrinho();
});

$("aplicarCupom").addEventListener("click", aplicarCupom);
$("btnTema").addEventListener("click", alternarTema);

$("finalizar").addEventListener("click", () => {
    if (carrinho.length === 0) {
        toast("Adicione pelo menos um produto.");
        return;
    }

    const { total } = calcularTotais();
    alert(`Pedido realizado com sucesso!\n\nTotal: ${reais(total)}`);

    carrinho = [];
    cupomAtivo = null;
    $("cupom").value = "";
    $("msgCupom").textContent = "";
    atualizarCarrinho();
    fecharCarrinho();
});

// Newsletter com validação de e-mail
$("formNews").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = $("emailNews").value.trim();
    const msg = $("msgNews");
    const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (valido) {
        msg.textContent = "Pronto! Use o cupom BEMVINDO10 no carrinho.";
        msg.className = "form-msg ok";
        e.target.reset();
        toast("Inscrição realizada!");
    } else {
        msg.textContent = "Digite um e-mail válido.";
        msg.className = "form-msg erro";
    }
});

// ================================
// INICIALIZAÇÃO
// ================================
iniciarTema();
carregarCarrinho();
renderProdutos();
atualizarCarrinho();
