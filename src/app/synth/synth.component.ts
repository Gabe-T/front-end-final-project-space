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
  //Signal Generators
  synth1:any;
  synth2:any;
  delay:any;
  reverb:any;
  autofilter:any;
  amp1:any;

  vol:any;
  mixer:any;
  
  
  note1:any;
  scale1:any; 
  
  loop1:any;
  pattern1:any;
  
  msdown:boolean = false;
  slider1Value:number = 100;
  slider2Value:number = 200;
  slider3Value:number = 0.01;

  slider4Value:number = -20;
  slider5Value:number = 2;
  slider6Value:number = .5;


  constructor() {
    this.synth1 = new Tone.Oscillator(this.slider1Value,"sawtooth");
    this.synth2 = new Tone.Synth();
    this.amp1 = new Tone.Gain(.5);
    this.mixer = new Tone.Gain(.8);
    this.delay = new Tone.PingPongDelay({
      wet: 0.75,
      delayTime: .33333,
      feedback: .25
    });
    this.reverb = new Tone.Reverb({
      wet: .75,
      decay: this.slider3Value,

    })
    this.autofilter= new Tone.AutoFilter({
      baseFrequency:60,
      depth:.75,
      frequency: .1,
      octaves: 4,
      type:"sine"

    })
    this.vol = new Tone.Volume(this.slider4Value);

    this.pattern1 = new Tone.Pattern()

  
    this.scale1 = Tonal.Scale.get("C3 major").notes;
    this.scale1 = this.scale1.concat(Tonal.Scale.get("C4 major").notes)
    this.scale1 = this.scale1.concat(Tonal.Scale.get("C5 major").notes)

    Tonal.Collection.shuffle(this.scale1);

    //INCORPORATE SCALES IN THIS LOOP! ADD CLOCK, TIME, LOOP STEP, ETC
    this.loop1 = new Tone.Loop(time=>{
      this.synth2.triggerAttackRelease(this.slider2Value, "8n", time)},
       "4n").start("8n");
    
    
       
       
       //MIX BUSS
       //consider using chains!!
       this.synth1.connect(this.amp1);
       this.amp1.connect(this.autofilter);
       this.autofilter.connect(this.mixer);
       
       this.synth2.connect(this.mixer);
       
       this.mixer.connect(this.delay);
       this.delay.connect(this.reverb);
       this.reverb.connect(this.vol);
       this.vol.toDestination();
      }
      
  loopStep(time){
           
  }

   getOscSlider(value:number){
     this.synth1.frequency.value = value;
   }
   getAmp1Slider(value:number){
     this.amp1.gain.value = value;
   }

   getSliderValue(value:number){
     this.reverb.decay = value;
   }
   
   getFilterSlider(value:number){
    this.autofilter.frequency.value = value;
    console.log(this.autofilter.frequency.value);
  }
   getVolSlider(value:number){
     this.vol.volume.value = value;
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
