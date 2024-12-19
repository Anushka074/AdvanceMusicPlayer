import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    songName: "Für Elise",
    songArtist: "Beethoven",
    songSrc: "./Assets/songs/Beethoven - Für Elise(M4A_128K).m4a",
    songAvatar: "./Assets/Images/img 1.jpg",
  });

  // UseStates Variables
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicTotalLength, setMusicTotalLength] = useState("04 : 38");
  const [musicCurrentTime, setMusicCurrentTime] = useState("00 : 00");
  const [videoIndex, setVideoIndex] = useState(0);
  const [musicAPI, setMusicAPI] = useState([
    {
      songName: "Für Elise",
      songArtist: "Beethoven",
      songSrc: "./Assets/songs/Beethoven - Für Elise(M4A_128K).m4a",
      songAvatar: "./Assets/Images/img 1.jpg",
    },
    {
      songName: "Symphony No.3 - Poco Allegretto",
      songArtist: "Brahms",
      songSrc: "./Assets/songs/Brahms - Symphony No.3 - Poco Allegretto(M4A_128K).m4a",
      songAvatar: "./Assets/Images/img 2.jpg",
    },
    {
      songName: "Peer Gynt Suite No. 1_ Op. 46_ I. Morning Mood",
      songArtist: "Grieg",
      songSrc: "./Assets/songs/Grieg_ Peer Gynt Suite No. 1_ Op. 46_ I. Morning Mood(M4A_128K).m4a",
      songAvatar: "./Assets/Images/img 3.jpg",
    },
    {
      songName: "Ave Maria",
      songArtist: "Schubert",
      songSrc: "./Assets/songs/Schubert - Ave Maria(M4A_128K).m4a",
      songAvatar: "./Assets/Images/img 4.jpg",
    },
    {
      songName: "The Four Seasons (Orquesta Reino de Aragón)",
      songArtist: "Vivaldi",
      songSrc: "./Assets/songs/Vivaldi_ The Four Seasons (Orquesta Reino de Aragón)(M4A_128K).m4a",
      songAvatar: "./Assets/Images/img 5.jpg",
    },
    /*{
       songName: "Soch (Slowed+Reverbed)",
       songArtist: "Hardy Sandhu",
       songSrc: "./Assets/songs/SOCH(Slowed+Reverbed) __ Hardy Sandhu.webm",
       songAvatar: "./Assets/Images/image6.jpg",
     },
     {
       songName: "Apna Bana Le",
       songArtist: "Arijit Singh",
       songSrc: "./Assets/songs/Apna Bana Le - Full Audio _ Bhediya _ Varun Dhawan, Kriti Sanon_ Sachin-Jigar,Arijit Singh,Amitabh B.webm",
       songAvatar: "./Assets/Images/image7.jpg",
     },*/
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newSongDetails, setNewSongDetails] = useState({
    songName: "",
    songArtist: "",
    songSrc: "",
    songAvatar: "",
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const currentAudio = useRef();

  const handleMusicProgressBar = (e) => {
    setAudioProgress(e.target.value);
    if (currentAudio.current) {
      currentAudio.current.currentTime =
        (e.target.value * currentAudio.current.duration) / 100;
    }
  };

  const handleAudioPlay = () => {
    if (currentAudio.current) {
      if (currentAudio.current.paused) {
        currentAudio.current.play();
        setIsAudioPlaying(true);
      } else {
        currentAudio.current.pause();
        setIsAudioPlaying(false);
      }
    }
  };

  const handleNextSong = () => {
    const nextIndex = (musicIndex + 1) % musicAPI.length;
    setMusicIndex(nextIndex);
    updateCurrentMusicDetails(nextIndex);
  };

  const handlePrevSong = () => {
    const prevIndex = (musicIndex - 1 + musicAPI.length) % musicAPI.length;
    setMusicIndex(prevIndex);
    updateCurrentMusicDetails(prevIndex);
  };

  const updateCurrentMusicDetails = (index) => {
    const musicObject = musicAPI[index];

    // Update the song details first
    setCurrentMusicDetails({
      songName: musicObject.songName,
      songArtist: musicObject.songArtist,
      songSrc: musicObject.songSrc,
      songAvatar: musicObject.songAvatar,
    });

    // Pause the current audio if playing
    if (currentAudio.current && !currentAudio.current.paused) {
      currentAudio.current.pause();
    }

    // Load new audio source and play
    if (currentAudio.current) {
      currentAudio.current.src = musicObject.songSrc;

      // Set event listener to play the new audio when it's loaded
      currentAudio.current.onloadeddata = () => {
        currentAudio.current.play();
        setIsAudioPlaying(true);
      };
    }
  };

  const handleAudioUpdate = () => {
    if (currentAudio.current) {
      // Update audio length and current time
      const duration = currentAudio.current.duration;
      const currentTime = currentAudio.current.currentTime;

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`;
      };
      

      setMusicTotalLength(formatTime(duration));
      setMusicCurrentTime(formatTime(currentTime));

      const progress = (currentTime / duration) * 100;
      setAudioProgress(isNaN(progress) ? 0 : progress);
    }
  };

  const handleShuffle = () => {
    const shuffledArray = [...musicAPI];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    setMusicAPI(shuffledArray);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setNewSongDetails({
      ...newSongDetails,
      [name]: name.includes("Src") || name.includes("Avatar") ? files[0] : value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newSong = {
      songName: newSongDetails.songName,
      songArtist: newSongDetails.songArtist,
      songSrc: URL.createObjectURL(newSongDetails.songSrc),
      songAvatar: URL.createObjectURL(newSongDetails.songAvatar),
    };
    setMusicAPI([...musicAPI, newSong]);
    setNewSongDetails({
      songName: "",
      songArtist: "",
      songSrc: "",
      songAvatar: "",
    });
    setShowForm(false);
  };

  const handleRemoveSong = (index) => {
    const updatedSongs = musicAPI.filter((_, i) => i !== index);
    setMusicAPI(updatedSongs);
    if (musicIndex === index && updatedSongs.length > 0) {
      const newIndex = index === 0 ? 0 : index - 1;
      setMusicIndex(newIndex);
      updateCurrentMusicDetails(newIndex);
    }
  };

  return (
    <>
      <div className="container">
        <audio
          src={currentMusicDetails.songSrc}
          ref={currentAudio}
          onEnded={handleNextSong}
          onTimeUpdate={handleAudioUpdate}
        ></audio>
        <video
          src="./Assets/Videos/video1.mp4"
          loop
          muted
          autoPlay
          className="backgroundVideo"
        ></video>
        <div className="blackScreen"></div>
        
        <div className={`playlist ${isSidebarVisible ? "" : "hidden"}`}>
          <h3>Playlist</h3>
          <ul>
            {musicAPI.map((song, index) => (
              <li
                key={index}
                onClick={() => {
                  setMusicIndex(index);
                  updateCurrentMusicDetails(index);
                }}
              >
                <span>
                  {song.songName} - {song.songArtist}
                </span>
                <button
                  className="removeBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSong(index);
                  }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          <button className="shuffleBtn" onClick={handleShuffle}>
            Shuffle
          </button>
          <button className="addSongBtn" onClick={() => setShowForm(true)}>
            Add Song
          </button>
        </div>
        <button 
            className="toggleSidebarBtn"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            {isSidebarVisible ? "ᯓ★Hide" : "ִֶָ🐚🫧𓇼˖°Show"} Playlist
          </button>
        <div className="music-Container">
          <p className="musicPlayer">Music Player</p>
          <p className="music-Head-Name">{currentMusicDetails.songName}</p>
          <p className="music-Artist-Name">{currentMusicDetails.songArtist}</p>
          <img
            src={currentMusicDetails.songAvatar}
            className="objectFitCover"
            onClick={() => {}}
            alt="song Avatar"
            id="songAvatar"
          />
          <div className="musicTimerDiv">
            <p className="musicCurrentTime">{musicCurrentTime}</p>
            <p className="musicTotalLenght">{musicTotalLength}</p>
          </div>
          <input
            type="range"
            name="musicProgressBar"
            className="musicProgressBar"
            value={audioProgress}
            onChange={handleMusicProgressBar}
          />
          <div className="musicControlers">
            <i
              className="fa-solid fa-backward musicControler"
              onClick={handlePrevSong}
            ></i>
            <i
              className={`fa-solid ${
                isAudioPlaying ? "fa-pause-circle" : "fa-circle-play"
              } playBtn`}
              onClick={handleAudioPlay}
            ></i>
            <i
              className="fa-solid fa-forward musicControler"
              onClick={handleNextSong}
            ></i>
          </div>
        </div>

        {showForm && (
          <div className="addSongForm">
            <form onSubmit={handleFormSubmit}>
              <label>
                Song Name:
                <input
                  type="text"
                  name="songName"
                  value={newSongDetails.songName}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Artist:
                <input
                  type="text"
                  name="songArtist"
                  value={newSongDetails.songArtist}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Song File:
                <input
                  type="file"
                  name="songSrc"
                  accept="audio/*"
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Cover Image:
                <input
                  type="file"
                  name="songAvatar"
                  accept="image/*"
                  onChange={handleFormChange}
                  required
                />
              </label>
              <button type="submit">Add Song</button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        <a
          href="https://www.youtube.com/@teenage-programmer"
          title="Subscribe"
          className="youtube-Subs"
        ></a>
      </div>
    </>
  );
}

export default App;