const API_KEY = '21d85e7e'; // Substitua pela sua chave de API da OMDb
const searchQuery = 'avengers'; // Exemplos de pesquisa
const carousel = document.querySelector("#carousel");
const sinopseContainer = document.getElementById("sinopse-container");
const sinopseText = document.getElementById("sinopse-text");
let currentIndex = 0;

// Função para buscar filmes
function buscarFilmes() {
  const url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const filmes = data.Search;
        
        // Adiciona os filmes ao carrossel
        filmes.forEach(filme => {
          const slide = document.createElement('div');
          slide.classList.add('carousel-slide');
          slide.innerHTML = `<img src="${filme.Poster}" alt="${filme.Title}" data-sinopse="${filme.Plot}">`;
          slide.addEventListener('click', () => showSinopse(filme.Plot));
          carousel.appendChild(slide);
        });
        
        // Exibe o carrossel após a carga
        showSlide(currentIndex);
      } else {
        console.error('Erro ao buscar filmes:', data.Error);
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