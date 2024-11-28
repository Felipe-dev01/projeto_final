// Chave da OMDb API
const API_KEY = "21d85e7e"; 

const botaoBuscar = document.getElementById('btn-buscar');
const detalhesFilme = document.getElementById('resultados-busca');
const filmesPopulares = document.getElementById('filmes-populares');
const filmesAvaliados = document.getElementById('filmes-avaliados');
const filmesRecomendados = document.getElementById('filmes-recomendados');

// Função para busca do filme Barra de pesquisa
function buscarDetalhesFilme(imdbID) {
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&r=xml`;

    // Realiza o fetch
    fetch(url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            if (data.getElementsByTagName('error').length > 0) {
                // Verifica se o filme existe
                detalhesFilme.innerHTML = '<p>Filme não encontrado.</p>'; 
            } else {
                exibirDetalhesFilme(data);
            }
        })
        .catch(error => {
            // Exibe o erro no console
            console.error('Erro ao buscar o filme:', error);
            // Exibe uma mensagem de erro na página
            detalhesFilme.innerHTML = '<p>Ocorreu um erro ao buscar os detalhes do filme.</p>'; 
        });
}

// Função que mostra os detalhes do filme 
function exibirDetalhesFilme(filmeXML) {
    const filme = filmeXML.getElementsByTagName('movie')[0];

    detalhesFilme.innerHTML = `
        <div class="detalhes-filme-container">
            <div class="cartaz-filme">
                <img src="${filme.getAttribute('poster') !== 'N/A' ? filme.getAttribute('poster') : 'https://via.placeholder.com/300x450'}" alt="Poster de ${filme.getAttribute('title')}"> <!-- Poster -->
            </div>
            <div class="info-filme">
                <h2>${filme.getAttribute('title')} (${filme.getAttribute('year')})</h2> <!-- Título e ano -->
                <p><strong>Diretor:</strong> ${filme.getAttribute('director')}</p> <!-- Diretor -->
                <p><strong>Elenco:</strong> ${filme.getAttribute('actors')}</p> <!-- Elenco -->
                <p><strong>Enredo:</strong> ${filme.getAttribute('plot')}</p> <!-- Sinopse -->
                <p><strong>Nota IMDb:</strong> ${filme.getAttribute('imdbRating')}</p> <!-- Nota -->
            </div>
        </div>
    `;
}

// Função que busca por categoria 
function buscarFilmesPorCategoria(query, container) {
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&r=xml`;

    fetch(url)
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, "text/xml"); 
            const filmes = xmlDoc.getElementsByTagName('result');

            if (filmes.length === 0) {
                // Exibe uma mensagem se não encontrar filmes
                container.innerHTML = '<p>Filmes não encontrados!</p>'; 
            } else {
                exibirFilmes(filmes, container);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar filmes:', error); 
            container.innerHTML = '<p>Ocorreu um erro ao carregar os filmes.</p>';
        });
}

// Função que exibi lista de filmes 
function exibirFilmes(filmes, container) {
    container.innerHTML = ''; 
    Array.from(filmes).forEach(filme => {
        const title = filme.getAttribute('title'); 
        const year = filme.getAttribute('year'); 
        const poster = filme.getAttribute('poster') !== 'N/A' ? filme.getAttribute('poster') : 'https://via.placeholder.com/150x225'; 
        const imdbID = filme.getAttribute('imdbID'); 

        const cartaoFilme = document.createElement('div'); 
        cartaoFilme.classList.add('cartao-filme'); 
        cartaoFilme.innerHTML = `
            <img src="${poster}" alt="${title}"> <!-- Adiciona a imagem do poster do filme -->
            <h3>${title}</h3> <!-- Exibe o título do filme -->
            <p>${year}</p> <!-- Exibe o ano do filme -->
        `;
        cartaoFilme.addEventListener('click', () => buscarDetalhesFilme(imdbID)); 
        container.appendChild(cartaoFilme); 
    });
}


// Adiciona o evento na busca
botaoBuscar.addEventListener('click', function () {
    // Pesquisa o titulo
    const tituloFilme = document.getElementById('titulo-filme').value.trim(); 
    if (tituloFilme) {
        buscarFilmesPorCategoria(tituloFilme, detalhesFilme); 
    } else {
        alert('Por favor, insira um título de filme.');
    }
});

// Carrega os filmes do carrossel 
document.addEventListener('DOMContentLoaded', function () {
    buscarFilmesPorCategoria('batman', filmesPopulares); 
    buscarFilmesPorCategoria('fast and furious', filmesAvaliados); 
    buscarFilmesPorCategoria('marvel', filmesRecomendados);
});
