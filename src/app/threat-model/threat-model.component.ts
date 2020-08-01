import { Component, OnInit } from '@angular/core';
import { nameToCssClass } from '../risk';
import { ThreatModelService, ThreatModel } from '../threat-model.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-threat-model',
  templateUrl: './threat-model.component.html',
  styleUrls: ['./threat-model.component.css']
})
export class ThreatModelComponent implements OnInit {

    threats : ThreatModel;

    selectedTabIndex : number;
    
    constructor(private threatModelService : ThreatModelService,
		private route : ActivatedRoute) {

	threatModelService.subscribe(tm => {
	    this.threats = tm;
	});

	this.route.fragment.subscribe(f => {
	    if (f == "overview")
		this.selectedTabIndex = 0;
	    if (f == "prod")
		this.selectedTabIndex = 1;
	});

    }

    ngOnInit(): void {
    }

    nameToCssClass = nameToCssClass;

    viewProd() {
	this.selectedTabIndex = 1;
    }

}

