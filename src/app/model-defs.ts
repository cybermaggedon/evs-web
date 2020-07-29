
// A number of risks are defined e.g. credential-stuffing, each of which has
// one or more profiles.  The profile defines the different risk parameters in
// different scenarios.  The risk profiles are organised in a hierarchy to aid
// organisation and navigation.  By convention, one of the profiles is called
// 'default'.

// A model selects a set of profiles for some of the risks.  Any risks which
// don't have a model selected will revert to 'default'.

// The model set is a hierarchy of models to permit organisation and
// navigation of the models.

// Hierarchy

export type HierarchyObject<T> = {
    kind : "entry";
    name : string;
    value : T;
}

export type HierarchyFolder<T> = {
    kind : "folder";
    name : string;
    entries : HierarchyEntry<T>[];
}

export type FlatItem<T> = {
    name : string;
    value : T;
}

export type HierarchyEntry<T> = HierarchyObject<T> | HierarchyFolder<T>;

export type Hierarchy<T> = HierarchyEntry<T>[];

export function flattenHierarchy<T>(h: Hierarchy<T>) : FlatItem<T>[] {
    let l = [];

    for(let ent of h) {
	switch (ent.kind) {
	case "entry":
	    l.push(ent);
	    continue;
	case "folder":
	    let folder = <HierarchyFolder<T>>ent;
	    let sublist = flattenHierarchy<T>(folder.entries);
	    for (let subent of sublist) {
		l.push({
		    name: ent.name + " / " + subent.name,
		    value: subent.value
		});
	    }
	}
    }
    return l;
}

// Risk

export interface FairParameters {
    lef_low : number;
    lef_mode : number;
    lef_high : number;
    pl_low : number;
    pl_medium : number;
    pl_high : number;
    sl : number;
}

export interface RiskProfile {

    id : string;

    // Risk probability value.
    // Thinks: Is it possible to work these out from the FAIR model?
    risk : number;

    // FAIR
    fair : FairParameters;

}

export interface Risk {
    id : string;
    name : string;
    profiles : Hierarchy<RiskProfile>;
}

// Model

export interface Model {
    id : string;

    // Maps risk to risk profile.
    models : Object;
}

// Model set

export type ModelSet = Hierarchy<Model>;

export const modelSet : ModelSet = [
    {
	kind: "folder",
	name: "Transport",
	entries: [
	    {
		kind: "entry",
		name: "Small business",
		value: {
		    id: "transport-small",
		    models: {
			"cred-stuffing": "cred-stuf-low",
			"malware": "malw-low"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Medium business",
		value: {
		    id: "transport-medium",
		    models: {
			"cred-stuffing": "cred-stuf-med",
			"malware": "malw-med"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Large enterprise",
		value: {
		    id: "transport-large",
		    models: {
			"cred-stuffing": "cred-stuf-high",
			"malware": "malw-high"
		    }
		}
	    }
	]
    },
    {
	kind: "folder",
	name: "Healthcare",
	entries: [
	    {
		kind: "entry",
		name: "Small business",
		value: {
		    id: "transport-small",
		    models: {
			"cred-stuffing": "cred-stuf-low",
			"malware": "malw-low"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Medium business",
		value: {
		    id: "transport-medium",
		    models: {
			"cred-stuffing": "cred-stuf-med",
			"malware": "malw-med"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Large business",
		value: {
		    id: "transport-large",
		    models: {
			"cred-stuffing": "cred-stuf-high",
			"malware": "malw-high"
		    }
		}
	    }
	]
    }
];

export const riskProfiles : Risk[] = [
    {
	id: "cred-stuf",
	name: "Credential stuffing",
	profiles: [
	    {
		kind: "folder",
		name: "Baseline",
		entries: [
		    {
			kind: "entry",
			name: "Baseline (small)",
			value: {
			    id: "cred-stuff-low",
			    risk: 0.5,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 20000, pl_medium: 50000, pl_high: 100000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Baseline (med)",
			value: {
			    id: "cred-stuff-med",
			    risk: 0.6,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 50000, pl_medium: 250000, pl_high: 2000000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Baseline (high)",
			value: {
			    id: "cred-stuff-high",
			    risk: 0.7,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 1000000, pl_medium: 2000000, pl_high: 5000000,
				sl: 50000
			    }
			}
		    }
		]
	    }   
	]
    },
    {
	id: "malw",
	name: "Malware infection",
	profiles: [
	    {
		kind: "folder",
		name: "Baseline",
		entries: [
		    {
			kind: "entry",
			name: "Baseline (small)",
			value: {
			    id: "malw-low",
			    risk: 0.2,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 20000, pl_medium: 50000, pl_high: 75000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Baseline (med)",
			value: {
			    id: "malw-med",
			    risk: 0.3,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 50000, pl_medium: 100000, pl_high: 150000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Baseline (high)",
			value: {
			    id: "malw-high",
			    risk: 0.4,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 75000, pl_medium: 150000, pl_high: 250000,
				sl: 50000
			    }
			}			    
		    }
		]
	    }	    
	]
    },
    {
	id: "tor-exit",
	name: "TOR exit node detection",
	profiles: [
	    {
		kind: "folder",
		name: "Baseline",
		entries: [
		    {
			kind: "entry",
			name: "Baseline (small)",
			value: {
			    id: "tor-exit-low",
			    risk: 0.6,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 20000, pl_medium: 50000, pl_high: 100000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Baseline (med)",
			value: {
			    id: "tor-exit-med",
			    risk: 0.7,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 20000, pl_medium: 50000, pl_high: 100000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Baseline (high)",
			value: {
			    id: "tor-exit-high",
			    risk: 0.8,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 20000, pl_medium: 50000, pl_high: 100000,
				sl: 50000
			    }
			}			    
		    }
		]
	    }	    
	]
    }     
];

