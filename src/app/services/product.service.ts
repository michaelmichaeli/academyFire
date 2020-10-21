import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage) { }

  getAllProducts() {
    return this.db.collection('products').valueChanges({ idField: 'id' });

  }

  getOneProduct(id) {
    return this.db.doc(`products/${id}`).valueChanges();
  }

  addProduct(product) {
    product.creator = auth().currentUser.uid;

    console.log('product creator id:', product.creator);

    const imageData = product.img;
    delete product.image; // img?

    let documentId = null;
    let storageRef: AngularFireStorageReference = null;

    return this.db.collection('products').add(product).then(ref => {
      console.log('ref', ref);
      documentId = ref.id;
      storageRef = this.storage.ref(`products/${documentId}`);
      const uplodTask = storageRef.putString(imageData, 'base64', { contentType: 'image/png' });
      return uplodTask;
    }).then(task => {
      console.log('task', task);
      return storageRef.getDownloadURL().toPromise();
    }).then(imageUrl => {
      console.log('got url:', imageUrl);
      return this.db.doc(`products/${documentId}`).update({ img: imageUrl })

    });
  }

  getSellerProducts() {
    const id = auth().currentUser.uid;
    return this.db.collection('products', ref => ref.where('creator', '==', id)).valueChanges({ idField: 'id' });
  }

  deleteProduct(id) {
    this.db.doc(`products/${id}`).delete();
    this.storage.ref(`products/${id}`).delete().subscribe(res => { })
  }

}
