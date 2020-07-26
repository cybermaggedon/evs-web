import { Component, OnInit, Input } from '@angular/core';

import { toxy, currencyTick } from '../charts';
import { colours, bgColours } from '../chart-colours';

import { FairService } from '../fair.service';

//import { createLossChart } 

@Component({
  selector: 'loss-exceedence-chart',
  templateUrl: './loss-exceedence-chart.component.html',
  styleUrls: ['./loss-exceedence-chart.component.css']
})
export class LossExceedenceChartComponent implements OnInit {

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

    createLossChart(data) {

	if (data == undefined) return { datasets: [{}], options: {} };

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["loss"]),
		pointRadius: 1,
		borderColor: colours[count],
		backgroundColor: bgColours[count],
		pointBorderColor: colours[count],
		borderWidth: 2,
		fill: false
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

	this.fairSvc.subscribe(this.kind + '-loss', rep => {
	    this.chart = this.createLossChart(rep);
	});

    }

}
