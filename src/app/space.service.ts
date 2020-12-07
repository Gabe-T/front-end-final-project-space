import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  apodURL: string = 'https://api.nasa.gov/planetary/apod/?api_key=';
  apodKey: string = 'xxy9QqiIgKLHHRWenOaxbbhnnVHEZqOfQzcUaosF';
  constructor(private http: HttpClient) { }

  getApod = () => {
    return this.http.get(`${this.apodURL}${this.apodKey}`);
  };

  

}
