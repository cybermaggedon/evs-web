import { Component, OnInit, Input, Inject } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { toxy, currencyTick } from '../charts';
import { colours, bgColours } from '../chart-colours';
import { FairService } from '../fair.service';

@Component({
  selector: 'loss-exceedence-chart',
  templateUrl: './loss-exceedence-chart.component.html',
  styleUrls: ['./loss-exceedence-chart.component.scss']
})
export class LossExceedenceChartComponent implements OnInit {

    loading = true;
    
    constructor(private fairSvc : FairService,
		@Inject(LOCALE_ID) private locale: string,
		@Inject(DEFAULT_CURRENCY_CODE) private currency: string) {
    }
    
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

	let locale = this.locale;
	let currency = this.currency;

	let fmtCurrency = function(value, index, values) {    
	    var symbol = getCurrencySymbol(currency, "wide");
	    return currencyTick(value, symbol);
	}

	let options = {
	    responsive: true,
	    animation: { duration: 0 },
	    maintainAspectRatio: true,
	    aspectRatio: 3,
	    scales: {
		xAxes: [
		    {
			type: 'linear',
			display: true,
			scaleLabel: {
			    display: true,
			    labelString: 'expected loss',
			    fontColor: 'rgb(210, 210, 210)',
			},
			ticks: {
			    fontColor: 'rgb(210, 210, 210)',
			    maxTicksLimit: 5,
			    callback: fmtCurrency
			}
		    }
		],
		yAxes: [
		    {
			type: 'linear',
			display: true,
			scaleLabel: {
			    display: true,
			    labelString: 'probability',
			    fontColor: 'rgb(210, 210, 210)',
			},
			ticks: {
			    fontColor: 'rgb(210, 210, 210)',
			    maxTicksLimit: 6,
			}
		    }
		]
	    },
	    legend: {
		position: 'right',
		labels: {
		    fontColor: 'rgb(210, 210, 210)'
		}
	    }
	};

	return {datasets: datasets, options: options};

    }

    ngOnInit(): void {

	this.fairSvc.subscribe(this.kind + '-loss', rep => {
	    this.loading = false;
	    this.chart = this.createLossChart(rep);
	});

	this.fairSvc.subscribeRecalcEvent(this.kind + '-loss', rep => {
	    this.loading = true;
	});

    }

}

