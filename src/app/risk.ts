
const risks = {
    'malware': 0.1,
    'tor-exit': 0.7
};

export function getRiskValue(category : string) : number {

    if (category in risks) {
        return risks[category];
    }
    return 0.3;
}
