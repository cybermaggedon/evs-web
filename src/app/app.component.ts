import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowService, Window } from './window.service';

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

    ngOnInit() {

        this.route.queryParams.subscribe(
            params => {
                const window = params.window;
                if (window == undefined) {
		    // Do nothing, slider initialises with 120 value.
                } else {
                    this.setSlider(parseInt(window));
                }
            });
	
        this.window.subscribe(w => {
            if (w == undefined) return;
	    
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

    setSlider(value : number) {
        const hour = 1000 * 60 * 60;
        const now = new Date();
        const thence = new Date(now.getTime() - hour * value);
        this.window.update(new Window(value, thence));

    }
    
}
