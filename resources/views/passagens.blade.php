@extends('layouts.app')

@section('title', 'Comprar Passagens')
@section('description', 'Encontre voos para o Japão, compare tarifas e escolha as melhores datas para a sua viagem.')

@section('content')
    @include('partials.em-breve', [
        'eyebrow' => 'Passagens',
        'titulo' => 'Comprar Passagens',
        'texto' => 'Busca de voos, comparação de companhias aéreas, alertas de tarifa e as melhores janelas de compra para voar ao Japão saindo do Brasil.',
    ])
@endsection
