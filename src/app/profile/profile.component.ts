import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore'
import { FirebaseTSStorage } from 'firebasets/firebasetsStorage/firebaseTSStorage'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
  

export class ProfileComponent implements OnInit {
  
  user: Observable<any>;
  editForm: FormGroup;
  isShown = false;
  selectedImageFile: File;
  auth = new FirebaseTSAuth();
  frstore = new FirebaseTSFirestore();
  storage = new FirebaseTSStorage();
  currentProfilePicture;
  constructor(public firebaseAuth: AngularFireAuth, private firestore: AngularFirestore, private fb: FormBuilder) { this.user = null!; }
   
  ngOnInit(): void {
    this.getProfilePicture();
    this.editForm = this.fb.group({
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      username: new FormControl('', Validators.required),
      age: new FormControl('', [Validators.min(13), Validators.max(99)]),
      hoursPlayed: new FormControl('', [Validators.min(0)])

    })
  
    this.firebaseAuth.authState.subscribe(res => {
      if (res!=null) {
        console.log(res.uid);
        this.user = this.firestore.collection('users').doc(res.uid).valueChanges(); 
      }
    
    });

  }
  editProfile() {
    const { username, description, age, hoursPlayed} = this.editForm.value
    this.firebaseAuth.authState.subscribe(res => {
      if (res != null) {
        this.firestore.collection('users').doc(res.uid).update({
          Username: username,
          Description: description, 
          Age: age,
          HoursPlayed: hoursPlayed
        });
        this.firestore.collection('users').doc(res.uid).get().toPromise().then(result => {
          this.editForm.controls['username'].setValue(result!.get("username"));
          this.editForm.controls['age'].setValue(result!.get("age"));
          this.editForm.controls['hoursPlayed'].setValue(result!.get("hoursPlayed"));
        })
      }
    });

    
  }

  toggleShow() {

    this.isShown = !this.isShown;

  }
  
  addProfilePicture() {
    this.firebaseAuth.authState.subscribe(res => {
      if (res != null) {
        let userId = res.uid;
      
        this.storage.upload(
          {
            uploadName: "upload Image Profile",
            path: ["Profile", userId, "image"],
            data: {
              data: this.selectedImageFile
            },
            onComplete: (downloadUrl) => {
              this.frstore.create(
                {
                  path: ["Profile", userId],
                  data: {
                    // @ts-ignore: Object is possibly 'null'.
                    imageUrl: downloadUrl,
                    timesptamp: FirebaseTSApp.getFirestoreTimestamp()

                  },
                }
              );
            }
          }
        );
      }
    });
    
  }
  onPhotoSelected(photoSelector: HTMLInputElement) {
    // @ts-ignore: Object is possibly 'null'.
    this.selectedImageFile = photoSelector.files[0];
    if (!this.selectedImageFile) return;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener(
      "loadend",
      ev => {
        // @ts-ignore: Object is possibly 'null'.
        let readableString = fileReader.result.toString();
        let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
        postPreviewImage.src = readableString;
      }
    );

  }
  getProfilePicture() {
    this.firebaseAuth.authState.subscribe(res => {
      if (res != null) {
        let userId = res.uid;
        this.frstore.getCollection(
          {
            path: ["Profile"],
            where: [],
            onComplete: (result) => {
              result.docs.forEach(
                doc => {
                  if (doc.id == userId) {
                    this.currentProfilePicture = doc.data().imageUrl;
                    console.log(this.currentProfilePicture, "Hello");
                  }
                  
                }
              );
            },
            onFail: err => {

            }
          }
        );
      }
    });
  }
}

