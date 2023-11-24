// import { DOCUMENT } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PizzaService } from './pizza.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router, @Inject(DOCUMENT) document, private pizzaService: PizzaService) {
  }

  isUser: boolean;
  title = 'Tour of Heroes';
  userType = [
    { value: 'customer', viewValue: 'Customer' },
    { value: 'baker', viewValue: 'Baker' }
  ];
  selected: string = "customer";
  showLogin: boolean;
  data: any = {
    userName: "",
    pwd: "",
    email: ""
  }
  showRegister: boolean;
  showOrderSummary: boolean;
  isBaker: boolean;
  errorMsg: boolean;
  userMsg:boolean;
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(e) {
  //    if (window.pageYOffset > 250) {
  //      let element = document.getElementById('navbar');
  //      element.classList.add('sticky');
  //    } else {
  //     let element = document.getElementById('navbar');
  //       element.classList.remove('sticky'); 
  //    }
  // }

  ngOnInit() {
    
    if (Boolean(sessionStorage.getItem('isLoggedIn'))) {
      this.showLogin = false;
      this.isBaker = sessionStorage.getItem('loggedInUser')=='baker';
      if (sessionStorage.getItem('loggedInUser')!=='baker') {
        this.router.navigate(['/customer']);
      } else {
        this.router.navigate(['/baker']);
      }
    } else {
      this.showLogin = true;
    }
  }

  createOrder(){
      this.router.navigate(['/customer']);
  }

  // onUserTypeChange() {
  //   console.log("user type change")
  //   this.isUser = this.selected.toLowerCase() == "customer";
  //   if (this.isUser) {
  //     this.router.navigate(['/customer']);
  //   } else {
  //     this.router.navigate(['/baker']);
  //   }
  // }

  viewOrders() {
    this.isUser = sessionStorage.getItem("loggedInUser") === "baker";
    if (!this.isUser) {
      this.router.navigate(['/baker']);
    } else {
      window.location.reload()
      this.router.navigate(['/baker']);
    }
  }

  login() {
    let customer;
      this.pizzaService.checkIfCustomerExists(this.data.email,this.data.pwd)
      .subscribe(cust => {
        console.log("customer login",cust)
        customer = cust;
      });
    setTimeout(() => {
      console.log("customer : ", customer);
      if (customer[0]["check_customer"]) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loggedInUser', this.data.email);
        // this.isBaker = sessionStorage.getItem('loggedInUser')=='baker';
        this.showLogin = false;
        this.ngOnInit();
      } else {
        this.errorMsg = true;
      }
    }, 3000)
    
  }

  // checkIfCustomerExists(email,pwd) {
    
  // }

  logOut() {
    sessionStorage.clear();
    this.showLogin = true;
  }

  register() {
    let params = {
      "userName": this.data.userName,
      "password": this.data.pwd,
      "email": this.data.email
    }
    this.pizzaService.addUser(params)
      .subscribe(order => {
        this.userMsg=true;
      });
  }

  goToLogin() {
    this.data = {
      userName: '',
      email: '',
      password: ''
    }
    this.showLogin = true;
    this.showRegister = false;
  }
  
}
