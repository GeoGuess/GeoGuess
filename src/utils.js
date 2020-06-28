
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import distance from '@turf/distance'
/**
 * check in valid format url
 * @param {string} str 
 */
export function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

/**
 * Search if point is in GeoJSON
 * @param {Point>} point 
 * @param {FeatureCollection} geoJSON 
 */
export function isInGeoJSON(point, geoJSON){
  return geoJSON.features.some((feature) => {
    if(feature.geometry.type === "Point"){
      return distance(feature, point, {units: 'kilometers'}) < 0.05;
    }else {      
      return booleanPointInPolygon(point, feature)
    }
  });
  
}