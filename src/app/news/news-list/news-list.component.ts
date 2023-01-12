import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IInfiniteScrollEvent } from 'ngx-infinite-scroll';
import { NewsFacade } from '../+state/news.facade';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { CategoryType, Feed, News } from '../+state/news.models';
import { NewsDetailComponent } from '../news-detail/news-detail.component';
import { title } from 'process';

@Component({
  selector: 'adr-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
  // providers: [ComponentStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsListComponent {
  readonly news$ = this.newsFacade.allNews$;
  readonly totalCount$ = this.newsFacade.totalCount$;
  readonly loading$ = this.newsFacade.loading$;
  readonly loadNewsComplete$ = this.newsFacade.loadNewsComplete$;
  // private currentPage = 1;

  constructor(
    private readonly newsFacade: NewsFacade,
    private readonly dialog: MatDialog
  ) {}

  public newsTrackById(index: number, news: News): number {
    return news.id;
  }

  onScroll(event: IInfiniteScrollEvent) {
    this.newsFacade.next();
  }

  addNews() {
    const dialogRef = this.dialog.open(NewsDetailComponent);

    dialogRef
      .afterClosed()
      .subscribe(
        (result: { title: string; description: string; image: File }) => {
          const news: News = {
            title: result.title,
            description: result.description,
            id: -1,
            categoryType: CategoryType.АвтомобильныеНовости,
            fullUrl: '',
            publishedDate: new Date().toString(),
            url: '',
            titleImageUrl: '',
          };
          this.newsFacade.addNews(news, result.image);
        }
      );
  }
}
