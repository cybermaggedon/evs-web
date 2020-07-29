
import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { Risk, RiskProfile, Model } from '../model';
import { flattenHierarchy, FlatItem, walk, HierarchyObject } from '../hierarchy';

@Component({
  selector: '[risk-configuration]',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    constructor(@Inject(LOCALE_ID) private locale: string) { }

    _risk : Risk;

    _model : Model;

    @Input("risk") set risk(risk : Risk) {
	this._risk = risk;
	this.flatten();
    	this.updateModel();
    }

    @Input("overall-model") set overallModel(model : Model) {
	this._model = model;
    	this.updateModel();
    }

    get overallModel() : Model { return this._model }

    items : FlatItem<RiskProfile>[] = [];

    ngOnInit(): void {
	console.log("LOCALE is ", this.locale);
    }

    selected : FlatItem<RiskProfile>;

    // Model-specified default.
    default : FlatItem<RiskProfile>;

    // Combined is the selected, or the default if nothing is selected.
    combined: FlatItem<RiskProfile>;
    
    flatten() : void {
	this.items = flattenHierarchy(this._risk.profiles);

    }

    updateModel() {

	if (this._model != undefined && this._risk != undefined) {

	    if (this._risk.id in this._model.profiles) {

		this.default = undefined;

		let id = this._model.profiles[this._risk.id];

		for(let item of this.items) {
		    if (item.value.id == id) {
			this.default = item;
		    }
		}


	    }

	}

	this.updateCombined();

    }

    updateCombined() : void {
	
	if (this.selected != null)
	    this.combined = this.selected;
	else
	    this.combined = this.default;

    }

    onChange() : void {
	this.updateCombined();
    }

}

