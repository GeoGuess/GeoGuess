class IndexedDBService {
    constructor() {
        this.db = undefined;
    }
    async loadDb() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
            }
            let request = window.indexedDB.open('geoguess', 1);

            request.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.log('Error opening db', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (e) => {
                // eslint-disable-next-line no-console
                console.log('onupgradeneeded');
                const db = e.target.result;
                db.createObjectStore('maps', {
                    autoIncrement: true,
                    keyPath: 'id',
                });
            };
        });
    }

    async getAllMaps() {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(['maps'], 'readonly');
            let store = transaction.objectStore('maps');
            const maps = new Array();

            const request = store.openCursor(null, 'prev');
            request.onsuccess = function (e) {
                const cursor = e.target.result;
                if (cursor) {
                    maps.push(cursor.value);
                    cursor.continue();
                } else {
                    // no more result
                    resolve(maps);
                }
            };

            request.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.log('Error getting maps', e);
                reject('Error');
            };
        });
    }

    async addMap(map) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(['maps'], 'readwrite');
            let store = transaction.objectStore('maps');
            let request = store.add(map);

            request.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.log('Error adding map', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
    }
    async deleteMap(map) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(['maps'], 'readwrite');
            let store = transaction.objectStore('maps');
            let request = store.delete(map.id);

            request.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.log('Error deleting map', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
    }
    async updateMap(map) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(['maps'], 'readwrite');
            let store = transaction.objectStore('maps');
            let request = store.put(map);

            request.onerror = (e) => {
                // eslint-disable-next-line no-console
                console.log('Error updating map', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
    }
}

export default new IndexedDBService();
