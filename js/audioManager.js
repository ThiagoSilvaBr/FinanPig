// js/audioManager.js

export const audioManager = {
  musicAudio: new Audio(),
  ambientAudio: new Audio(),
  currentMusic: null,
  currentAmbient: null,
  soundEffects: {}, // Objeto para armazenar os efeitos pré-carregados

  playMusic(mapName) {
    const musicPath = `./audios/musicas/${mapName}.mp3`;

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
    const ambientPath = `./audios/ambientes/${mapName}.mp3`;

    if (this.currentAmbient !== mapName) {
      this.ambientAudio.pause();
      this.ambientAudio = new Audio(ambientPath);
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.5;
      this.ambientAudio.play().catch(() => {});
      this.currentAmbient = mapName;
    }
  },
//Ainda irei arrumar Melhor a questao dos efeitos sonoros. Atualizações Futuras. (Hojak)
 
// 🔊 Método para efeitos sonoros
  playEffect(effectName) {
    const path = `./audios/efeitos/${effectName}.mp3`;

    // Reutiliza se já estiver carregado
    if (!this.soundEffects[effectName]) {
      this.soundEffects[effectName] = new Audio(path);
      this.soundEffects[effectName].volume = 0.6;
    }

    const sound = this.soundEffects[effectName];
    
    // Se for o som da porta do Minecraft, ajusta o tempo e a velocidade
    if (effectName === "minecraft-porta-sound") {
        sound.currentTime = 1.65;      // Começa a partir de 1.65 segundo
        sound.playbackRate = 1.1;   // Acelera o som 
                                    // Ajuste este valor (ex: 1.2, 1.8, 2.0) conforme desejar
    } else {
        sound.currentTime = 0;      // Para outros efeitos, começa do início
        sound.playbackRate = 1.0;   // Garante que outros efeitos toquem em velocidade normal
    }
    
    sound.play().catch(() => {}); // Toca o som
  }
};