console.log("JS begins!");
let currFolder;
async function getSongs(folder) {
    // currFolder = folder;
    // let htmlSongs = await fetch(`/songs/${folder}/`); //using relative path now
    // let response = await htmlSongs.text();
    // // console.log(response)
    // let div = document.createElement("div");
    // div.innerHTML = response;
    // let a = Array.from(div.getElementsByTagName("a")); // html collections isnt an array so for each doesn't work on it directly therefore we convert it into an array.
    // console.log(a);
    // let musicList = [];
    // a.forEach((elem) => {
    //     if (elem.href.endsWith(".mp3")) {
    //         // musicList.push(elem.href.split("/songs/")[1]);
    //         musicList.push(elem.href);
    //     }
    // });

    // console.log(musicList);
    // let decodedMusicList = [];
    // musicList.forEach((elem) =>{
    //     decodedMusicList.push(decodeURIComponent(elem));
    // })
    // console.log(decodedMusicList)
    // return decodedMusicList;     we are gonna be sending the actual url so we can play the music, we decode them later when we need it
    
   // return musicList;

   currFolder = folder;
   let response = await fetch(`songs/${folder}/info.json`);
   let info = await response.json();
   let musicList = [];
   info.songs.forEach((song)=>{
        musicList.push(`${window.location.origin}/songs/${folder}/${encodeURIComponent(song)}`);
   })
   return musicList;
}
// making a global audio object so only its src changes so only one song plays at a time, function call of playMusic only changes the src which means the changes the current song being played and doens't create multiple audio objects.

let audio = new Audio();
function playMusic(song, songname) {
    audio.src = song.dataset.song;
    audio.play();
    let playSVG = document.getElementById("play");
    playSVG.src = "imgs/pause.svg";
    let si = document.querySelector(".songinfodiv");
    let st = document.querySelector(".songtime");
    si.innerHTML = songname;
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

async function getAlbums() {
    // // let htmlAlbums = await fetch("http://127.0.0.1:5500/songs/");
    // let htmlAlbums = await fetch("/songs/"); // using relative path now
    // let response = await htmlAlbums.text(); //response has the entire html so when i checked our folders are as li in ul, and the album names are in href after /songs/
    // let temp = document.createElement("div");
    // temp.innerHTML = response;
    // let htmlcollection = temp.getElementsByTagName("a");
    // let array = Array.from(htmlcollection);
    // let albums = [];
    // array.forEach((album) => {
    //     if (album.href.includes("/songs/")) //as its an absolute url it also has localhost shit
    //         albums.push(album.href.split("/songs/")[1])
   // }
    //);
    //return albums;
let albums = await fetch(`/songs/albums.json`);
albums = await albums.json();
// albums = Array.from(albums); albums is already a json array so this is not needed.
return albums;
}
async function generateCard(albumname) {
    // let info = await fetch(`http://127.0.0.1:5500/songs/${albumname}/info.json`)
    let info = await fetch(`/songs/${albumname}/info.json`)
    info = await info.json();
    let title = info.title;
    let description = info.description;
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.insertAdjacentHTML("beforeend", `<div data-folder="${albumname}" class="card">
                        <div class="imageDiv">
                            <button class="play-btn">
                                <svg data-folder="${albumname}" class="cardPlay" viewBox="0 0 56 56">
                                    <circle cx="28" cy="28" r="28" fill="currentColor" />
                                    <path d="M23 18L40 28L23 38V18Z" fill="black" />
                                </svg>
                            </button>
                            <img src="imgs/${albumname}.jpg" alt="" />
                        </div>
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </div>` )
}

async function main() {
    let res = await getAlbums();
    console.log(res);
    res.forEach((albumname) => {
        generateCard(albumname);
    })
    //code to generate all albums (folders) dynamically : 




    //get list of all songs
    let songs = await getSongs("album1"); //songs is an array now which contains all the songs. (URL)
    console.log(songs);

    //insert all songs with only their song names in the library
    let songsUL = document.querySelector(".songList ul");
    songsUL.innerHTML = "";
    for (let song of songs) {
        let songurl = song;
        song = song.split(`/songs/${currFolder}/`)[1];
        songsUL.insertAdjacentHTML(
            "beforeend",
            `<li data-song="${songurl}"><img class = "invert" src = "imgs/music.svg" alt = "">
                            <div class="songinfo">
                                <div class = "songtitle" >${decodeURIComponent(song).slice(0, -4)}</div> 
                                <div>starBASE</div>
                            </div>
                            <div class = "playinfo">
                                <span>Play now</span>
                                <img class = "invert" src = "imgs/play.svg" alt = "">
                            </div> </li>`,
        );
        // for only one space : song.replaceAll("%20", " ")
        //using slice to cut of the last 4 characters of that string which is (.mp3) 
    }




    //Attaching Event Listeners to each song in the Library.

    Array.from(
        document.querySelector(".songList").getElementsByTagName("li"),
    ).forEach((elem) => {
        elem.addEventListener("click", (e) => {
            console.log(elem.querySelector(".songinfo div"));
            let songname = elem.querySelector(".songinfo div").textContent;
            playMusic(elem, songname);
        });
    });



    let previous = document.getElementById("previous");
    let play = document.getElementById("play");
    let next = document.getElementById("next");

    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            play.src = "imgs/pause.svg";
        } else {
            audio.pause();
            play.src = "imgs/play.svg";
        }
    });





    //listen for time update event.
    audio.addEventListener("timeupdate", (e) => {
        if (isNaN(audio.duration)) {
            return; // if duration isn't available, dont run this function return back, and next update its called again and when duration is ready, function runs.
        }
        console.log(audio.currentTime, audio.duration);
        let st = document.querySelector(".songtime");
        st.innerHTML = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`
        let circle = document.querySelector(".circle");
        circle.style.left = (audio.currentTime / audio.duration) * 100 + "%";
    })

    //add event listener for seeking in seekbar : 
    let seekbar = document.querySelector(".seekbar");
    seekbar.addEventListener("click", (e) => {
        console.log(e.target);
        console.log(e.target.getBoundingClientRect())
        console.log(e.offsetX);
        let circle = document.querySelector(".circle");
        let totalWidth = e.target.getBoundingClientRect().width
        let moved = e.offsetX;
        let percentage = (moved / totalWidth) * 100;
        circle.style.left = percentage + "%";
        audio.currentTime = (percentage / 100) * audio.duration;
    })


    //Add an event listener for hamburger click -> mobile
    let hamburger = document.querySelector(".hamburger");
    hamburger.addEventListener("click", () => {
        let left = document.querySelector(".left");
        left.style.left = "0";
    })

    //Add an event listener for close click -> mobile
    let close = document.getElementById("close");
    close.addEventListener("click", () => {
        let left = document.querySelector(".left");
        left.style.left = "-100%";
    })

    function playNext(songlink) {
        let length = songs.length;
        let index = songs.indexOf(songlink)
        if (index !== -1) {
            if (index === songs.length - 1) {
                return songs[0];
            }
            return songs[index + 1];
        }
        console.log("Nothing playing");
        return;
    }

    function playPrev(songlink) {
        let index = songs.indexOf(songlink);
        if (index != -1) {
            if (index == 0) {
                return songs[songs.length - 1];
            }
            return songs[index - 1];
        }
        console.log("Nothing playing");
         console.log("AUDIO:", audio.src);
    console.log("SONGS:", songs);
   console.log("INDEX:", songs.indexOf(audio.src));
        return;
    }

    //Add an event listener for previous song
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        console.log(audio.src);
        let prevSongURL = playPrev(audio.src);
        if (prevSongURL != undefined) {
            let prevSong = prevSongURL.split(`/songs/${currFolder}/`)[1];
            prevSong = decodeURIComponent(prevSong).slice(0, -4);
            audio.src = prevSongURL;
            audio.play();
            play.src = "imgs/pause.svg";
            let si = document.querySelector(".songinfodiv");
            si.innerHTML = prevSong;
           
        }

    })

    //Add an event listener for next song
    next.addEventListener("click", () => {
        console.log("next clicked");
        console.log(audio.src);
        let nextSongURL = playNext(audio.src);
        if (nextSongURL != undefined) {
            let nextSong = nextSongURL.split(`/songs/${currFolder}/`)[1]
            nextSong = decodeURIComponent(nextSong).slice(0, -4);
            audio.src = nextSongURL;
            audio.play();
            let si = document.querySelector(".songinfodiv");
            si.innerHTML = nextSong;
            play.src = "imgs/pause.svg";
        }

    })

    //Add an event for muting volume onclick
    // let on = true;
    let volumeicon = document.getElementById("volume");
    let volume = document.getElementById("volumebar");
    volumeicon.addEventListener("click", () =>{
       /* if(on)
        {
            volumeicon.src = "imgs/mute.svg";
            audio.volume = 0;
            on = false;
        }
        else{
            volumeicon.src = "imgs/volume.svg";
            audio.volume = 0.5;
            on = true;
        } */
        if(!audio.muted)
        {
            audio.muted = true;
            volumeicon.src = "imgs/mute.svg";
            volume.value = 0;
        }
        else{
            audio.muted = false;
            volumeicon.src = "imgs/volume.svg";
            volume.value = 30;
        }
    })
    //Add an event listner for volume bar
    
    //input enables dragging too.
    volume.addEventListener("input", (e) => {
        console.log(e);
        console.log(e.target);
        console.log(e.target.value);
        audio.volume = e.target.value / 100;
        if (audio.volume == 0)
        {
            audio.muted = true;
            volumeicon.src = "imgs/mute.svg"
            volume.value = 0;
        }
        else
        {
            audio.muted = false;
            volumeicon.src = "imgs/volume.svg"
        }
    })




    function addELtoLibray() {
        Array.from(
            document.querySelector(".songList").getElementsByTagName("li"),
        ).forEach((elem) => {
            elem.addEventListener("click", (e) => {
                console.log(elem.querySelector(".songinfo div"));
                let songname = elem.querySelector(".songinfo div").textContent;
                playMusic(elem, songname);
            });
        });
    }


    //Add an event for clicking an album (card) and opening that album (folder) in the library
    function updateLibrary() {
        let songsUL = document.querySelector(".songList ul");
        songsUL.innerHTML = "";
        for (let song of songs) {
            let songurl = song;
            song = song.split(`/songs/${currFolder}/`)[1];
            songsUL.insertAdjacentHTML(
                "beforeend",
                `<li data-song="${songurl}"><img class = "invert" src = "imgs/music.svg" alt = "">
                            <div class="songinfo">
                                <div class = "songtitle" >${decodeURIComponent(song).slice(0, -4)}</div> 
                                <div>starBASE</div>
                            </div>
                            <div class = "playinfo">
                                <span>Play now</span>
                                <img class = "invert" src = "imgs/play.svg" alt = "">
                            </div> </li>`,
            );
            // for only one space : song.replaceAll("%20", " ")
            //using slice to cut of the last 4 characters of that string which is (.mp3) 
        }
    }


    //add an event listener so when cards are clicked, their albums show on the library
    let cards = document.querySelectorAll(".card"); //html colln of cards.
    Array.from(cards).forEach(async (card) => {
        card.addEventListener("click", async (e) => {
            currFolder = card.dataset.folder;
            console.log(currFolder);
            songs = await getSongs(`${currFolder}`);
            updateLibrary();
            addELtoLibray();
            if(window.innerWidth <= 500)
            {
            let left = document.querySelector(".left");
            left.style.left = "0%";
            }
        })
    })

    //Add an event Listener so when The Play Icon on a card is pressed, the library gets updated and plays the first song : 
//so when this event runs, we dont want the card click event to run so we stop event propagation.
    let playbtns = document.getElementsByClassName("cardPlay");
    Array.from(playbtns).forEach(async (btn)=>{
        btn.addEventListener("click", async (e)=>{
            e.stopPropagation(); // stop event propagation to the card.
            currFolder = btn.dataset.folder;
            songs = await getSongs(`${currFolder}`);
            console.log(songs);
            updateLibrary();
            addELtoLibray();
            let firstSong = songs[0];
            console.log(firstSong)
            audio.src = `${firstSong}`;
            audio.play();
            play.src = "imgs/pause.svg";
            firstSong = firstSong.split(`/songs/${currFolder}/`)[1];
            firstSong = decodeURIComponent(firstSong);
            let si = document.querySelector(".songinfodiv");
            si.innerHTML = firstSong;
        })
    })

//Add an event listener for mobile screens so when a card is played, it also opens up the library.
// Array.from(cards).forEach((card)=>{
//     card.addEventListener("click", ()=>{
        // if(window.innerWidth <= 500)
        // {
        //     let left = document.querySelector(".left");
        //     left.style.left = "0%";
        // }
//     })
// })



// Add and IntersectionObserver for mobile to show playbtns when seen on Viewport.
if(window.innerWidth < 500)
{
    let obeserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting)
            {
                entry.target.classList.add("play-btn-visible");
            }
        })
    })
    let btnn = document.querySelectorAll(".play-btn")
    Array.from(btnn).forEach((btn)=>{
        obeserver.observe(btn);
    })
}

}




main();






//play first song
/* let audio = new Audio(songs[1]);
     audio.play(audio); */

/* let audio = new Audio();
    audio.src = songs[2];
    audio.addEventListener("loadedmetadata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    }) */
