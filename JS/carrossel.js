const API_KEY = 'e950e51d5d49e85f7c2f17f01eb23ba3'; // Substitua pela sua chave de API da TMDB
const searchQuery = 'avengers'; // Exemplos de pesquisa
const carousel = $('#carousel');
const sinopseContainer = $('#sinopse-container');
const sinopseText = $('#sinopse-text');
let currentIndex = 0;

// Função para buscar filmes
function buscarFilmes() {
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${API_KEY}&language=pt-BR`;

  $.get(url, function(data) {
    if (data.results.length > 0) {
      const filmes = data.results;

      // Adiciona os filmes ao carrossel
      filmes.forEach(filme => {
        const slide = $(`
          <div class="carousel-slide">
            <img src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="${filme.title}" data-sinopse="${filme.overview}" data-categoria="${filme.genre_ids.join(',')}">
            <h3>${filme.title}</h3>
          </div>
        `);
        slide.click(() => showSinopseModal(filme)); // Chama a função para exibir o modal de sinopse
        carousel.append(slide);
      });

      // Exibe o carrossel após a carga
      showSlide(currentIndex);
    } else {
      console.error('Erro ao buscar filmes:', data.status_message);
      alert('Erro ao buscar filmes. Tente novamente mais tarde.');
    }
  })
  .fail(function(error) {
    console.error('Erro ao fazer requisição:', error);
    alert('Erro ao fazer a requisição. Tente novamente mais tarde.');
  });
}

// Função para mostrar um slide específico
function showSlide(index) {
  const slides = carousel.children();
  if (index < 0) {
    currentIndex = slides.length - 1;
  } else if (index >= slides.length) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }
  carousel.css('transform', `translateX(-${currentIndex * 320}px)`); // Ajuste conforme a largura do slide
}

// Função para mostrar o modal com a sinopse e categoria do filme
function showSinopseModal(filme) {
  // Preenche as informações do modal
  $('#modal-title').text(filme.title);
  $('#modal-sinopse-text').text(filme.overview || 'Sinopse não disponível');
  // Categoria pode ser um pouco mais trabalhada, podemos buscar o nome das categorias a partir de uma lista de gêneros
  getCategoria(filme.genre_ids);
  
  // Exibe o modal
  $('#modal-sinopse').fadeIn();
}

// Função para obter as categorias dos filmes com base nos IDs de gênero
function getCategoria(genreIds) {
  const genreNames = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção Científica',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste'
  };

  const categorias = genreIds.map(id => genreNames[id] || 'Desconhecido').join(', ');
  $('#modal-categoria').text(`Categorias: ${categorias}`);
}

// Botão de fechar o modal
$('.close-modal').click(function() {
  $('#modal-sinopse').fadeOut(); // Fecha o modal com efeito de fadeOut
});

// Botões de navegação
$('#next').click(function() {
  currentIndex++;
  showSlide(currentIndex);
});

$('#prev').click(function() {
  currentIndex--;
  showSlide(currentIndex);
});

// Avança automaticamente a cada 3 segundos
setInterval(function() {
  currentIndex++;
  showSlide(currentIndex);
}, 2000);

// Chama a função para buscar os filmes
buscarFilmes();
