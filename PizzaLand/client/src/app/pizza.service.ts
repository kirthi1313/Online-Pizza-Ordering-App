import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Ingredient, Order, Pizzen, Supplier } from './pizza';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class PizzaService {

  private heroesUrl = 'api/heroes';  // URL to web api
  private serverUrl = 'http://localhost:3000';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  
  getbasePizzen(): Observable<Pizzen[]> {
    return this.http.get<Pizzen[]>(this.serverUrl+"/basePizzen")
      .pipe(
        tap(_ => this.log('fetched base pizzen')),
        catchError(this.handleError<Pizzen[]>('getbasePizzen', []))
      );
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.serverUrl+"/ingredients")
      .pipe(
        tap(_ => this.log('fetched ingredients')),
        catchError(this.handleError<Ingredient[]>('getIngredients', []))
      );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.serverUrl+"/orders")
      .pipe(
        tap(_ => this.log('fetched base pizzen')),
        catchError(this.handleError<Order[]>('getOrders', []))
      );
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.serverUrl+"/suppliers")
      .pipe(
        tap(_ => this.log('fetched base pizzen')),
        catchError(this.handleError<Supplier[]>('getSuppliers', []))
      );
  }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.serverUrl+"/getAllSuppliers")
      .pipe(
        tap(_ => this.log('fetched base pizzen')),
        catchError(this.handleError<Supplier[]>('getAllSuppliers', []))
      );
  }

  getRestockSuppliers(ingredientid): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.serverUrl+"/getRestockSuppliers",{params: {
      id:ingredientid
    }})
      .pipe(
        tap(_ => this.log('fetched base pizzen')),
        catchError(this.handleError<Supplier[]>('getSuppliers', []))
      );
  }

  getTotalPrice(arr,psize,pname): Observable<string> {
    return this.http.get<string>(this.serverUrl+"/checkTotalPrice",{
      params: {
        arr:arr,
        size: psize,
        name: pname
      }
    })
      .pipe(
        tap(_ => this.log('fetched ingredients')),
        catchError(this.handleError<string>('checkTotalPrice', ''))
      );
  }

  getPriceOfBasePizza(psize,pname): Observable<string> {
    return this.http.get<string>(this.serverUrl+"/checkPriceBasePizza",{
      params: {
        size: psize,
        name: pname
      }
    })
      .pipe(
        tap(_ => this.log('fetched ingredients')),
        catchError(this.handleError<string>('getIngredients', ''))
      );
  }

  checkIfCustomerExists(email,pwd): Observable<string> {
    return this.http.get<string>(this.serverUrl+"/checkCustomer", { 
      params: {
      email: email,
      pwd: pwd
    }
    })
  .pipe(
    tap(_ => this.log('fetched ingredients')),
    catchError(this.handleError<string>('getIngredients', ''))
  );
  }

  addOrder(order): Observable<Order> {
    return this.http.post<Order>(this.serverUrl+"/createOrder", order, this.httpOptions).pipe(
      tap((newOrder: Order) => this.log(`added hero w/ id=${newOrder}`)),
      catchError(this.handleError<Order>('addHero'))
    );
  }

  addSupplier(supplier,editOrDel): Observable<Supplier> {
    let url = editOrDel=='edit' ? '/updateSupplier' : editOrDel=='delete' ? '/deleteSupplier' : '/createSupplier'
    return this.http.post<Supplier>(this.serverUrl+url, supplier, this.httpOptions).pipe(
      tap((newSupplier: Supplier) => this.log(`added supplier w/ id=${newSupplier}`)),
      catchError(this.handleError<Supplier>('addSupplier'))
    );
  }

  restock(params): Observable<any> {
    return this.http.post<any>(this.serverUrl+'/restockIngredient', params, this.httpOptions).pipe(
      tap((newSupplier: any) => this.log(`added supplier w/ id=${newSupplier}`)),
      catchError(this.handleError<any>('restock'))
    );
  }

  addIngredient(ingredient,editOrDel): Observable<Supplier> {
    let url = editOrDel=='edit' ? '/updateIngredient' : editOrDel=='delete' ? '/deleteIngredient' : '/createIngredient'
    return this.http.post<Supplier>(this.serverUrl+url, ingredient, this.httpOptions).pipe(
      tap((newIngredient: Supplier) => this.log(`added supplier w/ id=${newIngredient}`)),
      catchError(this.handleError<Supplier>('addSupplier'))
    );
  }

  addUser(data): Observable<Supplier> {
    let url = '/createUser'
    return this.http.post<Supplier>(this.serverUrl+url, data, this.httpOptions).pipe(
      tap((newUser: any) => this.log(`added user w/ id=${newUser}`)),
      catchError(this.handleError<Supplier>('addUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a pizzaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`pizzaService: ${message}`);
  }
}
