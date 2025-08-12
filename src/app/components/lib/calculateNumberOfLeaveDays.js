export default function calculateNumberOfLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    for (let d = new Date(start); d <= end; d = new Date(d.setDate(d.getDate() + 1))) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) {
            count++;
        }
    }

    return count;
}
