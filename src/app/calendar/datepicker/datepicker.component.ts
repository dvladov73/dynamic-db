import { Component, OnInit,HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
//import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
//import { componentFactoryName } from '@angular/compiler';

import { GlobalsService } from '../../shared/globals.service';
//import { getLocaleDateFormat } from '@angular/common';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent  implements OnInit {

  constructor(private fb: FormBuilder, public glForm:GlobalsService) { glForm.myForm=this.myForm;}
  public myForm:FormGroup;
  public minDate: Object = new Date(2019,1,1);
  public maxDate: Object =  new Date(2020,5,1);
  ngOnInit() {
    this.myForm = this.fb.group({
      date: null,      
      range: null
    });
    this.glForm.myForm=this.myForm;
    
  }
}