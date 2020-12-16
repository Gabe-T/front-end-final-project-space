import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PatchService {
  baseURL: string = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  getPatches = () => {
    return this.http.get(`${this.baseURL}/patches`);
  };

  postPatch = (patch: any) => {
    return this.http.post(`${this.baseURL}/patches`, patch);
  };
}
