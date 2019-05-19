import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit {

  products = {};
  objectKeys = Object.keys;
  totalPrice: number;

  constructor(private toastr: ToastrService) {
    this.products = JSON.parse(localStorage.getItem('cart'));
    this.updateTotalPriceOnCart();
  }

  ngOnInit() {
  }

  deleteProduct(productId) {
    delete this.products[productId];
    localStorage.setItem('cart', JSON.stringify(this.products));
    this.toastr.info('Se ha eliminado el producto de su carrito con exito.');
    this.updateTotalPriceOnCart();
  }

  processPurchase() {
    this.products = {};
    localStorage.setItem('cart', JSON.stringify(this.products));
    this.toastr.success('Se ha procesado su compra con exito.');
  }

  updateTotalPriceOnCart() {
    this.totalPrice = 0;
    for (var key in this.products) {
      if (this.products.hasOwnProperty(key)) {
        this.totalPrice += this.products[key].totalPrice;
      }
    }
  }

  changeQty($event, productId) {
    if(parseInt($event.target.value) === 0) {
      this.deleteProduct(productId);
      return;
    }
    if (parseInt($event.target.value) > 0 && parseInt($event.target.value) <= this.products[productId].qtyTotal) {
      this.products[productId].quantity = parseInt($event.target.value);
      this.products[productId].totalPrice = this.products[productId].quantity * parseFloat(this.products[productId].price.replace(/\$/g, '').replace(/,/g, ''));
      localStorage.setItem('cart', JSON.stringify(this.products));
      this.updateTotalPriceOnCart();
      this.toastr.success('Se ha modificado la cantidad de productos de su carrito.');
    } else {
      this.toastr.success('No hay mas productos disponibles para agregar.');
    }
  }



}
