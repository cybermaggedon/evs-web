import { Component, OnInit } from '@angular/core';
import { nameToCssClass } from '../risk';
import { ThreatModelService, ThreatModel } from '../threat-model.service';

@Component({
  selector: 'app-threat-model',
  templateUrl: './threat-model.component.html',
  styleUrls: ['./threat-model.component.css']
})
export class ThreatModelComponent implements OnInit {

    threats : ThreatModel;
    
    constructor(private threatModelService : ThreatModelService) {

	threatModelService.subscribe(tm => {
	    this.threats = tm;
	});

    }

    ngOnInit(): void {
    }

    nameToCssClass = nameToCssClass;

}

