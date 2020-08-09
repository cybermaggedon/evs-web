import { Component, OnInit, Input } from '@angular/core';

import { toxy, currencyTick } from '../charts';
import { colours, bgColours } from '../chart-colours';

import { FairService } from '../fair.service';

//import { createLossChart } 

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
	    animation: { duration: 0 },
	    responsive: false,
	    maintainAspectRatio: false,
	    scales: {
		xAxes: [
		    {
			type: 'linear',
			display: true,
			ticks: {
			    maxTicksLimit: 5,
			    callback: currencyTick
			}
		    }
		],
		yAxes: [
		    {
			type: 'linear',
			display: true,
			ticks: {
			    maxTicksLimit: 6,
			}
		    }
		]
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
