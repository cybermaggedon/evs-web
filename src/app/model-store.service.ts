import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { modelSet, riskProfiles } from './model-defs';
import { ModelSet, Model, Risk, RiskProfile } from './model';
import { walk } from './hierarchy';

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

    constructor() {

	// Get the settings from model-defs
	this.modelSet = modelSet;
	this.riskProfiles = riskProfiles;

	// Find default model
	walk(modelSet, ent => {
	    if (ent.kind == "entry" && ent.default)
		this.defaultModel = ent.value;
	});

	// Get model setting from localstorage
	let modelSetting = localStorage.getItem("selected-model");

	// Set to selected model stored in localStorage, if set.
	if (modelSetting != null) {
	    walk(modelSet, ent => {
		if (ent.kind == "entry" && ent.value.id == modelSetting) {
		    this.selectedModel = ent.value;
		}
	    });
	}

	// Else, set to default
	if (this.selectedModel == undefined &&
	    this.defaultModel != undefined) {

	    this.selectedModel = this.defaultModel;

	    // Store this away for next time.
	    localStorage.setItem("selected-model", this.selectedModel.id);

	}

	this.selectedRisks = {};
	this.defaultRisks = {};
	this.combinedRisks = {};

	// Loop over all risks...
	for(let risk of riskProfiles) {

	    // Get the localStorage setting for this risk
	    let riskSetting = localStorage.getItem("selected-risk:" + risk.id);

	    this.selectedRisks[risk.id] = undefined;

	    if (riskSetting != null) {
		walk(risk.profiles, entry => {
		    if (entry.kind == "entry") {
			if (riskSetting == entry.value.id)
			    this.selectedRisks[risk.id] = entry.value;
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
	    if (this.selectedRisks[risk.id] != undefined)
		this.combinedRisks[risk.id] = this.selectedRisks[risk.id];
	    else 
		this.combinedRisks[risk.id] = this.defaultRisks[risk.id];

	}

	this.modelSetSubject = new Subject<ModelSet>();
	this.risksSubject = new Subject<Risk[]>();
	this.selectedModelSubject = new Subject<Model>();
	this.selectedRiskSubject = new Subject<SelectedRiskChange>();
	this.combinedRiskSubject = new Subject<SelectedRiskChange>();

    }

    setModels(m : ModelSet) {
	this.modelSet = m;
	this.modelSetSubject.next(m);
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
	if (this.selectedRisks[id] != undefined)
	    this.combinedRisks[id] = this.selectedRisks[id];
	else 
	    this.combinedRisks[id] = this.defaultRisks[id];

	rc.risk = this.combinedRisks[id];
	this.combinedRiskSubject.next(rc);

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
	f(this.modelSet);
    }
  
    subscribeRisks(f : any) {
	this.risksSubject.subscribe(rc => { f(rc); });
	f(this.riskProfiles);
    }
  
    subscribeSelectedModel(f : any) {
	this.selectedModelSubject.subscribe(m => { f(m); });
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

