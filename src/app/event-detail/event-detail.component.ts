import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  constructor() { }

  @Input("row")
  row : { key : string, value : string}[];

  ngOnInit(): void {
  }

}
