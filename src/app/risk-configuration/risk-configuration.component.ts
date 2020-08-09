
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Risk, RiskProfile, Model } from '../model-types';
import { flattenHierarchy, FlatItem, walk, HierarchyObject } from '../hierarchy';
import { ModelStateService, ModelState } from '../model-state.service';
import { RiskStateService, RiskState } from '../risk-state.service';
import { FinalRiskService } from '../final-risk.service';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'risk-configuration',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.scss']
})
export class RiskConfigurationComponent implements OnInit {

    rawRisks : RiskState[] = [];
    risks : RiskState[] = [];

    pageSize = 5;
    pageSizeOptions = [5, 10, 25, 50];
    curItem : number = 0;

    filters : string[] = [];

    @ViewChild('paginator')
    paginator : any;

    onFilter(filters : any[]) {
	this.filters = filters;
	this.applyFilters();
	this.curItem = 0;
	this.paginator.firstPage();
    }

    applyFilters() {

	if (this.filters.length == 0) {
	    this.risks = this.rawRisks;
	    return;
	}
	
	let filtered = [];

	for(let risk of this.rawRisks) {

	    let found = false;
	    for(let filter of this.filters) {
		let name = risk.risk.name;
		if (name.toLowerCase().includes(filter.toLowerCase())) 
		    found = true;
	    }
	    if (found)
		filtered.push(risk);
	}

	this.risks = filtered;

    }

    constructor(private riskSvc : RiskStateService) {
	this.risks = [];
    }

    ngOnInit(): void {

	this.riskSvc.subscribe(rs => {
	    this.rawRisks = rs.risks;
	    this.applyFilters();
	});

    }

    onChange(pageEvent) {
	this.pageSize = pageEvent.pageSize;
	this.curItem = pageEvent.pageIndex * this.pageSize;
    }

}

