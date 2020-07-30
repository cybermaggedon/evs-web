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

	walk(modelSet, ent => {
	    if (ent.kind == "entry" && ent.default) {
		this.selectedModel = ent.value;
	    }
	});

	this.selectedRisks = {};
	for(let risk of riskProfiles) {
	    this.selectedRisks[risk.id] = undefined;
	}
	
    }

    //
    setModels(m : ModelSet) {
	this.modelSet = m;
	this.modelSetSubject.next(m);
    }

    setRiskProfile(r : Risk[]) {
	this.riskProfiles = r;
	this.risksSubject.next(r);
    }

    setSelectedModel(m : Model) {
	this.selectedModel = m;
	this.selectedModelSubject.next(m);
    }

    setSelectedRisk(id : string, r : RiskProfile) {
	this.selectedRisks[id] = r;
	let rc = new SelectedRiskChange();
	rc.id = id;
	rc.risk = r;
	this.selectedRiskSubject.next(rc);
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
	this.selectedRiskSubject.subscribe(m => { f(m); });
	f(this.selectedModel);
    }
  
}

