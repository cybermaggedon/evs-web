
import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { Risk, RiskProfile, Model } from '../model';
import { flattenHierarchy, FlatItem, walk, HierarchyObject } from '../hierarchy';
import { ModelStoreService } from '../model-store.service';

@Component({
  selector: '[risk-configuration]',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    constructor(private models : ModelStoreService,
		@Inject(LOCALE_ID) private locale: string) { }

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
	this.models.subscribeSelectedRisk(rc => {

	    // Ignore risks which aren't for this component.
	    if (rc.id != this._risk.id) return;

	    console.log("INCOMING: ", rc);

	    // Ignore if no change.  This defeats recursion.
	    if (this._selected != undefined &&
		this._selected.value == rc.risk) {
		return;
	    }

	    // This is no change for the 'model default' case.
	    if (this._selected == undefined &&
		rc.risk == undefined)
		return;

	    // Special 'model default' case.
	    if (rc.risk == undefined) {
		this._selected = undefined;
		this.updateCombined();
		return;
	    }


	    // Locate the FlatItem corresponding to this risk.
	    for(let item of this.items) {
		if (item.value == rc.risk) {
		    this._selected = item;
		}
	    }

	    this.updateCombined();
	    
	    console.log("THIS IS A CHANGE");
	    console.log(this._selected);

	});
    }

    _selected : FlatItem<RiskProfile>;
    get selected() { return this._selected; }
    set selected(item : FlatItem<RiskProfile>) {
	this._selected = item;
	if (this._selected == undefined)
	    this.models.setSelectedRisk(this._risk.id, undefined);
	else
	    this.models.setSelectedRisk(this._risk.id, this._selected.value);
    }

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

