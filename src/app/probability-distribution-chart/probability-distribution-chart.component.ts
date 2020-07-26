import { Component, OnInit, Input } from '@angular/core';

import { toxy, currencyTick } from '../charts';
import { colours, bgColours } from '../chart-colours';

import { FairService } from '../fair.service';

@Component({
  selector: 'probability-distribution-chart',
  templateUrl: './probability-distribution-chart.component.html',
  styleUrls: ['./probability-distribution-chart.component.css']
})
export class ProbabilityDistributionChartComponent implements OnInit {

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

    createPdfChart(data) {

	if (data == undefined) return { datasets: [{}], options: {} };

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["pdf"]),
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

	this.fairSvc.subscribe(this.kind + '-pdf', rep => {
	    this.chart = this.createPdfChart(rep);
	});

    }

}
