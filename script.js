const btn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const songs = document.getElementById("songs");

const player = document.getElementById("globalAudio");
const playerImg = document.getElementById("playerImg");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

const homeBtn = document.getElementById("homeBtn");
const favoritesBtn = document.getElementById("favoritesBtn");

let currentList = [];
let currentAudio = null;

// тренды
const trends = ["pop", "rap", "rock", "dance", "music"];

// EVENTS
btn.addEventListener("click", searchMusic);
input.addEventListener("keypress", e => {
  if(e.key === "Enter") searchMusic();
});

homeBtn.addEventListener("click", loadPopular);
favoritesBtn.addEventListener("click", showFavorites);

// START
loadPopular();

// =====================
// POPULAR
// =====================
async function loadPopular(){

  const random = trends[Math.floor(Math.random() * trends.length)];

  const res = await fetch(
    `https://itunes.apple.com/search?term=${random}&entity=song&limit=20`
  );

  const data = await res.json();

  const clean = filterExplicit(data.results);

  renderSongs(clean);
}

// =====================
// SEARCH
// =====================
async function searchMusic(){

  const q = input.value.trim();
  if(!q) return alert("Введите название");

  const res = await fetch(
    `https://itunes.apple.com/search?term=${q}&entity=song&limit=20`
  );

  const data = await res.json();

  const clean = filterExplicit(data.results);

  renderSongs(clean);
}

// =====================
// REMOVE 18+
// =====================
function filterExplicit(list){
  return list.filter(t => t.collectionExplicitness !== "explicit");
}

// =====================
// FAVORITES
// =====================
function getFav(){
  return JSON.parse(localStorage.getItem("fav")) || [];
}

function saveFav(data){
  localStorage.setItem("fav", JSON.stringify(data));
}

function toggleFav(track){

  let fav = getFav();

  const exists = fav.find(t => t.trackId === track.trackId);

  if(exists){
    fav = fav.filter(t => t.trackId !== track.trackId);
  }else{
    fav.push(track);
  }

  saveFav(fav);
  renderSongs(currentList);
}

function showFavorites(){

  const fav = getFav();

  if(fav.length === 0){
    songs.innerHTML = "<h2>Пусто ❤️</h2>";
    return;
  }

  renderSongs(fav);
}

// =====================
// PLAYER (1 active song)
// =====================
function playTrack(track){

  if(currentAudio){
    currentAudio.pause();
  }

  const audio = new Audio(track.previewUrl);
  currentAudio = audio;

  player.src = track.previewUrl;
  playerImg.src = track.artworkUrl100.replace("100x100","500x500");
  playerTitle.textContent = track.trackName;
  playerArtist.textContent = track.artistName;

  player.play();
}

// =====================
// RENDER
// =====================
function renderSongs(list){

  currentList = list;
  songs.innerHTML = "";

  const fav = getFav();

  list.forEach(track => {

    const isFav = fav.some(t => t.trackId === track.trackId);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${track.artworkUrl100.replace("100x100","500x500")}">
      <h3>${track.trackName}</h3>
      <p>${track.artistName}</p>

      <button class="fav-btn">
        ${isFav ? "❤️ Убрать" : "🤍 В избранное"}
      </button>

      <button class="play-btn">▶ Play</button>
    `;

    div.querySelector(".fav-btn").addEventListener("click", () => {
      toggleFav(track);
    });

    div.querySelector(".play-btn").addEventListener("click", () => {
      playTrack(track);
    });

    songs.appendChild(div);
  });
}