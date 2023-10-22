const API_KEY = "90718cd8d0e147b2892d09af5e6babba";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("india")); //This will call our fetchNews function upon page reload

function reload() {
    window.location.reload();
}

async function fetchNews(query) {    // It is an asynchronus function which will fetch response from the News APi and stor it in a JSON Object
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    const articles = data.articles.sort((a, b) => {
        const dateA = new Date(a.publishedAt);
        const dateB = new Date(b.publishedAt);
        return dateB - dateA;
    });
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return; //This function will help us in not displaying articles without a proper thumbnail
        const cardClone = newsCardTemplate.content.cloneNode(true);//It will help us to make a deep clone with all child elements in HTML of newsCardTemplate
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {  //This function will help to fill the JSON data from fetchNews function into the 
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});