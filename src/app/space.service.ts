import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  apodURL: string = 'https://api.nasa.gov/planetary/apod/?api_key=';
  apodKey: string = 'xxy9QqiIgKLHHRWenOaxbbhnnVHEZqOfQzcUaosF';

  constructor(private http: HttpClient) {}

  getApod = () => {
    return this.http.get(`${this.apodURL}${this.apodKey}`);
  };

  getSpecificApod = (date) => {
    let validDate = this.dateCheck(date);
    return this.http.get(`${this.apodURL}${this.apodKey}`, {
      params: { date: validDate },
    });
  };

  dateCheck = (date) => {
    let validDate;
    const dateArray = date.split('-');
    const year = parseInt(dateArray[0]);
    let month: any = parseInt(dateArray[1]);
    let day: any = parseInt(dateArray[2]);
    const addZero = '0';

    if (month <= 9) {
      month = month.toString();
      let fixedMonth = addZero + month;
      month = fixedMonth;
    }

    if (day <= 9) {
      day = day.toString();
      let fixedDay = addZero + day;
      day = fixedDay;
    }

    validDate = `${year}-${month}-${day}`;
    return validDate;
  };
}
