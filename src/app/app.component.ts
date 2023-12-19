import {Component, OnInit} from '@angular/core';
// import {UserService} from "./service/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-blog-dashboard';
  // users: any[] = [];

  ngOnInit(): void {
  }

  // constructor(private userService: UserService) {
  //   this.userService.getAllUsers().subscribe((response) => {
  //       this.users = response;
  //     },
  //     (error) => {
  //       console.log("We've encountered some troubles during the generation of response");
  //     }
  //   )
  // }
}
