@extends('layouts.app')

@section('title', 'Quem somos')
@section('description', 'Conheça a proposta do MyJapan: um projeto acadêmico do SENAI para aproximar o Japão de quem sempre sonhou em conhecê-lo.')

@section('content')

    {{-- A seção inteira é uma ilha React: ela depende de animações de entrada e
         de um pop-up com estado, que não têm equivalente em Blade puro.
         O recuo no topo abre espaço para o botão do menu, que é fixo. --}}
    <div data-react="quem-somos" class="pt-24 sm:pt-28"></div>

@endsection
