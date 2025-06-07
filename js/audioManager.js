export const audioManager = {
  musicAudio: new Audio(),
  ambientAudio: new Audio(),
  currentMusic: null,
  currentAmbient: null,

  playMusic(mapName) {
    const musicPath = `./audio/musicas/${mapName}.mp3`;

    if (this.currentMusic !== mapName) {
      this.musicAudio.pause();
      this.musicAudio = new Audio(musicPath);
      this.musicAudio.loop = true;
      this.musicAudio.volume = 0.4;
      this.musicAudio.play().catch(() => {});
      this.currentMusic = mapName;
    }

    this.playAmbient(mapName); // Toca som ambiente junto com a música
  },

  playAmbient(mapName) {
    const ambientPath = `./audio/ambientes/${mapName}.mp3`;

    if (this.currentAmbient !== mapName) {
      this.ambientAudio.pause();
      this.ambientAudio = new Audio(ambientPath);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.5;
      this.ambientAudio.play().catch(() => {});
      this.currentAmbient = mapName;
    }
  }
};