import { Injectable } from '@angular/core';
import { RiskGraphService } from './risk-graph.service';
import { Graph } from './graph';
import { toRiskModel, RiskModel } from './risk';
import { RiskWindowService, Window } from './risk-window.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RiskService {

    subject : Subject<RiskModel>;

    constructor(private riskGraph : RiskGraphService,
		private windowService : RiskWindowService) {

	this.subject = new Subject<RiskModel>();

	let initWindow = new RiskModel();
	this.windowed = initWindow;

	this.riskGraph.subscribe(rg => {
	    this.risks = toRiskModel(rg);
	    this.updateWindowed();
	});
	this.windowService.subscribe(w => {
	    this.window = w;
	    this.updateWindowed();
	});
    }

    risks : RiskModel;
    windowed : RiskModel;

    window : Window;

    subscribe(f : any) {

        this.subject.subscribe(f);

        f(this.windowed);

    }

    minRisk = 0.05;

    updateWindowed() : void {

	if (this.risks == undefined) return;
	if (this.window == undefined) return;

	this.windowed = this.risks.applyWindow(this.window.earliest,
					       this.minRisk);

	this.subject.next(this.windowed);

    }

}

