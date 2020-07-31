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
	    description: "email threats",
	    risks: [
		{ id: "tor-exit", score: 0.5 },
		{ id: "malware", score: 0.2 },
		{ id: "credential-theft", score: 0.2 },
	    ]
	},
	{
	    id: "gsuite-threat-auth",
	    description: "auth threats",
	    risks: [ {
		    id: "tor-exit", score: 0.8
	    } ]
	},
	{
	    id: "research-threat",
	    description: "IP threats",
	    risks: [
		{ id: "tor-exit", score: 0.2 }
	    ]
	},
	{
	    id: "office-threat",
	    description: "network threats",
	    risks: [
	    ]
	},
	{
	    id: "payment-threat",
	    description: "fraud threats",
	    risks: [
		{ id: "credential-theft", score: 0.1 },
	    ]
	},
	{
	    id: "prod-threat",
	    description: "integrity threats",
	    risks: [
	    ]
	},
	{
	    id: "it-threat",
	    description: "device threats",
	    risks: [
	    ]
	}
    ];

    nameToCssClass = nameToCssClass;

}

