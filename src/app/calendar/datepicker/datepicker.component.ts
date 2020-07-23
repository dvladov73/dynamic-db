import { Component, OnInit,HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
//import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
//import { componentFactoryName } from '@angular/compiler';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent  implements OnInit {

  constructor(private fb: FormBuilder) {}
  myForm:FormGroup;
  ngOnInit() {
    this.myForm = this.fb.group({
      date: null,
     // range: null
    });
  }
}