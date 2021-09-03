class IndexDBService {
    constructor() {
        this.db = undefined;
        this.loadDb();
    }
    async loadDb() {
        return new Promise((resolve, reject) => {
            let request = window.indexedDB.open('geoguess', 1);

            request.onerror = (e) => {
                console.log('Error opening db', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };

            request.onupgradeneeded = (e) => {
                console.log('onupgradeneeded');
                this.db = e.target.result;
                this.db.createObjectStore('maps', {
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
            let request = store.getAll();

            request.onerror = (e) => {
                console.log('Error getting maps', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
    }

    async addMap(map) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction(['maps'], 'readwrite');
            let store = transaction.objectStore('maps');
            let request = store.add(map);

            request.onerror = (e) => {
                console.log('Error adding map', e);
                reject('Error');
            };

            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
    }
}

export default new IndexDBService();
