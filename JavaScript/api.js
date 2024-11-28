const API_KEY = '21d85e7e';
const searchQuery = 'avengers'; // Exemplo de pesquisa
 
// Função para buscar filmes
function buscarFilmes() {
    const url = `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`;
 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultadosDiv = document.getElementById('resultados'); // Seleciona o contêiner
 
            if (data.Response === 'True') {
                // Limpa o contêiner antes de adicionar novos resultados
                resultadosDiv.innerHTML = '';
 
                data.Search.forEach(filme => {
                    const filmeDiv = document.createElement('div');
                    filmeDiv.classList.add('filme');
                   
                    // Cria o conteúdo HTML para o filme
                    filmeDiv.innerHTML = `
                        <h3>${filme.Title} (${filme.Year})</h3>
                        <img src="${filme.Poster}" alt="Poster de ${filme.Title}">
                    `;
                   
                    // Adiciona o filme ao contêiner
                    resultadosDiv.appendChild(filmeDiv);
                });
            } else {
                resultadosDiv.innerHTML = `<p>Erro ao buscar filmes: ${data.Error}</p>`;
            }
        })
        .catch(error => {
            console.error('Erro ao fazer requisição:', error);
            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.innerHTML = `<p>Erro ao fazer a requisição. Tente novamente mais tarde.</p>`;
        });
}
 
// Chama a função para buscar os filmes
buscarFilmes();