// Substitua pela sua chave de API obtida no site da NewsAPI
const apiKey = '7777404f46d64de692f225f76a392cad';

// URL da API para buscar as últimas notícias
const url = 'https://newsapi.org/v2/top-headlines';

// Função para buscar e exibir notícias
async function fetchNews() {
    try {
        // Fazendo a requisição GET para a API
        const response = await fetch(`${url}?country=br&apiKey=${apiKey}`);
        
        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao buscar as notícias');
        }
        
        // Convertendo a resposta para JSON
        const data = await response.json();
        
        // Pegando o container de notícias
        const newsContainer = document.getElementById('news-container');
        
        // Limpando qualquer conteúdo anterior
        newsContainer.innerHTML = '';
        
        // Iterando sobre os artigos retornados e exibindo na página
        data.articles.forEach(article => {
            // Criando o HTML para cada artigo
            const newsCard = document.createElement('div');
            newsCard.classList.add('news-card');
            
            newsCard.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Leia mais</a>
            `;
            
            // Adicionando o artigo ao container de notícias
            newsContainer.appendChild(newsCard);
        });
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('news-container').innerHTML = 'Não foi possível carregar as notícias.';
    }
}

// Chama a função para carregar as notícias ao carregar a página
fetchNews();
