import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false
  constructor(public firebaseAuth : AngularFireAuth, private firestore: AngularFirestore) { }
  
  async signin(email: string, password: string){
    await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res=>{
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(res.user))
    })
  }

  async signup(username: string, email: string, password: string, description: string, age: number){
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then((res)=>{
      console.log("create user");
      localStorage.setItem('user', JSON.stringify(res.user))
      console
      if(res.user!=null){ 
        this.firestore.doc('/users/' + res.user.uid).set({
        UserCategory: 'generalUser',
        Username: username,
        Email: email,
        Description: description,
        Age: age,
        HoursPlayed: 0,
        })
    }
      

    })
  }
  async logout(){
    await this.firebaseAuth.signOut()
    localStorage.removeItem('user')
  }

}
