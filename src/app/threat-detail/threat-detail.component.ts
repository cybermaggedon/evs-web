import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ThreatService, Threats } from '../threat.service';
import { WindowService, Window } from '../window.service';
import { EventSearchService, SearchTerms } from '../event-search.service';
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
		private windowService : WindowService,
		private eventSearch : EventSearchService) {
    }

    id : string;
    window : Window;

    allThreats : Threats;
    threats : Object;

    threatCount : number;

    tableEvents : number;
    onEventsLoaded(e) { this.tableEvents = e; }

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
	})

  	this.route.params.subscribe(res => {
            if (res.id != this.id) {
		this.id = res.id;
		this.fetchThreats();
		this.eventSearch.update(new SearchTerms(this.id));
            }
	})

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
