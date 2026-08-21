<!doctype html>
<html lang="pt-BR" class="antialiased">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#f3efe7">
    <meta name="description" content="@yield('description', 'MyJapan — roteiros, passagens e inspiração para a sua viagem ao Japão.')">

    <title>@yield('title', 'MyJapan') — Viagens para o Japão</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="min-h-screen">
    {{-- Menu curvo (ilha React), presente em todas as páginas. --}}
    @php($currentPath = '/' . ltrim(request()->path(), '/'))
    <div data-react="curved-menu" data-props='@json(['currentPath' => $currentPath])'></div>

    <a href="#conteudo" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Pular para o conteúdo
    </a>

    <main id="conteudo">
        @yield('content')
    </main>

    @include('partials.footer')
</body>
</html>
