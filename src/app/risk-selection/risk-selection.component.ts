
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
import { FairService } from '../fair.service';
import { getRiskScoreFromFair } from '../risk';
@Component({
  selector: '[risk-selection]',
  templateUrl: './risk-selection.component.html',
  styleUrls: ['./risk-selection.component.scss']
})
export class RiskSelectionComponent implements OnInit {

    models : ModelState;
    risks : AllRisksState;
    selectedModel : string;
    selectedRiskProfile : string;

    riskScore = 0.0;
    
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
		private fairService : FairService,
		private selectedModelSvc : SelectedModelService,
		private selectedRiskProfilesSvc : SelectedRiskProfilesService,
		private finalRisk : FinalRiskService,
		@Inject(LOCALE_ID) private locale: string) {

	this.models = new ModelState();
	this.risks = new AllRisksState();

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
		this.describe();
	    }
	});

	this.fairService.subscribe(fr => {
	    if (fr.kind == "summary" && fr.name == this._risk) {
		this.riskScore = getRiskScoreFromFair(fr.report[fr.name]);
	    };
	});
	
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

    factors : Object = [];

    describeFactors(name, f, output, currency=false) {
	if (f.low && f.mode && f.high) {
	    output.push(
		{ key: name + ".low", value: f.low, currency: currency }
	    );
	    output.push(
		{ key: name + ".mode", value: f.mode, currency: currency }
	    );
	    output.push(
		{ key: name + ".high", value: f.high, currency: currency }
	    );
	    return
	}
	if (f.mean && f.stdev) {
	    output.push(
		{ key: name + ".mean", value: f.mean, currency: currency }
	    );
	    output.push(
		{ key: name + ".stdev", value: f.stdev, currency: currency}
	    );
	    return
	}
	if (f.constant) {
	    output.push(
		{ key: name + ".constant", value: f.constant,
		  currency: currency }
	    );
	    return;
	}

    }

    describe() {
	let output = [];
	let f = this.final.fair;

	if (f.r) this.describeFactors("risk", f.r, output, true);
	if (f.lef) this.describeFactors("lef", f.lef, output);
	if (f.tef) this.describeFactors("tef", f.tef, output);
	if (f.c) this.describeFactors("c", f.c, output);
	if (f.a) this.describeFactors("a", f.a, output);
	if (f.v) this.describeFactors("v", f.v, output);
	if (f.tc) this.describeFactors("tc", f.tc, output);
	if (f.cs) this.describeFactors("cs", f.cs, output);
	if (f.lm) this.describeFactors("lm", f.lm, output, true);
	if (f.pl) this.describeFactors("pl", f.pl, output, true);
	if (f.sl) this.describeFactors("sl", f.sl, output, true);
	if (f.slef) this.describeFactors("slef", f.slef, output);
	if (f.slem) this.describeFactors("slem", f.slem, output, true);

	this.factors = output;
    }

    onChange() : void {
	this.selectedRiskProfilesSvc.setRiskProfile(this.risk,
						   this.selected);
    }

}

