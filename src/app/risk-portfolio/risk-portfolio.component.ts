import { Component, OnInit, Input } from '@angular/core';

import { Asset } from '../risk';

@Component({
  selector: 'risk-portfolio',
  templateUrl: './risk-portfolio.component.html',
  styleUrls: ['./risk-portfolio.component.scss']
})
export class RiskPortfolioComponent implements OnInit {

    constructor() { }

    @Input("portfolio")
    portfolio : Asset[];

    @Input('max-items')
    maxItems : number = 20;

    ngOnInit(): void {
    }

}

