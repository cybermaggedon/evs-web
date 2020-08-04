
// Service provides access to forensic events on ElasticSearch.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchTerms } from './event-search-terms.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Window } from './window.service';

// This isn't used. FIXME:
export class Filter {
    fixme: string;
};

// Page information, partially used since we're not paging properly.
export class Page {
    from : number;
    to : number;
    size : number;
    data : Object[];
    total : number;
    pageNum : number;
    numPages : number;
};

// ElasticSearch service
@Injectable({
    providedIn: 'root'
})
export class ElasticSearchService {

    constructor(private http : HttpClient) { }

    // HTTP headers.
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // Hard-coded ES index name.
    index = "cyberprobe";

    // Parse a ES result _source document.
    parseSource(r : any) {

        // Map all _source fields across.
	let rtn = r;

        // Also add src/dest fields of the form ip:port.
	if ("src" in r && "dest" in r) {
	    const srcip = ("ipv4" in r["src"]) ? r["src"]["ipv4"][0] :
		  (("ipv6" in r["src"]) ? r["src"]["ipv6"][0] :
		   "-");
	    const destip = ("ipv4" in r["dest"]) ? r["dest"]["ipv4"][0] :
		  (("ipv6" in r["dest"]) ? r["dest"]["ipv6"][0] :
		   "-");
	    const srcport = ("tcp" in r["src"]) ? r["src"]["tcp"][0] :
		  (("udp" in r["src"]) ? r["src"]["udp"][0] :
		   "-");
	    const destport = ("tcp" in r["dest"]) ? r["dest"]["tcp"][0] :
		  (("udp" in r["dest"]) ? r["dest"]["udp"][0] :
		   "-");
	    const protocol = ("tcp" in r["src"]) ? "tcp" :
		  (("udp" in r["src"]) ? "udp" : "-");

	    rtn["src"] = `${srcip}:${srcport}`;
	    rtn["dest"] = `${destip}:${destport}`;
	    rtn["protocol"] = protocol;

	}

	return rtn;
	
    }

    // Parse ES search results.
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

    // Initiate an ES search.
    search(terms : SearchTerms, window : Window,
	   sort : string, sortAsc : boolean, filters : Filter[],
	   from : number, size : number) : Observable<Page>
    {

	if (terms.terms.length == 0) return;

        const start = `now-${window.value}h`;

	// FIXME: Filters not used.

        // Produce ElasticSearch query
	const qry = {
	    query: {
		bool: {
		    must: [
			{
			    multi_match: {
				query: terms.terms[0].value
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

        // Submit query, pipe through results parser.
	return this.http.post("/elasticsearch/" + this.index + "/_search",
			      JSON.stringify(qry),
			      this.httpOptions).
            pipe(map(r => this.parseResults(r, from, size)));

    };

}

