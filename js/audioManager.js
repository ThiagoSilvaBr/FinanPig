// js/audioManager.js

export const audioManager = {
  musicAudio:   new Audio(),
  ambientAudio: new Audio(),
  soundEffects: {},

  currentMusic:   null,
  currentAmbient: null,

  // Configurações de fade
  DEFAULT_VOLUME:   0.2,
  FADE_STEP:        0.02,
  FADE_INTERVAL_MS: 50,

  fadeOut(audio, onComplete) {
    clearInterval(audio._fadeInterval);
    audio._fadeInterval = setInterval(() => {
      if (audio.volume > this.FADE_STEP) {
        audio.volume = Math.max(0, audio.volume - this.FADE_STEP);
      } else {
        clearInterval(audio._fadeInterval);
        audio.pause();
        audio.volume = this.DEFAULT_VOLUME;
        onComplete?.();
      }
    }, this.FADE_INTERVAL_MS);
  },

  fadeIn(audio) {
    clearInterval(audio._fadeInterval);
    audio.volume = 0;
    audio.loop = true;
    audio.play().catch(err => console.warn("audioManager.play()", err));
    audio._fadeInterval = setInterval(() => {
      if (audio.volume < this.DEFAULT_VOLUME - this.FADE_STEP) {
        audio.volume = Math.min(this.DEFAULT_VOLUME, audio.volume + this.FADE_STEP);
      } else {
        clearInterval(audio._fadeInterval);
        audio.volume = this.DEFAULT_VOLUME;
      }
    }, this.FADE_INTERVAL_MS);
  },

  playMusic(name) {
    if (this.currentMusic === name) return;
    const path = `./audios/musicas/${name}.mp3`;
    console.log("[audioManager] playMusic:", name, path);

    const startTrack = () => {
      this.musicAudio = new Audio(path);
      this.fadeIn(this.musicAudio);
      this.currentMusic = name;
    };

    if (!this.musicAudio.paused) {
      this.fadeOut(this.musicAudio, startTrack);
    } else {
      startTrack();
    }
  },

  playAmbient(name) {
    if (this.currentAmbient === name) return;
    const path = `./audios/ambientes/${name}.mp3`;
    console.log("[audioManager] playAmbient:", name, path);

    const startAmbient = () => {
      this.ambientAudio = new Audio(path);
      this.fadeIn(this.ambientAudio);
      this.currentAmbient = name;
    };

    if (!this.ambientAudio.paused) {
      this.fadeOut(this.ambientAudio, startAmbient);
    } else {
      startAmbient();
    }
  },

  stopMusic() {
    if (!this.musicAudio.paused) {
      this.fadeOut(this.musicAudio);
    }
    this.currentMusic = null;
  },

  stopAmbient() {
    if (!this.ambientAudio.paused) {
      this.fadeOut(this.ambientAudio);
    }
    this.currentAmbient = null;
  },

  playEffect(effectName) {
    const path = `./audios/efeitos/${effectName}.mp3`;
    let fx = this.soundEffects[effectName];
    if (!fx) {
      fx = new Audio(path);
      fx.volume = 0.5;
      this.soundEffects[effectName] = fx;
    }
    fx.currentTime = 1.68; // delay para começar o som da porta (tempo vazio do áudio)
    fx.play().catch(err => console.warn("audioManager.playEffect()", err));
  },

  playFinalMusic(type) {
    console.log("[audioManager] playFinalMusic:", type);
    this.stopAmbient();
    this.stopMusic();

    let file = null;
    if (type === "finalBom")  file = "final-bom";
    if (type === "finalRuim") file = "final-ruim";
    if (!file) return;

    this.musicAudio = new Audio(`./audios/musicas/${file}.mp3`);
    this.musicAudio.loop = true;
    this.musicAudio.volume = this.DEFAULT_VOLUME;
    this.musicAudio.play().catch(err => console.warn("audioManager.playFinalMusic()", err));
    this.currentMusic = null;
  },

  setMap(mapName) {
    const mapsWithAudio = {
      casa:            { music: "cidade",   ambient: null },
      sala:            { music: null,       ambient: "quarto" },
      quarto:          { music: null,       ambient: "quarto" },
      quartoNoite:     { music: "quarto-noite",       ambient: "quarto-noite" },
      trabalho:        { music: "cidade",   ambient: null },
      casino:          { music: "cidade",   ambient: null },
      casinoInterno:   { music: "casino",   ambient: null },
      shopping:        { music: "cidade",   ambient: null },
      shoppingInterno: { music: null,       ambient: "shopping" },
    };

    const cfg = mapsWithAudio[mapName];
    if (!cfg) {
      console.warn(`[audioManager] sem definição para mapa '${mapName}'`);
      return;
    }

    console.log(`[audioManager] setMap('${mapName}') →`, cfg);

    // Música
    if (cfg.music) {
      this.playMusic(cfg.music);
    } else {
      this.stopMusic();
    }

    // Ambiência
    if (cfg.ambient) {
      this.playAmbient(cfg.ambient);
    } else {
      this.stopAmbient();
    }
  }
};
