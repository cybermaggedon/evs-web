import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-category-detail',
    templateUrl: './category-detail.component.html',
    styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

    constructor(private route: ActivatedRoute,
		private location: Location) { }

    id : string;

    ngOnInit(): void {
	this.id = this.route.snapshot.paramMap.get('id');
    }

    goBack(): void {
	this.location.back();
    }

}
