// convert "10:30" → minutes
const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

// convert minutes → "HH:MM"
const toTime = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
};

// generate slots
const generateSlots = (start, end, duration) => {
    let slots = [];

    let startMins = toMinutes(start);
    let endMins = toMinutes(end);

    while (startMins + duration <= endMins) {
        let slotStart = toTime(startMins);
        let slotEnd = toTime(startMins + duration);

        slots.push({ startTime: slotStart, endTime: slotEnd });

        startMins += 15; // move by 15 mins
    }

    return slots;
};

module.exports = { toMinutes, toTime, generateSlots };