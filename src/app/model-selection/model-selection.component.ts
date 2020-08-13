
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Model, Risk } from '../model-types';
import { flattenHierarchy, FlatItem } from '../hierarchy';
import { ModelStateService, ModelState } from '../model-state.service';
import { SelectedModelService } from '../selected-model.service';

@Component({
    selector: 'model-selection',
    templateUrl: './model-selection.component.html',
    styleUrls: ['./model-selection.component.scss']
})
export class ModelSelectionComponent implements OnInit {

    modelState : ModelState;
    selectedModel : string;

    constructor(private modelSvc : ModelStateService,
		private selectedModelSvc : SelectedModelService) {
	this.modelState = new ModelState();
    }

    ngOnInit(): void {

	this.modelSvc.subscribe(ms => {

	    this.modelState = ms;

	});

	this.selectedModelSvc.subscribe(m => {

	    if (m != this.selected)
		this.selected = m;

	});

    }

    _selected : string;
    get selected() { return this._selected; }
    set selected(m : string) {
	if (this._selected != m) {
	    // undefined means we're uninitialised
	    if (this._selected != undefined) {
		this.selectedModelSvc.setModel(m);
	    }
	    this._selected = m;
	}
    }

}

