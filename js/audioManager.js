class AudioManager {
    constructor() {
        // We'll initialize AudioContext on first user interaction to comply with browser autoplay policies.
        this.ctx = null;
        this.masterVolume = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = this.ctx.createGain();
        this.masterVolume.gain.value = 0.2; // Keep it low
        this.masterVolume.connect(this.ctx.destination);
        this.initialized = true;
    }

    _playTone(freq, type, duration, vol = 1) {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterVolume);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playMoveSound() {
        this._playTone(440, 'square', 0.1, 0.2); // short beep
    }

    playBumpSound() {
        this._playTone(150, 'sawtooth', 0.15, 0.3); // low dud
    }

    playSelectSound() {
        this._playTone(880, 'sine', 0.1, 0.4); // high ping
    }

    playAttackSound() {
        // Quick noise/slash sound
        if (!this.initialized) return;
        this._playTone(200, 'square', 0.1, 0.5);
        setTimeout(() => this._playTone(150, 'sawtooth', 0.1, 0.5), 50);
    }

    playMagicSound() {
        if (!this.initialized) return;
        this._playTone(600, 'sine', 0.1, 0.3);
        setTimeout(() => this._playTone(800, 'sine', 0.1, 0.3), 100);
        setTimeout(() => this._playTone(1000, 'sine', 0.2, 0.3), 200);
    }

    playDamageSound() {
        this._playTone(100, 'sawtooth', 0.3, 0.8);
    }

    playWinSound() {
        if (!this.initialized) return;
        this._playTone(400, 'square', 0.2, 0.5);
        setTimeout(() => this._playTone(500, 'square', 0.2, 0.5), 200);
        setTimeout(() => this._playTone(600, 'square', 0.4, 0.5), 400);
    }

    playBGM(type) {
        // A full BGM loop is complex with Vanilla Web Audio API
        // For this demo, we'll just log it. A background arpeggiator could be added.
        console.log("Playing BGM:", type);
    }
}

export const audio = new AudioManager();
