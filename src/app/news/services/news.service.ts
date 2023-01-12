import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feed, News } from '../+state/news.models';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getFeed(page: number, perToPage: number): Observable<Feed> {
    return this.http.get<Feed>(
      `https://webapi.autodoc.ru/api/news/${page}/${perToPage}`
    );
  }

  getNews(urlNews: string): Observable<News> {
    return this.http.get<News>(
      `https://webapi.autodoc.ru/api/news/item/${urlNews}`
    );
  }
}
