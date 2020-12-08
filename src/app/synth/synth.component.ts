import { Component, OnInit } from '@angular/core';
import { Player } from 'tone';
//import { Tone } from 'tone/build/esm/core/Tone';
import * as Tone from 'tone';
@Component({
  selector: 'app-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.css']
})
export class SynthComponent implements OnInit {

  synth1:any;
  synth2:any;
  msdown:boolean = false;
  mixer:any;
  delay:any;
  reverb:any;
  constructor() {
    this.synth1 = new Tone.Synth();
    this.synth2 = new Tone.Synth();
    this.mixer = new Tone.Gain();
    this.delay = new Tone.PingPongDelay({
      wet: .75,
      delayTime: "4n",
      feedback: .5
    });
    this.reverb = new Tone.Reverb({
      wet: .75,
      decay: 20
    })
    //mix buss
    this.synth1.connect(this.mixer);
    this.synth2.connect(this.mixer);
    this.mixer.connect(this.delay);
    this.delay.connect(this.reverb);
    this.reverb.toDestination();
    
   }

   play(){
    this.synth1.triggerAttackRelease("C3", "8n");
    this.synth2.triggerAttackRelease("E4", "8n")
  }

  ngOnInit(): void {
  }

}
