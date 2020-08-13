import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';

import { FairService } from '../fair.service';

@Component({
  selector: 'risk-summary',
  templateUrl: './risk-summary.component.html',
  styleUrls: ['./risk-summary.component.scss']
})
export class RiskSummaryComponent implements OnInit {

    loading : boolean;

    constructor(private fairSvc : FairService,
                @Inject(LOCALE_ID) private locale: string) {
	this.loading = true;
    }

    @Input('kind')
    kind : String;

    summary : Object[] = [];

    ngOnInit(): void {

	this.fairSvc.subscribeRecalcEvent(n => {
	    this.loading = (n > 0);
	});

	this.fairSvc.subscribe(fr => {
/*
	    this.loading = false;

	    let summary = [];
	    for (let v in rep) {
		if (v != "All risks") {
		    rep[v].name = v;
		    rep[v].class = "normal";
		    summary.push(rep[v]);
		}
	    }
	    for (let v in rep) {
		if (v == "All risks") {
		    rep[v].name = v;
		    rep[v].class = "allrisks";
		    summary.push(rep[v]);
		}
	    }
	    this.summary = summary;*/
	});
    }

}

