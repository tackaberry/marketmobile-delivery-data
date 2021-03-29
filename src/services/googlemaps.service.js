const { Client } = require("@googlemaps/google-maps-services-js");

const { GOOGLE_MAPS_API } = process.env;

const service = {};

service.geocode = (address) => {
  console.log(`[geocode] ${address}`);

  return new Promise(function (resolve, reject) {
    try {
      const client = new Client({});

      client
        .geocode({
          params: {
            address,
            key: GOOGLE_MAPS_API,
          },
        })
        .then((r) => {
          console.log(`[geocode] ${address} - got address`);
          resolve(r.data.results);
        })
        .catch((e) => {
          console.log(`[geocode] error - ${address}`);
          reject(e);
        });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = service;
