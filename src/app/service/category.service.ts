import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryModel} from "../model/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = "http://localhost:8080/api/category";

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  createCategory(category: CategoryModel) {
    return this.http.post(`${this.apiUrl}`, category, {headers: {'Content-Type': 'application/json'}});
  }

  deleteCategory(category: CategoryModel) {
    const options = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: category
    };
    return this.http.delete(`${this.apiUrl}`, options);
  }

  editCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.http.patch<CategoryModel>(`${this.apiUrl}`, category);
  }
}
