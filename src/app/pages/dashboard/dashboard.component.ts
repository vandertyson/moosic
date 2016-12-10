import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { APIService } from '../../auth/APIService';
import { environment } from '../../environment';
import { BarChartDemoComponent } from '../../directives/chart-component/bar-chart.component'
import { DoughnutChartDemoComponent } from '../../directives/chart-component/doughnuts.component'
import { LineChartDemoComponent } from '../../directives/chart-component/line-chart.component'
import { PieChartDemoComponent } from '../../directives/chart-component/pie-chart.component'


declare var jQuery: any;



@Component({
  selector: 'dashboard',
  templateUrl: 'app/pages/dashboard/dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [],
  directives: [
    BarChartDemoComponent,
    DoughnutChartDemoComponent,
    LineChartDemoComponent,
    PieChartDemoComponent
  ]
})

export class DashboardComponent implements AfterViewInit {


  constructor(private api: APIService) {

  }

  ngAfterViewInit() {
    jQuery(function () {
      jQuery('body').addClass('login-page');
    });

  }
}
