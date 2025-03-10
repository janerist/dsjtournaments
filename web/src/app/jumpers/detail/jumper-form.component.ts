import {Component, inject, input, OnChanges} from '@angular/core';
import {Router} from '@angular/router';
import {JumperActivityResponseModel} from '../../shared/api-responses';

import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import {format} from 'date-fns';

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip
);

@Component({
    selector: 'app-jumper-form',
    template: `
    <div>
      <canvas id="jumper-form" (click)="handleClick($event)"></canvas>
    </div>
  `
})
export class JumperFormComponent implements OnChanges {
  private router = inject(Router);
  rankings = input.required<JumperActivityResponseModel[]>();

  chart: Chart | undefined;

  handleClick(event: MouseEvent) {
    const activePoints = this.chart
      ? this.chart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, false)
      : [];

    if (activePoints.length === 1) {
      const index = activePoints[0].index;
      void this.router.navigate(['/tournaments', this.rankings()[index].tournamentId]);
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.rankings().length) {
      this.buildChart();
    }
  }

  private buildChart() {
    const canvas = document.getElementById('jumper-form') as HTMLCanvasElement;
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.rankings().map(r => format(new Date(r.date), 'dd MMM y')),
        datasets: [{
          label: 'Rank',
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          data: this.rankings().map(r => r.rank || 0),
          fill: false,
          pointHitRadius: 10
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Hover over the data points for more information.'
          },
          tooltip: {
            callbacks: {
              beforeTitle: tooltipItems => {
                const item = this.rankings()[tooltipItems[0].dataIndex];
                return `${item.tournamentType} (DSJ${item.gameVersion})`;
              }
            }
          }
        },
        scales: {
          y: {
            min: 1,
            max: Math.max(50, Math.ceil(this.rankings().reduce((m, r) => Math.max(m, r.rank ?? 0), 0) / 10) * 10),
            reverse: true,
            ticks: {
              stepSize: 10
            },
            title: {
              display: true,
              text: 'Rank'
            }
          }
        },
        onHover: (_, el) => {
          $('#jumper-form').css('cursor', el[0] ? 'pointer' : 'default');
        }
      }
    });
  }
}
