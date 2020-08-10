
// The risk service abstracts the risk graph, providing a device/resource
// summary.  The slider window is applied internally to the risk service.
// The device/resource summary has a minimal risk value applied.
import { Injectable } from '@angular/core';
import { RiskGraphService } from './risk-graph.service';
import { Graph } from './graph';
import { toRiskModel, RiskModel } from './risk';
import { WindowService, Window } from './window.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RiskService {

    // Subject to push out RiskModel.
    private subject : Subject<RiskModel>;

    // Risk service subscribes to the Window service to receive slider
    // updates.
    constructor(private riskGraph : RiskGraphService,
		private windowService : WindowService) {

	this.windowed = new RiskModel();

	this.subject = new Subject<RiskModel>();

        // Subscribe to receive periodic riskGraph updates.
	this.riskGraph.subscribe(rg => {
	    this.risks = toRiskModel(rg);
	    this.updateWindowed();
	});

        // Subscribe to window service to receive slider updates.
	this.windowService.subscribe(w => {
	    this.window = w;
	    this.updateWindowed();
	});

    }

    // Raw risk graph converted to RiskModel.
    risks : RiskModel;

    // Windowed form of the above with the slidable time window applied.
    windowed : RiskModel;

    // Last window slider update.
    window : Window;

    // Subscribe to receive service updates.
    subscribe(f : any) {

        // Subscribe
        this.subject.subscribe(f);

        // Also push last value
        f(this.windowed);

    }

    minRisk = 0.05;

    // Called when slider or risk data are updated.
    updateWindowed() : void {

	if (this.risks == undefined) return;
	if (this.window == undefined) return;

        // Convert risk graph to windowed form
	this.windowed = this.risks.applyWindow(this.window.earliest,
					       this.minRisk);

        // Push windowed risks to subscribers.
	this.subject.next(this.windowed);

    }

}

