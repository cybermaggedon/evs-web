import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'risk-configuration-filter',
    templateUrl: 'risk-configuration-filter.component.html',
    styleUrls: ['risk-configuration-filter.component.scss'],
})
export class RiskConfigurationFilterComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    filters: string[] = [];

    @Output("filter") filter = new EventEmitter<string[]>();

    add(event: MatChipInputEvent): void {

	const input = event.input;
	const value = event.value;

	// Add our filter
	if ((value || '').trim()) {
	    this.filters.push(value.trim());
	}
	
	// Reset the input value
	if (input) {
	    input.value = '';
	}

	this.filter.emit(this.filters);

    }

    remove(filter: string): void {
	const index = this.filters.indexOf(filter);

	if (index >= 0) {
	    this.filters.splice(index, 1);
	}

	this.filter.emit(this.filters);

    }
}

