import {
    validURL,
    isInGeoJSON,
    getCountdownText,
    getLocateString,
    isGeoJSONValid,
    getAreaCodeNameFromLatLng,
    getSelectedPos,
    getValueInObjectWithPath,
} from '/src/utils';
import { describe, it, expect } from 'vitest';

describe('utils/index.js', () => {
    it('validURL', () => {
        expect(validURL('')).toBeFalsy();
        expect(validURL('ftp://helllo.com')).toBeFalsy();
        expect(validURL('http://helllom')).toBeFalsy();
        expect(validURL('https://helll.com')).toBeTruthy();
    });

    it('isInGeoJSON', () => {
        const geoJson = {
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
        expect(isInGeoJSON(pointOut, geoJson)).toBeFalsy();
        expect(isInGeoJSON(pointIn, geoJson)).toBeTruthy();
        expect(isInGeoJSON(pointOut, geoJson.features[0])).toBeFalsy();
        expect(isInGeoJSON(pointIn, geoJson.features[0])).toBeTruthy();
    });

    it('getCountdownText', () => {
        expect(getCountdownText(1212)).toBe('20:12');
        expect(getCountdownText(3)).toBe('00:03');
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
        expect(getLocateString(object, 'title', 'fr')).toBe('titre');
        expect(getLocateString(object, 'description', 'fr')).toBe(
            'description'
        );
        expect(getLocateString(object, 'name', 'fr')).toBe('name');
        expect(getLocateString(object, 'author', 'ar')).toBe('');
        expect(getLocateString(object, 'date', 'ar')).toBe('');
    });

    it('isGeoJSON Valid', () => {
        const geoTrue = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [0, 40],
                                [-4, 3],
                                [19, 14],
                                [0, 40],
                            ],
                        ],
                    },
                },
            ],
        };
        expect(isGeoJSONValid(geoTrue)).toBeTruthy();
    });
    it('isGeoJSON Invalid', () => {
        const geo = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',

                        coordinates: [
                            [-117.49389, 40.73069],

                            [-115.98877, 37.95294],
                        ],
                    },
                },
            ],
        };
        expect(isGeoJSONValid(geo)).toBeFalsy();

        expect(isGeoJSONValid({})).toBeFalsy();
    });

    it('getAreaCodeNameFromLatLng: should return country code', async () => {
        const gps = {
            lat: () => 47.040182144806664,
            lng: () => -0.703125,
        };
        const res = await getAreaCodeNameFromLatLng(gps);
        expect(res).toBe('FR');

        const gps2 = {
            lat: () => 0,
            lng: () => 0,
        };

        const res2 = await getAreaCodeNameFromLatLng(gps2);
        expect(res2).toBeNull();
    });

    it('getAreaCodeNameFromLatLng: should return area code where need fallback', async () => {
        const gps = {
            lat: () => 19.250617647058824,
            lng: () => -99.07219999999,
        };
        const res = await getAreaCodeNameFromLatLng(gps, {
            bbox: [-33.8689056, 5.2693306, -73.9830625, -28.6289646],
            urlArea:
                'https://raw.githubusercontent.com/GeoGuess/GeoGuess-Maps/main/public/geojson/areas/mexico_states.geojson',
            type: 'nominatim',
            pathKey: 'name',
            nominatimResultPath: 'address.state',
            nominatimFallbackResultPath: 'display_name',
            nominatimQueryParams: {
                zoom: '5',
                'accept-language': 'en',
            },
        });
        expect(res).toContain('Mexico');
    });

    it('getAreaCodeNameFromLatLng: should return null if not value', async () => {
        const gps = {
            lat: () => 19.250617647058824,
            lng: () => -909.07219999999,
        };
        const res = await getAreaCodeNameFromLatLng(gps, {
            bbox: [-33.8689056, 5.2693306, -73.9830625, -28.6289646],
            urlArea:
                'https://raw.githubusercontent.com/GeoGuess/GeoGuess-Maps/main/public/geojson/areas/mexico_states.geojson',
            type: 'nominatim',
            pathKey: 'name',
            nominatimResultPath: 'address.state',
            nominatimQueryParams: {
                zoom: '5',
                'accept-language': 'es',
            },
        });
        expect(res).toBeNull();
    });

    it('getSelectedPos', () => {
        expect(
            getSelectedPos({ lat: () => 0, lng: () => 1 }, 'classic')
        ).toEqual({ latitude: 0, longitude: 1 });
        expect(getSelectedPos('FR', 'country')).toStrictEqual({ area: 'FR' });
    });

    it('getValueInObjectWithPath: should return undefined', () => {
        const object = {
            a: {
                b: {
                    c: 'Hello',
                },
            },
        };

        expect(getValueInObjectWithPath(object, 'a.a.c')).toBeUndefined();
    });

    it('getValueInObjectWithPath: should return value', () => {
        const object = {
            a: {
                b: {
                    c: {
                        d: {
                            e: {
                                f: {
                                    g: {
                                        h: {
                                            i: {
                                                j: {
                                                    k: 'Hello',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        expect(getValueInObjectWithPath(object, 'a.b.c.d.e.f.g.h.i.j.k')).toBe(
            'Hello'
        );
    });
});
