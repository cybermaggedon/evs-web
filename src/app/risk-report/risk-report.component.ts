import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'risk-report',
    templateUrl: './risk-report.component.html',
    styleUrls: ['./risk-report.component.scss']
})
export class RiskReportComponent implements OnInit {
    
    constructor() { }
    
    @Input('kind')
    kind : String;
    
    ngOnInit(): void {
    }
    
}


