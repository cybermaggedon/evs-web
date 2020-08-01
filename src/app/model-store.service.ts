

// State changes:
// If loading a new modelSet, and the existing modelSet is undefined, this
//   is the initial load.  Initialise selectedModel from persistence.
// If loading a new riskProfiles, and the existing riskProfiles is undefined,
//   this is initial load.  Initialise 


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModelSet, Model, Risk, RiskProfile } from './model';
import { walk } from './hierarchy';
import { HttpClient } from '@angular/common/http';

export class SelectedRiskChange {
    id : string;
    risk : RiskProfile;
}

@Injectable({
  providedIn: 'root'
})
export class ModelStoreService {

    // The model definitions
    private modelSet : ModelSet;
    private defaultModel : Model;
    
    // Risk profile definitions
    private riskProfiles : Risk[];

    // Which model is selected
    private selectedModel : Model;

    // Risks which are selected
    private selectedRisks : Object;

    // Default profiles settings for risk.
    private defaultRisks : Object;

    // For each risk, either the selected profile, or the default profile if
    // none selected.
    private combinedRisks : Object;

    // A bunch of subjects to push information out on.
    private modelSetSubject : Subject<ModelSet>;
    private risksSubject : Subject<Risk[]>;
    private selectedModelSubject : Subject<Model>;
    private selectedRiskSubject : Subject<SelectedRiskChange>;
    private combinedRiskSubject : Subject<SelectedRiskChange>;

    constructor(private http : HttpClient) {

	this.modelSetSubject = new Subject<ModelSet>();
	this.risksSubject = new Subject<Risk[]>();
	this.selectedModelSubject = new Subject<Model>();
	this.selectedRiskSubject = new Subject<SelectedRiskChange>();
	this.combinedRiskSubject = new Subject<SelectedRiskChange>();

	// Get the settings from model-defs
	this.http.get<ModelSet>("/assets/model-defs.json").subscribe(ms => {
	    this.setModels(ms);
	    this.modelSetSubject.next(ms);
	});

	// Get the settings from risk-profiles
	this.http.get<Risk[]>("/assets/risk-profiles.json").subscribe(rp => {
	    this.riskProfiles = rp;
	    if (this.modelSet == undefined) return;
	    this.updateModel();
	});

    }

    updateModel() {

	if (this.modelSet == undefined) return;
	if (this.riskProfiles == undefined) return;

	// Find default model
	walk(this.modelSet, ent => {
	    if (ent.kind == "entry" && ent.default)
		this.defaultModel = ent.value;
	});

	// Get model setting from localstorage
	let modelSetting = localStorage.getItem("selected-model");

	// Set to selected model stored in localStorage, if set.
	if (modelSetting != null) {
	    walk(this.modelSet, ent => {
		if (ent.kind == "entry" && ent.value.id == modelSetting) {
		    this.selectedModel = ent.value;
		    this.selectedModelSubject.next(this.selectedModel);
		}
	    });
	}

	// Else, set to default
	if (this.selectedModel == undefined &&
	    this.defaultModel != undefined) {

	    this.selectedModel = this.defaultModel;
	    this.selectedModelSubject.next(this.selectedModel);

	    // Store this away for next time.
	    localStorage.setItem("selected-model", this.selectedModel.id);

	}

	this.selectedRisks = {};
	this.defaultRisks = {};
	this.combinedRisks = {};

	// Loop over all risks...
	for(let risk of this.riskProfiles) {

	    // Get the localStorage setting for this risk
	    let riskSetting = localStorage.getItem("selected-risk:" + risk.id);

	    this.selectedRisks[risk.id] = undefined;

	    if (riskSetting != null) {
		walk(risk.profiles, entry => {
		    if (entry.kind == "entry") {
			if (riskSetting == entry.value.id)
			    this.selectedRisks[risk.id] = entry.value;
			//			ASD
			// FIXME: Subject push here.
		    }
		});
	    }

	    // Get the default for this risk
	    this.defaultRisks[risk.id] = undefined;
	    walk(risk.profiles, entry => {
		if (entry.kind == "entry")
		    if (entry.default)
			this.defaultRisks[risk.id] = entry.value;
	    });

	    // Set the combined risk from either the selected risk, or
	    // default if not set.
	    this.updateCombinedRisk(risk.id);

	}

	console.log(this.modelSet);
//	console.log(this.modelSet);

	this.modelSetSubject.next(this.modelSet);
	this.risksSubject.next(this.riskProfiles);

    }

    updateCombinedRisk(id : string) {

	// Set the combined risk from either the selected risk, or
	// default if not set.

	this.combinedRisks[id] = undefined;

	// If there's a selected risk, just use that.
	if (this.selectedRisks[id] != undefined) {
	    this.combinedRisks[id] = this.selectedRisks[id];
	    return;
	}

	// If the model specifies a value, use that.
	if (this.selectedModel != undefined &&
	    id in this.selectedModel.profiles) {
	    let profileId = this.selectedModel.profiles[id];
	    for(let risk of this.riskProfiles) {
		if (risk.id == id) {
		    walk(risk.profiles, ent => {
			if (ent.value.id == profileId) {
			    this.combinedRisks[id] = ent.value;
			}
		    });
		}
	    }
	    if (this.combinedRisks[id] != undefined) return;
	}

	// Just go with the default specified in the risk profile
	this.combinedRisks[id] = this.defaultRisks[id];

    }

    setModels(m : ModelSet) {
	this.modelSet = m;
	this.updateModel();
    }

    setRiskProfile(r : Risk[]) {
	this.riskProfiles = r;
	this.risksSubject.next(r);
    }

    setSelectedModel(m : Model) {

	// Ignore no-op.
	if (this.selectedModel == m) return;

	this.selectedModel = m;
	this.selectedModelSubject.next(m);

	for(let risk of this.riskProfiles) {

	    let prevVal = this.combinedRisks[risk.id];
	    this.updateCombinedRisk(risk.id);

	    if (this.combinedRisks[risk.id] != prevVal) {
		let rc = new SelectedRiskChange();
		rc.id = risk.id;
		rc.risk = this.combinedRisks[risk.id];
		this.combinedRiskSubject.next(rc);
	    }

	}

	localStorage.setItem("selected-model", m.id);

    }

    setSelectedRisk(id : string, r : RiskProfile) {
	this.selectedRisks[id] = r;
	let rc = new SelectedRiskChange();
	rc.id = id;
	rc.risk = r;
	this.selectedRiskSubject.next(rc);

	if (r == undefined) 
	    localStorage.removeItem("selected-risk:" + id);
	else
	    localStorage.setItem("selected-risk:" + id, r.id);

	// Set the combined risk from either the selected risk, or
	// default if not set.
	let prevVal = this.combinedRisks[id];
	this.updateCombinedRisk(id);

	if (this.combinedRisks[id] != prevVal) {
	    let rc = new SelectedRiskChange();
	    rc.id = id;
	    rc.risk = this.combinedRisks[id];
	    this.combinedRiskSubject.next(rc);
	}

    }

    // Yeh... but better to do the comms through subscriptions
    getModels() : ModelSet { return this.modelSet; }
    getRiskProfiles() : any { return this.riskProfiles; }
    getSelectedRisk(id : string) {
	if (id in this.selectedRisks) return this.selectedRisks[id];
	return undefined;
    }
    getSelectedModel() { return this.selectedModel; }

    subscribeModels(f : any) {
	this.modelSetSubject.subscribe(m => { f(m); });
	if (this.modelSet != undefined)
	    f(this.modelSet);
    }
  
    subscribeRisks(f : any) {
	this.risksSubject.subscribe(rc => { f(rc); });
	if (this.riskProfiles != undefined)
	    f(this.riskProfiles);
    }
  
    subscribeSelectedModel(f : any) {
	this.selectedModelSubject.subscribe(m => { f(m); });
	if (this.selectedModel != undefined)
	    f(this.selectedModel);
    }
  
    subscribeSelectedRisk(f : any) {
	this.selectedRiskSubject.subscribe(rc => { f(rc); });
	for(let id in this.selectedRisks) {
	    let rc = new SelectedRiskChange();
	    rc.id = id;
	    rc.risk = this.selectedRisks[id];
	    f(rc);
	}
    }
  
    subscribeCombinedRisk(f : any) {
	this.combinedRiskSubject.subscribe(rc => { f(rc); });
	for(let id in this.combinedRisks) {
	    let rc = new SelectedRiskChange();
	    rc.id = id;
	    rc.risk = this.combinedRisks[id];
	    f(rc);
	}
    }
  
}

