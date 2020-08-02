
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelSet, Model, Risk, RiskProfile } from './model-types';
import { walk, FlatItem, flattenHierarchy } from './hierarchy';
import { ModelLoaderService } from './model-loader.service';
import { RiskStateService } from './risk-state.service';

export interface ModelIndex {
    [key : string] : Model;
};

export class ModelState {
    models : FlatItem<Model>[];
    default : Model;
    index : ModelIndex;
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

