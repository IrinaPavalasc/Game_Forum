import { Component, Input, OnInit } from '@angular/core';
import { PostData } from '../discussion/discussion.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() postData: PostData;
  creatorName: string;
  firestore = new FirebaseTSFirestore();
  constructor() { }

  ngOnInit(): void {
    this.getCreatorInfo();
  }

  getCreatorInfo() {
    this.firestore.getDocument(
      {
        path: ["users", this.postData.creatorId],
        onComplete: result => {
          let userDocument = result.data();
          if (userDocument) {
            this.creatorName = userDocument.Username;
          }
        }
      }
    );
  }
}
