import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  apiUrl: string = "http://localhost:8080/api/image";

  constructor(private http: HttpClient) {
  }

  attachFile(file: File, id: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
  }
}
