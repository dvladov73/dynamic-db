import { Component, OnInit,  ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';

import { SalesInterface } from '../../shared/data-interface';

import * as d3 from 'd3';

@Component({
  selector: 'app-perf-chart',
  templateUrl: './perf-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./perf-chart.component.scss']
})
export class PerfChartComponent implements OnInit, OnChanges {
  
  @Input() data:SalesInterface[];
  @Input() transitionTime = 1000;
  private xmax=0;
  private ymax =0;
  private maxY1:number;
  private maxY2:number;
 // @Input() hticks = 0;
  @Input() showLabel = 0;
  viewBoxHeight = 100;
  viewBoxWidth = 200;
  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  g; // SVG Group element
  colorScale; // D3 color provider
  x; // X-axis graphical coordinates
  y; // Y-axis graphical coordinates
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  private bars:any;
  private bars1:any;
  private label:any;
  private label1:any;
  private text:any;
  private text1:any;
 

  constructor(private elRef: ElementRef) {
      this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.data) {
          this.createChart(changes.data.currentValue); //update the chart using new time window
      }
  }

  private createChart(data: SalesInterface[]) {

      this.removeExistingChartFromParent();
  //xmax calculation
      this.xmax=this.data.length;
 // ymax calculation  
      this.maxY1=this.data.reduce(function(max, x) { return ((x.sales1+x.sales2+x.sales3) > max) ? (x.sales1+x.sales2+x.sales3): max; }, 0);
      this.maxY2=this.data.reduce(function(max, x) { return ((x.expense1+x.expense2+x.expense3) > max) ? (x.expense1+x.expense2+x.expense3) : max; }, 0);
      this.ymax=this.maxY2;
      if (this.maxY1>this.maxY2) {this.ymax=this.maxY1}
   
      this.setChartDimensions();

      this.setColorScale();

      this.addGraphicsElement();

      this.createXAxis();

      this.createYAxis();
      

      this.createAreaCharts();

  }

  private setChartDimensions() {
   
      this.svg = d3.select(this.hostElement).append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight );
  }

  private addGraphicsElement() {
      this.g = this.svg.append("g")
          .attr("transform", "translate(0,0)");
  }

  private setColorScale() {
    // this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      // Custom colors
    // this.colorScale = d3.scaleOrdinal().domain().range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);
  }

  private createXAxis() {
     
    this.x=d3.scaleBand()
             .domain(this.data.map(d =>( d.date)))
             .rangeRound([30, this.viewBoxWidth-5]).padding(.1)
      this.g.append('g')
          .attr('transform', 'translate(0,90)')
          .attr("stroke-width", 0.2)
          .call(d3.axisBottom(this.x).tickSize(2).tickFormat(<any>''));

      this.g.append('g')
          .attr('transform', 'translate(0,90)')
          .style('font-size', '2')
         // .style("stroke-dasharray", ("1,1"))
          .attr("stroke-width", 0.5)
          .call(d3.axisBottom(this.x).ticks(this.xmax/10).tickSize(-1))
          .selectAll("text") 
                                                                .style("text-anchor", "end")
                                                                .attr("dx", "-.8em")
                                                                .attr("dy", ".15em")
                                                                .attr("transform", "rotate(-65)");

  }

  private createYAxis() {
   
      this.y = d3.scaleLinear()
          .domain([0, this.ymax])
          .range([this.viewBoxHeight-10, 10]);
      this.g.append('g')
          .attr('transform', 'translate(30,0)')
          .attr("stroke-width", 0.5)
          .call(d3.axisLeft(this.y).tickSize(0).tickFormat(<any>''));
      this.g.append('g')
          .attr('transform', 'translate(30,0)')
          //.style("stroke-dasharray", ("1,1"))
          .attr("stroke-width", 0.3)
          .call(d3.axisLeft(this.y).ticks(4).tickSize(1))
          .style('font-size', '3');

     
  }
  private createAreaCharts() {
  
     this.bars = this.svg.selectAll("bar")
                     .remove().exit()
                     .data(this.data).enter().append('rect')
      
     this.bars
         .attr('x',d => this.x(d.date)+this.x.bandwidth()/2)
         .attr('y', d => this.y(d.sales1+d.sales2+d.sales3))
         .attr('width', this.x.bandwidth()/2)
         .attr('height', d => -this.y(d.sales1+d.sales2+d.sales3) + this.y(0))// Keep this
       //  .transition().duration(this.transitionTime)
         .attr('fill','#72f7b6')
         .on('mouseenter', function (actual, i) {
          d3.select(this).attr('opacity', 0.5)
         })
        .on('mouseleave', function (actual, i) {
          d3.select(this).attr('opacity', 1)
         });
  
     this.bars1 = this.svg.selectAll("bar1")
        .remove().exit()
        .data(this.data).enter().append('rect')  
  
     this.bars1
        .attr('x',d => this.x(d.date))
        .attr('y', d => this.y(d.expense1+d.expense2+d.expense3))
        .attr('width', this.x.bandwidth()/2)
        .attr('height', d => -this.y(d.expense1+d.expense2+d.expense3) + this.y(0))// Keep this
       // .transition().duration(this.transitionTime)
        .attr('fill','#34eb92')   
   
        .on('mouseenter', function (actual, i) {
          d3.select(this).attr('opacity', 0.5)
         })
        .on('mouseleave', function (actual, i) {
          d3.select(this).attr('opacity', 1)
         });
      this.label=this.svg.append('circle')
        .attr('cx','150')
        .attr('cy','5')
        .attr('r','2')
        .attr('fill', '#72f7b6')
      this.text=this.svg.append('text')  
        .attr('x','160')
        .attr('y',5)
        .style("font-size", ".2em")
        .attr("dy", ".20em")
        .style("text-anchor", "middle")
        .style('fill', 'black')           
        .text('Sales')
      this.label1=this.svg.append('circle')
        .attr('cx','170')
        .attr('cy','5')
        .attr('r','2')
        .attr('fill', '#34eb92')
      this.text1=this.svg.append('text')  
        .attr('x','180')
        .attr('y',5)
        .style("font-size", ".2em")
        .attr("dy", ".20em")
        .style("text-anchor", "middle")
        .style('fill', 'black')           
        .text('Expense')
  }

  private removeExistingChartFromParent() {
      // !!!!Caution!!!
      // Make sure not to do;
      //     d3.select('svg').remove();
      // That will clear all other SVG elements in the DOM
      d3.select(this.hostElement).select('svg').remove();
  }
}
