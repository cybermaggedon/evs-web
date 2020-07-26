
export function currencyTick(value, index, values) {

    if (value > 1000000000000){
	return '$' + (value / 1000000000000).toFixed(1) + 'T';
    }
    if (value > 1000000000){
	return '$' + (value / 1000000000).toFixed(1) + 'B';
    }
    if (value > 1000000){
	return '$' + (value / 1000000).toFixed(1) + 'M';
    }
    if (value > 1000){
	return '$' + (value / 1000).toFixed(1) + 'k';
    }
    
    return '$' + value;
}

export function toxy(ds) {
    var data = [];
    for (let v in ds) {
	var datum = ds[v];
	data.push({x:datum[0], y:datum[1]});
    }
    return data;
}

