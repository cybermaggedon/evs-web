
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelSet, Model, Risk, RiskProfile } from './model-types';
import { walk, FlatItem, flattenHierarchy } from './hierarchy';
import { ModelLoaderService } from './model-loader.service';

export interface ModelIndex {
    [key : string] : Model;
};

export class ModelState {
    models : FlatItem<Model>[];
    default : Model;
    index : ModelIndex;
    currentModel(selected : string) : Model {
	if (selected != undefined && selected in this.index)
	    return this.index[selected];
	if (this.default)
	    return this.default;
	return undefined;
    }
    defaultProfile(selected : string, risk : string) : string {
	if (selected != undefined && selected in this.index &&
	    risk in this.index[selected].profiles)
	    return this.index[selected].profiles[risk];
	if (this.default && selected in this.default.profiles)
	    return this.default.profiles[risk];
	return undefined;
    }
};

@Injectable({
  providedIn: 'root'
})
export class ModelStateService {

    subject : BehaviorSubject<ModelState>;

    constructor(private loader : ModelLoaderService) {

	this.subject = new BehaviorSubject<ModelState>(new ModelState());

	this.loader.subscribe(ms => {

	    let state = new ModelState();
	    state.models = flattenHierarchy(ms);
	    state.index = {};

	    for(let model of state.models) {
		if (model.default)
		    state.default = model.value;
		state.index[model.value.id] = model.value;
	    }

	    this.subject.next(state);

	});

    }

    subscribe(f : (ms : ModelState) => void) {
	this.subject.subscribe(ms => { f(ms); });
    }

}

