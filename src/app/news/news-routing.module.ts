import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layout/default/default.component';

import { NewsListComponent } from './news-list/news-list.component';
import { NewsViewComponent } from './news-view/news-view.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: NewsListComponent, pathMatch: 'full' },
      { path: ':category/:url', component: NewsViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
