import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FirebaseService} from '.././services/firebase.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isSignedIn = false
  constructor(public firebaseService : FirebaseService, private router: Router) { }

  ngOnInit(){
    if(localStorage.getItem('user')!==null)
    this.isSignedIn = true
    else
    this.isSignedIn = false
  }

  logout(){
    this.firebaseService.logout()
    this.isSignedIn = false
    this.router.navigate(['../sign-in']);
  }


}
