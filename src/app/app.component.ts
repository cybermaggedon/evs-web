import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { WindowService, Window, windowFromValue } from './window.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Eventstream analytics';
    
    constructor(private route: ActivatedRoute,
                private window : WindowService,
                private router: Router) {
    }

    lastWindow : Window;

    ngOnInit() {

	this.lastWindow = windowFromValue(120);
	this.window.update(this.lastWindow);

	this.route.queryParams.subscribe(
	    params => {
		let window = params.window;
		if (window != undefined) {
		    this.setWindow(windowFromValue(window));
		}
	    }
	);

        this.window.subscribe(w => {
            if (w == undefined || w == this.lastWindow) {
		return;
	    }
	    
            this.router.navigate(
                [
                ],
                {
                    queryParams: { window: w.value },
                    relativeTo: this.route,
                    replaceUrl: true
                }
            );
            
        });

    }

    setWindow(w : Window) {
	if (w != this.lastWindow) {
            this.window.update(w);
	}

    }
    
}
