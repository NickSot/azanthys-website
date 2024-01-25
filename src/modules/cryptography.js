const fs = require('fs');
const { decode } = require('punycode');

const key = [
    3, 1, 5, 1, 0, 0, 7, 1, 1, 1, 1, 3, 3, 7, 2, 2
];

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

console.log(get_sbox(get_reverse_sbox([1])));

// TODO: finish
function expand_key(key) {
    rcon = [1, 2, 4, 8, 10, 32, 64, 128, 27, 54]

    let final_key = [];

    let counter = 0;

    for (let i = 0; i < 44; i += 4) {
        if (i < 4) {
            for (let j = 0; j < 4; j++) {
                final_key.push(key[j]);
                final_key.push(key[j + 1]);
                final_key.push(key[j + 2]);
                final_key.push(key[j + 3]);
            }
        }
        else if (i >= 4 && i % 4 == 0) {

            for (let k = 0; k < 4; k++) {
                shifted = []

                for (let j = 0; j < 4; j++) {
                    shifted.push(final_key[i * 4 + k + (j + 1) % 4]);
                }

                for (let j = 0; j < 4; j++) {
                    final_key.push(final_key[i + k + j - 4] ^ get_sbox([shifted[j]])[0] ^ rcon[i/4]);
                }
            }
        }
        else {
            for (let j = 0; j < 4; j++) {
                final_key.push(final_key[i + j - 4] ^ final_key[i + j]);
                final_key.push(final_key[i + j - 3] ^ final_key[i + j + 1]);
                final_key.push(final_key[i + j - 2] ^ final_key[i + j + 2]);
                final_key.push(final_key[i + j - 1] ^ final_key[i + j + 3]);
            }
        }
    }

    return final_key;
}

let arr = [
    172, 179, 157, 201, 119,
    161,   3, 189,  34,  16,
    166,  10, 172, 196, 101,
     96
  ];

function get_round_keys(final_key) {
    const result = [];

    for (let i = 0; i < final_key.length; i+=16) {
        let temp = []

        for (let j = 0; j < 16; j++) {
            temp.push(final_key[i + j]);
        }

        result.push(temp)
    }

    return result;
}

function addRoundKey(text, round_key) {
    let result = [];
    
    for (let i = 0; i < text.length; i++) {
        result.push(text[i] ^ round_key[i]);
    }

    return result;
}

function swap(val1, val2) {
    let val3 = val1;
    val1 = val2;
    val2 = val3;
}

function shift_rows(cipher_matrix) {
    let temp = cipher_matrix[4];
    
    // first row shift
    cipher_matrix[4] = cipher_matrix[7];
    cipher_matrix[7] = cipher_matrix[6];
    cipher_matrix[6] = cipher_matrix[5];
    cipher_matrix[5] = temp;

    // second row shift
    swap(cipher_matrix[9], cipher_matrix[11]);
    swap(cipher_matrix[8], cipher_matrix[10]);

    //third row shift
    swap(cipher_matrix[15], cipher_matrix[12]);
    swap(cipher_matrix[15], cipher_matrix[13]);
    swap(cipher_matrix[15], cipher_matrix[14]);
}

function reverse_shift_rows(cipher_matrix) {
    let temp = cipher_matrix[7];
    
    // first row shift
    cipher_matrix[7] = cipher_matrix[4];
    cipher_matrix[4] = cipher_matrix[5];
    cipher_matrix[5] = cipher_matrix[6];
    cipher_matrix[6] = temp;

    // second row shift
    swap(cipher_matrix[8], cipher_matrix[10]);
    swap(cipher_matrix[9], cipher_matrix[11]);

    //third row shift
    swap(cipher_matrix[15], cipher_matrix[14]);
    swap(cipher_matrix[15], cipher_matrix[13]);
    swap(cipher_matrix[15], cipher_matrix[12]);
}

function GMul(a, b) { // Galois Field (256) Multiplication of two Bytes
    let p = 0;

    for (let counter = 0; counter < 8; counter++) {
        if ((b & 1) != 0) {
            p = p ^ a;
        }

        let hi_bit_set = ((a & 0x80) != 0);
        a = (a << 1) & 255;

        if (hi_bit_set) {
            a = a ^ 0x1B;
        }

        b = (b >> 1) & 255;
    }

    return p;
}

function mix_columns(s) {
    let ss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let c = 0; c < 4; c++) {
        ss[c] = (GMul(2, s[c]) ^ GMul(3, s[4 + c]) ^ s[8 + c] ^ s[12 + c]) & 255;
        ss[4 + c] = (s[c] ^ GMul(2, s[4 + c]) ^ GMul(3, s[8 + c]) ^ s[12 + c]) & 255;
        ss[8 + c] = (s[c] ^ s[4 + c] ^ GMul(2, s[8 + c]) ^ GMul(3, s[12 + c])) & 255;
        ss[12 + c] = (GMul(3, s[c]) ^ s[4 + c] ^ s[8 + c] ^ GMul(2, s[12 + c])) & 255;
    }

    return ss;
}

function reverse_mix_columns(s) {
    let ss = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let c = 0; c < 4; c++) {
        ss[c] = (GMul(14, s[c]) ^ GMul(11, s[4 + c]) ^ GMul(13, s[8 + c]) ^ GMul(9, s[12 + c])) & 255;
        ss[4 + c] = (GMul(9, s[c]) ^ GMul(14, s[4 + c]) ^ GMul(11, s[8 + c]) ^ GMul(13, s[12 + c])) & 255;
        ss[8 + c] = (GMul(13, s[c]) ^ GMul(9, s[4 + c]) ^ GMul(14, s[8 + c]) ^ GMul(11, s[12 + c])) & 255;
        ss[12 + c] = (GMul(11, s[c]) ^ GMul(13, s[4 + c]) ^ GMul(9, s[8 + c]) ^ GMul(14, s[12 + c])) & 255;
    }

    return ss;
}

function encode_string(str) {
    var bytes = []; // char codes
    var bytesv2 = []; // char codes

    for (var i = 0; i < str.length; ++i) {
        var code = str.charCodeAt(i);
        
        bytes = bytes.concat([code]);
        
        bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
    }

    return bytesv2;
}

function decode_string(byte_array) {
    let str = byte_array
    .map((byte) => {
        return String.fromCharCode(byte);
    })
    .join("");
     
    return str;
}

function encrypt(plainText, key) {
    enc_text = encode_string(plainText);

    for (let i = enc_text.length; i < 16; i++) {
        enc_text.push(0)
    }

    let round_keys = get_round_keys(expand_key(key));

    let cipher_text = addRoundKey(enc_text, round_keys[0]);

    for (let i = 1; i < 10; i++) {
        // sub bytes
        // cipher_text = get_sbox(cipher_text);

        // shift rows
        shift_rows(cipher_text);
        // mix rows
        cipher_text = mix_columns(cipher_text);
        // add round key
        cipher_text = addRoundKey(cipher_text, round_keys[i]);
    }

    
    // cipher_text = get_sbox(cipher_text);
    shift_rows(cipher_text);
    cipher_text = addRoundKey(cipher_text, round_keys[10]);

    return cipher_text;
}

function decrypt(cipher_text, key) {
    enc_text =  cipher_text;

    for (let i = enc_text.length; i < 16; i++) {
        enc_text.push(0)
    }

    let round_keys = get_round_keys(expand_key(key));

    let plain_text = addRoundKey(enc_text, round_keys[10]);
    reverse_shift_rows(plain_text);
    // plain_text = get_reverse_sbox(plain_text);

    for (let i = 9; i > 0; i--) {
        // add round key
        plain_text = addRoundKey(plain_text, round_keys[i]);
        // mix rows
        plain_text = reverse_mix_columns(plain_text);
        // shift rows
        reverse_shift_rows(plain_text);

        // sub bytes
        // plain_text = get_reverse_sbox(plain_text);
    }

    plain_text = addRoundKey(plain_text, round_keys[0]);

    return decode_string(plain_text);
}

console.log(decrypt(encrypt('asdhghfjs', key), key));

module.exports = {encrypt, decrypt};