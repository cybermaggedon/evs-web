
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
  selector: 'risk-configuration',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    risks : AllRisksState;

    constructor(private riskSvc : RiskStateService) {

	this.risks = new AllRisksState();

    }

    ngOnInit(): void {

	this.riskSvc.subscribe(rs => {
	    this.risks = rs;
	});

    }

}

