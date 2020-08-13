import { Component, OnInit, Input } from '@angular/core';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';
import { FairService } from '../fair.service';

@Component({
    selector: 'resource-risk',
    templateUrl: './resource-risk.component.html',
    styleUrls: ['./resource-risk.component.scss']
})
export class ResourceRiskComponent implements OnInit {

    loading = false;
    
    constructor(private riskSvc : RiskService,
		private fairSvc : FairService) {
        // Initialise.
        this.model = new RiskModel();
    }

    @Input('max-items')
    maxItems : number = 20;

    // Data input
    model : RiskModel;

    ngOnInit(): void {
	this.fairSvc.subscribeRecalcEvent(n => {
	    this.loading = (n > 0);
	});
        this.riskSvc.subscribe(m => {this.model = m});
    }
    
}

