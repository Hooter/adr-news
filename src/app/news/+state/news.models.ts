export interface Feed {
  news: News[];
  totalCount: number;
}

export interface News {
  id: number;
  title: string;
  description: string;
  text?: string;
  publishedDate: string;
  url: string;
  fullUrl: string;
  titleImageUrl?: string;
  categoryType: CategoryType;
}

export enum CategoryType {
  АвтомобильныеНовости = 'Автомобильные новости',
  НовостиКомпании = 'Новости компании',
}
