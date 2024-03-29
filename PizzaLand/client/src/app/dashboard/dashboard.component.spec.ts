import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { pizzaService } from '../pizza.service';
import { HEROES } from '../mock-heroes';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let pizzaService;
  let getHeroesSpy;

  beforeEach(waitForAsync(() => {
    pizzaService = jasmine.createSpyObj('pizzaService', ['getHeroes']);
    getHeroesSpy = pizzaService.getHeroes.and.returnValue(of(HEROES));
    TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, HeroSearchComponent],
          imports: [RouterTestingModule.withRoutes([])],
          providers: [{provide: pizzaService, useValue: pizzaService}]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top Heroes" as headline', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Top Heroes');
  });

  it('should call pizzaService', waitForAsync(() => {
       expect(getHeroesSpy.calls.any()).toBe(true);
     }));

  it('should display 4 links', waitForAsync(() => {
       expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
     }));
});
