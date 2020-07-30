import { Injectable } from '@angular/core';
import { modelSet, riskProfiles } from './model-defs';
import { ModelSet, Risk } from './model';

@Injectable({
  providedIn: 'root'
})
export class ModelStoreService {

  constructor() { }

  getModels() : ModelSet { return modelSet; }

  getRiskProfiles() : Risk[] { return riskProfiles; }
  
}
