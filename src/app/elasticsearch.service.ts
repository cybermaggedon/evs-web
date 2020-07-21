import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchTerms } from './event-search.service';
import { map } from 'rxjs/operators';
import { Window } from './window.service';

@Injectable({
    providedIn: 'root'
})
export class ElasticSearchService {

    constructor(private http : HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    index = "cyberprobe";

    parseResults(r : any) : any {
	let e = [];
	if ("hits" in r) {
	    let res : Object[] = r["hits"]["hits"];
	    for (let r of res) {
		const source = r["_source"];
		e.push(source);
	    }
	}
	console.log(e);
	return e;
    };

    search(terms : SearchTerms, window : Window) {

	const start = 'now-' + window.value + 'h';

	const qry = {
	    query: {
		bool: {
		    must: [
			{
			    multi_match: {
				query: terms.id
			    }
			},
			{
			    range: {
				time: {
				    // FIXME: Use window
				    gte: start,
				    lt: 'now'
				}
			    }
			}
		    ]
		}
	    },
	    sort: [
		{ time: { order: "desc" } }
	    ]
	};

//	console.log(qry);

	let obs = this.http.post("/elasticsearch/" + this.index + "/_search",
				 JSON.stringify(qry),
				 this.httpOptions);

	const parse = map(r => this.parseResults(r));

	return parse(obs);

    };

}

