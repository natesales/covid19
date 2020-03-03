// script.js

const target_location = "Anhui";

const url_confirmed = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const url_recovered = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
const url_deaths = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
const urls = [url_confirmed, url_recovered, url_deaths];

let yConfirmed = [];
let yRecovered = [];
let yDeaths = [];
let yAxis = [yConfirmed, yRecovered, yDeaths];

let dates = [];

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

function load_ui() {
    const config = {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Confirmed',
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: yConfirmed,
                fill: false,
            }, {
                label: 'Recovered',
                fill: false,
                backgroundColor: window.chartColors.green,
                borderColor: window.chartColors.green,
                data: yRecovered,
            }, {
                label: 'Deaths',
                fill: false,
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: yDeaths,
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Cases'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cases'
                    }
                }]
            }
        }
    };

    const ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
}

for (const i in urls) {
    fetch(urls[i]).then(function (response) {
        response.text().then(function (data) {
            data = CSVToArray(data);

            for (let i = 1; i < data.length; i++) {
                let state = data[i][0];
                let country = data[i][1];
                let cases = data[i].slice(4, -1);

                if (state === target_location) {
                    yAxis[i] = cases;
                    break;
                }
            }

            dates = data[0].slice(4, -1);

        });
    });
}
