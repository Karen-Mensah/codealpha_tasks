const songs = [
    {
        title: "Beatwaves",
        artist: "Party over",
        src: "song1.mp3"
    },
    {
        title: "Stay",
        artist: "Holodr3ams",
        src: "song2.mp3"
    },
    {
        title: "Stay",
        artist: "Holodr3ams",
        src: "song3.mp3"
    },
     {
        title: "Beatwaves",
        artist: "Alex Morgan",
        src: "song4.mp3"
    }
];

let songIndex = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

function loadSong(song){
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
}

loadSong(songs[songIndex]);

playBtn.addEventListener("click", () => {
    if(audio.paused){
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
});

nextBtn.addEventListener("click", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
});

prevBtn.addEventListener("click", () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    audio.play();
});

audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});