@extends('layouts.app')

@section('title', 'Quem somos')
@section('description', 'Conheça a proposta do MyJapan: um projeto acadêmico do SENAI para aproximar o Japão de quem sempre sonhou em conhecê-lo.')

@section('content')

    {{-- A seção inteira é uma ilha React: ela depende de animações de entrada e
         de um pop-up com estado, que não têm equivalente em Blade puro.
         O recuo no topo é curto porque o kicker foi deslocado para a direita
         e não disputa mais espaço com o botão fixo do menu. --}}
    <div data-react="quem-somos" class="pt-6 sm:pt-8"></div>

@endsection
