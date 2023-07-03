import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  password = true;
  confirmpassword = true;

  constructor(){}

  ngOnInit(): void{

  }
}
