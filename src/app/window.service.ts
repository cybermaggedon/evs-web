import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Window {
    constructor(value : number, earliest : Date) {
        this.value = value; this.earliest = earliest;
    }
    value : number;
    earliest : Date;
}

export function windowFromValue(value : number) : Window {
    let then = new Date(new Date().getTime() - value * 3600 * 1000);
    return new Window(value, then);
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    subject : Subject<Window>;

    constructor(
    ) {
        this.subject = new Subject<Window>();
	this.lastValue = undefined;
    }

    lastValue : Window;

    update(value : Window) : void {
	if (this.lastValue == undefined || value != this.lastValue) {
            this.lastValue = value;
            this.subject.next(value);
	}
    }

    subscribe(f : any) {
        this.subject.subscribe(f);

        // Give subscribers last value.
	if (this.lastValue != undefined) {

	    f(this.lastValue);
	}
    }
    
}

