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
  constructor(private service: SpaceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getApod();
  }

  timeout = () => {
    setTimeout(() => {
      if (this.counter === this.sentenceArray.length) {
        this.counter = 0;
        this.currentSentence = this.sentenceArray[this.counter];
        console.log(this.currentSentence);
      } else {
        this.counter++;
        this.currentSentence = this.sentenceArray[this.counter];
        console.log(this.currentSentence);
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
}
