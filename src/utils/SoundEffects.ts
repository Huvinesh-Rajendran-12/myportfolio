// Sound effects utility for retro portfolio
export class SoundEffects {
  private static instance: SoundEffects;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private hasInteracted: boolean = false;
  private pendingSounds: Array<{name: string, volume: number}> = [];

  // Sound URLs - these will be loaded when needed
  private soundUrls = {
    click: './sounds/click.mp3',
    enter: './sounds/enter.mp3',
    navigate: './sounds/navigate.mp3',
    startup: './sounds/startup.mp3',
    error: './sounds/error.mp3',
    keypress: './sounds/keypress.mp3',
  };
  
  // Fallback base paths to try if the primary path fails
  private fallbackBasePaths = [
    '',           // Try with no path prefix
    '/',          // Try with root path
    '/sounds/',   // Try with explicit sounds folder
    '../sounds/', // Try with relative path
    'sounds/',    // Try with folder only
  ];

  private constructor() {
    // Initialize with empty sounds map
    // Sounds will be loaded on demand
    
    // Set up interaction listener
    if (typeof window !== 'undefined') {
      const interactionEvents = ['click', 'touchstart', 'keydown'];
      
      const handleInteraction = () => {
        this.hasInteracted = true;
        
        // Play any pending sounds
        if (this.pendingSounds.length > 0) {
          this.pendingSounds.forEach(sound => {
            this.playSound(sound.name, sound.volume);
          });
          this.pendingSounds = [];
        }
        
        // Remove event listeners once interaction has occurred
        interactionEvents.forEach(event => {
          window.removeEventListener(event, handleInteraction);
        });
      };
      
      // Add event listeners for user interaction
      interactionEvents.forEach(event => {
        window.addEventListener(event, handleInteraction);
      });
    }
  }

  public static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  // Load a sound if it's not already loaded
  private loadSound(name: string): HTMLAudioElement {
    // If we already have a loaded sound, return it
    if (this.sounds.has(name)) {
      return this.sounds.get(name) || new Audio();
    }
    
    try {
      // Make sure the sound name exists in our URLs
      const soundFileName = this.soundUrls[name as keyof typeof this.soundUrls];
      if (!soundFileName) {
        console.error(`Sound '${name}' not found in sound URLs`);
        return new Audio(); // Return empty audio element
      }
      
      // Extract the filename without the path
      const fileName = soundFileName.split('/').pop() || soundFileName;
      
      // Try to load with the primary path first
      this.tryLoadSound(name, soundFileName);
      
      // Set up fallback loading if primary fails
      setTimeout(() => {
        // If the sound is still not loaded successfully after a short delay, try fallbacks
        if (!this.sounds.has(name) || !this.sounds.get(name)?.src) {
          this.tryFallbackPaths(name, fileName);
        }
      }, 300);
      
      // Return an empty audio element for now, it will be replaced when loaded
      return new Audio();
    } catch (error) {
      console.error(`Error in loadSound for '${name}':`, error);
      return new Audio(); // Return empty audio element
    }
  }
  
  // Try to load a sound with the given URL
  private tryLoadSound(name: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = 'auto';
    
    // Add error handling
    audio.onerror = (e) => {
      console.warn(`Could not load sound '${name}' from ${url}:`, e);
      // Will try fallbacks automatically
    };
    
    // Add load event to confirm sound is loaded
    audio.oncanplaythrough = () => {
      console.log(`Sound '${name}' loaded successfully from ${url}`);
      this.sounds.set(name, audio);
    };
    
    // Try to load the sound
    audio.load();
  }
  
  // Try loading the sound from various fallback paths
  private tryFallbackPaths(name: string, fileName: string): void {
    console.log(`Trying fallback paths for sound '${name}'...`);
    
    // Try each fallback path
    this.fallbackBasePaths.forEach((basePath, index) => {
      setTimeout(() => {
        const fullPath = `${basePath}${fileName}`;
        console.log(`Trying fallback path ${index + 1}/${this.fallbackBasePaths.length}: ${fullPath}`);
        this.tryLoadSound(name, fullPath);
      }, index * 100); // Stagger the attempts to avoid overwhelming the browser
    });
  }

  // Play a sound by name
  public play(name: string, volume: number = 0.5): void {
    if (!this.enabled) return;
    
    // If user hasn't interacted yet, queue the sound for later
    if (!this.hasInteracted) {
      this.pendingSounds.push({ name, volume });
      return;
    }
    
    this.playSound(name, volume);
  }
  
  // Internal method to actually play the sound
  private playSound(name: string, volume: number = 0.5): void {
    try {
      const sound = this.loadSound(name);
      
      // Check if sound is valid
      if (!sound.src) {
        console.warn(`Sound '${name}' has no source, skipping playback`);
        return;
      }
      
      sound.volume = volume;
      
      // Clone and play to allow overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = volume;
      
      // Add specific error handling for playback
      soundClone.onerror = (e) => {
        console.error(`Error during playback of sound '${name}':`, e);
      };
      
      // Play with error handling
      soundClone.play().catch(e => {
        console.error(`Error playing sound '${name}':`, e);
        // If we get an error, mark as not interacted to try again later
        if (e.name === 'NotAllowedError') {
          this.hasInteracted = false;
        }
      });
    } catch (error) {
      console.error(`Error playing sound '${name}':`, error);
    }
  }

  // Toggle sound on/off
  public toggleSound(enabled?: boolean): boolean {
    if (enabled !== undefined) {
      this.enabled = enabled;
    } else {
      this.enabled = !this.enabled;
    }
    
    // Play a confirmation sound when enabling
    if (this.enabled && this.hasInteracted) {
      // Small delay to ensure the toggle is complete
      setTimeout(() => this.playSound('click', 0.3), 50);
    }
    
    return this.enabled;
  }
  
  // Preload all sounds to ensure they're ready
  public preloadAllSounds(): void {
    Object.keys(this.soundUrls).forEach(soundName => {
      this.loadSound(soundName);
    });
  }

  // Check if sound is enabled
  public isSoundEnabled(): boolean {
    return this.enabled;
  }
}

// Export a singleton instance
export const soundEffects = SoundEffects.getInstance();
