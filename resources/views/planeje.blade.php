@extends('layouts.app')

@section('title', 'Planeje a sua viagem')
@section('description', 'Monte o seu roteiro pelo Japão: melhores épocas, transporte, hospedagem e sugestões de itinerário.')

@section('content')
    @include('partials.em-breve', [
        'eyebrow' => 'Planejamento',
        'titulo' => 'Planeje a sua viagem',
        'texto' => 'Melhores estações para viajar, como usar o Japan Rail Pass, quanto tempo ficar em cada cidade e roteiros prontos para a sua primeira vez no Japão.',
    ])
@endsection
