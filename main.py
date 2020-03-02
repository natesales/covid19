from datetime import date, timedelta
import requests
import csv

today = date.today().strftime("%m-%d-%Y")
yesterday = (date.today() - timedelta(days = 1)).strftime("%m-%d-%Y")

def csv_to_array(raw):
	return list(csv.reader(raw.split('\n'), delimiter=','))[1:]

today_dict = {}
yesterday_dict = {}

url_prefix = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/"

data_today = csv_to_array(requests.get(url_prefix + today + ".csv").text.strip())
data_yesterday = csv_to_array(requests.get(url_prefix + yesterday + ".csv").text.strip())

for x in range(0, len(data_today)):
	try:
		row_today = data_today[x]
		row_yesterday = data_yesterday[x]

		today_state = row_today[0]
		if today_state == "":
			today_state = "UNKNOWN"

		today_country = row_today[1]
		if today_country == "":
			today_country = "UNKNOWN"

		today_confirmed = row_today[3]

		today_dict[today_state + ", " + today_country] = int(today_confirmed)


		yesterday_state = row_yesterday[0]
		if yesterday_state == "":
			yesterday_state = "UNKNOWN"

		yesterday_country = row_yesterday[1]
		if today_country == "":
			today_country = "UNKNOWN"

		yesterday_confirmed = row_yesterday[3]

		yesterday_dict[yesterday_state + ", " + yesterday_country] = int(yesterday_confirmed)

	except IndexError:
		pass


for location in yesterday_dict:
	try:
		number_today = today_dict[location]
	except KeyError:
		number_today = 0
	number_yesterday = yesterday_dict[location]

	if number_today > number_yesterday:
		print("Yesterday " + location, "had " + str(number_yesterday) + " confirmed cases. Now there is " + str(number_today) + " That is " + str((number_today - number_yesterday)) + " more.")
