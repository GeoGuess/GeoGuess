import { describe, vi, it, expect } from 'vitest';
import { GeoMap, GeoMapCustom, GeoMapOSM } from '@/models/GeoMap.js';
import IndexedDBService from '@/plugins/IndexedDBService';

vi.mock('@/plugins/IndexedDBService', () => {
    let list = [];
    return {
        default: {
            addMap: (a) => {
                list.push({ m: 'addMap', v: a });
                return 'addMap';
            },
            updateMap: (a) => {
                list.push({ m: 'updateMap', v: a });
            },
            deleteMap: () => {
                list.push({ m: 'deleteMap' });
            },
            list,
        },
    };
});
describe('GeoMap.js', () => {
    it('GeoMap nameLocate', () => {
        let gMap = new GeoMap();

        expect(gMap.nameLocate).toBe('');
        gMap.name = 'na';
        expect(gMap.nameLocate).toBe('na');

        gMap.name = {
            en: 'na en',
        };
        expect(gMap.nameLocate).toBe('na en');
    });
    it('GeoMap descriptionLocate', () => {
        let gMap = new GeoMap();

        expect(gMap.descriptionLocate).toBe('');
        gMap.description = 'na';
        expect(gMap.descriptionLocate).toBe('na');

        gMap.description = {
            en: 'na en',
        };
        expect(gMap.descriptionLocate).toBe('na en');
    });

    it('GeoMap details should return object', () => {
        let gMap = new GeoMap();

        expect(gMap.details).toStrictEqual({
            id: undefined,
            type: 'default',
            name: '',
        });
    });

    it('GeoMapCustom save delete', async () => {
        let gMapCustom = new GeoMapCustom();
        gMapCustom.name = 'Map 1 ';
        await gMapCustom.save();
        expect(IndexedDBService.list[0].m).toBe('addMap');
        expect(IndexedDBService.list[0].v.name).toBe('Map 1 ');

        gMapCustom.name = 'a';
        await gMapCustom.save();
        expect(IndexedDBService.list[1].m).toBe('updateMap');
        expect(IndexedDBService.list[1].v.name).toBe('a');

        await gMapCustom.delete();
        expect(IndexedDBService.list[2].m).toBe('deleteMap');
    });

    it('GeoMapOSM should create', () => {
        let gMap = new GeoMapOSM('Map', 123, 'relation', {});

        expect(gMap.details).toStrictEqual({
            type: 'osm',
            osmType: 'relation',
            osmId: 123,
            name: 'Map',
        });
    });
});
