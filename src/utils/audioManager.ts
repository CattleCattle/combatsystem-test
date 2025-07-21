// Système de son pour le jeu

class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private musicVolume: number = 0.5;
  private soundVolume: number = 0.7;
  private isMuted: boolean = false;

  constructor() {
    // Charger les sons quand le gestionnaire est créé
    this.preloadSounds();
  }

  private preloadSounds() {
    // URLs des sons (placeholder - remplacer par de vrais fichiers audio)
    const soundUrls = {
      menuMusic: '/sounds/menu-music.mp3',
      battleMusic: '/sounds/battle-music.mp3',
      victoryMusic: '/sounds/victory.mp3',
      defeat: '/sounds/defeat.mp3',
      attack: '/sounds/attack.wav',
      heal: '/sounds/heal.wav',
      levelUp: '/sounds/levelup.wav',
      click: '/sounds/click.wav',
      damage: '/sounds/damage.wav',
      criticalHit: '/sounds/critical.wav',
    };

    Object.entries(soundUrls).forEach(([key, url]) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = key.includes('Music') ? this.musicVolume : this.soundVolume;
      
      // Gérer les erreurs de chargement
      audio.onerror = () => {
        console.warn(`Impossible de charger le son: ${key} (${url})`);
      };
      
      // Pour les musiques, les faire boucler
      if (key.includes('Music')) {
        audio.loop = true;
      }
      
      this.sounds[key] = audio;
    });
  }

  playSound(soundName: string, volume?: number) {
    if (this.isMuted) return;
    
    const sound = this.sounds[soundName];
    if (!sound) {
      console.warn(`Son non trouvé: ${soundName}`);
      return;
    }

    // Cloner le son pour permettre les sons simultanés
    const soundClone = sound.cloneNode() as HTMLAudioElement;
    soundClone.volume = volume ?? (soundName.includes('Music') ? this.musicVolume : this.soundVolume);
    
    soundClone.play().catch(error => {
      console.warn(`Erreur lors de la lecture du son ${soundName}:`, error);
    });

    return soundClone;
  }

  playMusic(musicName: string) {
    if (this.isMuted) return;
    
    // Arrêter toute musique en cours
    Object.entries(this.sounds).forEach(([key, sound]) => {
      if (key.includes('Music') && !sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
    });

    // Jouer la nouvelle musique
    const music = this.sounds[musicName];
    if (music) {
      music.volume = this.musicVolume;
      music.play().catch(error => {
        console.warn(`Erreur lors de la lecture de la musique ${musicName}:`, error);
      });
    }
  }

  stopMusic() {
    Object.entries(this.sounds).forEach(([key, sound]) => {
      if (key.includes('Music') && !sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    Object.entries(this.sounds).forEach(([key, sound]) => {
      if (key.includes('Music')) {
        sound.volume = this.musicVolume;
      }
    });
  }

  setSoundVolume(volume: number) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    Object.entries(this.sounds).forEach(([key, sound]) => {
      if (!key.includes('Music')) {
        sound.volume = this.soundVolume;
      }
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    }
    return this.isMuted;
  }

  getMusicVolume() {
    return this.musicVolume;
  }

  getSoundVolume() {
    return this.soundVolume;
  }

  isMutedState() {
    return this.isMuted;
  }
}

// Instance globale du gestionnaire audio
export const audioManager = new AudioManager();

// Hook React pour utiliser l'audio manager
import { useEffect, useState } from 'react';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(audioManager.isMutedState());
  const [musicVolume, setMusicVolumeState] = useState(audioManager.getMusicVolume());
  const [soundVolume, setSoundVolumeState] = useState(audioManager.getSoundVolume());

  const toggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  const setMusicVolume = (volume: number) => {
    audioManager.setMusicVolume(volume);
    setMusicVolumeState(volume);
  };

  const setSoundVolume = (volume: number) => {
    audioManager.setSoundVolume(volume);
    setSoundVolumeState(volume);
  };

  return {
    playSound: audioManager.playSound.bind(audioManager),
    playMusic: audioManager.playMusic.bind(audioManager),
    stopMusic: audioManager.stopMusic.bind(audioManager),
    toggleMute,
    setMusicVolume,
    setSoundVolume,
    isMuted,
    musicVolume,
    soundVolume,
  };
}
