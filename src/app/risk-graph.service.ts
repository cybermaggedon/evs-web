import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Edge, Entity, Graph, toGraph } from './graph';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RiskGraphService {

    running : boolean;
    subject : Subject<Graph>;

    constructor(
        private http : HttpClient
    ) {
	this.running = false;
        this.subject = new Subject<Graph>();
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

	var that = this;
	setTimeout(function() { that.update() }, 10000);

    }

    subscribe(f : any) {
        if (!this.running) {
            this.running = true;
            // This is asynchronous.
            this.update();
        }
        this.subject.subscribe(f);
    }

}
