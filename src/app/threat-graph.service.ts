
// Threat graph service.  Executes queries against threat graph, returning
// results as observations.

import { Injectable } from '@angular/core';
import { Edge, Entity, Graph } from './graph';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toGraph } from './graph';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThreatGraphService {

    constructor(
        private http : HttpClient
    ) { }

    // HTTP headers.
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // Gaffer REST endpoint
    rest = "/threat-graph/rest/v2";

    // Execute a Gaffer query for threats
    getThreats(id : string, from : Date, to : Date) :
    Observable<Graph> {

        // Query predicates, searches on the basis that observations occur
        // in a time period.  Such a restriction is useful because the
        // graph can be quite big.
	const predicates = [
	    {
		"selection" : [ "time" ],
		"predicate" : {
		    "class" : "RBMBackedTimestampSetInRange",
		    "startTime" : from.getTime(),
		    "endTime" : to.getTime(),
		    "timeUnit": "MILLISECOND"
		}
            }
        ];

        // Construct the request.  GetElements gets all edges from the
        // search seed, filtering out those which don't occur within our
        // time window.
	const request = {
	    "class" : "OperationChain",
	    "operations" : [
  		{
		    "class": "GetElements",
		    "includeIncomingOutGoing": "EITHER",
		    "input": [
			{
			    "class": "EntitySeed",
			    "vertex": id
			}
		    ],
		    "view": {
			"globalEdges": [
			    {
				"postAggregationFilterFunctions": predicates
			    }
			]
		    }
		}
	    ]
	};

        // Execute query, pipe results through converstion to simple
        // graph structure.
        return this.http.post(this.rest + "/graph/operations/execute",
		       JSON.stringify(request),
		       this.httpOptions).
                pipe(map(g => toGraph(g)));

    }

    // Execute a Gaffer query for threats
    getAllThreats(from : Date, to : Date, limit : number = 500) :
    Observable<Graph> {

        // Query predicates, searches on the basis that observations occur
        // in a time period.  Such a restriction is useful because the
        // graph can be quite big.
	const predicates = [
	    {
		"selection" : [ "time" ],
		"predicate" : {
		    "class" : "RBMBackedTimestampSetInRange",
		    "startTime" : from.getTime(),
		    "endTime" : to.getTime(),
		    "timeUnit": "MILLISECOND"
		}
            }
        ];

        // Construct the request.  GetElements gets all edges from the
        // search seed, filtering out those which don't occur within our
        // time window.
	const request = {
	    "class" : "OperationChain",
	    "operations" : [
  		{
		    "class": "GetAllElements",
		    "includeIncomingOutGoing": "EITHER",
		    "view": {
			"globalEdges": [
			    {
				"postAggregationFilterFunctions": predicates
			    }
			]
		    }
		},
		{
		    "class": "Limit",
		    "resultLimit": limit
		}
	    ]
	};

        // Execute query, pipe results through converstion to simple
        // graph structure.
        return this.http.post(this.rest + "/graph/operations/execute",
		       JSON.stringify(request),
		       this.httpOptions).
                pipe(map(g => toGraph(g)));

    }

}

