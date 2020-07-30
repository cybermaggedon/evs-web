
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { modelSet, riskProfiles } from '../model-defs';
import { Model } from '../model';
import { flattenHierarchy, FlatItem } from '../hierarchy';

@Component({
    selector: 'model-selection',
    templateUrl: './model-selection.component.html',
    styleUrls: ['./model-selection.component.css']
})
export class ModelSelectionComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
	this.flatten();

	for(let model of modelSet) {
	    if (model.kind == "entry" && model.value.id == "default") {
		this.selected = model.value;
	    }
	}

    }

    selected : Model;

    items : FlatItem<Model>[] = [];
    riskProfiles = riskProfiles;

    flatten() : void {

	this.items = flattenHierarchy(modelSet);

    }

}

