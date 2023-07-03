import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  handleSignupAction() {
    const dailogConfig = new MatDialogConfig();
    dailogConfig.width = "550px";
    this.dialog.open(SignupComponent, dailogConfig);
  }

  handleForgotPasswordAction() {
    const dailogConfig = new MatDialogConfig();
    dailogConfig.width = "550px";
    this.dialog.open(ForgotPasswordComponent, dailogConfig);
  }

}
