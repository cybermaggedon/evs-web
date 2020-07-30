
// Hierarchy

export type HierarchyObject<T> = {
    kind : "entry";
    name : string;
    value : T;
    default? : boolean;
}

export type HierarchyFolder<T> = {
    kind : "folder";
    name : string;
    entries : HierarchyEntry<T>[];
}

export type HierarchyEntry<T> = HierarchyObject<T> | HierarchyFolder<T>;

export type Hierarchy<T> = HierarchyEntry<T>[];

export function walk<T>(h : Hierarchy<T>, f : any) : void {
    for(let ent of h) {
	switch (ent.kind) {
	case "entry":
	    f(ent);
	    continue;
	case "folder":
	    let folder = <HierarchyFolder<T>>ent;
	    walk(folder.entries, f);
	}
    }
}

export type FlatItem<T> = {
    name : string;
    default? : boolean;
    value : T;
}

export function flattenHierarchy<T>(h: Hierarchy<T>) : FlatItem<T>[] {

    let l = [];

    for(let ent of h) {
	switch (ent.kind) {
	case "entry":
	    l.push({
		name: ent.name,
		default: ent.default,
		value: ent.value
	    });
	    continue;
	case "folder":
	    let folder = <HierarchyFolder<T>>ent;
	    let sublist = flattenHierarchy<T>(folder.entries);
	    for (let subent of sublist) {
		l.push({
		    name: ent.name + " / " + subent.name,
		    default: subent.default,
		    value: subent.value
		});
	    }
	}
    }
    return l;
}
