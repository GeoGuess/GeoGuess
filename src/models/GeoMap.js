import i18n from '../lang';
import IndexedDBService from '../plugins/IndexedDBService';
import { getLocateString } from '../utils';

export const GeoMapType = {
    Default: 'default',
    Custom: 'custom',
    OSM: 'osm'
};

export class GeoMap {
    constructor() {
        this.geojson = null;
        this.type = GeoMapType.Default;
    }

    get nameLocate() {
        return getLocateString(this, 'name', i18n.locale);
    }

    get descriptionLocate() {
        return getLocateString(this, 'description', i18n.locale);
    }

    get imageSrc() {
        return this.imageUrl ||
            `https://source.unsplash.com/500x230/weekly?${encodeURI(getLocateString(this, 'name', 'en'))}`;
    }
    
    get details(){
        return {
            type: this.type,
            id: this.id,
            name: this.nameLocate,
        };
    }

}

export class GeoMapOSM extends GeoMap {
    constructor(name, osmId, osmType, geojson) {
        super();
        this.name = name;
        this.osmId = osmId;
        this.osmType = osmType;
        this.geojson = geojson;
        this.type = GeoMapType.OSM;
    }

    get details(){
        return {
            type: this.type,
            osmType: this.osmType,
            osmId: this.osmId,
            name: this.name,
        };
    }
}

export class GeoMapCustom extends GeoMap {
    constructor() {
        super();
        this.name = '';
        this.id = undefined;
        this.type = GeoMapType.Custom;
    }
    get nameLocate() {
        return this.name;
    }
    get descriptionLocate() {
        return '';
    }
    async save() {
        if (!this.id) {
            this.dateCreated = new Date();
            this.id = await IndexedDBService.addMap({
                name: this.name,
                dateCreated: this.dateCreated,
                geojson: this.geojson,
            });
        } else {
            this.updateMap = new Date();
            await IndexedDBService.updateMap({
                id: this.id,
                name: this.name,
                dateCreated: this.dateCreated,
                updateMap: this.updateMap,
                geojson: this.geojson,
            });
        }
        return this;
    }
    delete() {
        IndexedDBService.deleteMap(this);
    }
}
