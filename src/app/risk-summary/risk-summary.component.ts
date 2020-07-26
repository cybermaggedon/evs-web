import { Component, OnInit, Input, Inject, LOCALE_ID } from '@angular/core';

import { FairService } from '../fair.service';

@Component({
  selector: 'risk-summary',
  templateUrl: './risk-summary.component.html',
  styleUrls: ['./risk-summary.component.css']
})
export class RiskSummaryComponent implements OnInit {

    constructor(private fairSvc : FairService,
                @Inject(LOCALE_ID) private locale: string) {
    }

    @Input('kind')
    kind : String;

    summary : Object[] = [];

    ngOnInit(): void {
	this.fairSvc.subscribe(this.kind + '-summary', rep => {

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
	    this.summary = summary;
	    console.log(this.summary);
	});
    }

}

