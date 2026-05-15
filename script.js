const btn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const songs = document.getElementById("songs");

btn.addEventListener("click", searchMusic);

input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    searchMusic();
  }
});

async function searchMusic(){

  const query = input.value.trim();

  if(query === ""){
    alert("Введите название песни");
    return;
  }

  songs.innerHTML = "<h2>Загрузка...</h2>";

  try{

    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`
    );

    const data = await response.json();

    songs.innerHTML = "";

    if(data.results.length === 0){
      songs.innerHTML = "<h2>Ничего не найдено 😢</h2>";
      return;
    }

    data.results.forEach(track => {

      const div = document.createElement("div");
      div.classList.add("card");

      div.innerHTML = `
        <img src="${track.artworkUrl100.replace("100x100","500x500")}">

        <h3>${track.trackName}</h3>

        <p>${track.artistName}</p>

        <audio controls>
          <source src="${track.previewUrl}" type="audio/mp4">
        </audio>
      `;

      songs.appendChild(div);

    });

  }catch(error){

    songs.innerHTML = `
      <h2>Ошибка загрузки 😢</h2>
    `;

    console.log(error);
  }
}