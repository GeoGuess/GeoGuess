const { getScore } = require('../../../../src/utils/game/score');

describe('score.js', () => {
    it('getScore', () => {
        expect(getScore(20, 2000, 0, 'time')).toEqual(5000);
        expect(getScore(100, 2000, 0, 'time')).toEqual(5000);
        expect(getScore(100, 2000, 1000, 'time')).toEqual(4999);

        expect(getScore(20, 2000, 0, 'normal')).toEqual(5000);
        expect(getScore(200000, 2, 0, 'normal')).toEqual(0);
        expect(getScore(20, 2000, 0, 'normal')).toEqual(5000);
    });
});
