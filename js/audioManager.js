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
        if (!this.initialized) return;
        if (this._currentBGM) {
            try { this._currentBGM.stop(); } catch(e) {}
        }
        
        const configs = {
            town: { freq: 220, type: 'sine', interval: 800, vol: 0.15 },
            forest: { freq: 180, type: 'triangle', interval: 1200, vol: 0.1 },
            dungeon: { freq: 120, type: 'sawtooth', interval: 600, vol: 0.12 },
            battle: { freq: 300, type: 'square', interval: 300, vol: 0.1 }
        };
        
        const cfg = configs[type] || configs.town;
        
        const playNote = () => {
            if (!this.initialized) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = cfg.type;
            const notes = [1, 1.2, 1.25, 1.5, 1.33];
            const note = notes[Math.floor(Math.random() * notes.length)];
            osc.frequency.setValueAtTime(cfg.freq * note, this.ctx.currentTime);
            gain.gain.setValueAtTime(cfg.vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (cfg.interval / 1000) * 0.8);
            osc.connect(gain);
            gain.connect(this.masterVolume);
            osc.start();
            osc.stop(this.ctx.currentTime + (cfg.interval / 1000) * 0.8);
        };
        
        playNote();
        this._bgmInterval = setInterval(playNote, cfg.interval);
        this._currentBGM = { stop: () => { clearInterval(this._bgmInterval); } };
    }

    stopBGM() {
        if (this._currentBGM) {
            try { this._currentBGM.stop(); } catch(e) {}
            this._currentBGM = null;
        }
        if (this._bgmInterval) {
            clearInterval(this._bgmInterval);
            this._bgmInterval = null;
        }
    }
}

export const audio = new AudioManager();
