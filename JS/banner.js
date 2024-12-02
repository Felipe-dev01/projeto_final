const apikey = "e950e51d5d49e85f7c2f17f01eb23ba3";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const buscarTrending = `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=pt-BR`;

function inicializar() {
    carregarFilme();
    setInterval(carregarFilme, 2000); // Atualiza o banner a cada 2 segundos
}

function carregarFilme() {
    $.get(buscarTrending, (res) => {
        if (res.results?.length) {
            const filme = res.results[Math.floor(Math.random() * res.results.length)];
            exibirBanner(filme);
        } else {
            console.error("Nenhum filme encontrado no trending.");
        }
    }).fail((err) => console.error("Erro ao buscar filmes trending:", err));
}

function exibirBanner(filme) {
    const banner = $("#banner-section");
    if (!banner.length) return console.error("Elemento 'banner-section' não encontrado!");

    const { backdrop_path, poster_path, title, release_date, overview } = filme;

    if (!backdrop_path || !poster_path || !title || !release_date) {
        return console.error("Dados incompletos do filme:", filme);
    }

    banner
        .css("background-image", `url('${imgPath}${backdrop_path}')`)
        .empty()
        .append(`
            <div class="banner-content container">
                <h2 class="banner__title">${title}</h2>
                <p class="banner__info">Filmes em alta | Data de Lançamento - ${release_date}</p>
                <p class="banner__overview">
                    ${overview?.length > 200 ? `${overview.slice(0, 200)}...` : overview || "Sinopse não disponível"}
                </p>
                <div class="action-buttons-cont">
                    <button class="action-button" id="more-info-btn">Mais Informações</button>
                </div>
            </div>
        `);

    $("#more-info-btn").click(() => abrirModal(filme));
}

function abrirModal(filme) {
    const { poster_path, title, release_date, overview } = filme;

    const modal = $(`
        <div id="modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <button id="close-modal" class="close-modal">X</button>
                <img src="${imgPath}${poster_path}" alt="${title}" class="modal-image" />
                <h2 class="modal-title">${title}</h2>
                <p class="modal-release-date">Data de Lançamento: ${release_date}</p>
                <p class="modal-overview">${overview || "Sinopse não disponível."}</p>
            </div>
        </div>
    `);

    $("body").append(modal);

    modal.click((e) => {
        if (e.target === modal[0] || e.target.id === "close-modal") {
            modal.remove();
        }
    });
}

$(window).on("load", () => {
    inicializar();
    $(window).on("scroll", () => {
        $("#header").toggleClass("black-bg", $(window).scrollTop() > 5);
    });
});
