import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaceService } from '../space.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeinandout', [
      state(
        'in',
        style({
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
        })
      ),
      transition('in => out', [animate('5s')]),
      transition('out => in', [animate('5s')]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  apod: any;
  currentSentence: string;
  sentenceArray: string[];
  counter: number = 0;
  opened = false;
  random: number = 1;
  fade: boolean = false;
  year: number;
  month: number;
  day: number;
  currentDate: string = '';
  previousDay: string;

  constructor(
    private service: SpaceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApod();
  }

  timeout = () => {
    setTimeout(() => {
      if (this.counter === this.sentenceArray.length) {
        this.counter = 0;
        this.randomNum();
        this.currentSentence = this.sentenceArray[this.counter];
      } else {
        this.currentSentence = this.sentenceArray[this.counter];
        this.counter++;
        this.randomNum();
      }
      this.timeout();
    }, 10000);
  };

  fadeTimer = () => {
    setTimeout(() => {
      this.toggleFade();
      this.fadeTimer();
    }, 5000);
  };

  getApod = () => {
    this.route.queryParamMap.subscribe((response) => {
      const queryParams = response;
      if (queryParams.get('date') === null) {
        this.service.getApod().subscribe((response) => {
          this.apod = response;
          this.currentDate = this.apod.date;
          this.splitExplanation(this.apod.explanation);
          this.timeout();
          this.toggleFade();
          this.fadeTimer();
          console.log(this.apod);
        });
      } else {
        this.service
          .getRandomDate(queryParams.get('date'))
          .subscribe((response) => {
            this.apod = response;
            this.splitExplanation(this.apod.explanation);
            this.timeout();
            this.toggleFade();
            this.fadeTimer();
            console.log(this.apod);
          });
      }
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
    let number = Math.floor(Math.random() * 12);
    if (lastRand === number || number === 0) {
      number++;
      this.random = number;
    } else {
      this.random = number;
    }
  };

  toggleFade = () => {
    this.fade = !this.fade;
  };

  randomizeDate = () => {
    this.year = Math.floor(Math.random() * 6 + 1 + 2014);
    this.month = Math.floor(Math.random() * 12 + 1);
    this.day = Math.floor(Math.random() * 28 + 1);
    let randomDate = this.year + '-' + this.month + '-' + this.day;
    return randomDate;
  };

  getRandomApod = () => {
    let date = this.randomizeDate();
    this.router.navigate(['/home'], { queryParams: { date: date } });
  };

  backOneDay = (date: string) => {
    let year = parseInt(date.substring(0, 4));
    let month = parseInt(date.substring(5, 7));
    let day = parseInt(date.substring(8, 10)) - 1;

    if (day === 0) {
      month = month - 1;
      day = 28;
      this.previousDay = `${year}-${month}-${day}`;

      if (month === 0) {
        year = year - 1;
        month = 12;
        day = 28;
        this.previousDay = `${year}-${month}-${day}`;
      }
    } else {
      this.previousDay = `${year}-${month}-${day}`;
    }
    this.router.navigate(['/home'], {
      queryParams: {
        date: this.previousDay,
      },
    });
  };
}
