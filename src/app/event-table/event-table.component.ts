import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventSearchService, SearchTerms } from '../event-search.service';
import { WindowService, Window } from '../window.service';

@Component({
    selector: 'event-table',
    templateUrl: './event-table.component.html',
    styleUrls: ['./event-table.component.css']
})
export class EventTableComponent implements OnInit {

    constructor(private http : HttpClient,
		private eventSearch : EventSearchService,
		private windowService : WindowService) {
    }

    terms : SearchTerms;
    window : Window;

    ngOnInit(): void {

	this.eventSearch.subscribe(s => {
	    this.terms = s;
	    this.updateEs();
	});

	this.windowService.subscribe(w => {
	    this.window = w;
	    this.updateEs();
	});
    }

    esData : any;

    updateEs() {

	if (this.terms == undefined) return;
	if (this.window == undefined) return;

	const start = 'now-' + this.window.value + 'h';

	console.log(start);

	const qry = {
	    query: {
		bool: {
		    must: [
			{
			    multi_match: {
				query: this.terms.id
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

	console.log(qry);

	const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};

	const index = "cyberprobe";
	this.http.post("/elasticsearch/" + index + "/_search",
		       JSON.stringify(qry),
		       httpOptions).subscribe((r : Object) => {
			   let e = [];
			   if ("hits" in r) {
			       let res : Object[] = r["hits"]["hits"];
			       for (let r of res) {
				   let s = r["_source"];
				   e.push({
				       id: s["id"],
				       device: s["device"],
				       action: s["action"],
				       time: s["time"],
				   });
			       }


			   }
			   this.esData = e;
			   console.log(this.esData);
		       });

    }

}
