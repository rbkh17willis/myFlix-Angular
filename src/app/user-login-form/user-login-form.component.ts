import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-login-form',
    templateUrl: './user-login-form.component.html',
    styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit {
    @Input() userData = { username: "", password: "" };

    constructor(
        public fetchApiData: UserRegistrationService,
        public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
        public snackBar: MatSnackBar,
        public router: Router
    ) { }
    
    ngOnInit(): void {}

    logInUser() : void {
        this.fetchApiData.userLogin(this.userData).subscribe(res => {
            this.dialogRef.close();
            this.snackBar.open(`Login success, Welcom ${res.user.username}`, "OK", {
                duration: 2000
            });
            let user = {
                ...res.user,
                id: res.user._id,
                password: this.userData.password,
                token: res.token
            }
            localStorage.setItem("user", JSON.stringify(user));
            this.router.navigate(["movies"]);
        }, res => {
            this.snackBar.open("Login fail", "OK", {
                duration: 2000
            })
        })
    }
}