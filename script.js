var days = [
    'SUN', //Sunday starts at 0
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
];

Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function itemOutput(item) {

    today = new Date(item.arrival);
    dayIndex = today.getDay();
    weekIndex = today.getWeek();
    console.log(days[dayIndex]);
    outputWk = `<div class="week-container" id="week-${weekIndex}"></div>`
    console.log($("#week-" + weekIndex).length);
    if ($("#week-" + weekIndex).length > 0) {

    } else {
        $("#container").append(outputWk);
    }
    if (item.roomTypeCode == "AS1") {
        outputDay = `<div class="item">${days[dayIndex]}<br>${item.arrival}<br>$${item.totalRate} </div>`
        $("#week-" + weekIndex).append(outputDay);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Handler when the DOM is fully loaded
    $.ajax({
        url: "https://www.northernquest.com/duetto/duettoAPI.php?no-cache=1"
    }).done(function (response) {

        for (x = 0; x < response.length; x++) {
            item = response[x];
            itemOutput(item);


        }




    });
});