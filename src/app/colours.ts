
export function nameToCssColour(name : string, kind : string) : string {
    let a = 0;
    for (let c of (name + kind)) {
        let code = c.charCodeAt(0) % 127;
        a = (a ^ code) & 127;
    }
    let r = (a % 7) * 16;
    let g = ((a >> 3) % 7) * 16;
    let b = ((a >> 6) % 7) * 16;
    g ^= r;
    b ^= g;

    r = 4 + 2 * r; g = 4 + 2 * g; b = 4 + 2 * b;

    let rgb  = `rgb(${r},${g},${b})`;
    return rgb;
}
