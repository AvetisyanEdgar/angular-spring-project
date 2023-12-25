import { CategoryModel } from './category.model';

export interface PostModel {
  id?: number;
  title: string;
  permalink: string;
  category: CategoryModel;
  imageUrl: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  createdAt: Date;
}
