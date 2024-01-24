const fs = require('fs');

// generate the 11 round keys (including the initial key)

// rcons = [1, 2, 4, 8, 10, 20, 40, 80, 1B, 36] in hex, of course

const key = [
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2,
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2
]

function lss(x, n, l=8) {
    return (2^l - 1) & ((x << n) | (x >> (8 - n)));
}

function get_sbox(state) {
    let s_box = [];

    for (let i = 0; i < state.length; i++) {
        s_box.push(state[i] ^ lss(state[i], 1) ^ lss(state[i], 2) ^ lss(state[i], 3) ^ lss(state[i], 4) ^ 99);
    }

    return s_box;
}

function get_reverse_sbox(state) {
    let rev_sbox = [];

    for (let i = 0; i < state.length; i++) {
        rev_sbox.push(lss(state[i], 1) ^ lss(state[i], 3) ^ lss(state[i], 6) ^ 5);
    }

    return rev_sbox;
}

// TODO: finish
function expand_key(key) {
    rcon = [1, 2, 4, 8, 10, 32, 64, 128, 27, 54]

    let final_key = [];

    for (let i = 0; i < 44; i++) {
        final_key.push(0);

        if (i < 4) {
            final_key[i] = key[i];
        }
        else if (i > 4 && i % 4 == 0) {
            final_key[i] = final_key[i - 4] ^ get_sbox([lss(final_key[i - 1], 8, 32)])[0] ^ rcon[i/4];
        }
        else {
            final_key[i] = final_key[i - 4] ^ final_key[i - 1]
        }
    }

    return final_key;
}

console.log(expand_key(key));

function encode_string(str) {
    var bytes = []; // char codes
    var bytesv2 = []; // char codes

    for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        
        bytes = bytes.concat([code]);
        
        bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
    }

    return bytes;
}

function addRoundKey(text, round_key) {
    let result = [];
    
    for (let i = 0; i < text.length; i++) {
        result.push(text[i] ^ round_key[i%round_key.length]);
    }

    return result;
}

function encrypt(plainText, key) {
    enc_text = encode_string(plainText);

    let cipherText = [];

    cipherText.push(addRoundKey(enc_text, key));

    for (let i = 0; i < 9; i++) {
        cipherText = get_sbox(cipherText);
    }

    return cipherText;
}

function decrypt(cipherText, key) {

}

module.exports = {encrypt, decrypt};