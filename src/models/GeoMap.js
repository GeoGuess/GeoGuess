import i18n from '../lang';
import IndexedDBService from '../plugins/IndexedDBService';
import { getLocateString } from '../utils';

export class GeoMap {
    constructor() {
        this.geojson = null;
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
            custom: !!this.custom,
            id: this.id,
            name: this.name,
        };
    }

}

export class GeoMapCustom extends GeoMap {
    constructor() {
        super();
        this.name = '';
        this.id = undefined;
        this.custom = true;
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
