import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { nameToCssClass } from '../risk';
import { ThreatModelService, ThreatModel } from '../threat-model.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-threat-model',
  templateUrl: './threat-model.component.html',
  styleUrls: ['./threat-model.component.css']
})
export class ThreatModelComponent implements OnInit {

    threats : ThreatModel;

    _selectedTabIndex : number;

    get selectedTabIndex() { return this._selectedTabIndex; }
    
    set selectedTabIndex(n : number) {
	this._selectedTabIndex = n;

	if (n == 0) {
            this.router.navigate(
		["/threat-model", "overview"],
		{
		    queryParamsHandling: "preserve",
                    relativeTo: this.route,
                    replaceUrl: false
		}
            );
	}

	if (n == 1) {
            this.router.navigate(
		["/threat-model", "prod"],
		{
		    queryParamsHandling: "preserve",
                    relativeTo: this.route,
                    replaceUrl: false
		}
            );
	}

    }

    name : string;
    
    constructor(private threatModelService : ThreatModelService,
		private location: Location,
		private route : ActivatedRoute,
		private router : Router) {

	threatModelService.subscribe(tm => {
	    this.threats = tm;
	});

  	this.route.params.subscribe(res => {
	    if (res.name == "overview")
		this.selectedTabIndex = 0;
	    if (res.name == "prod")
		this.selectedTabIndex = 1;
	})

    }

    ngOnInit(): void {
    }

    nameToCssClass = nameToCssClass;

    viewProd() {
	this.selectedTabIndex = 1;
    }

    goBack(): void {
	this.location.back();
    }

}

