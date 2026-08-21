@extends('layouts.app')

@section('title', 'Planeje a sua viagem')
@section('description', 'Monte o seu roteiro no Japão: escolha as datas, os destinos, a hospedagem e as atrações — e leve tudo em PDF.')

@section('content')

{{-- Toda a página vive sob .pv: é o escopo dos estilos de resources/css/planeje.css.
     O data-planeje avisa o app.jsx para carregar o módulo desta página sob demanda. --}}
<div class="pv" data-planeje>

    <!-- ============ 1. PARALLAX ============ -->
    <div class="parallax">
      <section class="parallax__header">
        <div class="parallax__visuals">
          <div data-parallax-layers class="parallax__layers">
            <img src="/images/planeje/hero_back.webp" data-parallax-layer="1" alt="" class="parallax__layer-img" />
            <div data-parallax-layer="2" class="parallax__veu"></div>
            <div data-parallax-layer="3" class="parallax__layer-title">
              <h1 class="parallax__title"><small>MyJapan</small>Planeje a sua viagem</h1>
            </div>
            <img src="/images/planeje/hero_front.webp" data-parallax-layer="4" alt="" class="parallax__layer-img" style="object-fit:cover;object-position:50% 100%;top:auto;bottom:0;height:38%" />
          </div>
          <div class="parallax__fade"></div>
        </div>
      </section>
    </div>

    <!-- ============ 2. CTA + CHATBOT ============ -->
    <section class="secao wrap" id="assistente">
      <div class="cta">
        <p class="kicker">Assistente de viagem</p>
        <h2 class="titulo">Tire suas dúvidas antes de comprar a passagem</h2>
        <p class="sub">Ingressos das atrações, melhor época para ir, clima na data que você escolher e
          quanto rende o seu orçamento. Só sobre planejamento de viagem — o resto fica para outro dia.</p>
        <div class="btn-wrapper">
          <button class="btn" id="abrir-planejador" aria-haspopup="dialog">
            <svg class="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path>
            </svg>
            <div class="txt-wrapper"><div class="txt-1" id="btn-texto"></div></div>
          </button>
        </div>
      </div>
    </section>

    <!-- ============ 3. CARDS ============ -->
    <section class="secao wrap centro" id="checklist">
      <p class="kicker">Checklist</p>
      <h2 class="titulo">O que você precisa para planejar uma viagem internacional</h2>
      <p class="sub">Organização é o segredo para viajar com segurança e tranquilidade.</p>
      <div class="cards" id="cards"></div>
    </section>

    <!-- ============ 4. CARROSSEL + TEXTO ============ -->
    <section class="secao wrap" id="atracoes">
      <p class="kicker">Atrações</p>
      <h2 class="titulo">Oito paradas que valem o voo</h2>
      <div class="atracoes" style="margin-top:2.5rem">
        <div class="swiper" id="swiper-atracoes">
          <div class="swiper-wrapper" id="slides"></div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="atracoes__texto">
          <p class="kicker" id="atracao-local">Tóquio</p>
          <h3 class="atracao__nome split" id="atracao-nome"></h3>
          <p class="atracao__txt split" id="atracao-txt"></p>
          <div class="atracao__meta" id="atracao-tags"></div>
        </div>
      </div>
    </section>

    <!-- ============ 5. GLOBO + COMPANHIAS ============ -->
    <section class="secao wrap" id="rotas">
      <div class="rotas">
        <div class="rotas__lista">
          <p class="kicker">Como chegar</p>
          <h2 class="titulo">Do Brasil ao Japão</h2>
          <p class="sub">Os voos saem dos aeroportos internacionais brasileiros e chegam em Narita, Haneda ou Kansai — quase sempre com uma conexão pela América do Norte, Europa ou Oriente Médio. Arraste o globo para girar e passe o mouse sobre um ponto para ver o aeroporto.</p>
          <div class="aeroportos" id="aeroportos"></div>
          <div class="cias" id="cias"></div>
        </div>
        <div class="globo-caixa"><div class="globo"><canvas id="globo-canvas"></canvas><div id="globo-pontos"></div></div></div>
      </div>
    </section>

    <!-- ============ PLANEJADOR ============ -->
    <div class="pl-fundo" id="pl-fundo" hidden role="dialog" aria-modal="true" aria-label="Planejar viagem">
      <div class="pl">
        <div class="pl__topo">
          <h3><span>✱</span> Planeje a sua viagem</h3>
          <div class="pl-trilha">
            <span class="ativo">1 Datas</span><span>2 Destinos</span><span>3 Dias</span><span>4 Atrações</span><span>5 Roteiro</span>
          </div>
          <button class="pl__fechar" id="pl-fechar" aria-label="Fechar">✕</button>
        </div>

        <div class="pl__corpo">
          <!-- 1. datas -->
          <section class="pl-passo pl-passo--centro ativo">
            <h4>Quando você viaja?</h4>
            <p class="ajuda">Clique na data de ida e depois na data da volta — o intervalo entre elas vira a duração da viagem.</p>
            <div class="pl-cal">
              <div class="pl-cal__topo">
                <button type="button" id="pl-mes-ant" aria-label="Mês anterior">‹</button>
                <b id="pl-mes"></b>
                <button type="button" id="pl-mes-prox" aria-label="Próximo mês">›</button>
              </div>
              <div class="pl-cal__grade" id="pl-grade"></div>
            </div>
            <p id="pl-datas-resumo"></p>
          </section>

          <!-- 2. destinos -->
          <section class="pl-passo">
            <h4>Onde você vai ficar?</h4>
            <p class="ajuda">Escolha uma ou mais cidades no mapa. Para cada uma, selecione a hospedagem.</p>
            <div class="pl-mapa-caixa">
              <svg class="pl-mapa" id="pl-mapa" role="img" aria-label="Mapa do Japão com as cidades disponíveis"></svg>
              <div>
                <div class="pl-cidades" id="pl-cidades"></div>
                <div id="pl-hoteis"><p class="pl-rotulo">Nenhuma cidade escolhida ainda</p></div>
              </div>
            </div>
          </section>

          <!-- 3. dias por cidade -->
          <section class="pl-passo">
            <h4>Quantos dias em cada lugar?</h4>
            <p class="ajuda" id="pl-dias-ajuda"></p>
            <div id="pl-divisao"></div>
            <p id="pl-dias-saldo"></p>
          </section>

          <!-- 4. atrações -->
          <section class="pl-passo">
            <h4>O que você quer conhecer?</h4>
            <p class="ajuda">Marque as atrações que entram no roteiro. As gratuitas vêm sinalizadas.</p>
            <div id="pl-atracoes"></div>
            <p id="pl-total-atracoes"></p>
          </section>

          <!-- 5. roteiro -->
          <section class="pl-passo">
            <h4>Seu roteiro</h4>
            <p class="ajuda">Confira o resumo e exporte em PDF — no diálogo de impressão escolha "Salvar como PDF".</p>
            <div id="pl-roteiro"></div>
          </section>
        </div>

        <div class="pl__rodape">
          <span class="pl__espaco"></span>
          <button class="pl-btn pl-btn--fantasma" type="button" data-volta="1" data-so-em="2">Voltar</button>
          <button class="pl-btn pl-btn--fantasma" type="button" data-volta="2" data-so-em="3">Voltar</button>
          <button class="pl-btn pl-btn--fantasma" type="button" data-volta="3" data-so-em="4">Voltar</button>
          <button class="pl-btn pl-btn--fantasma" type="button" data-volta="4" data-so-em="5">Voltar</button>
          <button class="pl-btn" id="pl-ir-2" type="button" data-so-em="1" disabled>Escolher destinos</button>
          <button class="pl-btn" id="pl-ir-3" type="button" data-so-em="2" disabled>Dividir os dias</button>
          <button class="pl-btn" id="pl-ir-4" type="button" data-so-em="3">Escolher atrações</button>
          <button class="pl-btn" id="pl-ir-5" type="button" data-so-em="4">Ver roteiro</button>
          <button class="pl-btn" id="pl-exportar" type="button" data-so-em="5">Exportar PDF</button>
        </div>
      </div>
    </div>

    <div id="roteiro-print"></div>

</div>

@endsection
