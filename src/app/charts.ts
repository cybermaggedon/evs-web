
import { getCurrencySymbol, formatCurrency } from '@angular/common';

export function currencyTick(value, symbol) {
    
    if (value >= 1000000000000) {
	return symbol + (value / 1000000000000).toFixed(1) + 'T';
    }
    if (value >= 1000000000) {
	return symbol + (value / 1000000000).toFixed(1) + 'B';
    }
    if (value >= 1000000) {
	return symbol + (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
	return symbol + (value / 1000).toFixed(1) + 'k';
    }
    
    return symbol + value;
}

export function toxy(ds) {
    var data = [];
    for (let v in ds) {
	var datum = ds[v];
	data.push({x:datum[0], y:datum[1]});
    }
    return data;
}

