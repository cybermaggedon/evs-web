
// Window service, abstracts the window sliders, distributing slider updates.
// This potentially permits multiple sliders, and multiple sources of updates

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// A slider update emits a window.  The window contains the raw slider value
// (hours duration) and an absolute date value.
export class Window {
    constructor(value : number, earliest : Date) {
        this.value = value; this.earliest = earliest;
    }
    value : number;
    earliest : Date;
}

// Create a window from an hours value.
export function windowFromValue(value : number) : Window {
    let then = new Date(new Date().getTime() - value * 3600 * 1000);
    return new Window(value, then);
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    // Subject used to push Window updates
    subject : Subject<Window>;

    constructor(
    ) {
        this.subject = new Subject<Window>();
    }

    // We keep the last value pushed out so that new subscribers can be
    // given it.
    lastValue : Window;

    // Push a new window update
    update(value : Window) : void {
	if (this.lastValue == undefined || value != this.lastValue) {
            this.lastValue = value;
            this.subject.next(value);
	}
    }

    // Subscribe to window updates.
    subscribe(f : any) {
        this.subject.subscribe(f);

        // Give subscribers last value.
	if (this.lastValue != undefined) {
	    f(this.lastValue);
	}
    }
    
}

