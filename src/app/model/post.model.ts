import {CategoryModel} from "./category.model";

export interface PostModel {
  title: string,
  permalink: string,
  category: CategoryModel,
  postImgPath: string,
  excerpt: string,
  content: string,
  isFeatured: boolean,
  views: number,
  status: string,
  createdAt: Date
}
