import { Component, OnInit, Input } from '@angular/core';
import { TargetSet, Target } from '../risks.service';
import { RiskWindowService } from '../risk-window.service';

@Component({
    selector: 'device-risk',
    templateUrl: './device-risk.component.html',
    styleUrls: ['./device-risk.component.css']
})
export class DeviceRiskComponent implements OnInit {


    constructor(private risksSvc : TargetSet,
                private window : RiskWindowService) {
        this.targets = [];
        this.thence = new Date();
        this.windowed = [];
    }

    @Input('max-items')
    maxItems : number = 20;

    // Data input
    targets : Target[];
    thence : Date;

    // Window on targets
    windowed : Target[];

    minRisk = 0.05;

    updateWindowed() : void {

        this.windowed.length = 0;
        const now = new Date();

        for (let target of this.targets) {
            let wt = target.applyWindow(this.thence, now);
            if (wt.getRiskScore() > this.minRisk) {
                this.windowed.push(wt);
            }
            
        }

        this.windowed.sort((a, b) => (b.getRiskScore() - a.getRiskScore()));

    }

    ngOnInit(): void {
        this.risksSvc.subscribe("actorrisk", d => {
            this.targets = d;
            this.updateWindowed();
        });
        this.window.subscribe(w => {
            this.thence = w.earliest;
            this.updateWindowed();
        });
    }
    
}

