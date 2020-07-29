import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { modelSet, Model, riskProfiles } from '../model-defs';
import { flattenHierarchy, FlatItem } from '../hierarchy';

@Component({
    selector: 'app-model-configuration',
    templateUrl: './model-configuration.component.html',
    styleUrls: ['./model-configuration.component.css']
})
export class ModelConfigurationComponent implements OnInit {

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

