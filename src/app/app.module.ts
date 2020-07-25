import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { ChartDataComponent } from './chart-data/chart-data.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CalendarModule } from './calendar/calendar.module';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HomeComponent } from './home/home.component';
import { SalesChartComponent } from './sales-chart/sales-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AreaChartComponent,
    ChartDataComponent,
    PagenotfoundComponent,
    HomeComponent,
    SalesChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
   // FontAwesomeModule,
    
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
