import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostModel} from "../model/post.model";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = "http://localhost:8080/post";
  constructor(private http: HttpClient) { }

  createPost(post: PostModel) {
    return this.http.post(`${this.apiUrl}`, post, {headers: {'Content-Type': 'application/json'}});
  }
}
