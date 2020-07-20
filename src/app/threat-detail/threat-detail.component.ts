import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreatService, Threats } from '../threat.service';
import { WindowService, Window } from '../window.service';
import { age } from '../age';

@Component({
    selector: 'threat-detail',
    templateUrl: './threat-detail.component.html',
    styleUrls: ['./threat-detail.component.css']
})
export class ThreatDetailComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location,
 		private threatSvc : ThreatService,
		private windowService : WindowService
	       ) {
    }

    id : string;
    threats : Object;
    window : Window;

    // Update strategy...
    // - ID set or changed => Fetch new threat graph, update threats
    // - Periodically => fetch new threat graph, update threats
    // - Change window => update threats

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
				"age": age(threat.age)
			    });
			}
		    }
		}
		this.threats = thr;
	    }
	);

    }
    
    ngOnInit(): void {

  	  this.windowService.subscribe(w => {
	      if (this.window == undefined || w.value != this.window.value) {
   	          this.window = w;
   	          this.update();
              }
	  })

  	  this.route.params.subscribe(res => {
              if (res.id != this.id) {
		  this.id = res.id;
		  this.update();
              }
	  })

    }

    goBack(): void {
	this.location.back();
    }

    threatkinds = ['dnsquery', 'dnsresolve', 'serves', 'uses', 'requests',
		   'indomain', 'hasip', 'connects'
    ];

}
