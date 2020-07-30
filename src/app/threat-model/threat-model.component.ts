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

    threats = [
	{
	    id: "gsuite-threat-email",
	    risks: [
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
	{
	    id: "gsuite-threat-auth",
	    risks: [
		{
		    id: "tor-exit",
		    score: 0.8
		}
	    ]
	},
	{
	    id: "research-threat",
	    risks: [
		{
		    id: "tor-exit",
		    score: 0.2
		}
	    ]
	},
	{
	    id: "office-threat",
	    risks: [
	    ]
	},
	{
	    id: "payment-threat",
	    risks: [
	    ]
	},
	{
	    id: "prod-threat",
	    risks: [
	    ]
	},
	{
	    id: "it-threat",
	    risks: [
	    ]
	}
    ];

    nameToCssClass = nameToCssClass;

}

