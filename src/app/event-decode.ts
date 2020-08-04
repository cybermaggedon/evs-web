
// Page information, partially used since we're not paging properly.
export class Page {
    from : number;
    to : number;
    size : number;
    data : Object[];
    total : number;
    pageNum : number;
    numPages : number;
};

export class Event {
    [field : string] : string;
};

export function flattenESEvent(data) : Event {

    var result = {};

    function recurse (cur, prop) {
	if (Object(cur) !== cur) {
	    result[prop] = cur;
	} else if (Array.isArray(cur)) {
            result[prop] = cur.join(",");
	} else {
	    var isEmpty = true;
	    for (var p in cur) {
		isEmpty = false;
		recurse(cur[p], prop ? prop + "." + p : p);
	    }
	    if (isEmpty && prop)
		result[prop] = {};
	}
    }
    
    recurse(data, "");

    return result;

}
  
// Parse a ES result _source document.
export function parseESSource(r : any) {

    // Map all _source fields across.
    let rtn = flattenESEvent(r);
    //	rtn["time"] = new Date(rtn["time"]);
    return rtn;
	
}

    // Parse ES search results.
export function parseESResults(r : any, from : number, size : number) : Page {

    let d = [];

    if ("hits" in r) {
	let res : Object[] = r["hits"]["hits"];
	for (let r of res) {
	    d.push(parseESSource(r["_source"]));
	}
    }
	
    return {
	from: from, size: size, to: from + size,
	total: r.hits.total.value,
	pageNum: Math.ceil(from / size),
	numPages: Math.ceil(r.hits.total.value / size),
	data: d
    };
};
