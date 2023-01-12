import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { News } from './news.models';

export const initNews = createAction('[News Page] Init');

export const next = createAction('[News/API] Next Page');

export const loadNews = createAction('[News/API] Load News');

export const loadNewsSuccess = createAction(
  '[News/API] Load News Success',
  props<{ news: News[]; totalCount: number }>()
);

export const loadNewsComplete = createAction('[News/API] Load News Complete');

export const loadNewsFailure = createAction(
  '[News/API] Load News Failure',
  props<{ error: any }>()
);

export const addNews = createAction(
  '[News/API] Add News',
  props<{ news: News; image: File }>()
);

export const addNewsSuccess = createAction(
  '[News/API] save Image',
  props<{ news: News }>()
);

export const loadNewsItem = createAction(
  '[News/API] Load News Item',
  props<{ url: string }>()
);

export const openNewsItem = createAction(
  '[News/API] Load News Item',
  props<{ id: number }>()
);

export const loadNewsItemSuccess = createAction(
  '[News/API] Load News Item Success',
  props<{ news: News }>()
);

export const loadNewsItemFailure = createAction(
  '[News/API] Load News Item Failure',
  props<{ error: any }>()
);
