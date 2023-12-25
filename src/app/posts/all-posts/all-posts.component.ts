import {Component, OnInit} from '@angular/core';
import {PostService} from '../../service/post.service';
import {FileService} from '../../service/file.service';
import {PostModel} from '../../model/post.model';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {
  posts: PostModel[] = [];

  constructor(private postService: PostService, public fileService: FileService) {

  }

  ngOnInit(): void {
    this.findAllPosts();
  }

  findAllPosts() {
    this.postService.findAll().subscribe({
      next: (response) => {
        this.posts = response;
        forkJoin(
          this.posts.map(post => this.fileService.getImageByName(post.imageUrl))
        ).subscribe({
          next: (imageResponses: any[]) => {
            imageResponses.forEach((imageResponse, index) => {
              if (imageResponse) {
                const arrayBufferView = new Uint8Array(imageResponse.body);
                const blob = new Blob([arrayBufferView], {type: 'image/png'});
                this.posts[index].imageUrl = URL.createObjectURL(blob);
              }
            });
          },
          error: (error) => {
            console.error('Error occurred while loading images: ' + error);
          }
        });
      },
      error: (error) => {
        console.error('Error occurred while getting posts: ' + error);
      }
    });
  }
  public deleteById(postId: any){
    this.postService.deleteById(postId).subscribe( _=>{
      console.log("Deleted post with id ", postId)
    })
    this.findAllPosts()
  }
}
