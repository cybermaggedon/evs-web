import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Window {
    constructor(value : number, earliest : Date) {
        this.value = value; this.earliest = earliest;
    }
    value : number;
    earliest : Date;
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    subject : Subject<Window>;

    constructor(
    ) {
        this.subject = new Subject<Window>();
    }

    lastValue : Window;

    update(value : Window) : void {
        this.lastValue = value;
        this.subject.next(value);
    }

    subscribe(f : any) {
        this.subject.subscribe(f);

        // Give subscribers last value.
	if (this.lastValue != undefined)
	    f(this.lastValue);
    }

}

