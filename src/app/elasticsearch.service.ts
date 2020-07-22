import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchTerms } from './event-search.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Window } from './window.service';

export class Filter {
    fixme: string;
};

export class Page {
    from : number;
    to : number;
    size : number;
    data : Object[];
    total : number;
    pageNum : number;
    numPages : number;
};

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

	if ("src" in r && "dest" in r) {
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

	    rtn["src"] = `${srcip}:${srcport}`;
	    rtn["dest"] = `${destip}:${destport}`;
	    rtn["protocol"] = protocol;

	}

	return rtn;
	
    }

    parseResults(r : any, from : number, size : number) : Page {

	let e = [];

	if ("hits" in r) {
	    let res : Object[] = r["hits"]["hits"];
	    for (let r of res) {
		e.push(this.parseSource(r["_source"]));
	    }
	}
	
	return {
	    from: from, size: size, to: from + size,
	    total: r.hits.total.value,
	    pageNum: Math.ceil(from / size),
	    numPages: Math.ceil(r.hits.total.value / size),
	    data: e
	};
    };

    search(terms : SearchTerms, window : Window,
	   sort : string, sortAsc : boolean, filters : Filter[],
	   from : number, size : number) : Observable<Page> {

	const start = `now-${window.value}h`;

	// FIXME: Filters not used.
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
				    gte: start,
				    lt: 'now'
				}
			    }
			}
		    ]
		}
	    },
	    from: from, size: size,
	    sort: [
		{ [sort]: { order: (sortAsc ? "asc" : "desc") } }
	    ]
	};

	console.log(qry);

	let obs = this.http.post("/elasticsearch/" + this.index + "/_search",
				 JSON.stringify(qry),
				 this.httpOptions);

	const parse = map(r => this.parseResults(r, from, size));

	return parse(obs);

    };

}

