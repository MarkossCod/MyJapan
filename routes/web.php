<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'index')->name('home');

// Páginas do menu principal. O conteúdo será desenvolvido nas próximas etapas.
Route::view('/planeje', 'planeje')->name('planeje');
Route::view('/passagens', 'passagens')->name('passagens');
Route::view('/quem-somos', 'quem-somos')->name('quem-somos');
