$(function () {
  "use strict";

  /* =========================================================
     DADOS DAS FASES
     Edite os campos titulo / subtitulo / descricao / tecnologias / link
     de cada fase quando o projeto correspondente estiver pronto.
  ========================================================= */
  var FASES = [
    {
      x: 220, y: 560, icone: "fa-tractor", titulo: "Agrox",
      subtitulo: "Gestão agropecuária",
      descricao: "Sistema de gestão agropecuária que centraliza, em um único painel, as informações do dia a dia de uma propriedade rural — plantio, insumos, manejo, máquinas, produção, criação e solo — hoje espalhadas em cadernos, planilhas e conversas soltas. Traz previsão do tempo, calendário integrado com todos os módulos, contatos de emergência e assistente virtual, com acesso rápido em qualquer dispositivo, inclusive no celular durante o trabalho no campo.",
      tecnologias: ["Web"],
      link: "https://devomatheus.github.io/agrox-frontend/"
    },
    {
      x: 900, y: 380, icone: "fa-newspaper", titulo: "Automação DOU",
      subtitulo: "Extração do Diário Oficial da União",
      descricao: "Automação em Python que coleta, baixa e consolida diariamente as publicações da Seção 1 do Diário Oficial da União, gerando um arquivo Markdown pronto para leitura ou análise. Roda em três etapas sequenciais — consulta e salva metadados sem duplicatas, baixa o conteúdo completo de cada publicação e consolida tudo em um Markdown diário —, com controle de período que recupera automaticamente dias em que a automação não rodou.",
      tecnologias: ["Automação"],
      link: "https://github.com/devomatheus/automacao-extracao-diario-oficial-uniao"
    },
    {
      x: 1580, y: 560, icone: "fa-server", titulo: "Monitoramento Droplets",
      subtitulo: "Painel de controle DigitalOcean",
      descricao: "Painel web para visualizar e controlar droplets da DigitalOcean sem precisar acessar o painel oficial ou a CLI a cada verificação de status. Lista todas as droplets da conta com nome, IP, status e indicador visual, além de permitir ligar, desligar e reiniciar diretamente pela interface. Construído em Flask com padrão de application factory e Blueprints, expõe também uma API REST própria — desacoplada da interface — que pode ser reaproveitada por scripts, dashboards ou outras integrações.",
      tecnologias: ["Desktop"],
      link: "https://github.com/devomatheus/monitoramento-droplets-digitalocean"
    },
    {
      x: 2260, y: 300, icone: "fa-wallet", titulo: "Planejador Financeiro",
      subtitulo: "Controle de orçamento pessoal",
      descricao: "Dashboard web para controle do orçamento mensal e das despesas ao longo do ano, com os dados salvos diretamente no navegador. Permite definir um orçamento base, organizar o ano em 12 meses num acordeão, adicionar e remover despesas em cada mês e acompanhar o saldo, que se acumula automaticamente de um mês para o outro, projetando o resultado final do ano. Sem instalação, planilhas ou cadastro — basta abrir no navegador para ter uma visão clara da saúde financeira mês a mês.",
      tecnologias: ["Web"],
      link: "https://devomatheus.github.io/planejador-financeiro-pessoal/"
    },
    {
      x: 2940, y: 440, icone: "fa-key", titulo: "Gerenciador de Chaves SSH",
      subtitulo: "Visualização e cópia de chaves SSH",
      descricao: "Aplicação web para visualizar e copiar as chaves SSH armazenadas localmente no diretório ~/.ssh, eliminando a necessidade de navegar pelo terminal e usar comandos como cat para lê-las. Lista automaticamente as chaves encontradas, distingue visualmente públicas e privadas, exibe uma pré-visualização do conteúdo com o valor completo ao passar o mouse e oferece cópia para a área de transferência em um clique. Filtra arquivos irrelevantes como known_hosts, authorized_keys e config, lendo apenas os arquivos locais, sem enviar ou armazenar chaves externamente.",
      tecnologias: ["Desktop"],
      link: "https://github.com/devomatheus/automacao-gerenciamento-chaves-ssh",
      final: true
    }
  ].map(function (fase, i) {
    fase.id = i;
    if (fase.subtitulo === undefined) fase.subtitulo = "Em breve";
    if (fase.descricao === undefined) fase.descricao = "A descrição deste projeto será adicionada em breve. Volte para conferir as novidades!";
    if (fase.tecnologias === undefined) fase.tecnologias = [];
    if (fase.link === undefined) fase.link = null;
    return fase;
  });

  var LARGURA_MUNDO = 3160;
  var ALTURA_MUNDO = 760;
  var CHAVE_PROGRESSO = "portfolio_mapa_progresso";

  var $mapaViewport = $("#mapa-viewport");
  var $mundo = $("#mundo");
  var $personagem = $("#personagem");
  var $svg = $("#svg-trilha");

  var estado = carregarProgresso();
  var animando = false;

  /* =========================================================
     MONTAGEM DO MUNDO (tamanho, decoração, trilha, fases)
  ========================================================= */
  function montarMundo() {
    $mundo.css({ width: LARGURA_MUNDO + 600 + "px" });
    $svg.attr({ width: LARGURA_MUNDO + 600, height: ALTURA_MUNDO });

    desenharDecoracao();
    desenharTrilha();
    desenharFases();
    posicionarPersonagem(estado.atual, false);
    atualizarProgresso();
  }

  function desenharDecoracao() {
    var frag = $(document.createDocumentFragment());
    // colinas
    for (var i = 0; i < 12; i++) {
      var largura = 260 + Math.random() * 240;
      frag.append(
        $("<div>").addClass("colina").css({
          width: largura + "px",
          height: (largura * 0.5) + "px",
          left: (i * 320 - 80) + "px"
        })
      );
    }
    // nuvens
    for (var j = 0; j < 9; j++) {
      frag.append(
        $("<div>").addClass("nuvem").css({
          width: "70px",
          height: "26px",
          left: (j * 420 + 120) + "px",
          top: (30 + (j % 3) * 60) + "px"
        })
      );
    }
    $mundo.prepend(frag);
  }

  var NS_SVG = "http://www.w3.org/2000/svg";

  function desenharTrilha() {
    var d = construirCurvaSuave(FASES);
    [["trilha-base"], ["trilha-tracejada"]].forEach(function (info) {
      var path = document.createElementNS(NS_SVG, "path");
      path.setAttribute("class", info[0]);
      path.setAttribute("d", d);
      $svg[0].appendChild(path);
    });
  }

  // Converte uma lista de pontos numa curva suave (Catmull-Rom -> Bezier)
  function construirCurvaSuave(pontos) {
    var d = "M" + pontos[0].x + "," + pontos[0].y + " ";
    for (var i = 0; i < pontos.length - 1; i++) {
      var p0 = pontos[i === 0 ? 0 : i - 1];
      var p1 = pontos[i];
      var p2 = pontos[i + 1];
      var p3 = pontos[i + 2 < pontos.length ? i + 2 : i + 1];
      var cp1x = p1.x + (p2.x - p0.x) / 6;
      var cp1y = p1.y + (p2.y - p0.y) / 6;
      var cp2x = p2.x - (p3.x - p1.x) / 6;
      var cp2y = p2.y - (p3.y - p1.y) / 6;
      d += "C" + cp1x + "," + cp1y + " " + cp2x + "," + cp2y + " " + p2.x + "," + p2.y + " ";
    }
    return d;
  }

  function desenharFases() {
    FASES.forEach(function (fase) {
      var $fase = $("<div>")
        .addClass("fase")
        .toggleClass("final", !!fase.final)
        .attr("data-id", fase.id)
        .css({ left: fase.x + "px", top: fase.y + "px" })
        .append('<div class="numero">' + (fase.id + 1) + '</div>')
        .append('<i class="fas ' + fase.icone + ' icone-fase"></i>')
        .append($("<div>").addClass("fase-titulo").text(fase.titulo));

      $mundo.append($fase);
    });
    refletirEstadoFases();
  }

  function refletirEstadoFases() {
    $(".fase").each(function () {
      var id = +$(this).attr("data-id");
      $(this)
        .toggleClass("visitada", estado.visitadas.indexOf(id) > -1)
        .toggleClass("atual", id === estado.atual)
        .find(".selo-concluido").remove();
      if (estado.visitadas.indexOf(id) > -1) {
        $(this).append('<div class="selo-concluido"><i class="fas fa-check"></i></div>');
      }
    });
    $(".ponto-fase").each(function () {
      var id = +$(this).attr("data-id");
      $(this)
        .toggleClass("visitada", estado.visitadas.indexOf(id) > -1)
        .toggleClass("atual", id === estado.atual);
    });
  }

  /* =========================================================
     PROGRESSO (localStorage)
  ========================================================= */
  function carregarProgresso() {
    try {
      var salvo = JSON.parse(localStorage.getItem(CHAVE_PROGRESSO));
      if (salvo && typeof salvo.atual === "number") return salvo;
    } catch (e) { /* ignora dados corrompidos */ }
    return { atual: 0, visitadas: [] };
  }

  function salvarProgresso() {
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(estado));
  }

  function atualizarProgresso() {
    var total = FASES.length;
    var pct = Math.round((estado.atual / (total - 1)) * 100);
    $("#progresso-texto").text((estado.atual + 1) + "/" + total);
    $("#progresso-barra-interna").css("width", pct + "%");
  }

  /* =========================================================
     RODAPÉ COM PONTOS DE NAVEGAÇÃO RÁPIDA
  ========================================================= */
  function montarRodape() {
    var $rodape = $("#rodape");
    FASES.forEach(function (fase) {
      $("<div>")
        .addClass("ponto-fase")
        .attr("data-id", fase.id)
        .attr("title", fase.titulo)
        .appendTo($rodape);
    });
    refletirEstadoFases();
  }

  /* =========================================================
     PERSONAGEM: caminho, movimento e câmera
  ========================================================= */
  var caminhoSvg = null;
  var comprimentosAcumulados = [];

  function prepararCaminho() {
    caminhoSvg = $svg.find("path.trilha-base")[0];
    var total = caminhoSvg.getTotalLength();
    comprimentosAcumulados = FASES.map(function (fase) {
      return encontrarComprimentoMaisProximo(fase.x, fase.y, total);
    });
  }

  function encontrarComprimentoMaisProximo(x, y, total) {
    var melhorDist = Infinity, melhorL = 0;
    var passos = 400;
    for (var i = 0; i <= passos; i++) {
      var l = (total * i) / passos;
      var p = caminhoSvg.getPointAtLength(l);
      var dist = Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2);
      if (dist < melhorDist) { melhorDist = dist; melhorL = l; }
    }
    return melhorL;
  }

  function posicionarPersonagem(idx, comEfeito) {
    var fase = FASES[idx];
    if (comEfeito) {
      gsap.to($personagem[0], { left: fase.x, top: fase.y, duration: .3, ease: "back.out(2)" });
    } else {
      $personagem.css({ left: fase.x, top: fase.y });
    }
  }

  function moverPara(idxDestino) {
    if (animando || idxDestino === estado.atual || idxDestino < 0 || idxDestino >= FASES.length) {
      if (idxDestino === estado.atual) abrirModal(idxDestino);
      return;
    }
    animando = true;
    $(".fase").removeClass("atual");

    var origem = estado.atual;
    var passo = idxDestino > origem ? 1 : -1;
    var sequencia = [];
    for (var i = origem; i !== idxDestino; i += passo) sequencia.push(i + passo);

    var tl = gsap.timeline({
      onComplete: function () {
        animando = false;
        estado.atual = idxDestino;
        if (estado.visitadas.indexOf(idxDestino) === -1) estado.visitadas.push(idxDestino);
        salvarProgresso();
        refletirEstadoFases();
        atualizarProgresso();
        tocarSom("chegada");
        abrirModal(idxDestino);
      }
    });

    sequencia.forEach(function (destIdx) {
      tl.to({}, {
        duration: 0.5,
        ease: "power1.inOut",
        onStart: function () { tocarSom("passo"); },
        onUpdate: function () {
          var progresso = this.progress();
          var lenA = comprimentosAcumulados[destIdx - passo];
          var lenB = comprimentosAcumulados[destIdx];
          var lenAtual = lenA + (lenB - lenA) * progresso;
          var pontoAtual = caminhoSvg.getPointAtLength(lenAtual);
          var pontoDelta = caminhoSvg.getPointAtLength(Math.max(0, lenAtual - 2));
          var angulo = Math.atan2(pontoAtual.y - pontoDelta.y, pontoAtual.x - pontoDelta.x) * (180 / Math.PI);
          var inclinacao = Math.max(-15, Math.min(15, angulo / 4)) * passo;
          $personagem.css({ left: pontoAtual.x, top: pontoAtual.y });
          $personagem.find(".avatar").css({ transform: "scaleX(" + passo + ") rotate(" + inclinacao + "deg)" });
          centralizarCamera(pontoAtual.x);
        }
      });
    });
  }

  function centralizarCamera(x) {
    var larguraViewport = $mapaViewport.width();
    var alvo = Math.max(0, x - larguraViewport / 2);
    $mapaViewport.scrollLeft(alvo);
  }

  /* =========================================================
     MODAL DE FASE / PROJETO
  ========================================================= */
  function abrirModal(idx) {
    var fase = FASES[idx];
    $("#modal-icone-classe").attr("class", "fas " + fase.icone + " icone-grande");
    $("#modal-titulo").text((idx + 1) + ". " + fase.titulo);
    $("#modal-subtitulo").text(fase.subtitulo);
    $("#modal-descricao").text(fase.descricao);

    var $tags = $("#modal-tags").empty();
    if (fase.tecnologias.length) {
      fase.tecnologias.forEach(function (t) { $tags.append("<span>" + t + "</span>"); });
    } else {
      $tags.append('<span><i class="fas fa-hourglass-half"></i>&nbsp; Em construção</span>');
    }

    $("#modal-botao-link").prop("disabled", !fase.link);

    $("#overlay-modal").addClass("aberto");
    gsap.fromTo("#cartao-fase", { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: "back.out(1.7)" });
  }

  function fecharModal() {
    gsap.to("#cartao-fase", {
      scale: .8, opacity: 0, duration: .2, ease: "power1.in",
      onComplete: function () { $("#overlay-modal").removeClass("aberto"); }
    });
  }

  /* =========================================================
     ÁUDIO SINTETIZADO (sem dependência de arquivos externos)
  ========================================================= */
  var audioCtx = null;
  var somAtivo = JSON.parse(localStorage.getItem("portfolio_mapa_som") || "true");

  function tocarSom(tipo) {
    if (!somAtivo) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "square";
      var freq = tipo === "chegada" ? 880 : 440;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { /* Web Audio indisponível: falha silenciosamente */ }
  }

  function atualizarIconeSom() {
    $("#botao-som i").attr("class", "fas " + (somAtivo ? "fa-volume-high" : "fa-volume-xmark"));
  }

  /* =========================================================
     ARRASTAR PARA NAVEGAR (desktop) + EVENTOS
  ========================================================= */
  function habilitarArrasto() {
    var arrastando = false, inicioX = 0, scrollInicial = 0;
    $mapaViewport.on("mousedown", function (e) {
      arrastando = true;
      $mapaViewport.addClass("arrastando");
      inicioX = e.pageX;
      scrollInicial = $mapaViewport.scrollLeft();
    });
    $(document).on("mousemove", function (e) {
      if (!arrastando) return;
      $mapaViewport.scrollLeft(scrollInicial - (e.pageX - inicioX));
    });
    $(document).on("mouseup", function () {
      arrastando = false;
      $mapaViewport.removeClass("arrastando");
    });
  }

  function ligarEventos() {
    $(document).on("click", ".fase", function () { moverPara(+$(this).attr("data-id")); });
    $(document).on("click", ".ponto-fase", function () { moverPara(+$(this).attr("data-id")); });

    $("#seta-esquerda").on("click", function () { moverPara(estado.atual - 1); });
    $("#seta-direita").on("click", function () { moverPara(estado.atual + 1); });

    $("#botao-fechar-modal, #modal-botao-fechar").on("click", fecharModal);
    $("#overlay-modal").on("click", function (e) { if (e.target === this) fecharModal(); });

    $("#modal-botao-link").on("click", function () {
      var fase = FASES[estado.atual];
      if (fase.link) window.open(fase.link, "_blank", "noopener");
    });

    $("#botao-som").on("click", function () {
      somAtivo = !somAtivo;
      localStorage.setItem("portfolio_mapa_som", JSON.stringify(somAtivo));
      atualizarIconeSom();
    });

    $(document).on("keydown", function (e) {
      if ($("#overlay-modal").hasClass("aberto")) {
        if (e.key === "Escape") fecharModal();
        return;
      }
      if (e.key === "ArrowRight") moverPara(estado.atual + 1);
      if (e.key === "ArrowLeft") moverPara(estado.atual - 1);
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrirModal(estado.atual); }
    });
  }

  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */
  montarMundo();
  montarRodape();
  prepararCaminho();
  posicionarPersonagem(estado.atual, false);
  centralizarCamera(FASES[estado.atual].x);
  atualizarIconeSom();
  habilitarArrasto();
  ligarEventos();
});
