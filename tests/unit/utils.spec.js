const {
    validURL,
    isInGeoJSON,
    getCountdownText,
    getLocateString,
    getScore,
    isGeoJSONValid,
    getCountryCodeNameFromLatLng
} = require('../../src/utils');

describe('utils.js', () => {
    it('validURL', () => {
        expect(validURL('')).toBeFalsy();
        expect(validURL('ftp://helllo.com')).toBeFalsy();
        expect(validURL('http://helllom')).toBeFalsy();
        expect(validURL('https://helll.com')).toBeTruthy();
    });

    it('isInGeoJSON', () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [90.791015625, 21.94304553343818],
                                [110.4345703125, 21.94304553343818],
                                [110.4345703125, 35.85343961959182],
                                [90.791015625, 35.85343961959182],
                                [90.791015625, 21.94304553343818],
                            ],
                        ],
                    },
                },
            ],
        };
        const pointOut = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [86.044921875, 30.713503990354965],
            },
        };
        const pointIn = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [98.0419921875, 30.751277776257812],
            },
        };
        expect(isInGeoJSON(pointOut, geojson)).toBeFalsy();
        expect(isInGeoJSON(pointIn, geojson)).toBeTruthy();
        expect(isInGeoJSON(pointOut, geojson.features[0])).toBeFalsy();
        expect(isInGeoJSON(pointIn, geojson.features[0])).toBeTruthy();
    });

    it('getCountdownText', () => {
        expect(getCountdownText(1212)).toEqual('20:12');
        expect(getCountdownText(3)).toEqual('00:03');
    });

    it('getLocateString', () => {
        const object = {
            title: {
                fr: 'titre',
                en: 'title',
            },
            description: 'description',
            name: {
                en: 'name',
            },
            author: {
                fr: 'auteur',
            },
        };
        expect(getLocateString(object, 'title', 'fr')).toEqual('titre');
        expect(getLocateString(object, 'description', 'fr')).toEqual(
            'description'
        );
        expect(getLocateString(object, 'name', 'fr')).toEqual('name');
        expect(getLocateString(object, 'author', 'ar')).toEqual('');
        expect(getLocateString(object, 'date', 'ar')).toEqual('');
    });

    it('getScore', () => {
        expect(getScore(20, 2000, 0, 'time')).toEqual(5000);
        expect(getScore(100, 2000, 0, 'time')).toEqual(5000);
        expect(getScore(100, 2000, 1000, 'time')).toEqual(4999);

        expect(getScore(20, 2000, 0, 'normal')).toEqual(5000);
        expect(getScore(200000, 2, 0, 'normal')).toEqual(0);
        expect(getScore(20, 2000, 0, 'normal')).toEqual(5000);

    });

    it('isGeoJSON Valid', () => {
        const geoTrue = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Polygon",
                  "coordinates": [
                    [
                      [                      
                        0,
                        40
                      ],
                      [
                        -4,
                        3
                      ],
                      [
                        19,
                        14
                      ],
                      [
                        0,
                        40
                      ]
                    ]
                  ]
                }
              }
            ]
          };
        expect(isGeoJSONValid(geoTrue)).toBeTruthy();

    });
    it('isGeoJSON Invalid', () => {
        const geo = {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "geometry": {

                    "type": "LineString",
                  
                    "coordinates": [
                  
                      [-117.49389, 40.73069],
                  
                      [-115.98877, 37.95294]
                  
                    ] 
                  
                  }
                }
            ]
          };
        expect(isGeoJSONValid(geo)).toBeFalsy();
        
        expect(isGeoJSONValid({})).toBeFalsy();

    });
    
    it('getCountryCodeNameFromLatLng', async () => {

        const gps ={
            lat: () => 47.040182144806664,
            lng: () => -0.703125,
        };
        const res = await getCountryCodeNameFromLatLng(gps, ()=>{});
        expect(res).toEqual('FR');
        
        const gps2 ={
            lat: () => 0,
            lng: () => 0,
        };
        
        const res2 = await getCountryCodeNameFromLatLng(gps2, ()=>{});
        expect(res2).toBeUndefined();

    });

});
