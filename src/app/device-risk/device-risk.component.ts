import { Component, OnInit, Input } from '@angular/core';
import { RiskService } from '../risk.service';
import { RiskModel } from '../risk';

@Component({
    selector: 'device-risk',
    templateUrl: './device-risk.component.html',
    styleUrls: ['./device-risk.component.css']
})
export class DeviceRiskComponent implements OnInit {


    constructor(private riskSvc : RiskService) {
        // Initialise.
        this.model = new RiskModel();
    }

    @Input('max-items')
    maxItems : number = 20;

    model : RiskModel;

    ngOnInit(): void {
        this.riskSvc.subscribe(m => {this.model = m});
    }
    
}

