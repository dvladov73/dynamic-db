import { Component, OnInit, ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';

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
  private xmax:number=10;
  private ymax = 200;
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
  //bins; // Array of frequency distributions - one for each area chart
  //paths; // Path elements for each area chart
 // area; // For D3 area function
 // histogram; // For D3 histogram function

  constructor(private elRef: ElementRef) {
      this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.data) {
          this.updateChart(changes.data.currentValue);
      }
  }

  private createChart(data: SalesInterface[]) {

      this.removeExistingChartFromParent();
  //xmax calculation
      this.xmax=this.data.length;
 /* Y scale Max */ 
      this.maxY1=this.data.reduce(function(max, x) { return ((x.sales1+x.sales2+x.sales3) > max) ? (x.sales1+x.sales2+x.sales3): max; }, 0);
      this.maxY2=this.data.reduce(function(max, x) { return ((x.expense1+x.expense2+x.expense3) > max) ? (x.expense1+x.expense2+x.expense3) : max; }, 0);
      this.ymax=this.maxY2;
      if (this.maxY1>this.maxY2) {this.ymax=this.maxY1}


      this.setChartDimensions();

      this.setColorScale();

      this.addGraphicsElement();

      this.createXAxis();

      this.createYAxis();
    
      // d3 area and histogram functions  has to be declared after x and y functions are defined
  /*    this.area = d3.area()
          .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
          .y0(this.y(0))
          .y1((datum: any) => this.y(datum.length));

 
      this.histogram = d3.histogram()
          .value((datum) => datum)
          .domain([0, this.xmax])
          .thresholds(this.x.ticks(this.hticks));
*/
      // data has to be processed after area and histogram functions are defined
  //    this.processData(data);

      this.createAreaCharts();

  }
/*
  private processData(data) {
      this.bins = [];
      data.forEach((row) => {
          this.bins.push(this.histogram(row))
      });
  }
*/
  private setChartDimensions() {
   
      this.svg = d3.select(this.hostElement).append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight);
  }

  private addGraphicsElement() {
      this.g = this.svg.append("g")
          .attr("transform", "translate(0,0)");
  }

  private setColorScale() {
      this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      // Custom colors
      // this.colorScale = d3.scaleOrdinal().domain([0,1,2,3]).range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);
  }

  private createXAxis() {
     
     // this.x = d3.scaleLinear()
    //      .domain([0, this.xmax])
     //     .range([30, 170]);
      this.x=d3.scaleBand()
             .domain(this.data.map(d =>( d.date)))
             .rangeRound([30, this.viewBoxWidth]).padding(.1)
      this.g.append('g')
          .attr('transform', 'translate(0,90)')
          .attr("stroke-width", 0.5)
          .call(d3.axisBottom(this.x).tickSize(0).tickFormat(<any>''));

      this.g.append('g')
          .attr('transform', 'translate(0,90)')
          .style('font-size', '3')
          .style("stroke-dasharray", ("1,1"))
          .attr("stroke-width", 0.1)
          .call(d3.axisBottom(this.x).ticks(10).tickSize(-80));

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
          .style("stroke-dasharray", ("1,1"))
          .attr("stroke-width", 0.1)
          .call(d3.axisLeft(this.y).ticks(4).tickSize(-140))
          .style('font-size', '3');

     /* 
      this.g.append('text')
          .attr('text-anchor', 'middle')
          .attr('transform', 'translate(10,50) rotate(-90)')
          .style('font-size', 8)
          .text('$');
    */  
  }
  private createAreaCharts() {
   /*   this.paths = [];
      this.bins.forEach((row, index) => {
          this.paths.push(this.g.append('path')
              .datum(row)
              .attr('fill', this.colorScale('' + index))
              .attr("stroke-width", 0.1)
              .attr('opacity', 0.5)
              .attr('d', (datum: any) => this.area(datum))
          );
      });
   */
     this.bars = this.svg.selectAll("bar")
                     .remove().exit()
                     .data(this.data).enter().append('rect')
      
     this.bars
         .attr('x',d => this.x(d.date)+this.x.bandwidth()/2)
         .attr('y', d => this.y(d.sales1+d.sales2+d.sales3))
         .attr('width', this.x.bandwidth()/2)
         .attr('height', d => -this.y(d.sales1+d.sales2+d.sales3) + this.y(0))// Keep this
         .attr('fill','blue')
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
        .attr('fill',"red")   
   
        .on('mouseenter', function (actual, i) {
          d3.select(this).attr('opacity', 0.5)
         })
        .on('mouseleave', function (actual, i) {
          d3.select(this).attr('opacity', 1)
         });


  }

  public updateChart(data: SalesInterface[]) {
      if (!this.svg) {
          this.createChart(data);
          return;
      }

    //  this.processData(data);

      this.updateAreaCharts();

  }

  private updateAreaCharts() {
  /*    this.paths.forEach((path, index) => {
          path.datum(this.bins[index])
              .transition().duration(this.transitionTime)
              .attr('d', d3.area()
                  .x((datum: any) => this.x(d3.mean([datum.x1, datum.x2])))
                  .y0(this.y(0))
                  .y1((datum: any) => this.y(datum.length)));

      });
   */   
  }

  private removeExistingChartFromParent() {
      // !!!!Caution!!!
      // Make sure not to do;
      //     d3.select('svg').remove();
      // That will clear all other SVG elements in the DOM
      d3.select(this.hostElement).select('svg').remove();
  }
}
