import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { modelSet, flattenHierarchy, Model, Hierarchy, FlatItem, ModelSet } from '../model-defs';

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

    flatten() : void {
	this.items = flattenHierarchy(modelSet);
	console.log("GOT.....", this.items);
    }

}

