import { Component, OnInit, Input } from '@angular/core';
import { Risk, flattenHierarchy, FlatItem, RiskProfile } from '../model-defs';

@Component({
  selector: 'risk-configuration',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    constructor() { }

    @Input("risk")
    risk : Risk;

    items : FlatItem<RiskProfile>[] = [];

    ngOnInit(): void {
	console.log(this.risk);
    	this.flatten();
	console.log(this.items);
    }


        selectedProfile : RiskProfile;
//    selectedProfile : string;
    
    flatten() : void {
	this.items = flattenHierarchy(this.risk.profiles);
    }

}

