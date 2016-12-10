import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts';

@Component({
    selector: 'doughnut-chart-demo',
    templateUrl: 'app/directives/chart-component/doughnuts.component.html',
    styleUrls: ['app/directives/chart-component/chart.component.css'],
    directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class DoughnutChartDemoComponent {
    // Doughnut
    public doughnutChartLabels: string[] = ['A', 'B'];
    public doughnutChartData: number[] = [550, 450];
    public doughnutChartType: string = 'doughnut';
    public chartOptions: any = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
    };
    // events
    public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }
}