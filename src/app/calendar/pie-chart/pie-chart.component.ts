import { Component, OnInit, Input, ViewEncapsulation, OnChanges, ElementRef, SimpleChanges, OnDestroy } from '@angular/core';


import { SalesInterface } from  '../../shared/data-interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements  OnInit, OnDestroy, OnChanges {
 // destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() data:SalesInterface[];
  
  u_data=[{res:0,unit:"Retail"},{res:0,unit:"Wholesale"},{res:0,unit:"Online"}];
  hostElement='#pie';
  private width:number;
  private height:number;
  radius: number;
  private margin = { top:0, right: 0, bottom: 0, left:0 };
  // Arcs & pie
  private arc: any;  private pie: any;  private slices: any;
  private color: any;
  // Drawing containers
  private svg: any;  private mainContainer: any;
  //Tooltip
  private tooltip: any;  
  total=0;
  //Labels
  private arcLabel: any;
  private texts: any;

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
}
   
  ngOnInit(): void {
      
   }
  ngOnDestroy(){
  
  } 
  ngOnChanges(changes:SimpleChanges):void {
   //prepare data 
   if (changes.data) {
    this.removeExistingChartFromParent();
    this.processData(changes.data.currentValue); //update the chart using new time window
   }
    
    this.svg = d3.select(this.hostElement).append('svg');
    //this.width=parseInt(d3.select(this.hostElement).style('width'), 10);
    //this.height=parseInt(d3.select(this.hostElement).style('height'), 10);
    this.width=600;
    this.height=250;
    this.radius = (Math.min((this.width-this.margin.left-this.margin.right), (this.height-this.margin.top-this.margin.bottom)))/2;
   
    this.setSVGDimensions();
    this.color =d3.scaleLinear().domain([0,this.u_data.length]).range(<any[]>['#81f7be', '#026636']); //colours range
    //this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.mainContainer = this.svg.append('g').attr('transform', `translate(${(this.width)/2},${(this.height)/2})`);
    this.pie = d3.pie().sort(null).value((d: any) =>(d.res));
    this.draw();

    //listening to the window size
    window.addEventListener('resize', this.resize.bind(this));
  

  }
  private setSVGDimensions() {
    this.svg.style('width', '100%').style('height', '70%')
             .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);
  }
  
  private draw() {
    this.setArcs();
    this.drawSlices();
    //labels
   this.drawLabels();
  }

  private setArcs() {
    const thickness=0.1; // for inner radius
    this.arc = d3.arc().outerRadius(this.radius).innerRadius(this.radius * thickness); 
    //labels
    this.arcLabel = d3.arc().innerRadius(this.radius * thickness).outerRadius(this.radius +20);
  }

  private drawSlices() {
    this.slices = this.mainContainer.selectAll('path')
      .remove().exit()
      .data(this.pie(this.u_data))
      .enter().append('g').append('path')
      .attr('d', this.arc)
      .attr('fill', (d, i) => this.color(i));
     
  
  }

  private drawLabels() {
    this.texts = this.mainContainer.selectAll('text')
      .remove().exit()
      .data(this.pie(this.u_data))
      .enter().append('g').append('text')
      .attr('text-anchor', 'middle').attr('transform', d => `translate(${this.arcLabel.centroid(d)})`).attr('dy', '0.35em');

    this.texts.append('tspan').filter(d => (d.endAngle - d.startAngle) > 0.25)
      .attr('x', 0).attr('y', '1.3em').attr('fill-opacity', 0.7)
    //  .text(d => d.unit);
     .text((d,i)=>this.u_data[i].unit);
  }
  private processData (data:SalesInterface[]) {
    this.u_data[0].res=this.data.reduce(function(a, b){
      return a + b.sales1;}, 0)-this.data.reduce(function(a, b){
        return a + b.expense1;}, 0);
    this.u_data[1].res=this.data.reduce(function(a, b){
      return a + b.sales2;}, 0)-this.data.reduce(function(a, b){
        return a + b.expense2;}, 0);  
    this.u_data[2].res=this.data.reduce(function(a, b){
      return a + b.sales3;}, 0)-this.data.reduce(function(a, b){
        return a + b.expense3;}, 0);

  }
  //resizing as the window changes
  private resize() {
    this.setSVGDimensions();
    this.setArcs();
     this.repaint();
    this.drawLabels();
  }

  private repaint() {
    this.drawSlices();
    this.drawLabels();
  }
  private removeExistingChartFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement).select('svg').remove();
}
}

