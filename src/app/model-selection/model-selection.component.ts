
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Model, Risk } from '../model';
import { flattenHierarchy, FlatItem } from '../hierarchy';
import { ModelStoreService } from '../model-store.service';

@Component({
    selector: 'model-selection',
    templateUrl: './model-selection.component.html',
    styleUrls: ['./model-selection.component.css']
})
export class ModelSelectionComponent implements OnInit {

    constructor(private models : ModelStoreService) { }

    ngOnInit(): void {
	this.flatten();

	for(let model of this.models.getModels()) {
	    if (model.kind == "entry" && model.value.id == "default") {
		this.selected = model.value;
	    }
	}

	this.riskProfiles = this.models.getRiskProfiles();

    }

    selected : Model;

    items : FlatItem<Model>[] = [];
    riskProfiles : Risk[];

    flatten() : void {

	this.items = flattenHierarchy(this.models.getModels());

    }

}

