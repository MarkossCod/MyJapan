@extends('layouts.app')

@section('title', 'Quem somos')
@section('description', 'Conheça a proposta do MyJapan: um projeto acadêmico do SENAI para aproximar o Japão de quem sempre sonhou em conhecê-lo.')

@section('content')

    {{-- A seção inteira é uma ilha React: ela depende de animações de entrada e
         de um pop-up com estado, que não têm equivalente em Blade puro.
         O recuo no topo é o mínimo para não passar por baixo do botão do
         menu, que é fixo (48px + 16px de margem). --}}
    <div data-react="quem-somos" class="pt-16 sm:pt-20"></div>

@endsection
