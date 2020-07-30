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

    // Risk profile definitions
    private riskProfiles : Risk[];

    // Which model is selected
    private selectedModel : Model;

    // Risks which are selected
    private selectedRisks : Object;

    private modelSetSubject : Subject<ModelSet>;
    private risksSubject : Subject<Risk[]>;
    private selectedModelSubject : Subject<Model>;
    private selectedRiskSubject : Subject<SelectedRiskChange>;
    

    constructor() {
	this.modelSet = modelSet;

	this.riskProfiles = riskProfiles;

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
	if (this.selectedModel == undefined) {
	    walk(modelSet, ent => {
		if (ent.kind == "entry" && ent.default) {

		    // Setting from the default
		    this.selectedModel = ent.value;

		    // Store this away for next time.
		    localStorage.setItem("selected-model",
					 this.selectedModel.id);
		}
	    });
	}

	this.selectedRisks = {};
	for(let risk of riskProfiles) {

	    let riskSetting = localStorage.getItem("selected-risk:" + risk.id);

	    this.selectedRisks[risk.id] = undefined;

	    if (riskSetting != null && riskSetting != "") {

		walk(risk.profiles, entry => {
		    if (entry.kind == "entry") {
			if (riskSetting == entry.value.id)
			    this.selectedRisks[risk.id] = entry.value;
		    }
		});

	    }

	}

	this.modelSetSubject = new Subject<ModelSet>();
	this.risksSubject = new Subject<Risk[]>();
	this.selectedModelSubject = new Subject<Model>();
	this.selectedRiskSubject = new Subject<SelectedRiskChange>();

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

	// In storage, "" means undefined.
	if (r == undefined) 
	    localStorage.setItem("selected-risk:" + id, "");
	else
	    localStorage.setItem("selected-risk:" + id, r.id);
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
  
}

