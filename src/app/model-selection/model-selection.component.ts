
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Model, Risk } from '../model-types';
import { flattenHierarchy, FlatItem } from '../hierarchy';
import { ModelStateService, ModelState } from '../model-state.service';
import { SelectedModelService } from '../selected-model.service';

@Component({
    selector: 'model-selection',
    templateUrl: './model-selection.component.html',
    styleUrls: ['./model-selection.component.css']
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

	    // Set default, if undefined
	    if (this._selected == undefined) {
		if (this.modelState && this.modelState.default) {
		    let def = this.modelState.default.id;
		    if (this.selected != def)
			this.selected = def;
		}
	    }

	});

	this.selectedModelSvc.subscribe(m => {

	    // Set default, if undefined
	    if (m == undefined) {
		if (this.modelState && this.modelState.default) {
		    m = this.modelState.default.id;
		}
	    }

	    if (m != this.selected)
		this.selected = m;

	});

    }

    _selected : string;
    get selected() { return this._selected; }
    set selected(m : string) {
	this._selected = m;
	this.selectedModelSvc.setModel(m);
    }

}

