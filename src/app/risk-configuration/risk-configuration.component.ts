import { Component, OnInit, Input } from '@angular/core';
import { Risk, RiskProfile, Model } from '../model-defs';
import { flattenHierarchy, FlatItem, walk, HierarchyObject } from '../hierarchy';

@Component({
  selector: 'risk-configuration',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    constructor() { }

    _risk : Risk;

    _model : Model;

    @Input("risk") set risk(risk : Risk) {
	this._risk = risk;
	this.flatten();
    }

    @Input("overall-model") set overallModel(model : Model) {
	this._model = model;
    	this.flatten();
    }

    get overallModel() : Model { return this._model }

    items : FlatItem<RiskProfile>[] = [];

    ngOnInit(): void {

    }

    selected : RiskProfile;

    // Model-specified default.
    default : FlatItem<RiskProfile>;
    
    flatten() : void {

	this.items = flattenHierarchy(this._risk.profiles);

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

    }

}

