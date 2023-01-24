/**
 * @jest-environment jsdom
 */

import {expect, jest, test} from '@jest/globals'

test("Testing test", ()=>{
    expect(5).toBe(5);
});