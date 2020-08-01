
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

	this.models.subscribeModels(m => {
	    this.items = flattenHierarchy(m);
	});

	this.models.subscribeRisks(r => {
	    this.riskProfiles = r;
	});

	this.models.subscribeSelectedModel(m => {
	    // Defeat recursion
	    if (m == this.selected) return;

	    this.selected = m;
	});

    }

    _selected : Model;
    get selected() { return this._selected; }
    set selected(m : Model) {
	this._selected = m;
	this.models.setSelectedModel(m);
    }

    items : FlatItem<Model>[] = [];
    riskProfiles : Risk[];

}

