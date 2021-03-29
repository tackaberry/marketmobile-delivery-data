var convert = require("xml-js");
const fs = require("fs");

const service = {};

service.getAreasFromKml = (filename) => {
  console.log("[kml] getAreasFromKml");

  const xml = fs.readFileSync(filename, "utf8");
  const str = convert.xml2json(xml, { compact: true });
  const json = JSON.parse(str);

  const shapes = json.kml.Document.Placemark.map((item) => {
    const lines = item.Polygon.outerBoundaryIs.LinearRing.coordinates._text
      .trim()
      .split("\n");
    const coords = lines.map((line) => {
      const [longitude, latitude, h] = line.trim().split(",");
      return { latitude, longitude };
    });

    return {
      name: item.name._text,
      polygon: coords,
    };
  });

  return shapes;
};

module.exports = service;
