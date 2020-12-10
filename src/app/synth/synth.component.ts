import { Component, OnInit } from '@angular/core';
import { OmniOscillator, Player } from 'tone';
//import { Tone } from 'tone/build/esm/core/Tone';
import * as Tone from 'tone';
import * as Tonal from '@tonaljs/tonal';

@Component({
  selector: 'app-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.css']
})
export class SynthComponent implements OnInit {
  //--------Signal Generators--------//
  synth1:any;
  synth2:any;
  synth3:any;
  delay:any;
  reverb:any;
  autofilter:any;
  
  //---------Processors--------//
  vol:any;
  mixer:any;
  amp1:any;
  amp2:any;
  amp3:any;
  
  //--------note/pattern/trigger----//
  note1:any;
  scale1:any; 
  loop1:any;
  pattern1:any;
  loopBeat:any;
  counter:number;

  msdown:boolean = false;

  //--------------SLIDERS--------------//
  //OSC1
  sliderOsc1PitchValue:number = 100;
  sliderOsc1FilterLfoValue:number = 2;
  sliderOsc1LevelValue:number = .5;
  
  //OSC2
  sliderOsc2PitchValue:number = 200;
  sliderOsc2LevelValue:number = .5
  sliderOsc2IntervalValue:number =4;

  //OSC3
  sliderOsc3PitchValue:number = 400;
  sliderOsc3LevelValue:number = .5
  sliderOsc3IntervalValue:number =2;

  
  //FX //OTHER
  sliderReverbLevelValue:number = 0.01;
  sliderDelayLevelValue:number = .75;
  sliderDelayTimeValue:number = .3333;
  sliderMasterVolumeValue:number = -20;
  bpmSliderValue:number = 120;
  checked1:boolean;

  constructor() {
    Tone.Transport.bpm.value = this.bpmSliderValue;
    this.synth1 = new Tone.Oscillator(this.sliderOsc1PitchValue,"square");
    this.synth3 = new Tone.Synth(); 
    this.synth2 = new Tone.Synth();

    this.amp1 = new Tone.Gain(.5);
    this.amp2 = new Tone.Gain(.5);
    this.amp3 = new Tone.Gain(.5);

    this.mixer = new Tone.Gain(.8);
    this.delay = new Tone.PingPongDelay({
      wet: this.sliderDelayLevelValue,
      delayTime: this.sliderDelayTimeValue,
      feedback: .25
    });
    this.reverb = new Tone.Reverb({
      wet: this.sliderReverbLevelValue,
      decay: 10,

    })
    this.autofilter= new Tone.AutoFilter({
      baseFrequency:60,
      depth:.60,
      frequency: .1,
      octaves: 4,
      type:"sine"

    })
    this.vol = new Tone.Volume(this.sliderMasterVolumeValue);

    
    this.counter=0;
  
    this.scale1 = Tonal.Scale.get("C3 major").notes;
    this.scale1 = this.scale1.concat(Tonal.Scale.get("C4 major").notes)
    this.scale1 = this.scale1.concat(Tonal.Scale.get("C5 major").notes)

    Tonal.Collection.shuffle(this.scale1);

  
       
       //MIX BUSS
       //consider using chains!!
       this.synth1.connect(this.amp1);
       this.amp1.connect(this.autofilter);
       this.autofilter.connect(this.mixer);
       
       this.synth2.connect(this.amp2);
       this.amp2.connect(this.mixer);

       this.synth3.connect(this.amp3);
       this.amp3.connect(this.mixer);
       this.mixer.connect(this.delay);
       this.delay.connect(this.reverb);
       this.reverb.connect(this.vol);
       this.vol.toDestination();

       const song = ((time)=>{
        if (this.counter % this.sliderOsc2IntervalValue === 0){
          this.synth2.triggerAttackRelease(this.sliderOsc2PitchValue, "8n", time)
        }
        
        if (this.counter % this.sliderOsc3IntervalValue === 1){
          this.synth3.triggerAttackRelease(this.sliderOsc3PitchValue, "16n", time)
        }
        this.counter = (this.counter + 1)
      });
      
      
      this.loop1 = new Tone.Loop(song,'16n')
      }
      

      
      

   getOscSlider(value:number){
     this.synth1.frequency.value = value;
   }
   getAmp1Slider(value:number){
     this.amp1.gain.value = value;
   }
   getAmp2Slider(value:number){
    this.amp2.gain.value = value;
  }
  getAmp3Slider(value:number){
    this.amp3.gain.value = value;
  }

   getReverbLevelValue(value:number){
     this.reverb.wet.value = value;
   }
   
   getDelayLevelValue(value:number){
     this.delay.wet.value = value;
   }

   getDelayTimeValue(value:number){
     this.delay.delayTime.value = value;
   }
   getFilterSlider(value:number){
    this.autofilter.frequency.value = value;
  }

  getOsc2IntervalSlider(value:number){
    this.sliderOsc2IntervalValue = value;
  }

  getOsc3IntervalSlider(value:number){
    this.sliderOsc3IntervalValue = value;
  }

   getMasterVolSlider(value:number){
     this.vol.volume.value = value;
   }

   getBPMSlider(value:number){
     Tone.Transport.bpm.value = value;
   }

   getChecked1(value:boolean){
    console.log(value);
    console.log(this.checked1);
   }
  
   play(){
    this.vol.mute = false;
    Tone.Transport.start();
    this.synth1.start();
    this.loop1.start();
    
  }
  
  stop(){
    Tone.Transport.stop();
    this.synth1.stop();
    //this.vol.mute = true;
    console.log("audio muted")
  }

  ngOnInit(): void {
    Tone.start();
    this.autofilter.start();
    
  }
  
}
//ideas
//1. ramp up the gain with play() from 0 to smoothly bring in sounds of oscillators and sequences
//2.

