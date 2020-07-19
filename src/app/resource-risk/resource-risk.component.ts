import { Component, OnInit, Input } from '@angular/core';
import { RiskService } from '../risks.service';
import { RiskModel } from '../risk';
import { RiskWindowService } from '../risk-window.service';

@Component({
    selector: 'resource-risk',
    templateUrl: './resource-risk.component.html',
    styleUrls: ['./resource-risk.component.css']
})
export class ResourceRiskComponent implements OnInit {


    constructor(private riskSvc : RiskService) {
        // Initialise.
        this.model = new RiskModel();
    }

    @Input('max-items')
    maxItems : number = 20;

    // Data input
    model : RiskModel;

    ngOnInit(): void {
        this.riskSvc.subscribe(m => {this.model = m});
    }
    
}

