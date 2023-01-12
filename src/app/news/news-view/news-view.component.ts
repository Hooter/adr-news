import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewsFacade } from '../+state/news.facade';

@Component({
  selector: 'adr-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsViewComponent {
  readonly news$ = this.newsFacade.selectedNews$;

  constructor(private readonly newsFacade: NewsFacade) {}
}
