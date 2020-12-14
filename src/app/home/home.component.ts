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
  nextDay: string;
  running: boolean = false;
  fadeTimer: any;
  runTimer: any;
  regex: any = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/g;

  constructor(
    private service: SpaceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((response) => {
      let date = response.get('date');

      if (date) {
        this.stopTimers();
        this.getSpecificApod(date);
        console.log('getSpecificApod' + ' ' + date);
      } else {
        this.stopTimers();
        this.getApod();
        console.log('getApod' + ' ' + date);
      }
    });
  }

  timeout = () => {
    this.runTimer = setTimeout(() => {
      if (!this.running) {
        clearTimeout(this.runTimer);
        this.running = true;
        this.counter = 0;
        this.randomNum();
        this.currentSentence = this.sentenceArray[this.counter];
      } else if (this.counter === this.sentenceArray.length) {
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

  setFadeTimer = () => {
    this.fadeTimer = setTimeout(() => {
      if (!this.running) {
        clearTimeout(this.fadeTimer);
        this.running = true;
        this.toggleFade();
        this.setFadeTimer();
      } else {
        this.toggleFade();
        this.setFadeTimer();
      }
    }, 5000);
  };

  getSpecificApod = (date: string) => {
    this.service.getSpecificApod(date).subscribe((response) => {
      this.apod = response;
      if (this.apod.media_type !== 'image') {
        this.backOneDay(date);
      } else {
        this.splitExplanation(this.apod.explanation);
        this.startTimers();
      }
    });
  };

  getApod = () => {
    this.service.getApod().subscribe((response) => {
      this.apod = response;
      this.currentDate = this.apod.date;
      if (this.apod.media_type !== 'image') {
        this.backOneDay(this.currentDate);
      } else {
        this.splitExplanation(this.apod.explanation);
        this.startTimers();
      }
    });
  };
  splitExplanation = (p: string) => {
    const apodExp = p;
    const expSplit = apodExp.split('. ');
    const newArray = [];
    expSplit.forEach((sentence, index) => {
      if (sentence === '') {
        expSplit.splice(index, 1);
      } else {
        sentence = sentence + '.';
        newArray.push(sentence);
      }
    });
    this.sentenceArray = newArray;
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

  forwardOneDay = (date: string) => {
    let year = parseInt(date.substring(0, 4));
    let month = parseInt(date.substring(5, 7));
    let day = parseInt(date.substring(8, 10)) + 1;

    if (day === 29) {
      month = month + 1;
      day = 1;
      this.nextDay = `${year}-${month}-${day}`;

      if (month === 13) {
        year = year + 1;
        month = 1;
        day = 1;
        this.nextDay = `${year}-${month}-${day}`;
      }
    } else {
      this.nextDay = `${year}-${month}-${day}`;
    }
    this.router.navigate(['/home'], {
      queryParams: {
        date: this.nextDay,
      },
    });
  };

  backHome = () => {
    this.router.navigate(['/home']);
  };

  startTimers = () => {
    this.timeout();
    this.toggleFade();
    this.setFadeTimer();
  };

  stopTimers = () => {
    clearTimeout(this.runTimer);
    clearTimeout(this.fadeTimer);
    this.running = false;
    this.fade = false;
    this.counter = 0;
  };
}
