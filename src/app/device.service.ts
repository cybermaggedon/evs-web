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

export class DeviceThreats {
    threats : Map<string, Contact[]>;
};

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    constructor(private tgSvc : ThreatGraphService) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    getThreats(id : string, from : Date, to : Date, limit=25) :
    Observable<DeviceThreats> {

	let obs = new Observable<DeviceThreats>();

	const devicify = map((g : Graph) => {

	    let dt = new DeviceThreats();

	    let threats = new Map();

	    for (let elt of g.edges) {

		if (!threats.has(elt.group)) {
		    threats.set(elt.group, []);
		}

		let c = new Contact();
		c.id = elt.destination;
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
	

        return devicify(this.tgSvc.getDeviceThreats(id, from, to));

    }
    
}
