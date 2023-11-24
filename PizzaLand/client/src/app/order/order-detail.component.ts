import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PizzaService } from '../pizza.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: [ './order-detail.component.css' ]
})
export class OrderComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private pizzaService: PizzaService
  ) {}

  ngOnInit(): void {
  }

}
