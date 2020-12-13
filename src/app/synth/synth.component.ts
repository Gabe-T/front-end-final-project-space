import { Component, OnInit } from '@angular/core';
import { AMSynth, OmniOscillator, Player } from 'tone';
//import { Tone } from 'tone/build/esm/core/Tone';
import * as Tone from 'tone';
import * as Tonal from '@tonaljs/tonal';
// import * as p5 from 'p5';
// import * as dat from 'dat.gui';
import { StereoFeedbackEffect } from 'tone/build/esm/effect/StereoFeedbackEffect';

@Component({
  selector: 'app-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.css'],
})
export class SynthComponent implements OnInit {
  p5;
  gui;
  //--------Signal Generators--------//
  synth1: any;
  synth2: any;
  synth3: any;
  noise: any;
  delay: any;
  reverb: any;
  autofilter: any;
  autofilter2: any;
  masterFilter: any;
  osc2Filter: any;
  osc3Filter: any;
  kick: any;
  //---------Processors--------//
  vol: any;
  mixer: any;
  amp1: any;
  amp2: any;
  amp3: any;
  amp4: any;
  amp5: any;
  //--------note/pattern/trigger----//
  note1: any;
  scale1: any;
  scale2: any;
  scale3: any;
  loop1: any;
  pattern1: any;
  loopBeat: any;
  counter: number;

  msdown: boolean = false;

  //--------------SLIDERS--------------//
  //OSC1
  sliderOsc1PitchValue: number = 1;
  sliderOsc1FilterLfoValue: number = 2;
  sliderOsc1LevelValue: number = 0.5;

  switchOsc3ADValue: boolean = false;

  //OSC2
  sliderOsc2FilterValue: number = 10000;
  sliderOsc2LevelValue: number = 0.5;
  sliderOsc2IntervalValue: number = 7;
  switchOsc2ADValue: boolean = false;
  switchOsc2TypeValue: boolean;

  //OSC3
  sliderOsc3FilterValue: number = 10000;
  sliderOsc3LevelValue: number = 0.5;
  sliderOsc3IntervalValue: number = 7;
  switchOsc3TypeValue: boolean = false;
  //NOISE
  sliderNoiseLevelValue: number = 0.3;
  sliderNoiseFilterValue: number = 60;
  //FX //OTHER
  sliderReverbLevelValue: number = 0.01;
  sliderDelayLevelValue: number = 0.75;
  sliderDelayTimeValue: number = 0.3333;
  sliderMasterVolumeValue: number = -12;
  sliderMasterFilterValue: number = 12000;
  sliderKickVolValue: number = 0;
  bpmSliderValue: number = 120;
  noteOsc1: any;
  key1: any;
  flavor: string;
  wave1: any;
  comp: any;

  constructor() {
    //const gui = new dat.GUI();
    this.key1 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    this.scale1 = Tonal.Scale.get('C1' + ' major').notes;
    this.scale1 = this.scale1.concat(Tonal.Scale.get('C2' + ' major').notes);
    this.scale1 = this.scale1.concat(Tonal.Scale.get('C3' + ' major').notes);

    this.scale2 = Tonal.Scale.get('C3' + ' major').notes;
    this.scale2 = this.scale2.concat(Tonal.Scale.get('C4' + ' major').notes);

    this.scale3 = Tonal.Scale.get('C4' + ' major').notes;
    this.scale3 = this.scale3.concat(Tonal.Scale.get('C5' + ' major').notes);

    Tone.Transport.bpm.value = this.bpmSliderValue;
    //this.noteOsc1 = this.scale1[this.sliderOsc1PitchValue];

    this.synth1 = new Tone.Oscillator('C1', 'sawtooth');
    this.synth2 = new Tone.Synth();
    this.synth3 = new Tone.Synth({
      oscillator: {
        type: 'sine',
      },
      portamento: 0.005,
    });
    this.noise = new Tone.Noise({ type: 'white' });
    this.kick = new Tone.MembraneSynth({});

    this.osc2Filter = new Tone.Filter();
    this.osc3Filter = new Tone.Filter();

    this.amp1 = new Tone.Gain(0.5);
    this.amp2 = new Tone.Gain(0.5);
    this.amp3 = new Tone.Gain(0.5);
    this.amp4 = new Tone.Gain(0.5);
    this.amp5 = new Tone.Gain(0);
    this.comp = new Tone.Compressor(-20, 4);
    this.mixer = new Tone.Gain(0.8);
    this.delay = new Tone.PingPongDelay({
      wet: this.sliderDelayLevelValue,
      delayTime: this.sliderDelayTimeValue,
      feedback: 0.25,
    });
    this.reverb = new Tone.Reverb({
      wet: this.sliderReverbLevelValue,
      decay: 20,
    });
    this.autofilter = new Tone.AutoFilter({
      baseFrequency: 60,
      depth: 0.6,
      frequency: 0.1,
      octaves: 4,
      type: 'sine',
    });
    this.autofilter2 = new Tone.AutoFilter({
      baseFrequency: 100,
      depth: 0.6,
      frequency: 0.05,
      octaves: 4,
      type: 'sine',
    });
    this.masterFilter = new Tone.Filter(this.sliderMasterFilterValue);
    this.vol = new Tone.Volume(this.sliderMasterVolumeValue);

    this.counter = 0;

    //MIX BUSS
    //consider using chains!!
    this.synth1.connect(this.amp1);
    this.amp1.connect(this.autofilter);
    this.autofilter.connect(this.mixer);

    this.synth2.connect(this.osc2Filter);
    this.osc2Filter.connect(this.amp2);
    this.amp2.connect(this.mixer);

    this.synth3.connect(this.osc3Filter);
    this.osc3Filter.connect(this.amp3);
    this.amp3.connect(this.mixer);

    this.noise.connect(this.amp4);
    this.amp4.connect(this.autofilter2);
    this.autofilter2.connect(this.mixer);

    this.kick.connect(this.amp5);
    this.amp5.connect(this.vol);

    this.mixer.connect(this.masterFilter);
    this.masterFilter.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.connect(this.vol);
    this.vol.connect(this.comp);
    this.comp.toDestination();

    //Loop Function
    const song = (time) => {
      this.counter = this.counter + 1;

      let note1 = this.scale2[this.counter % 7];
      let note2 = this.scale3[this.counter % 24];

      if (this.counter % this.sliderOsc2IntervalValue === 0) {
        this.synth2.triggerAttackRelease(note1, '4n', time);
      }

      if (this.counter % this.sliderOsc3IntervalValue !== 0) {
        this.synth3.triggerAttackRelease(note2, '8n', time);
      }

      if (this.counter % 4 === 0)
        this.kick.triggerAttackRelease('c1', '16n', time, 1);
    };

    this.loop1 = new Tone.Loop(song, '16n');
  }

  getOscSlider(value: number) {
    this.synth1.frequency.value = this.scale1[value];

    this.synth3.frequency.value = this.scale3[value];
    this.key1[this.sliderOsc1PitchValue];
  }

  getOsc2FilterSlider(value: number) {
    this.osc2Filter.frequency.value = value;
  }
  getOsc3FilterSlider(value: number) {
    this.osc3Filter.frequency.value = value;
  }

  getAmp1Slider(value: number) {
    this.amp1.gain.value = value;
  }
  getAmp2Slider(value: number) {
    this.amp2.gain.value = value;
  }
  getAmp3Slider(value: number) {
    this.amp3.gain.value = value;
  }
  getAmp4Slider(value: number) {
    this.amp4.gain.value = value;
  }
  getAmp5Slider(value: number) {
    this.amp5.gain.value = value;
  }

  getReverbLevelValue(value: number) {
    this.reverb.wet.value = value;
  }

  getDelayLevelValue(value: number) {
    this.delay.wet.value = value;
  }

  getDelayTimeValue(value: number) {
    this.delay.delayTime.value = value;
  }
  getFilterSlider(value: number) {
    this.autofilter.frequency.value = value;
  }
  getNoiseFilterSlider(value: number) {
    this.autofilter2.baseFrequency = value;
  }
  getOsc2IntervalSlider(value: number) {
    this.sliderOsc2IntervalValue = value;
  }

  getOsc2ADSwitch() {
    if (this.switchOsc2ADValue === true) {
      this.synth2.envelope.attack = 0.001;
    } else {
      this.synth2.envelope.attack = 0.2;
      this.synth2.envelope.decay = 1;
    }
  }

  getOsc2TypeSwitch() {
    if (this.switchOsc2TypeValue === true) {
      this.synth2.oscillator.type = 'sine';
    } else {
      this.synth2.oscillator.type = 'square';
    }
  }

  getOsc3TypeSwitch() {
    if (this.switchOsc3TypeValue === true) {
      this.synth3.oscillator.type = 'sawtooth';
    } else {
      this.synth3.oscillator.type = 'sine';
    }
    console.log(this.synth3.oscillator.type);
  }

  getOsc3ADSwitch() {
    if (this.switchOsc3ADValue === true) {
      this.synth3.envelope.attack = 0.001;
    } else {
      this.synth3.envelope.attack = 0.2;
      this.synth3.envelope.decay = 1;
    }
    console.log(this.switchOsc3ADValue);
  }

  getOsc3IntervalSlider(value: number) {
    this.sliderOsc3IntervalValue = value;
  }

  getMasterVolSlider(value: number) {
    this.vol.volume.value = value;
  }
  getMasterFilterSlider(value: number) {
    this.masterFilter.frequency.value = value;
  }

  getBPMSlider(value: number) {
    Tone.Transport.bpm.value = value;
  }

  getChecked1(value: boolean) {
    console.log(value);
  }
  play() {
    this.vol.mute = false;
    Tone.Transport.start();
    this.synth1.start();
    this.noise.start();
    this.loop1.start();
    Tonal.Collection.shuffle(this.scale2);
    Tonal.Collection.shuffle(this.scale3);
    // //P5-------------------------
    // setTimeout(() => {
    //   this.wave1.getValue();
    // }, 7000);
    // //P5---------------------------------------
  }

  stop() {
    Tone.Transport.stop();
    this.synth1.stop();
    this.noise.stop();
    this.loop1.stop();
    //this.vol.mute = true;
    console.log('transport/osc1/noise stopped');
  }

  ngOnInit(): void {
    Tone.start();
    this.autofilter.start();
    this.autofilter2.start();
  }
}
//ideas
//1. ramp up the gain with play() from 0 to smoothly bring in sounds of oscillators and sequences
//2.

// setTimeout(() => {
//   this.createCanvas();
// }, 3000);
//p5-----------------------------------------------------

// osc1Wave(p: any) {
//   p.setup = () => {
//     p.createCanvas(125, 60).parent('osc1-canvas');
//     p.background(0);
//     p.stroke(255);
//   };
//   p.draw = () => {
//     let buffer = this.wave1.getValue();
//     for (let i = 0; i < buffer.length; i++) {
//       let x1 = p.map(i - 1, 0, buffer.length, 0, p.width);
//       let y1 = p.map(buffer[i - 1], -1, 1, 0, p.height);
//       let x2 = p.map(i, 0, buffer.length, 0, p.width);
//       let y2 = p.map(buffer[i], -1, 1, 0, p.height);
//       p.line(x1, y1, x2, y2);
//     }
//   };
// }
//----------------------------------------------------------
