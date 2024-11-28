const API_KEY = 'e950e51d5d49e85f7c2f17f01eb23ba3'; // Substitua pela sua chave de API da TMDB
const searchQuery = 'avengers'; // Exemplos de pesquisa
const carousel = document.querySelector("#carousel");
const sinopseContainer = document.getElementById("sinopse-container");
const sinopseText = document.getElementById("sinopse-text");
let currentIndex = 0;

// Função para buscar filmes
function buscarFilmes() {
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${API_KEY}&language=pt-BR`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        const filmes = data.results;

        // Adiciona os filmes ao carrossel
        filmes.forEach(filme => {
          const slide = document.createElement('div');
          slide.classList.add('carousel-slide');
          slide.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${filme.poster_path}" alt="${filme.title}" data-sinopse="${filme.overview}">
            <h3>${filme.title}</h3>
          `;
          slide.addEventListener('click', () => showSinopse(filme.overview));
          carousel.appendChild(slide);
        });

        // Exibe o carrossel após a carga
        showSlide(currentIndex);
      } else {
        console.error('Erro ao buscar filmes:', data.status_message);
        alert('Erro ao buscar filmes. Tente novamente mais tarde.');
      }
    })
    .catch(error => {
      console.error('Erro ao fazer requisição:', error);
      alert('Erro ao fazer a requisição. Tente novamente mais tarde.');
    });
}

// Função para mostrar um slide específico
function showSlide(index) {
  if (index < 0) {
    currentIndex = carousel.children.length - 1;
  } else if (index >= carousel.children.length) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }
  carousel.style.transform = `translateX(-${currentIndex * 320}px)`; // Ajuste conforme a largura do slide
}

// Função para mostrar a sinopse do filme
function showSinopse(sinopse) {
  sinopseText.textContent = sinopse ? sinopse : 'Sinopse não disponível';
}

// Botões de navegação
document.getElementById('next').addEventListener('click', () => {
  currentIndex++;
  showSlide(currentIndex);
});

document.getElementById('prev').addEventListener('click', () => {
  currentIndex--;
  showSlide(currentIndex);
});

// Avança automaticamente a cada 3 segundos
setInterval(() => {
  currentIndex++;
  showSlide(currentIndex);
}, 2000);

// Chama a função para buscar os filmes
buscarFilmes();