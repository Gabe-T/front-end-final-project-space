import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PatchService {
  baseURL: string = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getPatches = () => {
    return this.http.get(`${this.baseURL}/patches`);
  };

  postPatch = (patch: any) => {
    return this.http.post(`${this.baseURL}/patches`, patch);
  };
}
