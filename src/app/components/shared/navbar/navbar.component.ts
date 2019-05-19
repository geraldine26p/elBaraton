import { Component, OnInit, HostListener } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event'])
    scrollHandler(event) {
      if (event.target.scrollingElement.scrollTop > 0) {
        $('.navbar-dark').attr('style', 'padding-top: 10px; padding-bottom: 10px; background-color: #fff !important; -webkit-transition: all .5s ease; -moz-transition: all .5s ease; -ms-transition: all .5s ease; -o-transition: all .5s ease; transition: all .5s ease;');
        $('.navbar-brand').attr('style', 'color: #262626 !important;');
        $('.nav-link').attr('style', 'color: #ffff !important;');
        $('.fa-shopping-cart').attr('style', 'color: #262626 !important;');
      } else {
        $('.navbar-dark').attr('style', 'background-color: transparent !important;');
        $('.navbar-brand').attr('style', 'color: #fff !important;');
        $('.nav-link').attr('style', 'color: #fff !important;');
        $('.fa-shopping-cart').attr('style', 'color: #fff !important;');
      }
    }

}
