"use strict";
/* == Imports == */
const sheets = require("./src/services/googlesheets.service.js");
const maps = require("./src/services/googlemaps.service.js");
const kml = require("./src/services/kml.service.js");
const geo = require("./src/services/geolib.service.js");

const { REPLACE_ALL_DATA } = process.env;
const replaceAllData = REPLACE_ALL_DATA === "true" ? true : false;

const POSTAL_CODE = "Postal Code";
const ORDER = "Order";

exports.handler = async function (event, context) {
  try {
    const source = await sheets.fetch(0);
    const existing = await sheets.fetch(1);
    const existingOrderIds = existing.map((item) => item[ORDER]);
    const sourceFiltered = source.filter((item) =>
      replaceAllData || !existingOrderIds.includes(item[ORDER]) ? true : false
    );

    if (sourceFiltered.length > 0) {
      console.log(`Processing ${sourceFiltered.length}`);
      const areas = kml.getAreasFromKml("./updatedchrcmap_eng.kml");
      console.log(`Loaded ${areas.length} Areas from KML`);
      const promises = sourceFiltered.map((row) => getRegionName(row, areas));

      try {
        await Promise.allSettled(promises).then(async (responses) => {
          const successful = responses.filter(
            (promise) => promise.status === "fulfilled"
          );
          console.log(`Processed ${successful.length}`);
          const values = successful.map((item) => item.value);
          const headers = Object.keys(values[0]);
          const data = values.map((value) => {
            return Object.values(value);
          });

          if (replaceAllData) {
            const out = await sheets.put(headers, data);
            context.succeed(out);
          } else {
            const out = await sheets.append(data);
            context.succeed(out);
          }
        });
      } catch (error) {
        console.log(error);
        context.fail(error);
      }
    } else {
      console.log("Nothing to do.");
      context.succeed("Nothing to do.");
    }
  } catch (error) {
    context.fail(error);
  }
};

const getRegionName = async (row, areas) => {
  return new Promise(async function (resolve, reject) {
    try {
      row[POSTAL_CODE] = row[POSTAL_CODE].trim()
        .toLowerCase()
        .replace(/\W/g, "");
      const location = await maps.geocode(
        `${row[POSTAL_CODE]}, ottawa, ontario`
      );
      const point = {
        latitude: location[0].geometry.location.lat,
        longitude: location[0].geometry.location.lng,
      };
      let region = null;
      areas.forEach((area) => {
        const isPointInArea = geo.isPointInPolygon(point, area.polygon);
        if (isPointInArea) {
          region = area.name;
        }
      });
      row.lat = point.latitude;
      row.lng = point.longitude;
      row.geo = `${point.latitude}, ${point.longitude}`;
      row.region = region;
      resolve(row);
    } catch (e) {
      reject(e);
    }
  });
};
