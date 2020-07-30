import { Component, OnInit } from '@angular/core';
import { nameToCssClass } from '../risk';

@Component({
  selector: 'app-threat-model',
  templateUrl: './threat-model.component.html',
  styleUrls: ['./threat-model.component.css']
})
export class ThreatModelComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    threats = {
	"gsuite-threat-email": {
	    threats: [
		{
		    id: "malware",
		    score: 0.3
		},
		{
		    id: "credential-theft",
		    score: 0.2
		}
	    ]
	},
	"gsuite-threat-auth": {
	    threats: [
		{
		    id: "tor-exit",
		    score: 0.8
		}
	    ]
	}
    };

    nameToCssClass = nameToCssClass;

}

