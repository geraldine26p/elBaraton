import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './components/pages/cart/cart.component';
import { ShopComponent } from './components/pages/shop/shop.component';

const routes: Routes = [
  { path: 'shop', component: ShopComponent },
  { path: 'cart', component: CartComponent },
  { path: '', pathMatch: 'full', redirectTo: 'shop' },
  { path: '**', pathMatch: 'full', redirectTo: 'shop' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
