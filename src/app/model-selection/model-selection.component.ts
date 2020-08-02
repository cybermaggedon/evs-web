
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Model, Risk } from '../model-types';
import { flattenHierarchy, FlatItem } from '../hierarchy';
import { ModelStateService, ModelState } from '../model-state.service';
import { SelectedModelService } from '../selected-model.service';
import { RiskStateService, AllRisksState } from '../risk-state.service';

@Component({
    selector: 'model-selection',
    templateUrl: './model-selection.component.html',
    styleUrls: ['./model-selection.component.css']
})
export class ModelSelectionComponent implements OnInit {

    modelState : ModelState;
    selectedModel : string;
    riskState : AllRisksState;

    constructor(private modelSvc : ModelStateService,
		private riskSvc : RiskStateService,
		private selectedModelSvc : SelectedModelService) {
	this.modelState = new ModelState();
    }

    ngOnInit(): void {

	this.modelSvc.subscribe(ms => {
	    this.modelState = ms;
	});

	this.riskSvc.subscribe((rs : AllRisksState) => {
	    this.riskState = rs;
	});

	this.selectedModelSvc.subscribe(m => {
	    this._selected = m;
	});

    }

    _selected : string;
    get selected() { return this._selected; }
    set selected(m : string) {
	this._selected = m;
	this.selectedModelSvc.setModel(m);
    }

}

