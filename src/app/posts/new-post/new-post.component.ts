import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../service/category.service";
import {CategoryModel} from "../../model/category.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostModel} from "../../model/post.model";
import {PostService} from "../../service/post.service";
import {FileService} from "../../service/file.service";

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = "";
  imgSrc: any = "./assets/placeholder-image.png";
  selectedImage: any;
  categories: Array<CategoryModel> = [];
  postForm: FormGroup;

  constructor(private categoryService: CategoryService,
              private postService: PostService,
              private fileService: FileService,
              private fb: FormBuilder) {

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', [Validators.required]],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', [Validators.required]],
      postImg: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })

  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(val => {
        this.categories = val;
      }
    )
  }

  get formControl() {
    return this.postForm.controls;
  }

  onTitleChanged($event: Event) {
    const newPermalink = ($event.target as HTMLInputElement).value.replace(/\s/g, "-");
    const permalinkControl = this.postForm.get('permalink');
    if (permalinkControl) {
      permalinkControl.setValue(newPermalink);
    }
  }

  showPreview($event: Event) {
    const input = $event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target?.result as string;
      }
      reader.readAsDataURL(input.files[0]);
      this.selectedImage(input.files[0]);
    }
  }

  savePost() {
    console.log(this.postForm.value);

    let split = this.postForm.value['category'].split('-');

    const postData: PostModel = {
      title: this.postForm.value['title'],
      permalink: this.postForm.value['permalink'],
      category: {
        id: split[0],
        name: split[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value['excerpt'],
      content: this.postForm.value['content'],
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    };

    console.log(postData);
    this.postService.createPost(postData).subscribe({
      next: (response: any) => {
        this.fileService.attachFile(this.postForm.value['postImg'], response.id).subscribe({
          next: (response: any) => {
            console.log(response);
          },
          error: (error) => {
            console.log('Unable to save an image: ', error);
          }
        });
      },
      error: (error) => {
        console.error('Error creating post: ', error);
      }
    });

  }

}
