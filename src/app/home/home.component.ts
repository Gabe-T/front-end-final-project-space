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
    }); 
  }

}
