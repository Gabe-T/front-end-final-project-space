import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceService } from '../space.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  apod: any;
  currentSentence: string;
  sentenceArray: string[];
  counter: number = 0;
  opened = false;
  random: number = 1;
  constructor(private service: SpaceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getApod();
  }

  timeout = () => {
    setTimeout(() => {
      if (this.counter === this.sentenceArray.length) {
        this.counter = 0;
        this.randomNum();
        this.currentSentence = this.sentenceArray[this.counter];
        console.log(this.random);
      } else {
        this.currentSentence = this.sentenceArray[this.counter];
        this.counter++;
        this.randomNum();
        console.log(this.random);
      }
      this.timeout();
    }, 10000);
  };

  getApod = () => {
    this.service.getApod().subscribe((response) => {
      this.apod = response;
      this.splitExplanation(this.apod.explanation);
      this.timeout();
      console.log(this.apod);
    });
  };

  splitExplanation = (p: string) => {
    const apodExp = p;
    const expSplit = apodExp.match(/[^\.]+[\.]+/g);
    console.log(expSplit);
    this.sentenceArray = expSplit;
  };

  randomNum = () => {
    let lastRand = this.random;
    let number = Math.floor(Math.random()*11);
    if(lastRand === number || number === 0){
      number++;
      this.random = number;
    }else{
      this.random = number;
    }
  };

}

