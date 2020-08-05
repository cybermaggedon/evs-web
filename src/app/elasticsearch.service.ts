
// Service provides access to forensic events on ElasticSearch.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

    // Submit query, pipe through results parser.
    post(url : string, request : any) : any {

	return this.http.post("/elasticsearch/" + url, 
			      JSON.stringify(request),
			      this.httpOptions);

    };

}

