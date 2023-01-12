import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NEWS_FEATURE_KEY, NewsState, newsAdapter } from './news.reducer';

// Lookup the 'News' feature state managed by NgRx
export const selectNewsState =
  createFeatureSelector<NewsState>(NEWS_FEATURE_KEY);

const { selectAll, selectEntities } = newsAdapter.getSelectors();

const selector = <T>(mapping: (state: NewsState) => T) =>
  createSelector(selectNewsState, mapping);

export const selectNewsLoaded = selector((state) => state.loaded);
export const selectNewsLoading = selector((state) => state.loading);
export const selectLoadNewsComplete = selector(
  (state) => state.loadNewsComplete
);
export const selectNewsError = selector((state) => state.error);
export const selectAllNews = selector((state) => selectAll(state));
export const selectNewsEntities = selector((state) => selectEntities(state));
export const selectSelectedId = selector((state) => state.selectedId);
export const selectTotalCount = selector((state) => state.totalCount);

export const selectEntity = createSelector(
  selectNewsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
