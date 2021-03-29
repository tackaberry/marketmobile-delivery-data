# MarketMobile Delivery Data

This is a periodic function that reads data from an google spreadsheet, enriches the data and adds it back to the same google sheet.

The main concept is to geocode a postal code, determine a region by kml geofence and return the named geofence.

The example kml data set included is for [The Coalition of Community Health and Resource Centres of Ottawa (CHRC)](http://www.coalitionottawa.ca/). The geofence regions are [shown in a map on their website](http://www.coalitionottawa.ca/en/find-your-chrc.aspx).
