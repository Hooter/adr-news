import { NgModule } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  StoreRouterConnectingModule,
  FullRouterStateSerializer,
} from '@ngrx/router-store';

import { NewsRoutingModule } from './news-routing.module';

import { SharedModule } from '../shared/shared.module';

import * as fromNews from './+state/news.reducer';
import { NewsEffects } from './+state/news.effects';
import { NewsFacade } from './+state/news.facade';

import * as fromServices from './services';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsComponent } from './news/news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { NewsViewComponent } from './news-view/news-view.component';
import { DefaultComponent } from './layout/default/default.component';

@NgModule({
  declarations: [
    NewsListComponent,
    NewsDetailComponent,
    NewsViewComponent,
    DefaultComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NewsRoutingModule,
    HttpClientModule,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    InfiniteScrollModule,
    SharedModule,
    NewsComponent,
    StoreModule.forFeature(fromNews.NEWS_FEATURE_KEY, fromNews.newsReducer),
    EffectsModule.forFeature([NewsEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: FullRouterStateSerializer,
    }),
  ],
  providers: [fromServices.services, NewsFacade],
})
export class NewsModule {}
