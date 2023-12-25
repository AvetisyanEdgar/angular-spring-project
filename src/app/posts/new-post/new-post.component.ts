import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../service/category.service";
import {CategoryModel} from "../../model/category.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PostModel} from "../../model/post.model";
import {PostService} from "../../service/post.service";
import {FileService} from "../../service/file.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = "";
  imgSrc: any = "./assets/placeholder-image.png";
  selectedImage!: File;
  categories: Array<CategoryModel> = [];
  postForm: FormGroup;
  disablePermalink: boolean = true;
  post: PostModel | undefined;
  imgUrl: string=""
  selectedFileName: string = "";
  formStatus: string = "Add"

  constructor(private categoryService: CategoryService,
              private postService: PostService,
              private fileService: FileService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              ) {

    this.route.queryParamMap.subscribe(val => {
      this.postService.loadPostById(Number(val.get("id"))).subscribe({
        next: value => {
          this.post = value;
          this.imgUrl = value.imageUrl;
          this.post.imageUrl = this.imgUrl;
          this.findPostImage(this.post);
          this.formStatus = "Edit"
        }
      });
    })

    this.postForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.minLength(5)]],
      permalink: ['', Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(5)]],
      category: [`${this.post?.category.id}-${this.post?.category.name}`],
      postImg: [`${this.post?.imageUrl}`, Validators.required],
      content: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(val => {
      this.categories = val;
    });

    this.route.queryParamMap.subscribe(val => {
      this.postService.loadPostById(Number(val.get("id"))).subscribe(post => {
        this.post = post;
        this.postForm.patchValue(this.post);
        this.postForm.controls['category'].patchValue(`${this.post.category.id}-${this.post.category.name}`);

        this.findPostImage(post);

      });
    });
  }

  get formControl() {
    return this.postForm.controls;
  }

  onTitleChanged($event: Event) {
    const newPermalink = ($event.target as HTMLInputElement).value.replace(/\s/g, "-");
    const permalinkControl = this.postForm.get('permalink');
    if (permalinkControl) {
      this.postForm.controls['permalink'].patchValue(newPermalink);
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
      this.selectedImage = input.files[0];
      this.selectedFileName = this.selectedImage.name;
      console.log(this.selectedFileName);
    }
  }

  savePost() {
    if (!this.postForm.invalid) {
      let split = this.postForm.value['category'].split('-');

      const postData: PostModel = {
        title: this.postForm.value['title'],
        permalink: this.postForm.controls['permalink'].value,
        category: {
          id: split[0],
          name: split[1]
        },
        imageUrl: '',
        excerpt: this.postForm.value['excerpt'],
        content: this.postForm.value['content'],
        isFeatured: false,
        views: 0,
        status: 'new',
        createdAt: new Date()
      };


      this.postService.createPost(postData).subscribe({
        next: (response: any) => {
          this.fileService.attachFile(this.selectedImage, response.id).subscribe({
            next: (response: any) => {
              console.log('response:' + response);
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

  findPostImage(post: PostModel) {
    this.fileService.getImageByName(post.imageUrl).subscribe({
      next: (imageResponse: any) => {
        if (imageResponse) {
          const arrayBufferView = new Uint8Array(imageResponse.body);
          const blob = new Blob([arrayBufferView], {type: 'image/png'});
          post.imageUrl = URL.createObjectURL(blob);
        }
      },
      error: (error) => {
        console.error('Error occurred while loading image: ' + error);
      }
    });
  }

  public editPost() {
    if (this.postForm.valid) {
      const updatablePost = this.postForm.value
      this.postService.updateData(updatablePost.id , updatablePost)
        .subscribe( post =>{
        this.post = post
        updatablePost.imageUrl = post.imageUrl
        })
      this.postService.loadPostById(updatablePost.id)
    }
  }

}
