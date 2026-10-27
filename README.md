# Zapp — Loja virtual de eletrônicos

Projeto da Prova Prática de Web 2 (HTML, CSS e JavaScript puro, sem bibliotecas).

## Recursos

- Carrinho funcional: adicionar, alterar quantidade, remover, total em R$ e contador no ícone
- Carrinho lateral (drawer) com overlay
- Filtro por categoria, busca por nome e ordenação (preço e avaliação)
- Tema claro/escuro (respeita a preferência do sistema)
- Toast e validação de e-mail na newsletter
- **Bônus:** carrinho salvo em `localStorage`, cupom `BEMVINDO10` (10%) e frete (grátis acima de R$ 199)

## Design

### Paleta

| Variável | Hex | Uso |
|---|---|---|
| `--paper` | `#FFFFFF` | Fundo da página |
| `--ink` | `#181A2A` | Texto principal |
| `--slate` | `#6B7280` | Texto secundário |
| `--mist` | `#F3F4F6` | Superfícies suaves |
| `--line` | `#E5E7EB` | Linhas e bordas |
| `--accent` | `#6D28D9` | Marca e botões |
| `--price` | `#059669` | Preços |
| `--star` | `#F59E0B` | Estrelas de avaliação |

Categorias: Áudio `#6D28D9` · Acessórios `#0EA5E9` · Casa `#059669` · Vestível `#DB2777`

### Fontes (Google Fonts)

- **Space Grotesk** — logotipo, títulos e preços
- **Inter** — corpo, navegação, botões e campos

### Imagens

As imagens dos produtos são geradas por código em SVG (gradiente + inicial da categoria), então não dependem de arquivos externos. Ícones são emojis nativos.

## Como executar

Abra o `index.html` no navegador.
