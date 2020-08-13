import { Component, OnInit, Input, Inject } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';

import { toxy, currencyTick } from '../charts';
import { colours, bgColours } from '../chart-colours';
import { FairService } from '../fair.service';

@Component({
  selector: 'probability-distribution-chart',
  templateUrl: './probability-distribution-chart.component.html',
  styleUrls: ['./probability-distribution-chart.component.scss']
})
export class ProbabilityDistributionChartComponent implements OnInit {

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
			    maxTicksLimit: 5,
			    callback: fmtCurrency,
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
			    labelString: 'pd',
			    fontColor: 'rgb(210, 210, 210)',
			},
			ticks: {
			    maxTicksLimit: 6,
			    fontColor: 'rgb(210, 210, 210)'
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

	this.fairSvc.subscribeRecalcEvent(n => {
	    this.loading = (n > 0);
	});

	this.fairSvc.subscribe(fr => {
	    /*
	    this.loading = false;
	    this.chart = this.createPdfChart(rep);
	    */
	});

    }

}
