const GameAudio = {
    ctx: null,
    musicTimer: null,
    step: 0,
    enabled: true,
    chords: [
        [261.63, 329.63, 392.00, 493.88],
        [220.00, 277.18, 329.63, 440.00],
        [246.94, 293.66, 369.99, 493.88],
        [196.00, 246.94, 329.63, 392.00]
    ],

    ensure(){
        if(!this.ctx){
            let AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if(!AudioContextClass) return null;
            this.ctx = new AudioContextClass();
        }
        if(this.ctx.state === "suspended")
            this.ctx.resume();
        return this.ctx;
    },

    click(){
        let ctx = this.ensure();
        if(!ctx) return;
        let now = ctx.currentTime;
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(760,now);
        osc.frequency.exponentialRampToValueAtTime(420,now+0.055);
        gain.gain.setValueAtTime(0.0001,now);
        gain.gain.exponentialRampToValueAtTime(0.055,now+0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001,now+0.075);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now+0.08);
        if(typeof simSettings !== "undefined" && simSettings.lofiMusic !== false)
            this.startMusic();
    },

    tone(freq,start,duration,volume,type){
        let ctx = this.ensure();
        if(!ctx) return;
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        let filter = ctx.createBiquadFilter();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq,start);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1150,start);
        filter.Q.setValueAtTime(0.65,start);
        gain.gain.setValueAtTime(0.0001,start);
        gain.gain.exponentialRampToValueAtTime(volume,start+0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start+duration+0.04);
    },

    startMusic(){
        if(this.musicTimer || this.enabled === false) return;
        let ctx = this.ensure();
        if(!ctx) return;
        this.musicTimer = setInterval(()=>this.musicStep(),620);
        this.musicStep();
    },

    stopMusic(){
        if(this.musicTimer){
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    },

    setMusicEnabled(enabled){
        this.enabled = enabled;
        if(enabled) this.startMusic();
        else this.stopMusic();
    },

    musicStep(){
        if(typeof simSettings !== "undefined" && simSettings.lofiMusic === false){
            this.stopMusic();
            return;
        }
        let ctx = this.ensure();
        if(!ctx) return;
        let chord = this.chords[floor(this.step/8)%this.chords.length];
        let beat = this.step%8;
        let now = ctx.currentTime + 0.03;
        if(beat === 0 || beat === 4){
            for(let i=0;i<chord.length;i++)
                this.tone(chord[i]/2,now+i*0.018,0.55,0.018,"sine");
            this.tone(chord[0]/4,now,0.7,0.026,"triangle");
        }
        let melody = chord[(beat*2 + floor(this.step/8))%chord.length] * (beat%3===0 ? 2 : 1);
        this.tone(melody,now+0.06,0.18,0.012,"triangle");
        if(beat === 2 || beat === 6)
            this.tone(chord[1],now+0.1,0.12,0.01,"sine");
        this.step++;
    }
};
