import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { WindowService, Window, windowFromValue } from './window.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    
    constructor(private route: ActivatedRoute,
                private window : WindowService,
                private router: Router) {
    }

    // Value of last window update
    lastWindow : Window;

    ngOnInit() {

        // Kick off push slider value at 120.  This may later be overridden
        // by handling of the query parameter.
	this.lastWindow = windowFromValue(120);
	this.window.update(this.lastWindow);

        // Subscribe to  the router's queryParams observable and
        // receive parameter changes.
	this.route.queryParams.subscribe(
	    params => {

                // If window parameter is discovered, initiate a window change.
		let window = params.window;
		if (window != undefined) {
		    this.setWindow(windowFromValue(window));
		}

	    }
	);

        // The window service provides access to slider values, and
        // abstracts the sliders.  Subscribe and handle slider changes.
        this.window.subscribe(w => {

            if (w == undefined || w == this.lastWindow) {
		return;
	    }

	    // On slider change, inform the router so that the browser URL
            // changes.  This doesn't implement a change, just makes sure that
            // the browser has a URL which would bring back to the current
            // view.
            this.router.navigate(
                [
                ],
                {
                    queryParams: { window: w.value },
		    preserveFragment: true,
                    relativeTo: this.route,
                    replaceUrl: true
                }
            );
            
        });

    }

    // Handle pushing a window change.  This only results in action if
    // the value is different from the last value we pushed.
    // FIXME: lastWindow is only set in constructor.
    setWindow(w : Window) {
	if (w != this.lastWindow) {
            this.window.update(w);
	}

    }
    
}
