import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { from, Observable } from 'rxjs';

import * as NewsActions from './news.actions';
import { CategoryType, News } from './news.models';

export const NEWS_FEATURE_KEY = 'news';

export interface NewsState extends EntityState<News> {
  // page: number;
  perToPage: number;
  addedNewsCounter: number;
  totalCount: number;
  selectedId?: number; // which News record has been selected
  selectedUrl?: string;
  loaded: boolean; // has the News list been loaded
  loading: boolean; // has the News list been loading
  loadNewsComplete: boolean;
  error?: string | null; // last known error (if any)
}

export interface NewsPartialState {
  readonly [NEWS_FEATURE_KEY]: NewsState;
}

export function selectNewsId(a: News): number {
  //In this case this would be optional since primary key is id
  return a.id;
}

export function sortById(a: News, b: News): number {
  return b.id - a.id;
}

export const newsAdapter: EntityAdapter<News> = createEntityAdapter<News>({
  selectId: selectNewsId,
  sortComparer: sortById,
});

export const initialNewsState: NewsState = newsAdapter.getInitialState({
  // set initial required properties
  page: 1,
  addedNewsCounter: 0,
  perToPage: 50,
  totalCount: 0,
  loadNewsComplete: false,
  loaded: false,
  loading: false,
});

const reducer = createReducer(
  initialNewsState,
  on(NewsActions.initNews, (state) => ({
    ...initialNewsState,
  })),
  on(NewsActions.loadNews, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(NewsActions.loadNewsSuccess, (state, { news, totalCount }) =>
    newsAdapter.addMany(news, {
      ...state,
      loaded: true,
      loading: false,
      totalCount,
    })
  ),
  on(NewsActions.loadNewsFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: true,
    error,
  })),
  on(NewsActions.addNewsSuccess, (state, { news }) => {
    return newsAdapter.addOne(news, {
      ...state,
      addedNewsCounter: state.addedNewsCounter + 1,
    });
  }),
  on(NewsActions.loadNewsComplete, (state) => ({
    ...state,
    loadNewsComplete: true,
  })),
  on(NewsActions.loadNewsItem, (state, { url }) => ({
    ...state,
    selectedUrl: url,
  })),
  on(NewsActions.loadNewsItemSuccess, (state, { news }) =>
    newsAdapter.upsertOne(news, {
      ...state,
      selectedId: news.id,
    })
  ),
  on(NewsActions.openNewsItem, (state, { id }) => ({
    ...state,
    selectedId: id,
  }))
);

export function newsReducer(state: NewsState | undefined, action: Action) {
  return reducer(state, action);
}
