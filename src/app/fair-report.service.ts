import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FairReportService {

    constructor(private http : HttpClient) {
    }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    get(report_type : string, model : any) : any {

	let enc = encodeURIComponent(JSON.stringify(model));

	var url = `/fair/${model.name}?report=${report_type}&model=${enc}`;

	return this.http.get(url);

    }

}
