import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Ingredient, Order, Pizzen } from '../pizza';
import { OrderComponent } from '../order/order-detail.component';
import { PizzaService } from '../pizza.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  pizzen: Pizzen[] = [];
  ingredients: Ingredient[] = [];
  orders: Order[] = [];
  sizes: any[] = [
    {value: 'small', viewValue: 'Small', numberVal: '25 cm'},
    {value: 'medium', viewValue: 'Medium', numberVal: '30 cm'},
    {value: 'large', viewValue: 'Large', numberVal: '40 cm'}
  ]
  selected:string = "small";
  checked:boolean = false;
  sum:any = 0;
  
  constructor(private pizzaService: PizzaService,public snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log("in user")
    // this.getHeroes();
    this.getBasePizzen();
  }

  getBasePizzen(): void {
    // get base pizzas
    this.pizzaService.getbasePizzen()
    .subscribe(pizzen => {
      pizzen.forEach(val=>{
        val.pizzenName = val["pizzaname"].split(',')[0];
        val["size"] = val["pizzaname"].split(',')[1];
      })
      this.pizzen = [...pizzen]
      console.log(this.pizzen)
    })

    this.pizzaService.getIngredients()
      .subscribe(ingredients => {
        ingredients.forEach(x => {
          let rowData = x["getingredients"].replace('(', '').replace(')', '').split(',');

          let params = {
            "ingredientId": rowData[0],
            "ingredientName": rowData[1],
            "ingredientPrice": rowData[2],
            "quantity": rowData[3],
            "hide": rowData[4],
            "supplierId": rowData[5],
            "supplierName": rowData[6].replaceAll('"', ''),
            "stockid": rowData[7],
            "supplierAddress": rowData[8].replaceAll('"', '')
          }
          this.ingredients.push(params);
        })

      });
    setTimeout(()=>{
      console.log("-----",this.ingredients)
    },3000);
  }
  

  onSizeChange(selSize):void {
    let selPizza = "Pizza Dutchman";
    let psize = this.sizes.filter(x=>x.value.toLowerCase()==selSize.value.toLowerCase())[0].numberVal;
    this.pizzaService.getPriceOfBasePizza(psize,selPizza+', '+this.sizes.filter(x=>x.value==selSize.value)[0].viewValue)
    .subscribe(price => {
      this.sum = price[0]["checkpricebasedonsize"];
      console.log(this.sum);
    });
  }

  onSelectIngredient(selSize):void {
    let selPizza = "Pizza Dutchman";
    console.log("changed-- ",this.ingredients)
    let psize = this.sizes.filter(x=>x.value.toLowerCase()==selSize.toLowerCase())[0].numberVal;
    let arr = [];
    this.ingredients.filter(x=>{
      if(x["checked"]){
        arr.push(x["stockid"])
      }
    })
    this.pizzaService.getTotalPrice('{' + arr.join() + '}',psize,selPizza+', '+this.sizes.filter(x=>x.value.toLowerCase()==selSize.toLowerCase())[0].viewValue)
    .subscribe(price => {
      this.sum = price[0]["checkpriceoverall"];
      console.log(this.sum);
    });
  }

  onOpenPanel(val){
    // this.sum = 0;
    this.ingredients.forEach(x=>{
      if(x["checked"]){
        x["checked"]=false;
      }
    })

    this.selected="small";
    console.log(val);
    this.sum =  this.pizzen.filter(x=>x["pizzaname"]=='Pizza Dutchman, Small')[0]["baseprice"];
  }

  proceedToOrder(size){
    let arr:number[] = [];
    this.ingredients.filter(x=>{
      if(x["checked"]){
        let val:number = x["stockid"];
        arr.push(+val)
      }
    })
    let params = {
      "totalprice":this.sum,
      "pizzaname":'Pizza Dutchman, '+this.sizes.filter(x=>x.value==size)[0].viewValue,
      "ingredientlist":arr,
      "customerEmail":sessionStorage.getItem("loggedInUser")
    }
    console.log(":::",params)
    this.pizzaService.addOrder(params)
      .subscribe(order => {
        this.orders.push(order);
        console.log(this.orders);
          this.snackBar.openFromComponent(OrderComponent, {
            duration: 500,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
      });
  }
}
