
// Event search service, abstracts searching using the events table providing
// for search terms to be passed around.

import { Injectable } from '@angular/core';
import { Window } from './window.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSearchService {

    // Subject provides for search terms to be bussed around.

    constructor() {
    }

}

