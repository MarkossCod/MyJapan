@extends('layouts.app')

@section('title', 'Quem somos')
@section('description', 'Conheça a equipe por trás do MyJapan e a proposta do projeto.')

@section('content')
    @include('partials.em-breve', [
        'eyebrow' => 'Sobre',
        'titulo' => 'Quem somos',
        'texto' => 'A história do MyJapan, a equipe que desenvolve o projeto e a nossa proposta: aproximar o Japão de quem sempre sonhou em conhecê-lo.',
    ])
@endsection
