
// Risk graph service, periodically downloads the entire risk graph
// (it's a small graph, this is manageable)

import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { Edge, Entity, Graph, toGraph } from './graph';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RiskGraphService {

    subject : Subject<Graph>;

    constructor(
        private http : HttpClient
    ) {
        this.subject = new Subject<Graph>();
        timer(0, 10000).subscribe(g => {
            this.subject.next(toGraph(g));
        });
    }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    graph : Graph;

    update() : void {

	// Get risk graph from Gaffer.
	
	const request = {
	    "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
	};

	this.http.post("/risk-graph/rest/v2/graph/operations/execute",
		       request,
		       this.httpOptions).subscribe(g => {
			   this.subject.next(toGraph(g));
		       });

    }

    subscribe(f : any) {
        this.subject.subscribe(f);
    }

}
