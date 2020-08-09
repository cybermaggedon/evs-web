import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowService, Window } from '../window.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                private window : WindowService,
                private router: Router) {
        
    }

    setSlider(value : number) {
        const hour = 1000 * 60 * 60;
        const now = new Date();
        const thence = new Date(now.getTime() - hour * value);
        this.window.update(new Window(value, thence));

    }

    ngOnInit() : void {

/*
        this.route.queryParams.subscribe(
            params => {
                const window = params.window;
                if (window == undefined) {
                    // Const?!
                    this.setSlider(120);
                } else {
                    this.setSlider(window);
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
*/
    }

}

