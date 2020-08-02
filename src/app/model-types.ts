
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
    pl_mode : number;
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

export type RiskSet = Risk[];

// Model

export interface Model {
    id : string;

    // Maps risk to risk profile.
    profiles : Object;
}

// Model set

export type ModelSet = Hierarchy<Model>;
