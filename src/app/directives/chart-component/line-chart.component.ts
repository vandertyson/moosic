import { Component, Input, AfterViewInit, OnInit, EventEmitter, ViewContainerRef } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass } from '@angular/common';
import { CHART_DIRECTIVES } from 'ng2-charts';
import { APIService } from '../../auth/APIService';
import { environment } from '../../environment';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'line-chart-demo',
  templateUrl: 'app/directives/chart-component/line-chart.component.html',
  styleUrls: ['app/directives/chart-component/chart.component.css'],
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class LineChartDemoComponent implements AfterViewInit {
  private dummyData = [
    { data: [65, 59, 80, 81, 56, 55, 40, 65, 81, 56, 55, 40], label: '2014', fill: false, },
    { data: [28, 48, 40, 19, 86, 27, 90], label: '2015', fill: false, },
    { data: [18, 76, 77, 9, 28, 48, 40, 19, 86, 27, 90], label: '2016', fill: false, }
  ]
  @Input() data: any;
  @Input() type: any;
  constructor(private api: APIService) {
    this.getLineChartLabels(this.type)
    // this.getDataSalesAnalysis()
  }
  // lineChart
  public lineChartData = this.dummyData;
  public lineChartLabels: Array<any>
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
    }
  };
  public lineChartColours: Array<any> = [
    { // blue
      lineTension: 0,
      backgroundColor: 'rgba(60,141,188,0.2)',
      borderColor: 'rgba(60,141,188,1)',
      pointBackgroundColor: 'rgba(60,141,188,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(60,141,188,0.8)'
    },
    { // yellow
      lineTension: 0,
      backgroundColor: 'rgba(249,201,34,0.2)',
      borderColor: 'rgba(249,201,34,1)',
      pointBackgroundColor: 'rgba(249,201,34,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(249,201,34,1)'
    },
    { // green
      lineTension: 0,
      backgroundColor: 'rgba(0,166,90,0.2)',
      borderColor: 'rgba(0,166,90,1)',
      pointBackgroundColor: 'rgba(0,166,90,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,166,90,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public randomize(): void {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  ngAfterViewInit() {
    //this.lineChartData = this.data==[] ? this.data : this.dummyData
  }

  private getLineChartLabels(type: string) {
    switch (type) {
      case 'full-months':
        this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        break;

      default:
        this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        break;
    }
  }

  // private getDataSalesAnalysis() {
  //   var salesAnalysis = []
  //   var params: URLSearchParams = new URLSearchParams();
  //   var year = new Date().getFullYear()
  //   params.set('year', year.toString())
  //   this.api.get(environment.getUrl('reportlead'), params).map(res => res.json().result).subscribe(
  //       response => {
  //           var defau = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //           var pot = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //           var cus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //           var junk: Data = new Data()
  //           junk.label = "Junk"
  //           var customer: Data = new Data()
  //           customer.label = "Customer"
  //           var potential: Data = new Data()
  //           potential.label = "Potential"
  //           junk.fill = false
  //           potential.fill = false
  //           customer.fill = false
  //           junk.data = defau
  //           potential.data = pot
  //           customer.data = cus
  //           for (var data of response) {
  //               for (var x of data.lead.poten) {
  //                   var index = +data.month - 1
  //                   switch (x.status) {
  //                       case "15":
  //                           junk.data[index] = +x.total
  //                           break;
  //                       case "25":
  //                           customer.data[index] = +x.total
  //                           break;
  //                       case "30":
  //                           potential.data[index] = +x.total
  //                           break;

  //                       default:
  //                           break;
  //                   }
  //               }
  //           }
  //           salesAnalysis.push(junk)
  //           salesAnalysis.push(customer)
  //           salesAnalysis.push(potential)
  //           this.lineChartData = salesAnalysis
  //       }
  //   );
  //   return salesAnalysis
  // }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {

  }
}
