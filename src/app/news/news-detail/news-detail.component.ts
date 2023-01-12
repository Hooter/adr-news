import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { News } from '../+state/news.models';

@Component({
  selector: 'adr-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailComponent {
  newsForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    image: new FormControl<File | null>(null),
  });

  get selectedFile() {
    return this.newsForm.get('image')?.value?.name || '';
  }

  constructor(
    public dialogRef: MatDialogRef<NewsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public news: News
  ) {}

  onFileSelected(event: any): void {
    // this.selectedFile = event.target.files[0] ?? null;

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.newsForm.patchValue({
        image: file,
      });
    }
  }

  onSubmit() {
    this.dialogRef.close(this.newsForm.value);
  }
}
