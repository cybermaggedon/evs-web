import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';
import { age } from '../age';

@Component({
    selector: 'category-detail',
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location,
 		private riskSvc : RiskService) { }

    id : string;
    model : RiskModel;
    
    threats : Object;

    update() {

	if (this.id == undefined || this.model == undefined) return;

	let thr = [];
	
	for (let asset of this.model.devices) {
	    for (let risk of asset.risks) {
		if (risk.category == this.id) {
		    thr.push({
			"kind": "device",
			"id": asset.id,
			"age": age(risk.earliest)
		    });
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
		}
	    }
	}

        this.threats = thr;

    }
    
    ngOnInit(): void {
    	this.riskSvc.subscribe(m => {
	    this.model = m;
	    this.update();
	});
  	this.route.params.subscribe(res => {
	    this.id = res.id;
	    this.update();
	})
    }

    goBack(): void {
	this.location.back();
    }

}
