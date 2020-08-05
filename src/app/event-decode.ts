
export interface Event {
    [field : string] : string;
};

// Page information, partially used since we're not paging properly.
export interface EventPage {

    from : number;
    to : number;

//    size : number;

    events : Event[];

    total : number;
//    pageNum : number;
//    numPages : number;
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
export function parseESSource(r : any) : Event {

    // Map all _source fields across.
    let rtn = flattenESEvent(r);
    //	rtn["time"] = new Date(rtn["time"]);
    return rtn;
	
}

    // Parse ES search results.
export function parseESResults(
    r : any, from : number, size : number
) : EventPage {

    let d = [];

    if ("hits" in r) {
	let res : Object[] = r["hits"]["hits"];
	for (let r of res) {
	    d.push(parseESSource(r["_source"]));
	}
    }
	
    return {
	from: from,
//	size: size,
	to: from + size,
	total: r.hits.total.value,
//	pageNum: Math.ceil(from / size),
//	numPages: Math.ceil(r.hits.total.value / size),
	events: d
    };
};
