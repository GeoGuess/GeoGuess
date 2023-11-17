import { getScore } from '/src/utils/game/score.js';
import { describe, it, expect } from 'vitest';

describe('score.js', () => {
    it('getScore', () => {
        expect(getScore(20, 2000, 0, 'time')).toBe(5000);
        expect(getScore(100, 2000, 0, 'time')).toBe(5000);
        expect(getScore(100, 2000, 1000, 'time')).toBe(4999);

        expect(getScore(20, 2000, 0, 'normal')).toBe(5000);
        expect(getScore(200000, 2, 0, 'normal')).toBe(0);
        expect(getScore(20, 2000, 0, 'normal')).toBe(5000);
    });
});
