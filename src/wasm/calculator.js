import { postProgressAction } from '../worker/worker';
import * as wasm from './calculator_bg.wasm';

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

let WASM_VECTOR_LEN = 0;

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
* @param {Uint32Array} natures
* @param {boolean} has_shiny_charm
* @returns {Uint32Array}
*/
export function search_tinymt_seed(natures, has_shiny_charm) {
    var ptr0 = passArray32ToWasm0(natures, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.search_tinymt_seed(8, ptr0, len0, has_shiny_charm);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    var v1 = getArrayU32FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 4);
    return v1;
}

export const __wbg_postProgressAction_1032a86030b319ee = function(arg0, arg1, arg2) {
    postProgressAction(getArrayU32FromWasm0(arg0, arg1), arg2 >>> 0);
};

