
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

export interface Factors {

    // Beta PERT
    low : number;
    mode : number;
    high : number;

    // Constant
    constant : number;

    // Normal distribution
    mean : number;
    stdev : number;
    
}

export interface FairParameters {

    r : Factors;        	// Risk (currency)
      lef : Factors;	    	// Loss Event Frequency (event count)
        tef : Factors;		// Threat Event Frequency (event count)
          c : Factors;		// Contact (actor contact count)
          a : Factors;		// Action (probability)
        v : Factors;		// Vulnerability (probability)
          tc : Factors;		// Threat Capability (relative threat score)
          cs : Factors;		// Control Strength (relative defence score)
      lm : Factors;		// Loss Magnitude (currency)
        pl : Factors;		// Primary Loss (currency)
        sl : Factors;		// Secondary Loss (currency)
          slef : Factors;	// Secondary Loss Event Frequency (probability)
          slem : Factors;	// Secondary Loss Event Magnitude (currency)

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

export type RiskSet = Risk[];

// Model

export interface Model {
    id : string;

    // Maps risk to risk profile.
    profiles : Object;
}

// Model set

export type ModelSet = Hierarchy<Model>;
