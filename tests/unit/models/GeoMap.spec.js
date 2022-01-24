
jest.mock('@/plugins/IndexedDBService',()=>{
    let list = [];
    return {
        addMap: (a)=> {
            list.push({m: "addMap" , v: a});
            return 'addMap';
        },
        updateMap: (a)=>{
            list.push({m: "updateMap" , v: a});
        },
        deleteMap: ()=> {
            list.push({m: "deleteMap"});
        },
        list,
    };
});
import { GeoMap, GeoMapCustom, GeoMapOSM } from '@/models/GeoMap';
import IndexedDBService from '@/plugins/IndexedDBService';
describe('GeoMap.js', () => {
    it('GeoMap nameLocate', () => {

        let gMap = new GeoMap();

        expect(gMap.nameLocate).toEqual('');
        gMap.name = 'na';
        expect(gMap.nameLocate).toEqual('na');

        gMap.name = {
            en: 'na en'
        };
        expect(gMap.nameLocate).toEqual('na en');

    });
    it('GeoMap descriptionLocate', () => {

        let gMap = new GeoMap();

        expect(gMap.descriptionLocate).toEqual('');
        gMap.description = 'na';
        expect(gMap.descriptionLocate).toEqual('na');

        gMap.description = {
            en: 'na en'
        };
        expect(gMap.descriptionLocate).toEqual('na en');

    });


    it('GeoMap details should return object', () => {

        let gMap = new GeoMap();

        expect(gMap.details).toEqual({
            id: undefined,
            type: 'default',
            name: '',
        });

    });

    it('GeoMapCustom save delete', async () => {

        let gMapCustom = new GeoMapCustom();
        gMapCustom.name = 'Map 1 ';
        await gMapCustom.save();
        expect(IndexedDBService.list[0].m).toEqual('addMap');
        expect(IndexedDBService.list[0].v.name).toEqual('Map 1 ');

        gMapCustom.name = 'a';
        await gMapCustom.save();
        expect(IndexedDBService.list[1].m).toEqual('updateMap');
        expect(IndexedDBService.list[1].v.name).toEqual('a');

        await gMapCustom.delete();
        expect(IndexedDBService.list[2].m).toEqual('deleteMap');
        
    });

    it('GeoMapOSM should crea', () => {

        let gMap = new GeoMapOSM('Map', 123, 'relation', {});

        expect(gMap.details).toEqual({
            type: 'osm',
            osmType: 'relation',
            osmId:  123,
            name: 'Map',
        });

    });

});