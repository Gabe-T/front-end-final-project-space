import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';
import * as Tonal from '@tonaljs/tonal';
import { PatchService } from '../patch.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.css'],
})
export class SynthComponent implements OnInit {
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

  //OSC2
  sliderOsc2FilterValue: number = 10000;
  sliderOsc2LevelValue: number = 0.5;
  sliderOsc2IntervalValue: number = 7;
  switchOsc2ADValue: boolean = true;
  switchOsc2TypeValue: boolean = false;

  //OSC3
  sliderOsc3FilterValue: number = 10000;
  sliderOsc3LevelValue: number = 0.5;
  sliderOsc3IntervalValue: number = 7;
  switchOsc3ADValue: boolean = true;
  switchOsc3TypeValue: boolean = false;
  //NOISE
  sliderNoiseLevelValue: number = 0.3;
  sliderNoiseFilterValue: number = 60;
  //FX
  sliderReverbLevelValue: number = 0.01;
  sliderDelayLevelValue: number = 0.75;
  sliderDelayTimeValue: number = 0.3333;
  comp: any;
  sliderMasterVolumeValue: number = -12;
  sliderMasterFilterValue: number = 12000;
  sliderKickVolValue: number = 0;
  bpmSliderValue: number = 120;
  noteOsc1: any;
  key1: any;
  flavor: string;
  wave1: any;
  patches: any;

  constructor(private patchService: PatchService) {
    //----------------------Tonal Scales----------------------
    this.key1 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    this.scale1 = Tonal.Scale.get('C1' + ' major').notes;
    this.scale1 = this.scale1.concat(Tonal.Scale.get('C2' + ' major').notes);
    this.scale1 = this.scale1.concat(Tonal.Scale.get('C3' + ' major').notes);

    this.scale2 = Tonal.Scale.get('C3' + ' major').notes;
    this.scale2 = this.scale2.concat(Tonal.Scale.get('C4' + ' major').notes);

    this.scale3 = Tonal.Scale.get('C4' + ' major').notes;
    this.scale3 = this.scale3.concat(Tonal.Scale.get('C5' + ' major').notes);

    Tone.Transport.bpm.value = this.bpmSliderValue;

    //----------------------Signal Generators----------------------
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
    this.amp3 = new Tone.Gain(0.2);
    this.amp4 = new Tone.Gain(0.5);
    this.amp5 = new Tone.Gain(0);
    this.comp = new Tone.Compressor(-20, 2);
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

    //----------------------MIX/OUTPUT BUSS----------------------
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

    //----------------------Loop Function for OSC1/OSC2----------------------
    this.counter = 0;
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
        this.kick.triggerAttackRelease('c1', '8n', time, 1);
    };

    this.loop1 = new Tone.Loop(song, '16n');
  }

  //----------------------UI Functions----------------------
  getOscSlider(value: number) {
    this.sliderOsc1PitchValue = value;
    this.synth1.frequency.value = this.scale1[value];

    this.key1[this.sliderOsc1PitchValue];
  }

  getOsc2FilterSlider(value: number) {
    this.sliderOsc2FilterValue = value;
    this.osc2Filter.frequency.value = value;
  }
  getOsc3FilterSlider(value: number) {
    this.sliderOsc3FilterValue = value;
    this.osc3Filter.frequency.value = value;
  }

  getAmp1Slider(value: number) {
    this.sliderOsc1LevelValue = value;
    this.amp1.gain.value = value;
    console.log(this.sliderOsc1LevelValue);
  }
  getAmp2Slider(value: number) {
    this.sliderOsc2LevelValue = value;
    this.amp2.gain.value = value;
  }
  getAmp3Slider(value: number) {
    this.sliderOsc3LevelValue = value;
    this.amp3.gain.value = value;
  }
  getAmp4Slider(value: number) {
    this.sliderNoiseLevelValue = value;
    this.amp4.gain.value = value;
  }
  getAmp5Slider(value: number) {
    this.sliderKickVolValue = value;
    this.amp5.gain.value = value;
  }

  getReverbLevelValue(value: number) {
    this.sliderReverbLevelValue = value;
    this.reverb.wet.value = value;
  }

  getDelayLevelValue(value: number) {
    this.sliderDelayLevelValue = value;
    this.delay.wet.value = value;
  }

  getDelayTimeValue(value: number) {
    this.sliderDelayTimeValue = value;
    this.delay.delayTime.value = value;
  }
  getFilterSlider(value: number) {
    this.sliderOsc1FilterLfoValue = value;
    this.autofilter.frequency.value = value;
  }
  getNoiseFilterSlider(value: number) {
    this.sliderNoiseFilterValue = value;
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

  getOsc2ADSwitchV2 = (value: boolean) => {
    if (value === true) {
      this.switchOsc2ADValue = true;
      this.synth2.envelope.attack = 0.001;
    } else {
      this.switchOsc2ADValue = false;
      this.synth2.envelope.attack = 0.2;
      this.synth2.envelope.decay = 1;
    }
  };

  getOsc2TypeSwitch() {
    if (this.switchOsc2TypeValue === true) {
      this.synth2.oscillator.type = 'sine';
    } else {
      this.synth2.oscillator.type = 'triangle';
    }
  }

  getOsc2TypeSwitchV2 = (value: boolean) => {
    if (value === true) {
      this.switchOsc2TypeValue = true;
      this.synth2.oscillator.type = 'sine';
    } else {
      this.switchOsc2TypeValue = false;
      this.synth2.oscillator.type = 'triangle';
    }
  };

  getOsc3TypeSwitch() {
    if (this.switchOsc3TypeValue === true) {
      this.synth3.oscillator.type = 'sawtooth';
    } else {
      this.synth3.oscillator.type = 'sine';
    }
  }

  getOsc3TypeSwitchV2 = (value: boolean) => {
    if (value === true) {
      this.switchOsc3TypeValue = true;
      this.synth3.oscillator.type = 'sawtooth';
    } else {
      this.switchOsc3TypeValue = false;
      this.synth3.oscillator.type = 'sine';
    }
  };

  getOsc3ADSwitch() {
    if (this.switchOsc3ADValue === true) {
      this.synth3.envelope.attack = 0.001;
    } else {
      this.synth3.envelope.attack = 0.2;
      this.synth3.envelope.decay = 1;
    }
  }

  getOsc3ADSwitchV2 = (value: boolean) => {
    if (value === true) {
      this.switchOsc3ADValue = true;
      this.synth3.envelope.attack = 0.001;
    } else {
      this.switchOsc3ADValue = false;
      this.synth3.envelope.attack = 0.2;
      this.synth3.envelope.decay = 1;
    }
  };

  getOsc3IntervalSlider = (value: number) => {
    this.sliderOsc3IntervalValue = value;
  };

  getMasterVolSlider(value: number) {
    this.sliderMasterVolumeValue = value;
    this.vol.volume.value = value;
  }
  getMasterFilterSlider(value: number) {
    this.sliderMasterFilterValue = value;
    this.masterFilter.frequency.value = value;
  }

  getBPMSlider(value: number) {
    this.bpmSliderValue = value;
    Tone.Transport.bpm.value = value;
  }

  play() {
    this.vol.mute = false;
    Tone.Transport.start();
    this.synth1.start();
    this.noise.start();
    this.loop1.start();
    Tonal.Collection.shuffle(this.scale2);
    Tonal.Collection.shuffle(this.scale3);
  }

  stop() {
    Tone.Transport.stop();
    this.synth1.stop();
    this.noise.stop();
    this.loop1.stop();
    console.log('transport/osc1/noise stopped');
  }

  ngOnInit(): void {
    Tone.start();
    this.autofilter.start();
    this.autofilter2.start();
    this.getPatches();
  }

  //----------------------Patch saving and loading-------------------
  getPatches = () => {
    this.patchService.getPatches().subscribe((response) => {
      this.patches = response;
      console.log(this.patches);
    });
  };

  submitPatch = (form: NgForm) => {
    let name = form.value.name;
    let patch: any = {
      patch_name: name,
      osc1_pitch_value: this.sliderOsc1PitchValue,
      osc1_filter_lfo_value: this.sliderOsc1FilterLfoValue,
      osc1_level_value: this.sliderOsc1LevelValue,
      osc2_filter_value: this.sliderOsc2FilterValue,
      osc2_level_value: this.sliderOsc2LevelValue,
      osc2_interval_value: this.sliderOsc2IntervalValue,
      osc2_ad_value: this.switchOsc2ADValue,
      osc2_type_value: this.switchOsc2TypeValue,
      osc3_filter_value: this.sliderOsc3FilterValue,
      osc3_level_value: this.sliderOsc3LevelValue,
      osc3_interval_value: this.sliderOsc3IntervalValue,
      osc3_type_value: this.switchOsc3ADValue,
      osc3_ad_value: this.switchOsc3ADValue,
      noise_level_value: this.sliderNoiseLevelValue,
      noise_filter_value: this.sliderNoiseFilterValue,
      reverb_level_value: this.sliderReverbLevelValue,
      delay_level_value: this.sliderDelayLevelValue,
      delay_time_value: this.sliderDelayTimeValue,
      master_volume_value: this.sliderMasterVolumeValue,
      master_filter_value: this.sliderMasterFilterValue,
      kick_vol_value: this.sliderKickVolValue,
      bpm_value: this.bpmSliderValue,
    };
    console.log(patch);
    this.patchService.postPatch(patch).subscribe((response) => {
      this.getPatches();
    });
    form.reset();
  };

  loadPatch = (synthID: string) => {
    let id = parseInt(synthID);

    let found = this.patches.find((patch) => {
      return patch.id === id;
    });
    this.getOscSlider(found.osc1_pitch_value);
    this.getFilterSlider(found.osc1_filter_lfo_value);
    this.getAmp1Slider(found.osc1_level_value);
    this.getOsc2FilterSlider(found.osc2_filter_value);
    this.getAmp2Slider(found.osc2_level_value);
    this.getOsc2IntervalSlider(found.osc2_interval_value);
    this.getOsc2ADSwitchV2(found.osc2_ad_value);
    this.getOsc2TypeSwitchV2(found.osc2_type_value);
    this.getOsc3FilterSlider(found.osc3_filter_value);
    this.getAmp3Slider(found.osc3_level_value);
    this.getOsc3IntervalSlider(found.osc3_interval_value);
    this.getOsc3TypeSwitchV2(found.osc3_type_value);
    this.getOsc3ADSwitchV2(found.osc3_ad_value);
    this.getAmp4Slider(found.noise_level_value);
    this.getNoiseFilterSlider(found.noise_filter_value);
    this.getReverbLevelValue(found.reverb_level_value);
    this.getDelayLevelValue(found.delay_level_value);
    this.getDelayTimeValue(found.delay_time_value);
    this.getMasterVolSlider(found.master_volume_value);
    this.getMasterFilterSlider(found.master_filter_value);
    this.getAmp5Slider(found.kick_vol_value);
    this.getBPMSlider(found.bpm_value);
    this.getMasterFilterSlider(found.master_filter_value);
  };
}
