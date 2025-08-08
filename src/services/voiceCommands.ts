interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  parameters: Record<string, unknown>;
  confidence: number;
  category: 'playback' | 'mixing' | 'effects' | 'navigation' | 'analytics';
}

interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  commands: VoiceCommand[];
  timestamp: Date;
}

class VoiceCommandService {
  private isListening = false;
  private recognition: SpeechRecognition | null = null;
  private commands: VoiceCommand[] = [];
  private onCommandCallback: ((command: VoiceCommand) => void) | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeVoiceRecognition();
    this.setupCommands();
  }

  private initializeVoiceRecognition() {
    try {
      // Check for browser support
      if (
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.setupRecognitionHandlers();
        this.isInitialized = true;
        console.log('🎤 Voice Command Service initialized');
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize voice recognition:', error);
    }
  }

  private setupRecognitionHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('🎤 Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ')
        .toLowerCase();

      if (event.results[event.results.length - 1].isFinal) {
        this.processTranscript(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      console.log('🎤 Voice recognition ended');
      this.isListening = false;
    };
  }

  private setupCommands() {
    this.commands = [
      // Playback Commands
      {
        id: 'play-deck-a',
        phrase: 'play deck a',
        action: 'playDeck',
        parameters: { deck: 'A' },
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'play-deck-b',
        phrase: 'play deck b',
        action: 'playDeck',
        parameters: { deck: 'B' },
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'pause-deck-a',
        phrase: 'pause deck a',
        action: 'pauseDeck',
        parameters: { deck: 'A' },
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'pause-deck-b',
        phrase: 'pause deck b',
        action: 'pauseDeck',
        parameters: { deck: 'B' },
        confidence: 0.9,
        category: 'playback',
      },
      {
        id: 'stop-all',
        phrase: 'stop all',
        action: 'stopAll',
        parameters: {},
        confidence: 0.9,
        category: 'playback',
      },

      // Mixing Commands
      {
        id: 'crossfade-left',
        phrase: 'crossfade left',
        action: 'setCrossfader',
        parameters: { position: 0.2 },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'crossfade-center',
        phrase: 'crossfade center',
        action: 'setCrossfader',
        parameters: { position: 0.5 },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'crossfade-right',
        phrase: 'crossfade right',
        action: 'setCrossfader',
        parameters: { position: 0.8 },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'volume-up',
        phrase: 'volume up',
        action: 'adjustVolume',
        parameters: { direction: 'up', amount: 0.1 },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'volume-down',
        phrase: 'volume down',
        action: 'adjustVolume',
        parameters: { direction: 'down', amount: 0.1 },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'master-volume',
        phrase: 'master volume',
        action: 'setMasterVolume',
        parameters: { volume: 0.8 },
        confidence: 0.7,
        category: 'mixing',
      },

      // Effects Commands
      {
        id: 'add-reverb',
        phrase: 'add reverb',
        action: 'setEffect',
        parameters: { effect: 'reverb', value: 0.5 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'remove-reverb',
        phrase: 'remove reverb',
        action: 'setEffect',
        parameters: { effect: 'reverb', value: 0 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'add-delay',
        phrase: 'add delay',
        action: 'setEffect',
        parameters: { effect: 'delay', value: 0.3 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'remove-delay',
        phrase: 'remove delay',
        action: 'setEffect',
        parameters: { effect: 'delay', value: 0 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'eq-low-up',
        phrase: 'boost bass',
        action: 'setEQ',
        parameters: { band: 'low', value: 6 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'eq-low-down',
        phrase: 'cut bass',
        action: 'setEQ',
        parameters: { band: 'low', value: -6 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'eq-high-up',
        phrase: 'boost treble',
        action: 'setEQ',
        parameters: { band: 'high', value: 6 },
        confidence: 0.8,
        category: 'effects',
      },
      {
        id: 'eq-high-down',
        phrase: 'cut treble',
        action: 'setEQ',
        parameters: { band: 'high', value: -6 },
        confidence: 0.8,
        category: 'effects',
      },

      // Navigation Commands
      {
        id: 'next-track',
        phrase: 'next track',
        action: 'nextTrack',
        parameters: {},
        confidence: 0.9,
        category: 'navigation',
      },
      {
        id: 'previous-track',
        phrase: 'previous track',
        action: 'previousTrack',
        parameters: {},
        confidence: 0.9,
        category: 'navigation',
      },
      {
        id: 'jump-to-cue',
        phrase: 'jump to cue',
        action: 'jumpToCue',
        parameters: { cueNumber: 1 },
        confidence: 0.7,
        category: 'navigation',
      },
      {
        id: 'set-cue',
        phrase: 'set cue',
        action: 'setCue',
        parameters: { cueNumber: 1 },
        confidence: 0.7,
        category: 'navigation',
      },

      // Analytics Commands
      {
        id: 'show-analytics',
        phrase: 'show analytics',
        action: 'showAnalytics',
        parameters: {},
        confidence: 0.9,
        category: 'analytics',
      },
      {
        id: 'hide-analytics',
        phrase: 'hide analytics',
        action: 'hideAnalytics',
        parameters: {},
        confidence: 0.9,
        category: 'analytics',
      },
      {
        id: 'crowd-energy',
        phrase: 'crowd energy',
        action: 'getCrowdEnergy',
        parameters: {},
        confidence: 0.8,
        category: 'analytics',
      },
      {
        id: 'transition-quality',
        phrase: 'transition quality',
        action: 'getTransitionQuality',
        parameters: {},
        confidence: 0.8,
        category: 'analytics',
      },

      // Advanced Commands
      {
        id: 'auto-mix',
        phrase: 'auto mix',
        action: 'enableAutoMix',
        parameters: { enabled: true },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'stop-auto-mix',
        phrase: 'stop auto mix',
        action: 'enableAutoMix',
        parameters: { enabled: false },
        confidence: 0.8,
        category: 'mixing',
      },
      {
        id: 'energy-build',
        phrase: 'energy build',
        action: 'energyBuild',
        parameters: { duration: 30 },
        confidence: 0.7,
        category: 'mixing',
      },
      {
        id: 'drop-track',
        phrase: 'drop track',
        action: 'dropTrack',
        parameters: { deck: 'A' },
        confidence: 0.8,
        category: 'playback',
      },
    ];
  }

  private processTranscript(transcript: string): VoiceRecognitionResult {
    const matchedCommands: VoiceCommand[] = [];

    // Find matching commands
    for (const command of this.commands) {
      if (transcript.includes(command.phrase)) {
        const matchConfidence = this.calculateMatchConfidence(
          transcript,
          command.phrase
        );
        if (matchConfidence > 0.6) {
          matchedCommands.push({
            ...command,
            confidence: matchConfidence,
          });
        }
      }
    }

    // Sort by confidence
    matchedCommands.sort((a, b) => b.confidence - a.confidence);

    const result: VoiceRecognitionResult = {
      transcript,
      confidence:
        matchedCommands.length > 0 ? matchedCommands[0].confidence : 0,
      commands: matchedCommands,
      timestamp: new Date(),
    };

    // Execute the best match
    if (matchedCommands.length > 0) {
      const bestMatch = matchedCommands[0];
      console.log(`🎤 Voice command: "${transcript}" -> ${bestMatch.action}`);

      if (this.onCommandCallback) {
        this.onCommandCallback(bestMatch);
      }
    }

    return result;
  }

  private calculateMatchConfidence(transcript: string, phrase: string): number {
    const words = transcript.split(' ');
    const phraseWords = phrase.split(' ');

    let matches = 0;
    for (const word of phraseWords) {
      if (words.some((w) => w.includes(word) || word.includes(w))) {
        matches++;
      }
    }

    return matches / phraseWords.length;
  }

  /**
   * Start listening for voice commands
   */
  startListening(): void {
    if (!this.recognition || !this.isInitialized) {
      console.warn('Voice recognition not available');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
    }
  }

  /**
   * Stop listening for voice commands
   */
  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Set callback for when commands are recognized
   */
  onCommand(callback: (command: VoiceCommand) => void): void {
    this.onCommandCallback = callback;
  }

  /**
   * Get available commands
   */
  getCommands(): VoiceCommand[] {
    return this.commands;
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category: string): VoiceCommand[] {
    return this.commands.filter((cmd) => cmd.category === category);
  }

  /**
   * Add custom command
   */
  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  /**
   * Remove command by ID
   */
  removeCommand(commandId: string): void {
    this.commands = this.commands.filter((cmd) => cmd.id !== commandId);
  }

  /**
   * Get listening status
   */
  isListeningForCommands(): boolean {
    return this.isListening;
  }

  /**
   * Get initialization status
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get voice recognition status
   */
  getStatus(): {
    isInitialized: boolean;
    isListening: boolean;
    commandsCount: number;
    supported: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      isListening: this.isListening,
      commandsCount: this.commands.length,
      supported:
        'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.isListening = false;
    this.isInitialized = false;
    this.onCommandCallback = null;
  }
}

export const voiceCommandService = new VoiceCommandService();
export default voiceCommandService;
