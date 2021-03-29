const geolib = require("geolib");

const service = {};

service.isPointInPolygon = (point, polygon) => {
  return geolib.isPointInPolygon(point, polygon);
};

module.exports = service;
