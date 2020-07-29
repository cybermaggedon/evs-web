import { Component, OnInit, Input } from '@angular/core';
import { riskProfiles } from '../model-defs';

@Component({
  selector: 'risk-configuration',
  templateUrl: './risk-configuration.component.html',
  styleUrls: ['./risk-configuration.component.css']
})
export class RiskConfigurationComponent implements OnInit {

    constructor() { }

    @Input("id")
    id : string;

    @Input("name")
    name : string;

    ngOnInit(): void {
    }

    selectedModel : string;

    riskProfiles = riskProfiles;
    
}
