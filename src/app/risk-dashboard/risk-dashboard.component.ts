import { Component, OnInit, Input } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FairService } from '../fair.service';
import { interval } from 'rxjs';
import { throttle } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';

export      function currencyTick(value, index, values) {
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

    constructor(private fairSvc : FairService,
		private http : HttpClient) {
    }

//    @Input('max-items')
//    maxItems : number = 20;

//    @ViewChild('resourceloss')
    //    resourceLossCanvas: ElementRef<HTMLCanvasElement>;

    fairModel : any;

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


    drawLossChart(canvasId, data) {
	var canvas = document.getElementById(canvasId);
	if (canvas == null) return;
	if (data == undefined) return;

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["loss"]),
		pointRadius: 1,
		borderColor: this.colours[count],
		fill: false,
		pointBorderColor: this.colours[count],
		borderWidth: 2
	    });
	    count += 1;
	}

	var chart = new Chart(canvas, {
	    type: 'line',
	    data: {
		datasets: datasets
	    },
	    options: {
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
	    }
	});

    }

    drawPdfChart(canvasId, data) {
	var canvas = document.getElementById(canvasId);
	console.log("pdf on ", canvas);
	if (canvas == null) return;
	if (data == undefined) return;

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["pdf"]),
		pointRadius: 1,
		backgroundColor: this.bgColours[count],
		borderColor: this.colours[count],
		pointBorderColor: this.colours[count],
		borderWidth: 1
	    });
	    count += 1;
	}

	var chart = new Chart(canvas, {
	    type: 'line',
	    data: {
		datasets: datasets
	    },
	    options: {
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
	    }
	});

    }

    drawRiskChart(canvasId, data) {
	var canvas = document.getElementById(canvasId);
	if (canvas == null) return;
	if (data == undefined) return;

	let datasets = [];
	let count = 0;
	for (let v in data) {
	    datasets.push({
		label: v,
		data: toxy(data[v]["risk"]),
		pointRadius: 1,
		backgroundColor: this.bgColours[count],
		borderColor: this.colours[count],
		pointBorderColor: this.colours[count],
		borderWidth: 1
	    });
	    count += 1;
	}

	var chart = new Chart(canvas, {
	    type: 'line',
	    data: {
		datasets: datasets
	    },
	    options: {
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
	    }
	});

    }

    ngOnInit(): void {

        this.fairSvc.subscribe(m => {

	    console.log(">>>>>");
	    console.log(m);

	    this.fairModel = m;

	    this.drawLossChart("categoryloss", this.fairModel.categories);
	    this.drawLossChart("deviceloss", this.fairModel.devices);
	    this.drawLossChart("resourceloss", this.fairModel.resources);

	    this.drawPdfChart("categorypdf", this.fairModel.categories);
	    this.drawPdfChart("devicepdf", this.fairModel.devices);
	    this.drawPdfChart("resourcepdf", this.fairModel.resources);

	    this.drawRiskChart("categoryrisk", this.fairModel.categories);
	    this.drawRiskChart("devicerisk", this.fairModel.devices);
	    this.drawRiskChart("resourcerisk", this.fairModel.resources);

	});

	    /*

       var catPdfChart = new Chart(canvas, {
	  type: 'line',
	  data: {
	      datasets: [
		  {
		      label: "tor-exit",
		      data: toxy(curves["tor-exit"]["loss"]),
		      pointRadius: 1,
		      backgroundColor: 'rgba(100, 0, 0, 0.2)',
		      borderColor: 'rgb(100,0,0)',
		      borderWidth: 1,
		      pointBorderColor: 'rgb(100,0,0)'
		  },
		  {
		      label: "malware",
		      data: toxy(curves["malware"]["loss"]),
		      pointRadius: 1,
		      backgroundColor: 'rgba(0, 100, 0, 0.2)',
		      borderColor: 'rgb(0,100,0)',
		      borderWidth: 1,
		      pointBorderColor: 'rgb(0,100,0)'
		  },
		  {
		      label: "Overall resources",
		      data: toxy(curves["Overall risk"]["loss"]),
		      pointRadius: 1,
		      backgroundColor: 'rgba(0, 0, 100, 0.2)',
		      borderColor: 'rgb(0,0,100)',
		      borderWidth: 1,
		      pointBorderColor: 'rgb(0,0,100)'
		  }
	      ]
	  },
	  options: {
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
	  }
       });

	});
*/

    }

/*
    public context: CanvasRenderingContext2D;

    ngAfterViewInit(): void {
	console.log("CONTEXT INIT");

	var canvas=document.getElementById("resourceloss");
	console.log("canvas is ", canvas);

	
	console.log("ASD", this.resourceLossCanvas);
	if (this.resourceLossCanvas == undefined) {
	    return;
	}
	console.log("x", this.resourceLossCanvas);
	if (this.resourceLossCanvas == null) {
	    return;
	}
	console.log("xx", this.resourceLossCanvas.nativeElement);
	this.context = this.resourceLossCanvas.nativeElement.getContext('2d');
	console.log("CONTEXT INIT", this.context);
    }
*/
    /*
    deviceReport : any;
    resourceReport : any;
    categoryReport : any;

    emptyReport : Object = {
	distribution: "", exceedence: ""
    };

    model : RiskModel;

    getReports(model) {
	return {
	    "distribution": "/fair/" + model.name + "?report=distribution&model=" +
		encodeURIComponent(JSON.stringify(model)),
	    "exceedence": "/fair/" + model.name + "?report=exceedence&model=" +
		encodeURIComponent(JSON.stringify(model))
	};
    }

    updateFairModels() {

	console.log("UPDATINGGGGG");

        if (this.model.devices.length == 0) {
	    this.deviceReport = this.emptyReport;
	} else {
	    const assets = this.model.devices.slice(0, this.maxItems);
	    const model = this.getMetaModel(assets, "Overall devices");
//	    this.deviceReport = this.getReports(model);
	}

        if (this.model.resources.length == 0) {
	    this.resourceReport = this.emptyReport;
	} else {
	    const assets = this.model.resources.slice(0, this.maxItems);
	    const model = this.getMetaModel(assets, "Overall resources");
	    //	    this.resourceReport = this.getReports(model);

	    var rptUrl = "/fair/" + model.name + "?report=curves&model=" +
		encodeURIComponent(JSON.stringify(model));
	    this.http.get(rptUrl).subscribe(curves => {
		console.log(curves);


		console.log("CTX", this.context);
		var canvas=document.getElementById("resourceloss");
		console.log("canvas is ", canvas);

		if (this.context == undefined || this.context == null) {
		    console.log("IIIIIIIITTTTTTT IS NULL");
		    return;
		}

      var myChart = new Chart(this.context, {
	  type: 'line',
	  data: {
	      datasets: [
		  {
		      label: "192.179.1.72",
		      data: toxy(curves["192.179.1.72"]["loss"]),
		      pointRadius: 1,
		      backgroundColor: 'rgba(100, 0, 0, 0.2)',
		      borderColor: 'rgb(100,0,0)',
		      borderWidth: 1,
		      pointBorderColor: 'rgb(100,0,0)'
		  },
		  {
		      label: "www.malware.org",
		      data: toxy(curves["www.malware.org"]["loss"]),
		      pointRadius: 1,
		      backgroundColor: 'rgba(0, 100, 0, 0.2)',
		      borderColor: 'rgb(0,100,0)',
		      borderWidth: 1,
		      pointBorderColor: 'rgb(0,100,0)'
		  },
		  {
		      label: "Overall resources",
		      data: toxy(curves["Overall resources"]["loss"]),
		      pointRadius: 1,
		      backgroundColor: 'rgba(0, 0, 100, 0.2)',
		      borderColor: 'rgb(0,0,100)',
		      borderWidth: 1,
		      pointBorderColor: 'rgb(0,0,100)'
		  }
	      ]
	  },
	  options: {
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
	  }
      });
		



	    })

	}

	if ((this.model.devices.length == 0) &&
	    (this.model.resources.length == 0)) {
	    this.categoryReport = this.emptyReport;
	} else {
	    const model = this.getCatModel();
//	    this.categoryReport = this.getReports(model);
	}

	console.log("UPDATE COMPLETTTT");

    }
*/
}

