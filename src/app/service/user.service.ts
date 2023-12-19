import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:8080/api";
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
