import { Component, OnInit, Inject,  LOCALE_ID, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { WindowService, Window } from '../window.service';
@Component({
    selector: 'slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

    constructor(private window : WindowService,
                @Inject(LOCALE_ID) private locale: string) {

        //FIXME: Const.  Hopefully this value gets over-ridden by the
        // subscription to the service.
        this.sliderValue = 0;

    }

    ngOnInit(): void {

        // Receive notifications.  This helps keep all sliders in sync,
        // Snag is, we don't want to take notice of our own events.
        this.window.subscribe(w => {
            if (w.value != this.sliderValue) {
                this.sliderValue = w.value;
            }
        });

    }

    // Format the time slider, displays time period in hours/days.
    formatHours(value: number) : string {
        if (value < 48) {
            return value + 'h';
        } else if (value < 24 * 7) {
            return (value / 24).toFixed(1) + 'd';
        } else {
            return (value / (24 * 7)).toFixed(1) + 'w';
        }
    }

    // Converts hours elapsed to an absolute date string.
    sliderTime(x : number) : string{
        const now = new Date();
        const thence = new Date(now.getTime() - 1000 * 60 * 60 * x);
        return formatDate(thence, 'dd/MM/yyyy hh:mm', this.locale);
    }

    @Input('slider-value')
    sliderValue : number;

    // Receives reports of slider change.
    sliderChange(value : number) : void {
        const hour = 1000 * 60 * 60;
        const now = new Date();
        const thence = new Date(now.getTime() - hour * value);
        this.window.update(new Window(value, thence));
    }

}

