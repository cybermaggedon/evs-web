import {
    Component, OnInit, AfterContentInit, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import * as d3 from 'd3';

import { GraphCreator } from './graph-creator';

@Component({
    selector: 'threat-model-editor',
    templateUrl: './threat-model-editor.component.html',
    styleUrls: ['./threat-model-editor.component.scss']
})
export class ThreatModelEditorComponent implements OnInit, AfterContentInit, AfterViewInit {

    width = 960;
    height = 600;

    svg : any;
    graph : any;

    @ViewChild('graphContainer') graphContainer: ElementRef;

    ngOnInit() {
    }

    ngAfterContentInit() {
    }

    ngAfterViewInit() {

	const rect = this.graphContainer.nativeElement.getBoundingClientRect();
	this.width = rect.width;

	this.svg = d3.select('#graphContainer')
            .attr('oncontextmenu', 'return false;')
            .attr('width', this.width)
            .attr('height', this.height);

	var xLoc = this.width / 2;
	var yLoc = this.height / 2;
	var nodes = [{title: "new concept", id: 0, x: xLoc, y: yLoc},
		     {title: "new concept", id: 1, x: xLoc, y: yLoc + 200}];
	var edges = [{source: nodes[1], target: nodes[0]}];
	
	this.graph = new GraphCreator(this.svg, nodes, edges);

	this.graph.setIdCt(2);
	this.graph.updateGraph();
	
    }


    // update graph (called when needed)
    update() {

    }
    
    createActor() {

    }

}

