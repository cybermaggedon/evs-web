import { Component, OnInit, Input } from '@angular/core';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';
import { FairService } from '../fair.service';

@Component({
    selector: 'device-risk',
    templateUrl: './device-risk.component.html',
    styleUrls: ['./device-risk.component.scss']
})
export class DeviceRiskComponent implements OnInit {

    loading = false;

    constructor(private riskSvc : RiskService,
		private fairSvc : FairService) {
        // Initialise.
        this.model = new RiskModel();
    }

    @Input('max-items')
    maxItems : number = 20;

    model : RiskModel;

    ngOnInit(): void {
        this.riskSvc.subscribe(m => {
	    this.model = m;
	});
	this.fairSvc.subscribeRecalcEvent(n => {
	    this.loading = (n > 0);
	});
    }
    
}

