function convertToMinutes(time) {
    const [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

function calculateEndTime(startTime, duration) {
    let totalMinutes = convertToMinutes(startTime) + duration;

    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    let modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${modifier}`;
}

module.exports = {
    convertToMinutes,
    calculateEndTime
};