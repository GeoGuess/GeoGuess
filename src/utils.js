import json from '@/resources/countries.geo.json';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import distance from '@turf/distance';
import axios from 'axios';
import { GAME_MODE } from './constants';
import { point } from '@turf/helpers';

/**
 * check in valid format url
 * @param {string} str
 */
export function validURL(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(str);
}

/**
 * Search if point is in GeoJSON
 * @param {Point} point
 * @param {FeatureCollection} geoJSON
 */
export function isInGeoJSON(point, geoJSON) {
    if (geoJSON.type === 'Feature') {
        if (geoJSON.geometry.type === 'Point') {
            return distance(geoJSON, point, { units: 'kilometers' }) < 0.05;
        } else {
            return booleanPointInPolygon(point, geoJSON);
        }
    }
    return geoJSON.features.some((feature) => {
        if (feature.geometry.type === 'Point') {
            return distance(feature, point, { units: 'kilometers' }) < 0.05;
        } else {
            return booleanPointInPolygon(point, feature);
        }
    });
}

export function getCountdownText(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}

/**
 * Test in geojson object is valid
 * @param {object} geojson
 * @return {boolean} true if geojson is valid else false
 */
export function isGeoJSONValid(geojson) {
    try {
        let obj = geojson;
        if (obj.type === 'FeatureCollection' && obj.features) {
            obj.features.map((f) => {
                if (
                    !['Point', 'Polygon', 'MultiPolygon'].includes(
                        f.geometry.type
                    )
                ) {
                    throw new Error('Not Point Polygon MultiPolygon');
                }
            });
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/**
 * Get value locate from object
 * @param {object} obj
 * @param {string} name
 * @param {string} language
 * @param {string} defaultLanguage
 */
export function getLocateString(obj, name, language, defaultLanguage = 'en') {
    if (typeof obj[name] === 'string') {
        return obj[name];
    } else if (typeof obj[name] === 'object') {
        return obj[name][language] || obj[name][defaultLanguage] || '';
    }
    return '';
}

export function getCountryCodeNameFromLatLng(latLng, errorFunction) {
    return axios
        .get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat()}&lon=${latLng.lng()}&zoom=3&addressdetails=0&format=json&extratags=1`
        )
        .then((res) => {
            if (res.status === 200 && res.data) {
                return res.data.extratags['ISO3166-1:alpha2'];
            }
        })
        .catch(() => {
            errorFunction();
            return undefined;
        });
}

export function getSelectedPos(selectedPos, gameMode) {
    switch (gameMode) {
        case GAME_MODE.CLASSIC:
            return {
                latitude: selectedPos.lat(),
                longitude: selectedPos.lng(),
            };
        default:
            return {
                country: selectedPos,
            };
    }
}

export function getRandomCountry() {
    return json.features[Math.floor(Math.random() * json.features.length)]
        .properties['iso_a2'];
}

export function getMaxDistanceBbox(bbox) {
    const bboxPlace = Object.values(bbox);
    const from = point(bboxPlace.slice(0, 2));
    const to = point(bboxPlace.slice(2, 4));

    return distance(from, to);
}
