import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Graph, toGraph } from './graph';
import { ThreatGraphService } from './threat-graph.service';
import { map } from 'rxjs/operators';

export class Contact {
    id : string;
    age : Date;
};

export class Threats {
    threats : Map<string, Contact[]>;
};

@Injectable({
    providedIn: 'root'
})
export class ThreatService {

    constructor(private tgSvc : ThreatGraphService) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    getThreats(id : string, from : Date, to : Date, limit=25) :
    Observable<Threats> {

	let obs = new Observable<Threats>();

	const devicify = map((g : Graph) => {

	    let dt = new Threats();

	    let threats = new Map();

	    for (let elt of g.edges) {

		if (!threats.has(elt.group)) {
		    threats.set(elt.group, []);
		}

		let c = new Contact();

		if (elt.source == id)
		    c.id = elt.destination;
		else
		    c.id = elt.source;
		c.age = elt.earliest;

		threats.get(elt.group).push(c);

	    }

	    for (let kind of threats.keys()) {
		threats.get(kind).sort((a, b) => b.age - a.age);
		threats.set(kind, threats.get(kind).slice(0, limit));
	    }

	    dt.threats = threats;

	    return dt;

	});
	

        return devicify(this.tgSvc.getThreats(id, from, to));

    }
    
}
