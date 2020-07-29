
// A number of risks are defined e.g. credential-stuffing, each of which has
// one or more profiles.  The profile defines the different risk parameters in
// different scenarios.  The risk profiles are organised in a hierarchy to aid
// organisation and navigation.  By convention, one of the profiles is called
// 'default'.

// A model selects a set of profiles for some of the risks.  Any risks which
// don't have a model selected will revert to 'default'.

// The model set is a hierarchy of models to permit organisation and
// navigation of the models.

import { Hierarchy } from './hierarchy';

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
    profiles : Object;
}

// Model set

export type ModelSet = Hierarchy<Model>;

export const modelSet : ModelSet = [
    {
	kind: "entry",
	name: "default",
	default: true,
	value: {
	    id: "default",
	    profiles: {
		"cred-stuffing": "cred-stuff-low",
		"malware": "malware-low",
		"tor-exit": "tor-exit-low",
	    }
	}
    },
    {
	kind: "folder",
	name: "Transport",
	entries: [
	    {
		kind: "entry",
		name: "Small business",
		value: {
		    id: "transport-small",
		    profiles: {
			"cred-stuffing": "cred-stuff-low",
			"malware": "malware-low",
			"tor-exit": "tor-exit-low"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Medium business",
		value: {
		    id: "transport-medium",
		    profiles: {
			"cred-stuffing": "cred-stuff-med",
			"malware": "malware-med",
			"tor-exit": "tor-exit-med"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Large enterprise",
		value: {
		    id: "transport-large",
		    profiles: {
			"cred-stuffing": "cred-stuff-high",
			"malware": "malware-high",
			"tor-exit": "tor-exit-high"
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
		    profiles: {
			"cred-stuffing": "cred-stuff-pii-low",
			"malware": "malware-low",
			"tor-exit": "tor-exit-low"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Medium business",
		value: {
		    id: "transport-medium",
		    profiles: {
			"cred-stuffing": "cred-stuff-pii-med",
			"malware": "malware-med",
			"tor-exit": "tor-exit-med"
		    }
		}
	    },
	    {
		kind: "entry",
		name: "Large business",
		value: {
		    id: "transport-large",
		    profiles: {
			"cred-stuffing": "cred-stuff-pii-high",
			"malware": "malware-high",
			"tor-exit": "tor-exit-high"
		    }
		}
	    }
	]
    }
];

export const riskProfiles : Risk[] = [
    {
	id: "cred-stuffing",
	name: "Credential stuffing",
	profiles: [
	    {
		kind: "folder",
		name: "Baseline",
		entries: [
		    {
			kind: "entry",
			name: "Low",
			default: true,
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
			name: "Medium",
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
			name: "High",
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
	    },
	    {
		kind: "folder",
		name: "PII",
		entries: [
		    {
			kind: "entry",
			name: "Low",
			default: true,
			value: {
			    id: "cred-stuff-pii-low",
			    risk: 0.7,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 2000000, pl_medium: 5000000, pl_high: 10000000,
				sl: 500000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "Medium",
			value: {
			    id: "cred-stuff-pii-med",
			    risk: 0.9,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 5000000, pl_medium: 25000000, pl_high: 200000000,
				sl: 500000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "High",
			value: {
			    id: "cred-stuff-pii-high",
			    risk: 0.95,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 100000000, pl_medium: 200000000, pl_high: 500000000,
				sl: 500000
			    }
			}
		    }
		]
	    }
	]
    },
    {
	id: "malware",
	name: "Malware infection",
	profiles: [
	    {
		kind: "folder",
		name: "Baseline",
		entries: [
		    {
			kind: "entry",
			name: "Low",
			default: true,
			value: {
			    id: "malware-low",
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
			name: "Medium",
			value: {
			    id: "malware-med",
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
			name: "High",
			value: {
			    id: "malware-high",
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
			name: "Low",
			default: true,
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
			name: "Medium",
			value: {
			    id: "tor-exit-med",
			    risk: 0.7,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 80000, pl_medium: 120000, pl_high: 200000,
				sl: 50000
			    }
			}
		    },
		    {
			kind: "entry",
			name: "High",
			value: {
			    id: "tor-exit-high",
			    risk: 0.8,
			    fair: {
				lef_low: 0.5, lef_mode: 1, lef_high: 2,
				pl_low: 160000, pl_medium: 240000, pl_high: 600000,
				sl: 50000
			    }
			}			    
		    }
		]
	    }	    
	]
    }     
];

