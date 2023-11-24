import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';

import { Ingredient, Order, Supplier } from '../pizza';
import { PizzaService } from '../pizza.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderComponent } from '../order/order-detail.component';

@Component({
  selector: 'app-bakers',
  templateUrl: './bakers.component.html',
  styleUrls: ['./bakers.component.css']
})
export class BakersComponent implements OnInit {
  
  orders: any[] = [];
  isBaker:boolean;
  suppliers: Supplier[] = [];
  ingredients: Ingredient[]= [];
  isShowIngredient:boolean = false;
  isShowSupplier:boolean = false;
  ELEMENT_DATA: Supplier[] = [];
  displayedColumns: string[];
  dataSource: any[] = [];
  
  constructor(public pizzaService: PizzaService, public dialog: MatDialog,private cd: ChangeDetectorRef,public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isShowSupplier = false;
    this.isShowIngredient = false;
    this.isBaker = sessionStorage.getItem("loggedInUser")=="baker";
    console.log("in baker");
    this.getOrders();
  }

  getOrders(): void {
    this.pizzaService.getOrders()
      .subscribe(orders => {
        orders.forEach(x => {
          let rowData = Object.values(x)[0].replace('(', '').replace(')', '').replaceAll('"', '')
          let supplierSet = rowData.substring(
            rowData.lastIndexOf("{") + 1,
            rowData.lastIndexOf("}")
          ).split(",");
          let ingredientIdSet = rowData.substring(
            rowData.indexOf("{") + 1,
            rowData.indexOf("}")
          );
          let ingredientSet = rowData.substring(rowData.lastIndexOf("{")-2,rowData.indexOf("}")+3).split(",")
          console.log("::",ingredientSet)
          rowData = rowData.replace(/{.*}/g, '').split(',')
          let totSet = [];let ct = 0;
          ingredientSet.forEach(x=>{
            totSet.push({
              "name":x,
              "supplier":supplierSet[ct]
            });
            ct++;
          })
          let params = {
            "totalPrice": rowData[4],
            "customerEmail": rowData[5],
            "pizzaName": rowData[1] + rowData[2],
            "pizzaSize": rowData[3],
            "ingredients": totSet,
            "ingredientIds": ingredientIdSet,
            "suppliers": supplierSet,
            "orderid": rowData[0]
          }
          this.orders.push(params)
        })
        console.log(this.orders)
      });
  }

  showSuppliers(): void {
    this.displayedColumns = ["supplierId","supplierName", 'supplierAddress', 'supplierContact', 'supplierEmail','actions'];
    this.isShowSupplier = true;
    this.isShowIngredient = false;
    this.suppliers = [];
    this.pizzaService.getAllSuppliers()
      .subscribe(suppliers => {
        suppliers.forEach(x => {
          let rowData = Object.values(x)[0].replace('(','').replace(')','').split(',')
          let params = {
            "supplierId": rowData[0],
            "supplierName": rowData[1].replaceAll('"',''),
            "supplierContact": rowData[2],
            "supplierEmail": rowData[3],
            "supplierAddress": rowData[4].replaceAll('"',''),
            "actions":"",
            "hide":rowData[5]
          }
          this.suppliers.push(params);
        })
        this.suppliers = [...this.suppliers]
    console.log(this.suppliers)
    this.dataSource = [...this.suppliers];
    this.cd.detectChanges();
      });
  }

  showIngredients(): void {
    this.displayedColumns = ["ingredientId","ingredientName", 'ingredientPrice', 'quantity','region','supplierName','actions']
    this.isShowIngredient = true;
    this.isShowSupplier = false;
    this.ingredients = [];
    this.pizzaService.getIngredients()
      .subscribe(ingredients => {
        ingredients.forEach(x => {
          let rowData = x["getingredients"].replace('(','').replace(')','').split(',')
          let params = {
            "ingredientId": rowData[0],
            "ingredientName": rowData[1].replaceAll("\"",""),
            "ingredientPrice": rowData[2],
            "quantity": rowData[3],
            "hide":rowData[4],
            "supplierId": rowData[5],
            "supplierName": rowData[6].replaceAll('"',''),
            "stockid": rowData[7],
            "supplierAddress": rowData[8].replaceAll('"','')
          }
          this.ingredients.push(params);
        })
        setTimeout(()=>{
          this.ingredients = [...this.ingredients];

        },3000)
    this.dataSource = [...this.ingredients];
    console.log(this.ingredients)
    this.cd.detectChanges();
      });
  }

  openAddSupplier(text,val?) {
    if(val){
      val["isEditOrDel"] = text
    }
    const dialogRef = this.dialog.open(addSupplierDialog, {
      width: '250px',
      data: val
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.showSuppliers();
    });
  }

  openAddIngredient(text,val?) {
    if(val){
      val["isEditOrDel"] = text
    }
    const dialogRefIng = this.dialog.open(addIngredientDialog, {
      width: '250px',
      data: val
    });

    dialogRefIng.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.showIngredients();
    });
  }

  hideOrShow(val,hide){
    console.log(val);
    val["hide"] = hide;
    delete val["actions"];
    delete val["isEditOrDel"];
    this.pizzaService.addIngredient(val, 'edit')
      .subscribe(supplier => {
        // this.dialogRef.close();
      });
  }

  hideOrShowSuppliers(val,hide){
    console.log(val);
    val["hide"] = hide;
    delete val["actions"];
    delete val["isEditOrDel"];
    this.pizzaService.addSupplier(val, 'edit')
      .subscribe(supplier => {
        // this.dialogRef.close();
      });
  }

  restock(val){
    console.log(val);
    val["suppliers"] = [];
    this.pizzaService.getRestockSuppliers(val["ingredientId"])
      .subscribe(suppliers => {
        suppliers.forEach(x => {
          let rowData = Object.values(x)[0].replace('(','').replace(')','').split(',')
          let params = {
            "supplierId": rowData[0],
            "supplierName": rowData[1].replaceAll('"',''),
            "supplierContact": rowData[2],
            "supplierEmail": rowData[3],
            "supplierAddress": rowData[4].replaceAll('"',''),
            "actions":"",
            "hide":rowData[5]
          }
          val.suppliers.push(params);
        })
      console.log(val.suppliers)
      });
    const dialogRefIng = this.dialog.open(restockIngredientDialog, {
      width: '250px',
      data: val
    });

    dialogRefIng.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      this.showIngredients();
    });
    
  }

  proceedToOrder(data){

    console.log("dataa--------",data);
    let name = data.pizzaName.split(' ');
    let params = {
      "totalprice":data.totalPrice,
      "pizzaname":name[0]+' '+name[1]+', '+name[2],
      "ingredientlist":data.ingredientIds.split(','),
      "customerEmail":sessionStorage.getItem("loggedInUser")
    }
    this.pizzaService.addOrder(params)
      .subscribe(order => {
        // this.orders.push(order);
        // console.log(this.orders);
        
        this.ngOnInit();
          this.snackBar.openFromComponent(OrderComponent, {
            duration: 500,
            horizontalPosition: "center",
            verticalPosition: "top",
          });
      });
  }

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.pizzaService.addHero({ name } as Hero)
  //     .subscribe(hero => {
  //       this.heroes.push(hero);
  //     });
  // }

  // delete(hero: Hero): void {
  //   this.heroes = this.heroes.filter(h => h !== hero);
  //   this.pizzaService.deleteHero(hero).subscribe();
  // }

}


@Component({
  selector: 'addSupplierDialog',
  templateUrl: '../addSupplierDialog/addSupplierDialog.component.html',
})
export class addSupplierDialog {
  isDelete:boolean = false;
  constructor(public dialogRef: MatDialogRef<addSupplierDialog>,public matDialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: Supplier,private pizzaService: PizzaService,private cd:ChangeDetectorRef) {
  }
  ngOnInit(){
      console.log("---",this.data)
      if(!this.data){
          this.data = {
              "supplierId":null,
              "supplierName": '',
              "supplierContact": '',
              "supplierEmail": '',
              "supplierAddress": '',
          }
      }
  }

  addSupplierEvent(params) {
      console.log(params);
      const isEdit = Object.keys(params).includes('isEditOrDel') ? params.isEditOrDel : '';
      this.isDelete = isEdit=='delete'?true:false;
      if(isEdit == 'edit'){
        delete params["actions"];
      delete params["isEditOrDel"]; 

      } else if (isEdit == 'delete'){
        delete params["actions"];
        delete params["supplierName"];
        delete params["supplierAddress"];
        delete params["supplierContact"];
        delete params["supplierEmail"];
      delete params["isEditOrDel"]; 

      } else {
        delete params["actions"];
        delete params["supplierId"]; 
      delete params["isEditOrDel"]; 

      }
        this.pizzaService.addSupplier(params,isEdit)
        .subscribe(supplier => {
    this.dialogRef.close();
        });
    }

}

@Component({
  selector: 'addIngredientDialog',
  templateUrl: '../addIngredientDialog/addIngredientDialog.component.html',
})
export class addIngredientDialog {
  isDelete:boolean = false;
  constructor(public dialogRef: MatDialogRef<addIngredientDialog>,public matDialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: Ingredient,private pizzaService: PizzaService,private cd:ChangeDetectorRef) {
  }
  ngOnInit(){
      console.log("---",this.data)
      if(!this.data){
          this.data = {
              "ingredientId":null,
              "ingredientName": '',
              "ingredientPrice": '',
              "quantity": '',
              "supplierName": '',
              "hide": 0,
              "supplierId":null,
              "supplierAddress":null,
              "stockid":null
          }
      }
    this.data["suppliers"] = [];
    // this.data.supplierName=this.data["suppliers"][0].supplierName;
    // this.data.supplierAddress=this.data["suppliers"][0].supplierAddress;
    // this.data.supplierId=this.data["suppliers"][0].supplierId;
    if(this.data["isEditOrDel"]!=="edit") {
      this.pizzaService.getSuppliers()
      .subscribe(suppliers => {
        suppliers.forEach(x => {
          let rowData = Object.values(x)[0].replace('(','').replace(')','').split(',')
          let params = {
            "supplierId": rowData[0],
            "supplierName": rowData[1].replaceAll('"',''),
            "supplierContact": rowData[2],
            "supplierEmail": rowData[3],
            "supplierAddress": rowData[4].replaceAll('"',''),
            "actions":""
          }
          this.data["suppliers"].push(params);
        })
        console.log(this.data["suppliers"])
        setTimeout(()=>{
          this.data.supplierName = this.data["suppliers"][0].supplierName;
          this.data.supplierAddress = this.data["suppliers"][0].supplierAddress;
          this.data.supplierId = this.data["suppliers"][0].supplierId;
        },3000)
        
      });
    } else {
      this.pizzaService.getRestockSuppliers(this.data.ingredientId)
      .subscribe(suppliers => {
        suppliers.forEach(x => {
          let rowData = Object.values(x)[0].replace('(','').replace(')','').split(',')
          let params = {
            "supplierId": rowData[0],
            "supplierName": rowData[1].replaceAll('"',''),
            "supplierContact": rowData[2],
            "supplierEmail": rowData[3],
            "supplierAddress": rowData[4].replaceAll('"',''),
            "actions":"",
            "hide":rowData[5]
          }
          this.data["suppliers"].push(params);
        })
        console.log(this.data["suppliers"])
        setTimeout(()=>{
          this.data.supplierName = this.data.supplierName;
          this.data.supplierAddress = this.data.supplierAddress;
          this.data.supplierId = this.data.supplierId;
        },1000)
        
      });
    }
    
  }

  addIngredientEvent(params) {
      console.log(params);
      params["hide"]=0;
      const isEdit = Object.keys(params).includes('isEditOrDel') ? params.isEditOrDel : '';
      this.isDelete = isEdit=='delete'?true:false;
      if(isEdit == 'edit'){
        delete params["actions"];
        delete params["isEditOrDel"]; 

      } else if (isEdit == 'delete'){
        delete params["actions"];
        delete params["ingredientName"];
        delete params["ingredientPrice"];
        delete params["quantity"];
        // delete params["region"];
        delete params["supplierAddress"];
        delete params["hide"];
        delete params["isEditOrDel"]; 
      } else {
        delete params["actions"];
        delete params["stockid"]; 
        delete params["isEditOrDel"]; 
        delete params["hide"];
      }
      
        this.pizzaService.addIngredient(params,isEdit)
        .subscribe(supplier => {
        this.dialogRef.close();
        });
    }

    onChangeSupplier(event){
      console.log("changed supplier",event.target.value)
      this.data.supplierId=event.target.value;
      this.data["suppliers"].map(x=>{
        if(x.supplierId==this.data.supplierId){
          this.data.supplierName=x.supplierName;
          this.data.supplierAddress=x.supplierAddress;
        }
      })
    } 

}



@Component({
  selector: 'restockIngredientDialog',
  templateUrl: '../restockIngredientDialog/restockIngredientDialog.component.html',
})
export class restockIngredientDialog {
  isDelete:boolean = false;
  supplierId:number;
  constructor(public dialogRef: MatDialogRef<restockIngredientDialog>,public matDialog:MatDialog,@Inject(MAT_DIALOG_DATA) public data: Ingredient,private pizzaService: PizzaService,private cd:ChangeDetectorRef) {
  }
  ngOnInit(){
    console.log("fghjk",this.data)
  }

  restockIngredientEvent(params,val) {
      let obj = {
        ingredientId:params.stockid,
        supplierId:this.supplierId ? this.supplierId : params.supplierId,
        quantity:params.quantity
      }
      console.log("obj",obj)
      this.pizzaService.restock(obj)
        .subscribe(supplier => {
        this.dialogRef.close();
        });
      
    }

    onChangeSupplier(event){
      console.log("in on change",)
      this.supplierId = event.target.value;
    }

}