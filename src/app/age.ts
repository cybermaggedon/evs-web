
// Converts a time to human-readable tag describing the age, which is a
// number followed by 'h', 'd' or 'w' for hours, dates, weeks.
export function age(then : Date) : string {

    let duration = (new Date().getTime() - then.getTime()) / 1000;

    let hrs = duration / 60 / 60;
    if (hrs < 48) {
	return hrs.toFixed(0) + "h";
    }

    if (hrs < (24 * 7)) {
	return (hrs/24).toFixed(0) + "d";
    }

    return (hrs/24/7).toFixed(0) + "w";

}
