import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '.././services/firebase.service';
import {Router} from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  isSignedIn = false
  registerForm: FormGroup;
  constructor(public firebaseService : FirebaseService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('',  Validators.required),
      password: new FormControl('',  Validators.required),

    })
  }
  onSignin(){
    const {email, password} = this.registerForm.value
    this.firebaseService.signin(email,password).then((result)=>
    {
      if(this.firebaseService.isLoggedIn){ 
        this.isSignedIn = true
        this.refresh();
        this.router.navigate(['../home']);
      }

    })
  }
  refresh(): void {
    window.location.reload();
}

}
