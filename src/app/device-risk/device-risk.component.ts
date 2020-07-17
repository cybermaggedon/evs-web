import { Component, OnInit, Input } from '@angular/core';
import { RiskGraphService } from '../risk-graph.service';
import { DevicesService, Device } from '../devices.service';
import { RiskWindowService } from '../risk-window.service';

@Component({
    selector: 'device-risk',
    templateUrl: './device-risk.component.html',
    styleUrls: ['./device-risk.component.css']
})
export class DeviceRiskComponent implements OnInit {


    constructor(private riskGraph: RiskGraphService,
                private devicesService : DevicesService,
                private window : RiskWindowService) {
        this.devices = [];
        this.thence = new Date();
        this.windowed = [];
    }

    @Input('max-items')
    maxItems : number = 20;

    // Data input
    devices : Device[];
    thence : Date;

    // Window on devices
    windowed : Device[];

    minRisk = 0.05;

    updateWindowed() : void {

        this.windowed.length = 0;
        const now = new Date();

        for (let device of this.devices) {
            let wd = device.applyWindow(this.thence, now);
            if (wd.getRiskScore() > this.minRisk) {
                this.windowed.push(wd);
            }
            
        }

        this.windowed.sort((a, b) => (b.getRiskScore() - a.getRiskScore()));

    }

    ngOnInit(): void {
        this.devicesService.subscribe(d => {
            this.devices = d;
            this.updateWindowed();
        });
        this.window.subscribe(w => {
            this.thence = w.earliest;
            this.updateWindowed();
        });
    }
    
}

