import { Component, OnInit, Input } from '@angular/core';
import { ResourcesService, Resource } from '../resources.service';
import { RiskWindowService } from '../risk-window.service';

@Component({
  selector: 'resource-risk',
  templateUrl: './resource-risk.component.html',
  styleUrls: ['./resource-risk.component.css']
})
export class ResourceRiskComponent implements OnInit {


    constructor(private resourcesService : ResourcesService,
                private window : RiskWindowService) {
        this.resources = [];
        this.thence = new Date();
        this.windowed = [];
    }

    @Input('max-items')
    maxItems : number = 20;

    // Data input
    resources : Resource[];
    thence : Date;

    // Window on resources
    windowed : Resource[];

    minRisk = 0.05;

    updateWindowed() : void {

        this.windowed.length = 0;
        const now = new Date();

        for (let resource of this.resources) {
            let wd = resource.applyWindow(this.thence, now);
            if (wd.getRiskScore() > this.minRisk) {
                this.windowed.push(wd);
            }
            
        }

        this.windowed.sort((a, b) => (b.getRiskScore() - a.getRiskScore()));

    }

    ngOnInit(): void {
        this.resourcesService.subscribe(d => {
            this.resources = d;
            this.updateWindowed();
        });
        this.window.subscribe(w => {
            this.thence = w.earliest;
            this.updateWindowed();
        });
    }
    
}

