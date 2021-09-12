
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
import IndexedDBService from '@/plugins/IndexedDBService';
import {GeoMap, GeoMapCustom} from '@/models/GeoMap';
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
});