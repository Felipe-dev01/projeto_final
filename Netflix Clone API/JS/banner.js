// Consts
const apikey = "e950e51d5d49e85f7c2f17f01eb23ba3";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    buscarTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=pt-BR`,
};

// Inicializa o app
function inicializar() {
    buscarFilmesCarrossel();
}

function buscarFilmesCarrossel() {
    fetch(apiPaths.buscarTrending)
        .then(res => res.json())
        .then(res => {
            console.log('Resposta do trending:', res);  // Verifique se a resposta está correta
            if (res.results && res.results.length > 0) {
                const indiceAleatorio = parseInt(Math.random() * res.results.length);
                construirSecaoBanner(res.results[indiceAleatorio]);
            } else {
                console.error('Nenhum filme encontrado no trending.');
            }
        })
        .catch(err => console.error('Erro ao buscar filmes trending:', err));
}

function construirSecaoBanner(filme) {
    const bannerCont = document.getElementById('banner-section');
    
    // Verifica se o bannerContainer existe
    if (!bannerCont) {
        console.error('Elemento banner-section não encontrado!');
        return;
    }

    // Verifica se o filme tem a propriedade 'backdrop_path'
    if (!filme || !filme.backdrop_path) {
        console.error('Filme não tem backdrop_path:', filme);
        return;
    }

    bannerCont.style.backgroundImage = `url('${imgPath}${filme.backdrop_path}')`;

    const div = document.createElement('div');

    div.innerHTML = `
            <h2 class="banner__title">${filme.title}</h2>
            <p class="banner__info">Filmes em alta | Data de Lançamento - ${filme.release_date} </p>
            <p class="banner__overview">${filme.overview && filme.overview.length > 200 ? filme.overview.slice(0,200).trim()+ '...':filme.overview}</p>
            <div class="action-buttons-cont">
                <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp;&nbsp; Mais Informações</button>
            </div>
        `;
    div.className = "banner-content container";

    // Adiciona o conteúdo do banner ao container
    bannerCont.append(div);
}

// Evento para inicializar o app assim que a página carregar
window.addEventListener('load', function () {
    inicializar();
    window.addEventListener('scroll', function () {
        // atualiza a UI do cabeçalho
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg');
        else header.classList.remove('black-bg');
    });
});
