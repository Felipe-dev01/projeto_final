// Consts
const apikey = "e950e51d5d49e85f7c2f17f01eb23ba3";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    buscarTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=pt-BR`,
};

// Inicializa o app
let filmesTrending = []; // Armazena os filmes para o carrossel
let currentIndex = 0;    // Índice do filme atual

function inicializar() {
    buscarFilmesCarrossel();
}

function buscarFilmesCarrossel() {
    fetch(apiPaths.buscarTrending)
        .then(res => res.json())
        .then(res => {
            console.log('Resposta do trending:', res);  // Verifique se a resposta está correta
            if (res.results && res.results.length > 0) {
                filmesTrending = res.results; // Armazena os filmes recebidos
                mostrarFilmeAtual();          // Mostra o primeiro filme
                iniciarCarrossel();           // Inicia o carrossel para trocar filmes
            } else {
                console.error('Nenhum filme encontrado no trending.');
            }
        })
        .catch(err => console.error('Erro ao buscar filmes trending:', err));
}

function mostrarFilmeAtual() {
    const filme = filmesTrending[currentIndex];
    
    // Verifica se o filme tem as propriedades essenciais
    if (!filme || !filme.backdrop_path || !filme.poster_path || !filme.title || !filme.release_date) {
        console.error('Filme com dados inválidos ou incompletos:', filme);
        return;  // Se algum dado essencial estiver faltando, não exibe o filme
    }

    const bannerCont = $('#banner-section');
    
    bannerCont.css('background-image', `url('${imgPath}${filme.backdrop_path}')`);

    const div = $(`
        <div class="banner-content container">
            <h2 class="banner__title">${filme.title}</h2>
            <p class="banner__info">Filmes em alta | Data de Lançamento - ${filme.release_date}</p>
            <p class="banner__overview" id="overview-short">${filme.overview && filme.overview.length > 200 ? filme.overview.slice(0, 200).trim() + '...': filme.overview || "Sinopse não disponível"}</p>
            <div class="action-buttons-cont">
                <button class="action-button" id="more-info-btn">Mais Informações</button>
            </div>
        </div>
    `);

    // Adiciona o conteúdo do banner ao container
    bannerCont.html(div);

    // Adiciona o evento de clique no botão de mais informações
    $('#more-info-btn').on('click', function () {
        // Cria o modal
        const modal = $('<div id="modal-overlay" class="modal-overlay"></div>');

        const modalContent = $(`
            <div class="modal-content">
                <button id="close-modal" class="close-modal">X</button>
                <img src="${imgPath}${filme.poster_path}" alt="${filme.title}" class="modal-image" />
                <h2 class="modal-title">${filme.title}</h2>
                <p class="modal-release-date">Data de Lançamento: ${filme.release_date}</p>
                <p class="modal-overview">${filme.overview || "Sinopse não disponível."}</p>
                <p class="modal-writer">Escritor: ${filme.writer || "Não disponível"}</p>
            </div>
        `);

        modal.append(modalContent);
        $('body').append(modal);

        // Fecha o modal quando clicar no botão de fechar
        $('#close-modal').on('click', function () {
            modal.remove();
        });

        // Fecha o modal ao clicar fora dele
        modal.on('click', function (e) {
            if (e.target === modal[0]) {
                modal.remove();
            }
        });
    });
}

function iniciarCarrossel() {
    // Intervalo de troca do banner (5 segundos neste caso)
    setInterval(function() {
        // Incrementa o índice e faz a rotação circular
        currentIndex = (currentIndex + 1) % filmesTrending.length;
        mostrarFilmeAtual();
    }, 5000);  // Troca de banner a cada 5 segundos (5000ms)
}

// Evento para inicializar o app assim que a página carregar
$(document).ready(function () {
    inicializar();

    $(window).on('scroll', function () {
        // Atualiza a UI do cabeçalho
        const header = $('#header');
        if ($(window).scrollTop() > 5) {
            header.addClass('black-bg');
        } else {
            header.removeClass('black-bg');
        }
    });
});
