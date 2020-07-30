
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { modelSet, riskProfiles } from '../model-defs';
import { Model } from '../model';
import { flattenHierarchy, FlatItem } from '../hierarchy';

@Component({
    selector: 'model-configuration',
    templateUrl: './model-configuration.component.html',
    styleUrls: ['./model-configuration.component.css']
})
export class ModelConfigurationComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}

