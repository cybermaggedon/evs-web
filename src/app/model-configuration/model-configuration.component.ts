import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { modelSet, flattenHierarchy, Model, FlatItem, riskProfiles } from '../model-defs';

@Component({
    selector: 'app-model-configuration',
    templateUrl: './model-configuration.component.html',
    styleUrls: ['./model-configuration.component.css']
})
export class ModelConfigurationComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
	this.flatten();
    }

    selectedModel : string;

    items : FlatItem<Model>[] = [];
    riskProfiles = riskProfiles;

    flatten() : void {

	this.items = flattenHierarchy(modelSet);

    }

}

