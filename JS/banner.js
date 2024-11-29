// Consts
const apikey = "e950e51d5d49e85f7c2f17f01eb23ba3";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    buscarTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=pt-BR`,
};

// Inicializa o app
function inicializar() {
    buscarFilmesCarrossel();  // Primeira chamada para carregar o filme
    setInterval(buscarFilmesCarrossel, 5000);  // Chama a função a cada 5 segundos
}

function buscarFilmesCarrossel() {
    $.get(apiPaths.buscarTrending, function (res) {
        console.log('Resposta do trending:', res);  // Verifique se a resposta está correta
        if (res.results && res.results.length > 0) {
            const indiceAleatorio = parseInt(Math.random() * res.results.length);
            construirSecaoBanner(res.results[indiceAleatorio]);
        } else {
            console.error('Nenhum filme encontrado no trending.');
        }
    }).fail(function (err) {
        console.error('Erro ao buscar filmes trending:', err);
    });
}

function construirSecaoBanner(filme) {
    const bannerCont = $('#banner-section');
    
    // Verifica se o bannerContainer existe
    if (!bannerCont.length) {
        console.error('Elemento banner-section não encontrado!');
        return;
    }

    // Verifica se o filme tem as propriedades essenciais
    if (!filme || !filme.backdrop_path || !filme.poster_path || !filme.title || !filme.release_date) {
        console.error('Filme com dados inválidos ou incompletos:', filme);
        return;  // Se algum dado essencial estiver faltando, não exibe o filme
    }

    bannerCont.css('background-image', `url('${imgPath}${filme.backdrop_path}')`);

    // Limpa a seção do banner antes de adicionar um novo conteúdo
    bannerCont.empty();

    const div = $('<div>', { class: 'banner-content container' }).html(`
        <h2 class="banner__title">${filme.title}</h2>
        <p class="banner__info">Filmes em alta | Data de Lançamento - ${filme.release_date}</p>
        <p class="banner__overview" id="overview-short">${filme.overview && filme.overview.length > 200 ? filme.overview.slice(0, 200).trim() + '...': filme.overview || "Sinopse não disponível"}</p>
        <div class="action-buttons-cont">
            <button class="action-button" id="more-info-btn">Mais Informações</button>
        </div>
    `);
    bannerCont.append(div);

    // Adiciona o evento de clique no botão de mais informações
    $('#more-info-btn').click(function () {
        // Cria o modal
        const modal = $('<div>', { id: 'modal-overlay', class: 'modal-overlay' });
        const modalContent = $('<div>', { class: 'modal-content' }).html(`
            <button id="close-modal" class="close-modal">X</button>
            <img src="${imgPath}${filme.poster_path}" alt="${filme.title}" class="modal-image" />
            <h2 class="modal-title">${filme.title}</h2>
            <p class="modal-release-date">Data de Lançamento: ${filme.release_date}</p>
            <p class="modal-overview">${filme.overview || "Sinopse não disponível."}</p>
            <p class="modal-writer">Escritor: ${filme.writer || "Não disponível"}</p>
        `);

        modal.append(modalContent);
        $('body').append(modal);

        // Fecha o modal quando clicar no botão de fechar
        $('#close-modal').click(function () {
            modal.remove();
        });

        // Fecha o modal ao clicar fora dele
        modal.click(function (e) {
            if (e.target === modal[0]) {
                modal.remove();
            }
        });
    });
}

// Evento para inicializar o app assim que a página carregar
$(window).on('load', function () {
    inicializar();
    $(window).on('scroll', function () {
        // atualiza a UI do cabeçalho
        const header = $('#header');
        if ($(window).scrollTop() > 5) {
            header.addClass('black-bg');
        } else {
            header.removeClass('black-bg');
        }
    });
});
