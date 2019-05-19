import { Component, OnInit } from '@angular/core';
import { AppSettingsServiceProducts } from '../../../services/products.service';
import { AppSettingsServiceCategories } from '../../../services/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.sass']
})
export class ShopComponent implements OnInit {

  constructor(private appSettingsServiceProducts: AppSettingsServiceProducts, private appSettingsServiceCategories: AppSettingsServiceCategories, private toastr: ToastrService) {}

  products: any[] = [];
  categories: any[] = [];
  filterProducts: any[] = [];
  filters = {
    category: [],
    available: -1,
    price_range: [0, 999999],
    quantity: -1,
    productName: null
  };
  minPriceProduct: number;
  maxPriceProduct: number;
  showForm = false;

  ngOnInit() {
    this.appSettingsServiceProducts.getJSON().subscribe(data => {
      this.products = data.products;
      this.filterProducts = data.products;
      this.filterProducts = this.setFilters();
      this.filters.price_range[1] = this.maxPriceProduct;
    });
    this.appSettingsServiceCategories.getJSON().subscribe(data => {
      this.categories = data.categories;
    });
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '280px';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.body.style.backgroundColor = 'white';
  }

  categoryFilter(sublevelId, sublevelEnd) {
    const sublevelsIds = [sublevelId];
    if (sublevelEnd) {
      this.showForm = false;
      sublevelEnd.forEach((sublevel) => {
        sublevelsIds.push(sublevel.id);
        if (sublevel.sublevels) {
          sublevel.sublevels.forEach((sublevel1) => {
            sublevelsIds.push(sublevel1.id);
            if (sublevel1.sublevels) {
              sublevel1.sublevels.forEach((sublevel2) => {
                sublevelsIds.push(sublevel2.id);
              });
            }
          });
        }
      });
    } else {
      this.showForm = true;
    }
    this.filters.category = sublevelsIds;
    this.filterProducts = this.setFilters();
    this.closeNav();
  }

  filterByDisponibility($event) {
    this.filters.available = ($event.target.value === '1') ? 1 : 0;
    this.filterProducts = this.setFilters();
    this.closeNav();
  }

  filterByQuantity($event) {
// tslint:disable-next-line: radix
    this.filters.quantity = parseInt($event.target.value);
    this.filterProducts = this.setFilters();
    this.closeNav();
  }

  filterByRange($event) {
    this.filters.price_range[1] = parseFloat($event.target.value);
    this.filterProducts = this.setFilters();
    this.closeNav();
  }

  resetFilter() {
    this.filterProducts = this.products;
    this.filters = {
      category: [],
      available: -1,
      price_range: [this.minPriceProduct, this.maxPriceProduct],
      quantity: 1,
      productName: null
    };
    this.closeNav();
  }

  setFilters() {

    let min = 9999999999;
    let max = 0;

    this.products.forEach((product) => {
      const price = parseFloat(product.price.replace(/\$/g, '').replace(/,/g, ''));
      if (price > max) {
        max = price;
      }
      if (price < min) {
        min = price;
      }
    });

    this.minPriceProduct = min;
    this.maxPriceProduct = max;
    this.filters.price_range[0] = min;

    const filterProducts = this.products.filter((product) => {
      // Filtrado por categorias
      let filterByCategory = true;

      if (this.filters.category.length > 0) {
        filterByCategory = (this.filters.category.find(item => item === product.sublevel_id));
      } else {
        filterByCategory = true;
      }

      // Fitrado por disponibilidad
      let filterByAvailable = false;

      if (this.filters.available === -1) {
        filterByAvailable = true;
      } else {
        const available = (product.available === true) ? 1 : 0;

        if (available === this.filters.available) {
          filterByAvailable = true;
        } else {
          filterByAvailable = false;
        }
      }

      // Filtrado por cantidad
      let filterByQty = true;

      if (this.filters.quantity !== -1) {
        filterByQty = (product.quantity > this.filters.quantity);
      } else {
        filterByQty = true;
      }

      // Filtrado por nombre del producto
      let filterByName = true;

      if (this.filters.productName !== null && this.filters.productName !== '') {
        const reg = new RegExp(this.filters.productName, 'gi');
        filterByName = reg.test(product.name);
      } else {
        filterByName = true;
      }

      // Filtrado por precio
      const price = parseFloat(product.price.replace(/\$/g, '').replace(/,/g, ''));

      const filterByPrice = (price >= this.filters.price_range[0] && price <= this.filters.price_range[1]);

      if (filterByCategory && filterByAvailable && filterByQty && filterByPrice && filterByName) {
        return true;
      }
    });

    return filterProducts;
  }

  searchByName($event) {
    this.filters.productName = $event.target.value;
    this.filterProducts = this.setFilters();
  }

  // Order products
  orderByPriceLowToHigt() {
    this.filterProducts = this.filterProducts.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/\$/g, '').replace(/,/g, ''));
      const priceB = parseFloat(b.price.replace(/\$/g, '').replace(/,/g, ''));
      if (priceA - priceB) {
        return priceA - priceB;
      }
      return 0;
    });
  }

  orderByPriceHigtToLow() {
    this.filterProducts = this.filterProducts.sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/\$/g, '').replace(/,/g, ''));
      const priceB = parseFloat(b.price.replace(/\$/g, '').replace(/,/g, ''));
      if (priceB - priceA) {
        return priceB - priceA;
      }
      return 0;
    });
  }

  orderByQuantityLowToHigt() {
    this.filterProducts = this.filterProducts.sort((a, b) => {
// tslint:disable-next-line: radix
      const qtyA = parseInt(a.quantity);
// tslint:disable-next-line: radix
      const qtyB = parseInt(b.quantity);

      if (qtyA - qtyB) {
        return qtyA - qtyB;
      }
      return 0;
    });
  }

  orderByQuantityHigtToLow() {
    this.filterProducts = this.filterProducts.sort((a, b) => {
// tslint:disable-next-line: radix
      const qtyA = parseInt(a.quantity);
// tslint:disable-next-line: radix
      const qtyB = parseInt(b.quantity);

      if (qtyB - qtyA) {
        return qtyB - qtyA;
      }
      return 0;
    });
  }

  orderByAvailability() {
    this.filterProducts = this.filterProducts.sort((a, b) => {
      const availableA = (a.available === true) ? 'Disponible' : 'No disponible';
      const availableB = (b.available === true) ? 'Disponible' : 'No disponible';
      if (availableA > availableB) {
        return 1;
      }

      if (availableA < availableB) {
        return -1;
      }
      return 0;
    });
  }

  // Add to cart
  addToCart(productId, quantityO, productInf) {
// tslint:disable-next-line: prefer-const
    if (localStorage.getItem('cart')) {
// tslint:disable-next-line: prefer-const
      let cart = JSON.parse(localStorage.getItem('cart'));
      if (cart[productId]) {
        if (cart[productId].quantity >= quantityO) {
          this.toastr.success('No hay mas productos disponibles para agregar.');
          localStorage.setItem('cart', JSON.stringify(cart));
        } else {
          cart[productId].quantity += 1;
          cart[productId].totalPrice = cart[productId].quantity * parseFloat(cart[productId].price.replace(/\$/g, '').replace(/,/g, ''));
          this.toastr.success('Se ha agregado un producto a su carrito.');
          localStorage.setItem('cart', JSON.stringify(cart));
        }
      } else {
        cart[productId] = {};
        cart[productId].id = productInf.id;
        cart[productId].quantity = 1;
        cart[productId].name = productInf.name;
        cart[productId].price = productInf.price;
        cart[productId].totalPrice = cart[productId].quantity * parseFloat(cart[productId].price.replace(/\$/g, '').replace(/,/g, ''));
        cart[productId].qtyTotal = productInf.quantity;
        this.toastr.success('Se ha agregado un producto a su carrito.');
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } else {
// tslint:disable-next-line: prefer-const
      let cart = {};
      cart[productId] = {};
      cart[productId].id = productInf.id;
      cart[productId].quantity = 1;
      cart[productId].name = productInf.name;
      cart[productId].price = productInf.price;
      cart[productId].totalPrice = cart[productId].quantity * parseFloat(cart[productId].price.replace(/\$/g, '').replace(/,/g, ''));
      cart[productId].qtyTotal = productInf.quantity;
      this.toastr.success('Se ha agregado un producto a su carrito.');
      localStorage.setItem('cart', JSON.stringify(cart));
    }

  }

}
