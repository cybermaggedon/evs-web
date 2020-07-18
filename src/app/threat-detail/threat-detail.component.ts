import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreatService, Threats } from '../threat.service';

@Component({
    selector: 'threat-detail',
    templateUrl: './threat-detail.component.html',
    styleUrls: ['./threat-detail.component.css']
})
export class ThreatDetailComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location,
 		private threatSvc : ThreatService
		) { }

    id : string;

    threats : Object;

    update() {

	//FIXME: Hard-coded.
	const to = new Date();
	const from = new Date(to.getTime() - 1000 * 60 * 60 * 1200);

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
