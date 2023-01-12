import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { News } from '../+state/news.models';
import { NewsFacade } from '../+state/news.facade';
import { throws } from 'assert';

@Component({
  selector: 'adr-news',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  @Input() news!: News;
}
