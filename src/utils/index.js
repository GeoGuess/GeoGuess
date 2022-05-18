import axios from '@/plugins/axios';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import distance from '@turf/distance';
import { point } from '@turf/helpers';
import { GAME_MODE } from '../constants';

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
 * Return geojson from url
 * @param {string} url 
 * @returns geojson 
 */
export async function getGeoJsonFromUrl(url) {
    if (validURL(url)) {
        return axios
            .get(formatUrlGeoJSON(url))
            .then((res) => {
                if (res.status === 200 && res.data) {
                    if (typeof res.data === 'object') {
                        return res.data;
                    } else {
                        return JSON.parse(res.data);
                    }
                }
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        
    }
}

function formatUrlGeoJSON(url){
    // if gist url get raw
    if (/^(https?:\/\/)?gist.github.com\//.test(url)) {
        let urlSplit = url.split('/');
        if (
            urlSplit.length > 3 &&
            urlSplit[urlSplit.length - 1] !== 'raw'
        ) {
            urlSplit[urlSplit.length - 3] =
                'gist.githubusercontent.com';
            urlSplit.push('raw');
            return urlSplit.join('/');
        }
    }
    return url;
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
            obj.features.forEach((f) => {
                if (
                    !['Point', 'Polygon', 'MultiPolygon'].includes(
                        f.geometry.type
                    )
                ) {
                    throw new Error('Not Point Polygon MultiPolygon');
                }
            });
            return true;
        } else if (obj.type === 'Feature') {
            if (
                !['Point', 'Polygon', 'MultiPolygon'].includes(
                    obj.geometry.type
                )
            ) {
                throw new Error('Not Point Polygon MultiPolygon');
            }
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
/**
 * Get Area Code name From latlng with nominatim api
 * @param {object} latLng
 * @param {function} errorFunction
 * @param {string} key
 * @param {object} nominatimQueryParams
 * @returns {string}
 */
export function getAreaCodeNameFromLatLng(latLng, areaParams) {
    const nominatimQueryParams =
        areaParams && areaParams.nominatimQueryParams
            ? areaParams.nominatimQueryParams
            : {
                  zoom: 5,
                  addressdetails: 1,
                  extratags: 1,
              };

    return axios
        .get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat()}&lon=${latLng.lng()}&format=json&${new URLSearchParams(
                nominatimQueryParams
            )}`
        )
        .then(({ status, data }) => {
            if (status !== 200 || !data || data.error)
                return null;

            if (areaParams && areaParams.nominatimResultPath) {
                const areaName = getValueInObjectWithPath(data, areaParams.nominatimResultPath);

                if(areaName === undefined && areaParams.nominatimFallbackResultPath)
                  return getValueInObjectWithPath(data, areaParams.nominatimFallbackResultPath);

                return areaName;
            }

            if (data.extratags['ISO3166-1:alpha2']) {
                return data.extratags['ISO3166-1:alpha2'];
            }
            return data.address['country_code'].toUpperCase();
         
        });  
}

export function getValueInObjectWithPath(obj, path) {
    return path.split('.').reduce((o, i) => o ? o[i] : undefined, obj);
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
                area: selectedPos,
            };
    }
}

export function getRandomArea(areas, pathKey = 'iso_a2') {
    return areas.features[Math.floor(Math.random() * areas.features.length)]
        .properties[pathKey];
}

export function getMaxDistanceBbox(bbox) {
    const bboxPlace = Object.values(bbox);
    const from = point(bboxPlace.slice(0, 2));
    const to = point(bboxPlace.slice(2, 4));

    return distance(from, to);
}

/**
 * Download file
 * @param {string} data
 * @param {string} filename
 * @param {string} type
 */
export function download(data, filename, type) {
    const file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        // Others
        const a = document.createElement('a'),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
