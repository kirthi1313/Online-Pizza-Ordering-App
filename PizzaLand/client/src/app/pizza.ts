
export interface Pizzen {
  pizzenId: number;
  pizzenName: string;
  pizzenSize: string;
  basePrice: string;
}

export interface Ingredient {
  ingredientId: number;
  ingredientName: string;
  quantity: string;
  ingredientPrice: string;
  hide: number;
  supplierId: number;
  supplierName:string;
  supplierAddress:string;
  stockid:number;
}

export interface Order {
  totalPrice: string;
  pizzaId: number;
  ingredientIds: number[];
  orderid: number;
}

export interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierContact: string;
  supplierEmail: string;
  supplierAddress: string;
}
