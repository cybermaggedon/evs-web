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

    parseSource(r : any) {
	let rtn = r;

	const srcip = ("ipv4" in r["src"]) ? r["src"]["ipv4"][0] :
	      (("ipv6" in r["src"]) ? r["src"]["ipv6"][0] :
	       undefined);
	const destip = ("ipv4" in r["dest"]) ? r["dest"]["ipv4"][0] :
	      (("ipv6" in r["dest"]) ? r["dest"]["ipv6"][0] :
	       undefined);
	const srcport = ("tcp" in r["src"]) ? r["src"]["tcp"][0] :
	      (("udp" in r["src"]) ? r["src"]["udp"][0] :
	       undefined);
	const destport = ("tcp" in r["dest"]) ? r["dest"]["tcp"][0] :
	      (("udp" in r["dest"]) ? r["dest"]["udp"][0] :
	       undefined);
	const protocol = ("tcp" in r["src"]) ? "tcp" :
	      (("udp" in r["src"]) ? "udp" : undefined);

	rtn["srcip"] = srcip;
	rtn["destip"] = destip;
	rtn["srcport"] = srcport;
	rtn["destport"] = destport;
	rtn["protocol"] = protocol;

	return rtn;
    }

    parseResults(r : any) : any {

	let e = [];

	if ("hits" in r) {
	    let res : Object[] = r["hits"]["hits"];
	    for (let r of res) {
		e.push(this.parseSource(r["_source"]));
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

