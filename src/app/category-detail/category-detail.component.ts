import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';
import { EventSearchService, SearchTerms } from '../event-search.service';
import { age } from '../age';

@Component({
    selector: 'category-detail',
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

    constructor(private route : ActivatedRoute,
		private location : Location,
 		private riskSvc : RiskService,
		private eventSearch : EventSearchService) {
    }

    // Current threat identifier
    id : string;

    // Risk model
    model : RiskModel;

    // Threats derived from risk model
    threats : Object;

    // Number of threats
    threatCount : number;

    // Number of events in the event table
    tableEvents : number;

    // Called when events are loaded in the table
    onEventsLoaded(e) { this.tableEvents = e; }

    // Called to update
    update() {

	if (this.id == undefined || this.model == undefined) return;

	let thr = [];

	let count = 0;

	
	for (let asset of this.model.devices) {
	    for (let risk of asset.risks) {
		if (risk.category == this.id) {
		    thr.push({
			"kind": "device",
			"id": asset.id,
			"age": age(risk.earliest)
		    });
		    count++;
		}
	    }
	}
	
	for (let asset of this.model.resources) {
	    for (let risk of asset.risks) {
		if (risk.category == this.id) {
		    thr.push({
			"kind": "resource",
			"id": asset.id,
			"age": age(risk.earliest)
		    });
		    count++;
		}
	    }
	}

        this.threats = thr;
        this.threatCount = count;

    }
    
    ngOnInit() : void {

    	this.riskSvc.subscribe(m => {
	    this.model = m;
	    this.update();
	});

  	this.route.params.subscribe(res => {
	    this.id = res.id;
	    this.update();
	    console.log("ID is ", this.id);
            this.eventSearch.update(new SearchTerms(this.id));
	})

    }

    goBack(): void {
	this.location.back();
    }

}
