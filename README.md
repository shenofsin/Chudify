# 🎵 Chudify — Web Music Player

A Spotify-inspired web music player built using **HTML, CSS, and JavaScript**.

## ✨ Features

- 🎵 Play and pause songs
- ⏭️ Next and previous song controls
- 🔊 Volume control
- 🔇 Mute/unmute
- 🎚️ Seek/progress bar
- 📚 Dynamic song library
- 💿 Dynamic album cards
- ▶️ Play an album directly from its card
- 📱 Responsive/mobile layout
- 📂 JSON-based album and song management
- 👀 Mobile play-button visibility using `IntersectionObserver`

## 🚀 Custom Features

### Album Card Play Button

Each album card has a dedicated play button.

- Clicking the card loads the album's songs into the library.
- Clicking the play button loads the album and immediately plays its first song.
- `stopPropagation()` prevents the play button click from also triggering the card click.

### Mobile Album Selection

On smaller screens, clicking an album automatically opens the music library/sidebar.

### Mobile Play Button

Since hover does not work normally on touch devices, `IntersectionObserver` is used to show album play buttons when cards enter the viewport.

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript
- DOM API
- Fetch API
- Audio API
- JSON
- Intersection Observer API
- Google Fonts

## 📁 Project Structure

```text
Chudify/
│
├── index.html
├── style.css
├── utility.css
├── script.js
│
├── imgs/
│   └── ...
│
└── songs/
    ├── albums.json
    ├── album1/
    │   ├── info.json
    │   └── ...
    ├── album2/
    │   ├── info.json
    │   └── ...
    └── ...
```

## 📂 Album Management

Albums are stored in `songs/albums.json`:

```json
[
    "album1",
    "album2",
    "album3",
    "album4"
]
```

Each album contains an `info.json` file:

```json
{
    "title": "My Album",
    "description": "My songs",
    "songs": [
        "song1.mp3",
        "song2.mp3",
        "song3.mp3"
    ]
}
```

This allows albums and songs to be loaded dynamically.

## 🔄 How It Works

```text
                    CHUDIFY
                       │
                       ↓
                    main()
                       │
              ┌────────┴────────┐
              ↓                 ↓
         getAlbums()       getSongs()
              │                 │
              ↓                 ↓
        albums.json         info.json
              │                 │
              ↓                 ↓
      Generate cards       Song library
              │                 │
              └────────┬────────┘
                       ↓
                  User action
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
        Card          Song       Controls
          │            │            │
          ↓            ↓            ↓
     Load album    Play audio    Audio API
```

## 🎧 Audio Player

The project uses a single JavaScript `Audio` object:

```javascript
let audio = new Audio();
```

The selected song is assigned to:

```javascript
audio.src
```

Playback is controlled using:

```javascript
audio.play();
audio.pause();
```

Other Audio API properties used include:

```javascript
audio.currentTime;
audio.volume;
audio.muted;
```

## ⏭️ Next / Previous

The current song is found using:

```javascript
songs.indexOf(audio.src);
```

The song URLs are generated as absolute URLs using:

```javascript
window.location.origin
```

This prevents the mismatch between relative URLs and the absolute URL returned by `audio.src`.

## 🌐 Deployment

The project originally relied on directory listings to discover albums and songs.

This worked with Live Server but was not reliable after deployment.

To make the project deployment-friendly:

- `albums.json` stores the album folders.
- Each album contains an `info.json` containing its songs.
- `window.location.origin` is used instead of hardcoded localhost URLs.

The project can therefore be hosted as a static website on platforms such as Netlify.

## 🐛 Important Problems Solved

### Albums not loading after deployment

**Problem:** Album folders were discovered through directory listings.

**Solution:** Created `songs/albums.json`.

### Songs not loading after deployment

**Problem:** Songs were also discovered through directory listings.

**Solution:** Created `info.json` inside every album.

### Next/Previous returning `-1`

**Problem:** `audio.src` returned an absolute URL while the `songs` array contained relative URLs.

**Solution:** Generate absolute URLs using:

```javascript
window.location.origin
```

### New song elements not responding to clicks

**Problem:** `innerHTML = ""` destroys the existing elements and their event listeners.

**Solution:**

```javascript
updateLibrary();
addELtoLibray();
```

### Album play button triggering the card click

**Problem:** Event bubbling.

**Solution:**

```javascript
e.stopPropagation();
```

### Hover not working on mobile

**Problem:** Touch devices do not have normal mouse hover behaviour.

**Solution:** Used `IntersectionObserver` to detect when cards enter the viewport.

## 📚 What I Learned

- DOM manipulation
- Dynamic element creation
- `querySelector()`
- `querySelectorAll()`
- `getElementById()`
- `getElementsByClassName()`
- Event listeners
- Event bubbling
- `event.target`
- `event.currentTarget`
- `stopPropagation()`
- `data-*` attributes
- Arrays and array methods
- `async/await`
- Promises
- Fetch API
- JSON
- Audio API
- `audio.src`
- `audio.currentTime`
- `audio.volume`
- `audio.muted`
- Responsive CSS
- Media queries
- `window.innerWidth`
- Intersection Observer
- Dynamic DOM updates
- Relative vs absolute URLs
- Static website deployment

## 💻 Running Locally

Run the project using a local development server such as **Live Server**.

Do not open `index.html` directly using `file:///`, because the project uses `fetch()` to load JSON files.

## 🔮 Future Improvements

- 🔍 Search functionality
- ❤️ Favorite songs
- 📑 Custom playlists
- 🔀 Shuffle
- 🔁 Repeat
- 🔐 User authentication
- ☁️ Backend integration
- 🗄️ Database-based music management
- 🎨 More advanced animations
- 📱 Further mobile improvements

## 👨‍💻 Author

**Jason Rai**

Built as a learning project while studying web development.

---

⭐ **First JavaScript project completed!**
