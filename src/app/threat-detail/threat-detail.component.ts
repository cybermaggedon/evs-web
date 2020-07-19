import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreatService, Threats } from '../threat.service';
import { RiskWindowService, Window } from '../risk-window.service';

@Component({
    selector: 'threat-detail',
    templateUrl: './threat-detail.component.html',
    styleUrls: ['./threat-detail.component.css']
})
export class ThreatDetailComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location,
 		private threatSvc : ThreatService,
		private riskWindow : RiskWindowService
	       ) {
    }

    id : string;
    threats : Object;
    window : Window;

    update() {

	if (this.window == undefined) return;
	if (this.id == undefined) return;

	const to = new Date();
	const from = this.window.earliest;

        this.threatSvc.getThreats(this.id, from, to).subscribe(
	    dt => {
		let thr = [];
		for (let kind of this.threatkinds) {
		    if (dt.threats.has(kind)) {
			for (let threat of dt.threats.get(kind)) {
			    thr.push({
				"kind": kind, "id": threat.id,
				"age": this.age(threat.age)
			    });
			}
		    }
		}
		this.threats = thr;
	    }
	);

    }
    
    ngOnInit(): void {

  	  this.riskWindow.subscribe(w => {
	      this.window = w;
	      this.update();
	  })

  	this.route.params.subscribe(res => {
	      this.id = res.id;
	      this.update();
	  })

    }

    age(then : Date) : string {

	let duration = (new Date().getTime() - then.getTime()) / 1000;

	let hrs = duration / 60 / 60;
	if (hrs < 48) {
	    return hrs.toFixed(0) + "h";
	}

	if (hrs < (24 * 7)) {
	    return (hrs/24).toFixed(0) + "d";
	}

	return (hrs/24/7).toFixed(0) + "w";

    }

    goBack(): void {
	this.location.back();
    }

    threatkinds = ['dnsquery', 'dnsresolve', 'serves', 'uses', 'requests',
		   'indomain', 'hasip', 'connects'
    ];

}
