import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostModel} from "../model/post.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = "http://localhost:8080/post";
  constructor(private http: HttpClient) {
  }

  createPost(post: PostModel) {
    return this.http.post(`${this.apiUrl}`, post, {headers: {'Content-Type': 'application/json'}});
  }

  findAll(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}`);
  }

  loadPostById(id: number):Observable<PostModel> {
    return this.http.get<PostModel>(`${this.apiUrl}/${id}`);
  }

  updateData(id: number, postData: PostModel): Observable<PostModel>{
    return this.http.patch<PostModel>(`${this.apiUrl}/${id}`, postData);
  }

  deleteById(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);

  }
}
