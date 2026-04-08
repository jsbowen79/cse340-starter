const hostEL = document.getElementById("host_id")
const button = document.getElementById('scheduleBtn')
button.remove();
    

function renderDate() {
    const dateEL = document.getElementById("date"); 
    dateEL.innerHTML = '<label for="drive_date">Please enter the date you would like to schedule.</label><input type="date" id="drive_date" name="drive_date" required>'
}

hostEL.addEventListener("change", (e) => {
    const host_id = e.target.value;

    renderDate();

    const dateEL = document.getElementById("drive_date");

    dateEL.addEventListener("change", async (f) => {
        const drive_date = f.target.value;

        const res = await fetch(`/drive/times?host_id=${host_id}&drive_date=${drive_date}`);
        const availableTimes = await res.json();

        const driveEL = document.getElementById("driveTime");

        let selectHtml = "<select id='drive_time' name='drive_time'>";
        selectHtml += availableTimes.map(time =>
            `<option value="${time}">${time}</option>`
        ).join("");
        selectHtml += "</select>";

        driveEL.innerHTML = selectHtml;
    });
});
