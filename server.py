import requests
import csv
from flask import Flask, Markup, Request, render_template

class URL:
    Confirmed = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"
    Recovered = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv"
    Deaths = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv"

app = Flask(__name__, template_folder=".")

LOCATION = "Portland, OR US"
CONFIRMED = []

def csv_to_array(raw):
    return list(csv.reader(raw.split('\n'), delimiter=','))

@app.route("/")
def index():
    return render_template("index.html",
    dataConfirmed=get(URL.Confirmed),
    dataRecovered=get(URL.Recovered),
    dataDeaths=get(URL.Deaths),
    dates=dates(),
    numRecovered=latest(URL.Recovered)
    )

def dates():
    r = requests.get(URL.Confirmed)
    data = csv_to_array(r.text)
    return Markup(data[0][4:])

def get(url):
    r = requests.get(url)
    data = csv_to_array(r.text)
    dates = data[0][4:]
    data = data[1:]

    for loc in data:
        state = loc[0].strip()
        country = loc[1].strip()

        if state != "":
            loc_str = state + " " + country
        else:
            loc_str = country

        if loc_str == LOCATION:
            return Markup(loc[4:])

def latest(url):
    r = requests.get(url)
    data = csv_to_array(r.text)
    dates = data[0][4:]
    data = data[1:]

    for loc in data:
        state = loc[0].strip()
        country = loc[1].strip()

        if state != "":
            loc_str = state + " " + country
        else:
            loc_str = country

        if loc_str == LOCATION:
            return Markup(loc[-1])

print(latest(URL.Confirmed))

app.run("localhost", debug=True)