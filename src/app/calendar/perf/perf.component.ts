import { Component, OnInit, OnDestroy} from '@angular/core';

import { FormBuilder, FormGroup} from '@angular/forms';

import { DataService } from '../../core/data.service';
import { SalesInterface } from '../../shared/data-interface';

import { Subject } from 'rxjs';
import { min } from 'd3';

@Component({
  selector: 'app-perf',
  templateUrl: './perf.component.html',
  styleUrls: ['./perf.component.scss']
})

export class PerfComponent implements OnInit,  OnDestroy {
  salesData:SalesInterface[];
  salesData1:SalesInterface[]=[];
  public myForm:FormGroup;
  public minDate: Object = new Date('2019-10-20');
  public maxDate: Object =  new Date('2020-01-01');

  
  date_s:string;
  date_d: Object = new Date('2001-01-01');
  averageSales:number=0;
  averageRevenue:number=0;
  averageProfitUnit:number=0;
  salesYTD:number=0;
  profitYTD:number=0;
  av_cust_acc:number=0;
  av_cust_ltv:number=0;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isVisible:boolean=false;
  

  changeVisibility() {
    this.isVisible = !this.isVisible;
}

  constructor(private dataService:DataService,private fb: FormBuilder) {  }
  
  ngOnInit(): void {
    
    this.myForm = this.fb.group({
      date: null,      
      range: null
    });
  
    this.dataService.sendGetRequest().subscribe((data: SalesInterface[])=>{
         this.salesData = data;
        // this.salesData1=data;
             /*setting the interval*/
           
         this.dateFilter();
         this.salesData=this.salesData1;
         this.avSales();
         this.avRevenue();
         this.avProfitUnit();
         this.salesYTD=this.averageSales*this.salesData.length;
         this.profitYTD=3*this.averageProfitUnit*this.salesData.length;
         this.avCustomer();
     
              
     });
     
  } 
  
  ngOnDestroy() {
    
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    
  }
 OnSubmit(){
      
  /* New Interval */       
   this.minDate=this.myForm.value.range[0];
   this.maxDate=this.myForm.value.range[1];
   this.destroy$.next(true);
   // Unsubscribe from the subject
   this.destroy$.unsubscribe();
   //re-subscribe
   this.dataService.sendGetRequest().subscribe((data: SalesInterface[])=>{
    this.salesData = data;
   // this.salesData1=data;
        /*setting the interval*/
      
    this.dateFilter();
    this.salesData=this.salesData1;
    this.avSales();
    this.avRevenue();
    this.avProfitUnit();
    this.salesYTD=this.averageSales*this.salesData.length;
    this.profitYTD=3*this.averageProfitUnit*this.salesData.length;
    this.avCustomer();
        
   });
  
    
  
 }
  private dateFilter(){
    for(var i=0;i<this.salesData.length;i++)
    {
      this.date_s=this.salesData[i].date;
      this.date_d=new Date(this.date_s);
      if (this.date_d>=this.minDate){ 
        if(this.date_d<=this.maxDate){
          this.salesData1.push(this.salesData[i]);
        }  
      }
    }
  }
  private avSales(){
    var av_sales;
    for(var i=0;i<this.salesData.length;i++){
       av_sales=this.salesData[i].sales1+this.salesData[i].sales2+this.salesData[i].sales3;
    }
    this.averageSales=av_sales;
  }
  private avRevenue(){
    var av_sales;
    var av_exp;

    for(var i=0;i<this.salesData.length;i++){
      av_sales=this.salesData[i].sales1+this.salesData[i].sales2+this.salesData[i].sales3;
      av_exp=this.salesData[i].expense1+this.salesData1[i].expense2+this.salesData[i].expense3;
    }
    this.averageRevenue=(av_sales-av_exp);
  }
  private avProfitUnit(){
   this.averageProfitUnit=this.averageRevenue/3;  
  }
  private avCustomer(){
    this.av_cust_acc=this.salesData.reduce(function(acc, curr){
      acc += curr.cust_acc;
      return acc;
      }, 0)/this.salesData.length;
    this.av_cust_ltv=this.salesData.reduce(function(acc, curr){
      acc += curr.cust_ltv;
      return acc;
      }, 0)/this.salesData.length;
  }

}