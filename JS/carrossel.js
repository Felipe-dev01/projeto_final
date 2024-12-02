const API_KEY = 'e950e51d5d49e85f7c2f17f01eb23ba3'; 
const searchQuery = 'avengers';
const carousel = $('#carousel');
let currentIndex = 0;

function buscarFilmes() {
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${API_KEY}&language=pt-BR`;

  $.get(url, function(data) {
    if (data.results.length > 0) {
      data.results.forEach(filme => {
        const slide = $(`<div class="carousel-slide"><img src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="${filme.title}" data-sinopse="${filme.overview}" data-categoria="${filme.genre_ids.join(',')}"><h3>${filme.title}</h3></div>`);
        slide.click(() => showSinopseModal(filme));
        carousel.append(slide);
      });
      showSlide(currentIndex);
    } else {
      alert('Erro ao buscar filmes.');
    }
  }).fail(function() {
    alert('Erro ao fazer a requisição.');
  });
}

function showSlide(index) {
  const slides = carousel.children();
  if (index < 0) currentIndex = slides.length - 1;
  else if (index >= slides.length) currentIndex = 0;
  else currentIndex = index;
  carousel.css('transform', `translateX(-${currentIndex * 320}px)`);
}

function showSinopseModal(filme) {
  $('#modal-title').text(filme.title);
  $('#modal-sinopse-text').text(filme.overview || 'Sinopse não disponível');
  $('#modal-poster').attr('src', `https://image.tmdb.org/t/p/w500${filme.poster_path}`);
  getCategoria(filme.genre_ids);
  $('#modal-sinopse').fadeIn();
}

function getCategoria(genreIds) {
  const genreNames = {
    28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia', 80: 'Crime', 
    99: 'Documentário', 18: 'Drama', 10751: 'Família', 14: 'Fantasia', 36: 'História',
    27: 'Terror', 10402: 'Música', 9648: 'Mistério', 10749: 'Romance', 878: 'Ficção Científica',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'Guerra', 37: 'Faroeste'
  };

  const categorias = genreIds.map(id => genreNames[id] || 'Desconhecido').join(', ');
  $('#modal-categoria').text(`Categorias: ${categorias}`);
}

$('.close-modal').click(function() {
  $('#modal-sinopse').fadeOut();
});

$('#next').click(function() {
  currentIndex++;
  showSlide(currentIndex);
});

$('#prev').click(function() {
  currentIndex--;
  showSlide(currentIndex);
});

setInterval(function() {
  currentIndex++;
  showSlide(currentIndex);
}, 2000);

buscarFilmes();
