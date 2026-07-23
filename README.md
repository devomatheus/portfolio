# Portfólio — Matheus Martins

Portfólio pessoal interativo em formato de **mapa de fases**, inspirado em jogos de plataforma. Cada fase representa um projeto, e o visitante navega pelo mapa arrastando a tela, usando as setas de navegação ou os pontos de atalho no rodapé.

## Funcionalidades

- **Mapa navegável** com trilha em SVG desenhada dinamicamente entre as fases (curva suave via Catmull-Rom → Bézier).
- **Personagem animado** que se move ao longo da trilha, com câmera que acompanha o deslocamento.
- **Progresso persistente** salvo no `localStorage`, marcando fases já visitadas.
- **Modal de projeto** com título, descrição, tecnologias utilizadas e link para o projeto (quando disponível).
- **Efeitos sonoros sintetizados** via Web Audio API (sem arquivos de áudio externos), com opção de mudo.
- **Navegação por teclado** (setas, Enter/Espaço, Esc) e por arraste do mouse.
- Layout **responsivo** para diferentes tamanhos de tela.

## Tecnologias

- HTML5 + CSS3 (variáveis CSS para a paleta de cores)
- JavaScript (jQuery)
- [GSAP](https://gsap.com/) para animações
- SVG para o desenho da trilha
- Font Awesome (ícones) e Google Fonts (Press Start 2P + Poppins)

## Paleta de cores

| Cor         | Hex       |
| ----------- | --------- |
| Laranja     | `#FF8200` |
| Cinza       | `#6f7072` |
| Cinza claro | `#ecedec` |

## Licença

Distribuído sob os termos definidos em [LICENSE](LICENSE).
