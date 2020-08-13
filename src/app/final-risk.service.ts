import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ModelStateService, ModelState } from './model-state.service';
import { RiskStateService, AllRisksState } from './risk-state.service';
import { SelectedModelService } from './selected-model.service';
import { SelectedRiskProfilesService } from './selected-risk-profiles.service';
import { ModelSet, RiskSet, RiskProfile } from './model-types';

export class FinalRiskChange {
    id : string;
    profile : RiskProfile;
    constructor(id : string, profile : RiskProfile) {
	this.id = id;
	this.profile = profile;
    }
};

@Injectable({
  providedIn: 'root'
})
export class FinalRiskService {

    private riskProfiles = {};

    subject : Subject<FinalRiskChange>;

    private models : ModelState;
    private risks : AllRisksState;

    private fairSummary : {
	[key : string] : Object;
    };

    private selectedModel : string;
    private selectedRisks : { [key : string] : string };

    constructor(private modelStateSvc : ModelStateService,
		private riskStateSvc : RiskStateService,
		private selectedModelSvc : SelectedModelService,
		private selectedRisksSvc : SelectedRiskProfilesService) {

	this.subject = new Subject<FinalRiskChange>();

	this.models = new ModelState();
	this.risks = new AllRisksState();
	this.selectedRisks = {};

	modelStateSvc.subscribe((ms : ModelState) => {
	    this.models = ms;
	    this.update();
	});

	riskStateSvc.subscribe((rs : AllRisksState) => {
	    this.risks = rs;
	    this.update();

	});

	selectedModelSvc.subscribe(sm => {
	    this.selectedModel = sm;
	    this.update();
	});

	selectedRisksSvc.subscribe(sr => {
	    this.selectedRisks[sr.risk] = sr.profile;
	    this.update();
	});

    }

    update() : void {

	let model = this.models.currentModel(this.selectedModel);
	if (model == undefined) {

	    for (let risk of this.risks.risks) {

		let id = risk.risk.id;
		
		if (this.selectedRisks[id] != undefined) {
		    this.selectedRisks[id] = undefined;
		    this.subject.next(new FinalRiskChange(id, undefined));
		}
	    }

	}

	for(let risk of this.risks.risks) {

	    let id = risk.risk.id;

	    let modelDefault = this.models.defaultProfile(this.selectedModel,
							  id);

	    let selected = this.selectedRisks[id]

	    let profile =
		this.risks.currentProfile(id, modelDefault, selected);

	    if (this.riskProfiles[id] != profile) {
		this.riskProfiles[id] = profile;
		this.subject.next(new FinalRiskChange(id, profile));
	    }

	}

    }

    subscribe(f : (frc : FinalRiskChange) => void) {
	this.subject.subscribe(frc => {
	    f(frc);
	});
	for (let r in this.riskProfiles) {
	    let rc = new FinalRiskChange(r, this.riskProfiles[r]);
	    f(rc);
	}
    }
  
}

