import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Datepicker module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { PerfComponent } from './perf/perf.component';
import { ChartDataComponent } from '../chart-data/chart-data.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon'
import { PerfChartComponent } from './perf-chart/perf-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';




@NgModule({
  declarations: [PerfComponent, PerfChartComponent, PieChartComponent],
  exports: [
    
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule
  ]
})
export class CalendarModule { }
