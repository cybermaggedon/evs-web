
import { ModelSet, Risk } from './model';

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
		    id: "healthcare-small",
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
		    id: "healthcare-medium",
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
		    id: "healthcare-large",
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

