import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { fetch, navigation } from '@nrwl/angular';
import { EMPTY, from, map, Observable } from 'rxjs';
import { NewsListComponent } from '../news-list/news-list.component';
import { NewsViewComponent } from '../news-view/news-view.component';
import { NewsComponent } from '../news/news.component';
import { NewsService } from '../services';

import * as NewsActions from './news.actions';
import { News } from './news.models';
import * as NewsFeature from './news.reducer';
import * as fromNews from './news.selectors';

@Injectable()
export class NewsEffects {
  private actions$ = inject(Actions);

  readonly navigate$ = createEffect(() =>
    this.actions$.pipe(
      navigation(NewsListComponent, {
        run: (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
          return NewsActions.initNews();
        },
      })
    )
  );

  readonly init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.initNews),
      concatLatestFrom((action) => this.store.select(fromNews.selectNewsState)),
      fetch({
        run: (action, state) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return this.newsService.getFeed(1, state.perToPage).pipe(
            map((feed) => {
              const storage: News[] = JSON.parse(
                localStorage.getItem('news') || '[]'
              );
              return NewsActions.loadNewsSuccess({
                news: [...storage, ...feed.news],
                totalCount: feed.totalCount,
              });
            })
          );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return NewsActions.loadNewsFailure({ error });
        },
      })
    )
  );

  readonly next$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.next),
      concatLatestFrom((action) => this.store.select(fromNews.selectNewsState)),
      fetch({
        run: (action, state) => {
          const currentPage = Math.ceil(
            (state.ids.length - state.addedNewsCounter) / state.perToPage
          );
          const countPages = Math.ceil(state.totalCount / state.perToPage);

          if (state.loading) {
            return EMPTY;
          } else if (currentPage >= countPages) {
            return NewsActions.loadNewsComplete();
          } else {
            return NewsActions.loadNews();
          }
        },
      })
    )
  );

  readonly getNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadNews),
      concatLatestFrom((action) => this.store.select(fromNews.selectNewsState)),
      fetch({
        run: (action, state) => {
          const currentPage = Math.ceil(
            (state.ids.length - state.addedNewsCounter) / state.perToPage
          );
          // const countPages = Math.ceil(state.totalCount / state.perToPage);

          return this.newsService
            .getFeed(currentPage + 1, state.perToPage)
            .pipe(
              map((feed) =>
                NewsActions.loadNewsSuccess({
                  news: feed.news,
                  totalCount: feed.totalCount,
                })
              )
            );
        },
        onError: (action, error) => {
          console.error('Error', error);
          return NewsActions.loadNewsFailure({ error });
        },
      })
    )
  );

  readonly addNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.addNews),
      concatLatestFrom((action) => this.store.select(fromNews.selectNewsState)),
      fetch({
        run: (action, state) => {
          const { news, image } = action;
          const id = (+state.ids[0] + state.addedNewsCounter + 1) * 100;
          if (image) {
            return this.getBase64(image).pipe(
              map((image64) => {
                return NewsActions.addNewsSuccess({
                  news: {
                    ...news,
                    id,
                    text: news.description,
                    titleImageUrl: image64,
                    url: `new/${id}`,
                  },
                });
              })
            );
          } else {
            return NewsActions.addNewsSuccess({
              news: {
                ...news,
                id,
                titleImageUrl: '',
                text: news.description,
                url: `new/${id}`,
              },
            });
          }
        },
      })
    )
  );

  readonly saveNewsToStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.addNewsSuccess),
      concatLatestFrom((action) => this.store.select(fromNews.selectNewsState)),
      fetch({
        run: (action, state) => {
          const storage: News[] = [
            ...JSON.parse(localStorage.getItem('news') || '[]'),
            action.news,
          ];
          localStorage.setItem('news', JSON.stringify(storage));
        },
      })
    )
  );

  readonly newsItemNavigate$ = createEffect(() =>
    this.actions$.pipe(
      navigation(NewsViewComponent, {
        run: (activatedRouteSnapshot: ActivatedRouteSnapshot) => {
          if (activatedRouteSnapshot.params['category'] === 'new') {
            return NewsActions.openNewsItem({
              id: +activatedRouteSnapshot.params['url'],
            });
          } else {
            return NewsActions.loadNewsItem({
              url: `${activatedRouteSnapshot.params['category']}/${activatedRouteSnapshot.params['url']}`,
            });
          }
        },
      })
    )
  );

  readonly loadNewsItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadNewsItem),
      concatLatestFrom((action) => this.store.select(fromNews.selectNewsState)),
      // concatLatestFrom((action) => this.store.select(fromNews.selectEntity)),
      fetch({
        run: (action, state) => {
          return this.newsService
            .getNews(state.selectedUrl || '')
            .pipe(map((news) => NewsActions.loadNewsItemSuccess({ news })));
        },
      })
    )
  );

  constructor(
    private readonly newsService: NewsService,
    private store: Store<NewsFeature.NewsState>
  ) {}

  private getBase64(file: File): Observable<string> {
    return from(
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || '');
        reader.onerror = (error) => reject(error);
      })
    );
  }
}
