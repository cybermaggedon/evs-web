import {
    Component, OnInit, ViewChild, ElementRef
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import * as d3 from 'd3';

import { nameToCssClass } from '../risk';
import { ThreatModelService, ThreatModel } from '../threat-model.service';
import {
    ThreatModelEditorComponent
} from '../threat-model-editor/threat-model-editor.component';

@Component({
    selector: 'threat-model',
    templateUrl: './threat-model.component.html',
    styleUrls: ['./threat-model.component.scss']
})
export class ThreatModelComponent implements OnInit {

id : string = "hello";

    @ViewChild(ThreatModelEditorComponent) editor: ThreatModelEditorComponent;

    ngOnInit() {
    }

    createActor() {
    console.log("CREATE ACTOR (outer)");
    this.editor.createActor();
    /*
	const point = [100, 100];
	// const point = d3.mouse(this);
	const node = { id: ++this.lastNodeId, reflexive: false, x: point[0], y: point[1] };
	this.nodes.push(node);

	this.restart();
	*/
    }

}

