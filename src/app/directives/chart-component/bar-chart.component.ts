import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';

import {CHART_DIRECTIVES} from 'ng2-charts';

@Component({
  selector: 'bar-chart-demo',
  templateUrl: 'app/directives/chart-component/bar-chart.component.html',
  styleUrls: ['app/directives/chart-component/chart.component.css'],
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class BarChartDemoComponent {
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
    }
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label:'A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label:'B'},
    {data: [28, 48, 40, 19, 86, 27, 90], label:'C'},
  ];

  // events
  public chartClicked(e:any):void {

  }

  public chartHovered(e:any):void {

  }
}