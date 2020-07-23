
// Converts a time to human-readable tag describing the age, which is a
// number followed by 'h', 'd' or 'w' for hours, dates, weeks.
export function age(then : Date) : string {

    // Get time difference from 'now' in seconds.
    let duration = (new Date().getTime() - then.getTime()) / 1000;

    // Convert to hours
    let hrs = duration / 60 / 60;

    // If less than 2 days, add 'h' suffix.
    if (hrs < 48) {
	return hrs.toFixed(0) + "h";
    }

    // If less than 1 week, convert to days and add 'd' suffix.
    if (hrs < (24 * 7)) {
	return (hrs/24).toFixed(0) + "d";
    }

    // Convert to weeks, and add 'w' suffix.
    return (hrs/24/7).toFixed(0) + "w";

}
