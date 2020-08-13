import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ThreatService, Threats } from '../threat.service';
import { WindowService, Window } from '../window.service';
import { Seed } from '../seed'; 

@Component({
    selector: 'all-threats',
    templateUrl: './all-threats.component.html',
    styleUrls: ['./all-threats.component.scss']
})
export class AllThreatsComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location,
 		private threatSvc : ThreatService,
		private windowService : WindowService) {
    }

    // Current threat window
    window : Window;

    // Threats
    allThreats : Threats;

    // Summarized threats
    threats : Seed[];

    // Number of threat elements
    threatCount : number;

    // Update strategy...
    // - ID set or changed => Fetch new threat graph, update threats
    // - Periodically => fetch new threat graph, update threats
    // - Change window => update threats

    updateThreats() {

	if (this.window == undefined) return;
	if (this.allThreats == undefined) return;

	let res = this.allThreats.refineSeeds(this.window, this.threatkinds);
	this.threats = res.seeds;
	this.threatCount = res.count;

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
