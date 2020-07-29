import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ThreatService, Threats } from '../threat.service';
import { WindowService, Window } from '../window.service';
import { EventSearchService, SearchTerms } from '../event-search.service';
import { age } from '../age';

@Component({
    selector: 'all-threats',
    templateUrl: './all-threats.component.html',
    styleUrls: ['./all-threats.component.css']
})
export class AllThreatsComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location,
 		private threatSvc : ThreatService,
		private windowService : WindowService,
		private eventSearch : EventSearchService) {
    }

    // Current threat window
    window : Window;

    // Threats
    allThreats : Threats;

    // Summarized threats
    threats : Object;

    // Number of threat elements
    threatCount : number;

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

	// Ignore window, just fetching 21 days' of date.
	const to = new Date();
	const from = new Date(to.getTime() - 3 * 7 * 86400 * 1000);

        this.threatSvc.getAllThreats(from, to, 50).subscribe(
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

	timer(0, 10000).subscribe(e => {
	    this.fetchThreats();
	});

    }

    goBack(): void {
	this.location.back();
    }

    threatkinds = ['hostname', 'server', 'useragent', 'domain', 'ip',
		   'device'];

}
