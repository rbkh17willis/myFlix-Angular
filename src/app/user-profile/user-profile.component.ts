import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
//added in MatDialog to see if that was the issue, didn't make a difference on error
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  FavoriteMovies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    //added in dialog to see if it fixed error
    public dialog: MatDialog
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  ngOnInit(): void {
    this.getfavoriteMovies();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }
  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  getfavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.FavoriteMovies = res.filter((movie: any) => {
        return this.userData.FavoriteMovies.includes(movie._id)
      })
    }, (err: any) => {
      console.error(err);
    });
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovies(this.userData.Username, movie.Title).subscribe((res: any) => {
      this.userData.FavoriteMovies = res.FavoriteMovies;
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}