import { Component, OnInit, Input } from '@angular/core';
import { FairService } from '../fair.service';

export function currencyTick(value, index, values) {

    if (value > 1000000000000){
	return '$' + (value / 1000000000000).toFixed(1) + 'T';
    }
    if (value > 1000000000){
	return '$' + (value / 1000000000).toFixed(1) + 'B';
    }
    if (value > 1000000){
	return '$' + (value / 1000000).toFixed(1) + 'M';
    }
    if (value > 1000){
	return '$' + (value / 1000).toFixed(1) + 'k';
    }
    
    return '$' + value;
}

export function toxy(ds) {
    var data = [];
    for (let v in ds) {
	var datum = ds[v];
	data.push({x:datum[0], y:datum[1]});
    }
    return data;
}

@Component({
    selector: 'app-risk-dashboard',
    templateUrl: './risk-dashboard.component.html',
    styleUrls: ['./risk-dashboard.component.css']
})
export class RiskDashboardComponent {

    constructor(private fairSvc : FairService) {}

    // FIXME: Should implement this.
//    @Input('max-items')
//    maxItems : number = 20;

    colours = [
	"rgb(100, 0, 0)",
	"rgb(0, 100, 0)",
	"rgb(0, 0, 100)",
	"rgb(50, 50, 0)",
	"rgb(0, 50, 50)",
	"rgb(50, 0, 50)",
	"rgb(30, 70, 0)",
	"rgb(0, 30, 70)",
	"rgb(70, 0, 30)",
	"rgb(70, 30, 0)",
	"rgb(0, 70, 30)",
	"rgb(30, 0, 70)",
	"rgb(15, 45, 30)",
	"rgb(30, 15, 45)",
	"rgb(45, 30, 15)",
	"rgb(45, 15, 30)",
	"rgb(30, 45, 15)",
	"rgb(15, 30, 45)",
    ];

    bgColours = [
	"rgba(100, 0, 0, 0.2)",
	"rgba(0, 100, 0, 0.2)",
	"rgba(0, 0, 100, 0.2)",
	"rgba(50, 50, 0, 0.2)",
	"rgba(0, 50, 50, 0.2)",
	"rgba(50, 0, 50, 0.2)",
	"rgba(30, 70, 0, 0.2)",
	"rgba(0, 30, 70, 0.2)",
	"rgba(70, 0, 30, 0.2)",
	"rgba(70, 30, 0, 0.2)",
	"rgba(0, 70, 30, 0.2)",
	"rgba(30, 0, 70, 0.2)",
	"rgba(15, 45, 30, 0.2)",
	"rgba(30, 15, 45, 0.2)",
	"rgba(45, 30, 15, 0.2)",
	"rgba(45, 15, 30, 0.2)",
	"rgba(30, 45, 15, 0.2)",
	"rgba(15, 30, 45, 0.2)",
    ];

    chart : any = {
	category: { 
	    loss: { datasets: [{data: []}], options: {} }, 
	    pdf: { datasets: [{data: []}], options: {} },
	    risk: { datasets: [{data: []}], options: {} }
	},
	device: { 
	    loss: { datasets: [{data: []}], options: {} }, 
	    pdf: { datasets: [{data: []}], options: {} },
	    risk: { datasets: [{data: []}], options: {} }
	},
	resource: { 
	    loss: { datasets: [{data: []}], options: {} }, 
	    pdf: { datasets: [{data: []}], options: {} },
	    risk: { datasets: [{data: []}], options: {} }
	}
    };

    createLossChart(data) {

	if (data == undefined) return { datasets: [{}], options: {} };

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["loss"]),
		pointRadius: 1,
		borderColor: this.colours[count],
		backgroundColor: this.bgColours[count],
		pointBorderColor: this.colours[count],
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

    createPdfChart(data) {

	if (data == undefined) return { datasets: [{}], options: {} };

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["pdf"]),
		pointRadius: 1,
		borderColor: this.colours[count],
		backgroundColor: this.bgColours[count],
		pointBorderColor: this.colours[count],
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

    createRiskChart(data) {

	if (data == undefined) return { datasets: [{}], options: {} };

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["risk"]),
		pointRadius: 1,
		borderColor: this.colours[count],
		backgroundColor: this.bgColours[count],
		pointBorderColor: this.colours[count],
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

	this.fairSvc.subscribe('device-loss', rep => {
	    this.chart.device.loss = this.createLossChart(rep);
	});
	this.fairSvc.subscribe('device-pdf', rep => {
	    this.chart.device.pdf = this.createPdfChart(rep);
	});
	this.fairSvc.subscribe('device-risk', rep => {
	    this.chart.device.risk = this.createRiskChart(rep);
	});
	this.fairSvc.subscribe('resource-loss', rep => {
	    this.chart.resource.loss = this.createLossChart(rep);
	    console.log("RESOURCE LOSS UPDATE");
	});
	this.fairSvc.subscribe('resource-pdf', rep => {
	    this.chart.resource.pdf = this.createPdfChart(rep);
	});
	this.fairSvc.subscribe('resource-risk', rep => {
	    this.chart.resource.risk = this.createRiskChart(rep);
	});
	this.fairSvc.subscribe('category-loss', rep => {
	    console.log("CATEGORY LOSS UPDATE");
	    this.chart.category.loss = this.createLossChart(rep);
	});
	this.fairSvc.subscribe('category-pdf', rep => {
	    this.chart.category.pdf = this.createPdfChart(rep);
	});
	this.fairSvc.subscribe('category-risk', rep => {
	    this.chart.category.risk = this.createRiskChart(rep);
	});
    }

}

