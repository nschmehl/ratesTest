var days = [
    'SUN', //Sunday starts at 0
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
];

var jfcalplugin;
var memberId = 90025;;

if (window.location.search !== "")
memberId = window.location.search.substr(1).split(',')[0].split("=")[1];

console.log(memberId);
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

document.addEventListener("DOMContentLoaded", function () {

    var clickDate = "";
    var clickAgendaItem = "";

    /**
     * Initializes calendar with current year & month
     * specifies the callbacks for day click & agenda item click events
     * then returns instance of plugin object
     */
    var jfcalplugin = $("#mycal").jFrontierCal({
        date: new Date() /*,
        dayClickCallback: myDayClickHandler,
        agendaClickCallback: myAgendaClickHandler,
        agendaDropCallback: myAgendaDropHandler,
        agendaMouseoverCallback: myAgendaMouseoverHandler,
        applyAgendaTooltipCallback: myApplyTooltip,
        agendaDragStartCallback : myAgendaDragStart,
        agendaDragStopCallback : myAgendaDragStop,
        dragAndDropEnabled: true
        */
    }).data("plugin");
    updateCalendarDate();
    jfcalplugin.setAspectRatio("#mycal", 1);

    function updateCalendarDate(){
        var calDate = jfcalplugin.getCurrentDate("#mycal");
        mo = new Intl.DateTimeFormat('en', { month: 'long' }).format(calDate)
        $('#myCurrentMonth').html(mo);
    }

    /**
     * Initialize jquery ui datepicker. set date format to yyyy-mm-dd for easy parsing
     */
    $("#dateSelect").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'yy-mm-dd'
    });

    /**
     * Set datepicker to current date
     */
    $("#dateSelect").datepicker('setDate', new Date());
    /**
     * Use reference to plugin object to a specific year/month
     */
    
     $("#dateSelect").bind('change', function() {
        var selectedDate = $("#dateSelect").val();
        var dtArray = selectedDate.split("-");
        var year = dtArray[0];
        // jquery datepicker months start at 1 (1=January)		
        var month = dtArray[1];
        // strip any preceeding 0's		
        month = month.replace(/^[0]+/g,"")		
        var day = dtArray[2];
        // plugin uses 0-based months so we subtrac 1
        jfcalplugin.showMonth("#mycal",year,parseInt(month-1).toString());
    });	
    /**
     * Initialize previous month button
     */
    $("#BtnPreviousMonth").button();
    $("#BtnPreviousMonth").click(function() {
        jfcalplugin.showPreviousMonth("#mycal");
        // update the jqeury datepicker value
        var calDate = jfcalplugin.getCurrentDate("#mycal"); // returns Date object
        var cyear = calDate.getFullYear();
        // Date month 0-based (0=January)
        var cmonth = calDate.getMonth();
        var cday = calDate.getDate();
        // jquery datepicker month starts at 1 (1=January) so we add 1
        $("#dateSelect").datepicker("setDate",cyear+"-"+(cmonth+1)+"-"+cday);
        updateCalendarDate();
        return false;
    });
    /**
     * Initialize next month button
     */
    $("#BtnNextMonth").button();
    $("#BtnNextMonth").click(function() {
        jfcalplugin.showNextMonth("#mycal");
        // update the jqeury datepicker value
        var calDate = jfcalplugin.getCurrentDate("#mycal"); // returns Date object
        var cyear = calDate.getFullYear();
        // Date month 0-based (0=January)
        var cmonth = calDate.getMonth();
        var cday = calDate.getDate();
        // jquery datepicker month starts at 1 (1=January) so we add 1
        $("#dateSelect").datepicker("setDate",cyear+"-"+(cmonth+1)+"-"+cday);	
        updateCalendarDate();
        return false;
    });

    function addItem(item){
        var price = item.totalRate
        var arrivalDateObj = Date.parse(item.arrival);
        
        if (price > 300){
            var labelColor = "#ffffff";
            var backgroundColor = "#022c5b";
        } else {
            var labelColor = "#ffffff";
            var backgroundColor = "#529ff5";
            price = "$"+price;
        }

        //if (item.roomsAvailable ==  0)
        //backgroundColor = "#6b0000";

        jfcalplugin.addAgendaItem(
            "#mycal",
            price,
            arrivalDateObj,
	        arrivalDateObj,
            true,
            {},
            {
                backgroundColor: backgroundColor,
                labelColor: labelColor
            }	
        );
    }
    $.ajax({
        url: 'https://www.northernquest.com/duetto/duettoAPI.php?no-cache=1&memberId='+memberId,
        dataType: 'json',
        success: function(response) {
            for (x = 0; x < response.length; x++) {
                item = response[x];
                addItem(item);
            }
        }
    });
});
