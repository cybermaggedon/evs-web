
// Manipulation on Gaffer graphs, converting to simpler structure.

// An edge
export interface Edge {
    group : string;
    source : string;
    destination : string;
    earliest : Date;
    latest : Date;
    count : number;
};

// An entity (or node)
export interface Entity {
    group : string;
    vertex : string;
    earliest : Date;
    latest : Date;
    count : number;
};

// Simple graph representation
export class Graph {
    constructor(edges : Edge[], entities : Entity[]) {
        this.edges = edges;
        this.entities = entities;
    }

    // An array of edges
    edges : Edge[];

    // An array of entities/nodes
    entities : Entity[];
};

// Convert Gaffer results (e.g. result of GetAllElements) to a Graph object
export function toGraph(elts : any) : Graph {
    
    let edges = [];
    let entities = [];
    
    for (let e of (elts as any[])) {
        if (e.class == "uk.gov.gchq.gaffer.data.element.Entity") {
            let ent = { group: e.group, vertex: e.vertex };
            if (e.properties && "time" in e.properties) {
                let tm = e.properties.time;
                let tss = tm["uk.gov.gchq.gaffer.time.RBMBackedTimestampSet"];
                ent["earliest"] = new Date(tss.earliest * 1000);
                ent["latest"] = new Date(tss.latest * 1000);
            }
            if (e.properties && "count" in e.properties) {
                ent["count"] = e.properties.count;
            }
            entities.push(ent);
        }
        if (e.class == "uk.gov.gchq.gaffer.data.element.Edge") {
            let edge = { group: e.group, source: e.source,
                         destination: e.destination };
            if (e.properties && "time" in e.properties) {
                let tm = e.properties.time;
                let tss = tm["uk.gov.gchq.gaffer.time.RBMBackedTimestampSet"];
                edge["earliest"] = new Date(tss.earliest * 1000);
                edge["latest"] = new Date(tss.latest * 1000);
            }
            if (e.properties && "count" in e.properties) {
                edge["count"] = e.properties.count;
            }
            edges.push(edge);
        }
    }

    return new Graph(edges, entities);

}

