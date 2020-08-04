
// Service provides access to forensic events on ElasticSearch.
import { Injectable } from '@angular/core';
import { SearchTerms } from './event-search-terms.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Window } from './window.service';
import { ElasticSearchService } from './elasticsearch.service';

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
export class EventSearchService {

    constructor(private esSvc : ElasticSearchService) { }

    // Hard-coded ES index name.
    index = "cyberprobe";

    flatten(data) : any {

        var result = {};

	function recurse (cur, prop) {
	    if (Object(cur) !== cur) {
		result[prop] = cur;
	    } else if (Array.isArray(cur)) {
                result[prop] = cur.join(",");
	    } else {
		var isEmpty = true;
		for (var p in cur) {
		    isEmpty = false;
		    recurse(cur[p], prop ? prop + "-" + p : p);
		}
		if (isEmpty && prop)
		    result[prop] = {};
	    }
	}

	recurse(data, "");

	return result;

    }

    // Parse a ES result _source document.

    parseSource(r : any) {

        // Map all _source fields across.
	let rtn = this.flatten(r);
	rtn["time"] = new Date(rtn["time"]);
	console.log(rtn);
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
//	    _source: [
//		"src.ipv4,src.tcp,src.udp,dest.ipv4,device,network,time,action"
//	    ],
	    sort: [
		{ [sort]: { order: (sortAsc ? "asc" : "desc") } }
	    ]
	};

        // Submit query, pipe through results parser.
	return this.esSvc.post(this.index + "/_search", qry).
            pipe(map(r => this.parseResults(r, from, size)));

    };

}

