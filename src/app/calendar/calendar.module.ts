import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
// Datepicker module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { PerfComponent } from './perf/perf.component';
import { ChartDataComponent } from '../chart-data/chart-data.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [DatepickerComponent, PerfComponent,SalesChartComponent],
  exports: [
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
   
  ]
})
export class CalendarModule { }
