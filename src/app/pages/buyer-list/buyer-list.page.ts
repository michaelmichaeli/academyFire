import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { CartModalPage } from '../cart-modal/cart-modal.page';

@Component({
  selector: 'app-buyer-list',
  templateUrl: './buyer-list.page.html',
  styleUrls: ['./buyer-list.page.scss'],
})
export class BuyerListPage implements OnInit {
  products: Observable<any>;
  cartItemCount: BehaviorSubject<number> = this.cartService.getCartItemCount();

  constructor(private auth: AuthService, private productService: ProductService,
    private cartService: CartService, private modalCrtl: ModalController) { }

  ngOnInit() {
    this.products = this.productService.getAllProducts();
  }

  signOut() {
    this.auth.signOut();
  }

  async openCart() {
    const modal = await this.modalCrtl.create({
      component: CartModalPage,
      cssClass: 'cart-modal'
    });
    modal.present();
  }

}
