import { Component, OnInit, Input } from '@angular/core';

import { toxy, currencyTick } from '../charts';
import { colours, bgColours } from '../chart-colours';
import { FairService } from '../fair.service';

@Component({
  selector: 'risk-distribution-chart',
  templateUrl: './risk-distribution-chart.component.html',
  styleUrls: ['./risk-distribution-chart.component.scss']
})
export class RiskDistributionChartComponent implements OnInit {

    loading = true;
    
    constructor(private fairSvc : FairService) { }
    
    chart : any = {
	datasets: [
	    {
		data: []
	    }
	],
	options: {
	}
    }

    @Input('kind')
    kind : String;

    createRiskChart(data) {

	if (data == undefined) return { datasets: [{}], options: {} };

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["risk"]),
		pointRadius: 1,
		borderColor: colours[count],
		backgroundColor: bgColours[count],
		pointBorderColor: colours[count],
		borderWidth: 2
	    });
	    count += 1;
	}

	let options = {
	    responsive: true,
	    animation: { duration: 0 },
	    maintainAspectRatio: true,
	    aspectRatio: 2,
	    scales: {
		xAxes: [
		    {
			type: 'linear',
			display: true,
			scaleLabel: {
			    display: true,
			    labelString: 'expected loss',
			    fontColor: 'rgb(210, 210, 210)'
			},
			ticks: {
			    maxTicksLimit: 5,
			    callback: currencyTick,
			    fontColor: 'rgb(210, 210, 210)'
			}
		    }
		],
		yAxes: [
		    {
			type: 'linear',
			display: true,
			scaleLabel: {
			    display: true,
			    labelString: 'samples',
			    fontColor: 'rgb(210, 210, 210)'
			},
			ticks: {
			    maxTicksLimit: 6,
			    fontColor: 'rgb(210, 210, 210)'
			}
		    }
		]
	    },
	    legend:  {
		position: 'right',
		labels: {
		    fontColor: 'rgb(210, 210, 210)'
		}
	    }
	};

	return {datasets: datasets, options: options};

    }

    ngOnInit(): void {

	this.fairSvc.subscribeRecalcEvent(this.kind + '-risk', rep => {
	    this.loading = true;
	});

	this.fairSvc.subscribe(this.kind + '-risk', rep => {
	    this.loading = false;
	    this.chart = this.createRiskChart(rep);
	});

    }

}
