import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  public newScienceResult!: any[];
  public newTechnologyResult!: any[];
  private http: HttpClient;

  constructor( handler: HttpBackend ) {
    this.http = new HttpClient(handler)
  }

  newScience(){

    return this.http.get
    (`https://newsapi.org/v2/everything?sortBy=publishedAt&apiKey=679861a23219432d8e6d6485c9da7d12&language=es&q=science&pageSize=1`);

  }

  newTechnology(){

    return this.http.get(`https://newsapi.org/v2/everything?sortBy=publishedAt&apiKey=679861a23219432d8e6d6485c9da7d12&language=es&q=technology&pageSize=1`);


  }

}
