import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceService } from '../space.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  apod: any;
  opened = false;
  constructor(private service: SpaceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.service.getApod().subscribe((response)=>{
      this.apod = response;
      console.log(this.apod);
      this.splitExplanation(this.apod.explanation);
    }); 
  }

  splitExplanation = (p:string) =>{
    let apodExp = p;
    let expSplit = apodExp.match(/[^\.]+[\.]+/g)
    console.log(expSplit);
    return expSplit;
    //we started this code block to append shorter sentences with previous phrase.
    // (/[^\.!\?]+[\.!\?]+/g)
    // for(let i=0; i< expSplit.length; i++){
    //   if (expSplit[i].length<20){
    //    console.log(expSplit[i])
    //    return expSplit[i] + expSplit[i-1] 
    //   }
    //   console.log(expSplit);
    // }
  }

  // presentExplanation = (array:[])=>{

  // }


}
