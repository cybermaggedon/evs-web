
// Update strategy:
// - Selected model changes => this may change the default risk profile for
//   a label, find out what that is and update trigger label (may be
//   undefined).
// - No selected model & default model changes => this changes the final
//   model.  Changes the default risk profile, and thus the risk selector
//   trigger label.
// - Selected risk profile changes for this risk, change the selector.
// - Underlying modelset changes => rework everything.
// - Underlying riskset changes => rework everything

// - The model parameters are all described from the finalrisk.

import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';
import { Risk, RiskProfile, Model } from '../model-types';
import { flattenHierarchy, FlatItem, walk, HierarchyObject } from '../hierarchy';
import { ModelStateService, ModelState } from '../model-state.service';
import { RiskStateService, AllRisksState } from '../risk-state.service';
import { SelectedModelService } from '../selected-model.service';
import { SelectedRiskProfilesService } from '../selected-risk-profiles.service';
import { FinalRiskService } from '../final-risk.service';

@Component({
  selector: '[risk-configuration]',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    models : ModelState;
    risks : AllRisksState;
    selectedModel : string;
    selectedRiskProfile : string;

    @Input("risk") _risk : string;

    items : FlatItem<RiskProfile>[] = [];
    name : string;

    get risk() : string { return this._risk; }
    set risk(r : string) {
	this._risk = r;
	this.update();
    }

    selected : string;
    modelDefault : string;
    final : RiskProfile;

    constructor(private modelSvc : ModelStateService,
		private riskSvc : RiskStateService,
		private selectedModelSvc : SelectedModelService,
		private selectedRiskProfilesSvc : SelectedRiskProfilesService,
		private finalRisk : FinalRiskService,
		@Inject(LOCALE_ID) private locale: string) {

	this.models = new ModelState();
	this.risks = new AllRisksState();

    }

    update() {
	
	if (!(this.risk in this.risks.riskIndex))
	    return;

	if (this.risk in this.risks.riskIndex) {
	    this.items = this.risks.riskIndex[this.risk].profiles;
	}

	this.name = this.risks.riskIndex[this.risk].risk.name;

	let model = this.models.currentModel(this.selectedModel);
 	let modelDefault = this.models.defaultProfile(this.selectedModel,
						      this.risk);

	if (modelDefault == undefined)
	    this.modelDefault = undefined;
	else {

	    let profile =
		this.risks.currentProfile(this.risk, modelDefault,
					  undefined);

	    let name = this.risks.riskIndex[this.risk].nameIndex[profile.id];

	    this.modelDefault = name;

	}

	this.selected = this.selectedRiskProfile;

   }

    ngOnInit(): void {

	this.modelSvc.subscribe(ms => {
	    this.models = ms;
	    this.update();
	});

	this.riskSvc.subscribe(rs => {
	    this.risks = rs;
	    this.update();
	});

	this.selectedModelSvc.subscribe(m => {
	    this.selectedModel = m;
	    this.update();
	});

	this.selectedRiskProfilesSvc.subscribe(srp => {
	    if (srp.risk == this.risk) {
		this.selectedRiskProfile = srp.profile;
		this.update();
	    }
	});

	this.finalRisk.subscribe(frc => {
	    if (frc.id == this.risk) {
		this.final = frc.profile;
	    }
	});

    }

    onChange() : void {
	this.selectedRiskProfilesSvc.setRiskProfile(this.risk,
						   this.selected);
    }

}

