import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as NewsActions from './news.actions';
import { News } from './news.models';
import * as NewsFeature from './news.reducer';
import * as NewsSelectors from './news.selectors';

@Injectable()
export class NewsFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(NewsSelectors.selectNewsLoaded));
  loading$ = this.store.pipe(select(NewsSelectors.selectNewsLoading));
  loadNewsComplete$ = this.store.pipe(
    select(NewsSelectors.selectLoadNewsComplete)
  );
  allNews$ = this.store.pipe(select(NewsSelectors.selectAllNews));
  selectedNews$ = this.store.pipe(select(NewsSelectors.selectEntity));
  totalCount$ = this.store.pipe(select(NewsSelectors.selectTotalCount));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(NewsActions.initNews());
  }

  next() {
    this.store.dispatch(NewsActions.next());
  }

  addNews(news: News, image: File) {
    this.store.dispatch(
      NewsActions.addNews({
        news,
        image,
      })
    );
  }
}
