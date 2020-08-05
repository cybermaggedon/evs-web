import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ThreatService, Threats } from '../threat.service';
import { WindowService, Window } from '../window.service';
import { EventSearchTermsService, SearchTerms } from '../event-search-terms.service';
import { EventSearchService } from '../event-search.service';
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
		private searchSvc : EventSearchService,
		private windowService : WindowService,
		private searchTermsSvc : EventSearchTermsService) {
    }

    // Current threat identifier
    id : string;

    // Current threat window
    window : Window;

    // Threats
    allThreats : Threats;

    // Summarized threats
    threats : Object;

    // Number of threat elements
    threatCount : number;

    // Number of events in the event table
    eventsTotal : number;

    // Update strategy...
    // - ID set or changed => Fetch new threat graph, update threats
    // - Periodically => fetch new threat graph, update threats
    // - Change window => update threats

    updateThreats() {

	if (this.window == undefined) return;
	if (this.allThreats == undefined) return;

	let thr = [];

	let count = 0;

	
	for (let kind of this.threatkinds) {
	    if (this.allThreats.threats.has(kind)) {
		for (let threat of this.allThreats.threats.get(kind)) {
		    if (threat.age < this.window.earliest) continue;
		    thr.push({
			kind: kind,
			id: threat.id,
			age: age(threat.age)
		    });
		    count++;
		}
	    }
	}

	this.threats = thr;
        this.threatCount = count;
    }

    // Stage 1, fetch threat graph elements
    fetchThreats() {

	if (this.id == undefined) return;

	// Ignore window, just fetching 21 days' of date.
	const to = new Date();
	const from = new Date(to.getTime() - 3 * 7 * 86400 * 1000);

        this.threatSvc.getThreats(this.id, from, to, 50).subscribe(
	    dt => {
		this.allThreats = dt;
		this.updateThreats();
	    }
	);

    }
    
    ngOnInit(): void {

  	this.windowService.subscribe(w => {
	    if (this.window == undefined || w.value != this.window.value) {
   	        this.window = w;
		this.updateThreats();
            }
	});

  	this.route.params.subscribe(res => {
            if (res.id != this.id) {

		this.id = res.id;
		this.fetchThreats();
		this.searchTermsSvc.update(new SearchTerms([
		    { field: undefined, value: this.id }
		]));
            }
	});

	this.searchSvc.total.subscribe(t => {
	    console.log("TOTAL ", t);
	    this.eventsTotal = t;
	});

	interval(5000).subscribe(e => {
	    this.fetchThreats();
	});

    }

    goBack(): void {
	this.location.back();
    }

    threatkinds = ['dnsquery', 'dnsresolve', 'serves', 'uses', 'requests',
		   'indomain', 'hasip', 'connects'
    ];

}
