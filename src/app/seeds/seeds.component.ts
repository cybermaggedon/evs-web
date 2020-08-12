import { Component, OnInit, Input } from '@angular/core';

import { Seed } from '../seed';

@Component({
  selector: 'seeds',
  templateUrl: './seeds.component.html',
  styleUrls: ['./seeds.component.scss']
})
export class SeedsComponent implements OnInit {

    @Input("seeds")
    seeds : Seed[] = [];

    constructor() { }

    ngOnInit(): void {
    }

}
