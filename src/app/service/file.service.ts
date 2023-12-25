import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
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

    return this.http.post(`${this.apiUrl}/${id}`, formData);
  }

  getImageByName(imageName: string): Observable<HttpResponse<ArrayBuffer>> {
    const headers = new HttpHeaders({'Content-Type': 'image/png'});

    return this.http.get(`${this.apiUrl}/${imageName}`, {
      observe: 'response',
      responseType: 'arraybuffer',
      headers,
    });
  }
}
