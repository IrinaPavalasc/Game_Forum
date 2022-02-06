import { Component, OnInit } from '@angular/core';
import { FirebaseService} from '.././services/firebase.service';
import { Router} from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  isSignedIn = false
  registerForm: FormGroup;
  constructor(public firebaseService : FirebaseService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')!==null)
    this.isSignedIn = true
    else
    this.isSignedIn = false

    this.registerForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      username: new FormControl('', Validators.required),
      age: new FormControl('', [Validators.min(13), Validators.max(99)])

    })
  }
  onSignup(){
    console.log(this.registerForm.value)
    const {username, email, password, description, age} = this.registerForm.value
    this.firebaseService.signup(username,email,password,description,age).then((result)=> 
      { if(localStorage.getItem('user')!==null){ 
          this.router.navigate(['../sign-in']);
          console.log(this.firebaseService.isLoggedIn)
        }
      })  
  }
}
