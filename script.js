const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

searchBtn.addEventListener("click", searchMusic);

async function searchMusic() {
    const query = searchInput.value.trim();

    if (!query) {
        alert("Введите запрос");
        return;
    }

    results.innerHTML = "<p>Загрузка...</p>";

    try {
        const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`
        );

        const data = await response.json();

        results.innerHTML = "";

        if (data.results.length === 0) {
            results.innerHTML = "<p>Ничего не найдено</p>";
            return;
        }

        data.results.forEach(song => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${song.artworkUrl100.replace('100x100', '500x500')}" alt="">
                <h3>${song.trackName}</h3>
                <p>${song.artistName}</p>
                <audio controls>
                    <source src="${song.previewUrl}" type="audio/mpeg">
                </audio>
            `;

            results.appendChild(card);
        });

    } catch (error) {
        results.innerHTML = "<p>Ошибка загрузки</p>";
        console.error(error);
    }
}