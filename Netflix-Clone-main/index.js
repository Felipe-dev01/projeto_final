// Consts
const apikey = "e950e51d5d49e85f7c2f17f01eb23ba3";
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    buscarTodasCategorias: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    buscarListaFilmes: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    buscarTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=pt-BR`,
}


// Inicializa o app
function inicializar() {
    buscarFilmesCarrossel();
    buscarEConstruirTodasSecoes();
}

function buscarFilmesCarrossel(){
    buscarEConstruirSecaoFilmes(apiPaths.buscarTrending, 'Trending Now')
    .then(lista => {
        const indiceAleatorio = parseInt(Math.random() * lista.length);
        construirSecaoBanner(lista[indiceAleatorio]);
    })
}

function construirSecaoBanner(filme){
    const bannerCont = document.getElementById('banner-section');
    
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

    bannerCont.append(div);
}


function buscarEConstruirTodasSecoes(){
    fetch(apiPaths.buscarTodasCategorias)
    .then(res => res.json())
    .then(res => {
        const categorias = res.genres;
        if (Array.isArray(categorias) && categorias.length) {
            categorias.forEach(categoria => {
                buscarEConstruirSecaoFilmes(
                    apiPaths.buscarListaFilmes(categoria.id),
                    categoria.name
                );
            });
        }
        // console.table(filmes);
    })
    .catch(err=>console.error(err));
}

function buscarEConstruirSecaoFilmes(urlFetch, nomeCategoria){
    console.log(urlFetch,nomeCategoria);
    return fetch(urlFetch)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results);
        const filmes = res.results;
        if (Array.isArray(filmes) && filmes.length) {
            construirSecaoFilmes(filmes.slice(0,6), nomeCategoria);
        }
        return filmes;
    })
    .catch(err=>console.error(err))
}

function construirSecaoFilmes(lista, nomeCategoria){
    console.log(lista, nomeCategoria);

    const filmesCont = document.getElementById('movies-cont');
    
    const criaListaFilmes = lista.map(item => {
        return `
        <div class="movie-item")">
            <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    }).join('');

    const filmesSecaoHTML = `
        <h2 class="movie-section-heading">${nomeCategoria}</h2>
        <div class="movies-row">
            ${criaListaFilmes}
        </div>
    `

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = filmesSecaoHTML;

    // adiciona html no container de filmes
    filmesCont.append(div);
}

// Evento para inicializar o app assim que a página carregar
window.addEventListener('load',function() {
    inicializar();
    window.addEventListener('scroll', function(){
        // atualiza a UI do cabeçalho
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})
