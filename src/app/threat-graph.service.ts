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

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    edges : Edge[];
    entities : Entity[];

    rest = "/threat-graph/rest/v2";

    getThreats(id : string, from : Date, to : Date) :
    Observable<Graph> {

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

	const graphify = map(g => toGraph(g));

        let obs = this.http.post(this.rest + "/graph/operations/execute",
				 JSON.stringify(request),
				 this.httpOptions);
	return graphify(obs);

    }

}

