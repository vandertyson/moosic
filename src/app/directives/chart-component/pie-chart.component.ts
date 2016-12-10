import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts';

@Component({
  selector: 'pie-chart-demo',
  templateUrl: 'app/directives/chart-component/pie-chart.component.html',
  styleUrls: ['app/directives/chart-component/chart.component.css'],
  directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class PieChartDemoComponent {
  public pieChartLabels: string[] = ['A', 'B', 'C', 'D'];
  public pieChartData: number[] = [300, 500, 100, 20];
  public pieChartType: string = 'pie';
  public pieChartOptions: any = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right'
    }
  };
  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }
}
