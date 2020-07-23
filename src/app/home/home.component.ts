import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataService } from '../core/data.service';
import { SalesInterface } from '../shared/data-interface';

import { Subject } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  salesData:SalesInterface[];
  averageSales:number=0;
  averageRevenue:number=0;
  averageProfitUnit:number=0;
  salesYTD:number=0;
  profitYTD:number=0;
  av_cust_acc:number=0;
  av_cust_ltv:number=0;
  destroy$: Subject<boolean> = new Subject<boolean>();
    
  
  constructor() {  }

  ngOnInit() {
   
  }
  ngOnDestroy() {
    
   
  }
}