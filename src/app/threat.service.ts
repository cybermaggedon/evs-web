
// Threat service provides simpler abstraction of threat graph.

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Graph, toGraph } from './graph';
import { ThreatGraphService } from './threat-graph.service';
import { Seed } from './seed';
import { Window } from './window.service';

// Describes a threat contact.
export class Contact {
    id : string;
    age : Date;
};

// Threats, threat contacts grouped by kind.
export class Threats {
    threats : Map<string, Contact[]>;

    refineSeeds(window : Window, kinds : string[]) :
    {seeds : Seed[], count : number} {

	let thr = [];
	let count = 0;
	
	for (let kind of kinds) {
	    if (this.threats.has(kind)) {
		for (let threat of this.threats.get(kind)) {
		    if (threat.age < window.earliest) continue;
		    thr.push({
			kind: kind,
			id: threat.id,
			age: threat.age
		    });
		    count++;
		}
	    }
	}

	return {seeds: thr, count: count};

    };



};

@Injectable({
    providedIn: 'root'
})
export class ThreatService {

    constructor(private tgSvc : ThreatGraphService) { }

    groupThreatEdges(g : Graph, id : string, limit : number) : Threats {

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

    }

    groupThreatEntities(g : Graph, limit : number) : Threats {

	let dt = new Threats();  

	let threats = new Map();

	for (let elt of g.entities) {

	    if (!threats.has(elt.group)) {
		threats.set(elt.group, []);
	    }

	    let c = new Contact();

	    c.id = elt.vertex;
	    c.age = elt.earliest;

	    threats.get(elt.group).push(c);

	}

	for (let kind of threats.keys()) {
	    threats.get(kind).sort((a, b) => b.age - a.age);
	    threats.set(kind, threats.get(kind).slice(0, limit));
	}

	dt.threats = threats;

	return dt;

    }

    // Async threat fetch.  Given a seed, find all threatgraph
    // relationships in a time period.
    getThreats(id : string, from : Date, to : Date, limit=25) :
    Observable<Threats> {
	
        return this.tgSvc.getThreats(id, from, to).
            pipe(map(g => this.groupThreatEdges(g, id, limit)));

    }

    // Async threat fetch.  Recent threats in time period.
    getAllThreats(from : Date, to : Date, limit=25) :
    Observable<Threats> {
	
        return this.tgSvc.getAllThreats(from, to).
            pipe(map(g => this.groupThreatEntities(g, limit)));

    }
    
}
