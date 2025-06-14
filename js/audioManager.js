// js/audioManager.js

export const audioManager = {
  musicAudio: new Audio(),
  ambientAudio: new Audio(),
  currentMusic: null,
  currentAmbient: null,
  soundEffects: {},

  fadeOut(audio, callback) {
    const fadeInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        clearInterval(fadeInterval);
        audio.pause();
        audio.volume = 0.2; // volume final após fade
        if (callback) callback();
      }
    }, 50);
  },

  fadeIn(audio) {
    audio.volume = 0;
    audio.play().catch(() => {});
    const fadeInterval = setInterval(() => {
      if (audio.volume < 0.2) {
        audio.volume += 0.02;
      } else {
        clearInterval(fadeInterval);
        audio.volume = 0.2;
      }
    }, 50);
  },

  playMusic(musicName) {
    const musicPath = `./audios/musicas/${musicName}.mp3`;
    if (this.currentMusic === musicName) return;

    if (!this.musicAudio.paused) {
      this.fadeOut(this.musicAudio, () => {
        this.musicAudio = new Audio(musicPath);
        this.musicAudio.loop = true;
        this.fadeIn(this.musicAudio);
      });
    } else {
      this.musicAudio = new Audio(musicPath);
      this.musicAudio.loop = true;
      this.fadeIn(this.musicAudio);
    }

    this.currentMusic = musicName;
  },

  playAmbient(ambientName) {
    const ambientPath = `./audios/ambientes/${ambientName}.mp3`;
    if (this.currentAmbient === ambientName) return;

    if (!this.ambientAudio.paused) {
      this.fadeOut(this.ambientAudio, () => {
        this.ambientAudio = new Audio(ambientPath);
        this.ambientAudio.loop = true;
        this.fadeIn(this.ambientAudio);
      });
    } else {
      this.ambientAudio = new Audio(ambientPath);
      this.ambientAudio.loop = true;
      this.fadeIn(this.ambientAudio);
    }

    this.currentAmbient = ambientName;
  },

  playEffect(effectName) {
  const path = `./audios/efeitos/${effectName}.mp3`;

  if (!this.soundEffects[effectName]) {
    this.soundEffects[effectName] = new Audio(path);
    this.soundEffects[effectName].volume = 0.5;
  }

  const sound = this.soundEffects[effectName];

  // 🔧 Tratamento especial para som da porta do Minecraft
  if (effectName === "minecraft-porta-sound") {
    sound.currentTime = 1.65;
    sound.playbackRate = 1.1;
  } else {
    sound.currentTime = 0;
    sound.playbackRate = 1.0;
  }

  sound.play().catch(() => {});
},


  setMap(mapName) {
    const mapsWithAudio = {
      casa: { music: "cidade", ambient: null },
      trabalho: { music: "cidade", ambient: null },
      rua: { music: "cidade", ambient: null },
      shopping: { music: "cidade", ambient: null },
      shoppingInterno: { music: null, ambient: "shopping" },
      casinoInterno: { music: "cidade", ambient: null },
    };

    const config = mapsWithAudio[mapName];
    if (!config) return;

    if (config.music) {
      if (this.currentMusic !== config.music) {
        this.playMusic(config.music);
      }
    } else {
      if (!this.musicAudio.paused) {
        this.fadeOut(this.musicAudio);
      }
      this.currentMusic = null;
    }

    if (config.ambient) {
      if (this.currentAmbient !== config.ambient) {
        this.playAmbient(config.ambient);
      }
    } else {
      if (!this.ambientAudio.paused) {
        this.fadeOut(this.ambientAudio);
      }
      this.currentAmbient = null;
    }

    console.log("Trocando para:", mapName);
    console.log("Esperado:", config);
  }
};
