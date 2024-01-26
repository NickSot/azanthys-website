const { assert } = require('console');
const fs = require('fs');

assert(fs.existsSync('./key.txt'));

// define the key
const key = fs.readFileSync('./key.txt').toString().split(' ').map((element) => {
    return parseInt(element);
});

// function to get the sbox of a state
function get_sbox(state) {
    s_box = []

    const s_box_lookup = [
        [0x63,  0x7c,   0x77,   0x7b,   0xf2,   0x6b,   0x6f,   0xc5,   0x30,   0x01,   0x67,   0x2b,   0xfe,   0xd7,   0xab,   0x76],
        [0xca,  0x82,   0xc9,   0x7d,   0xfa,   0x59,   0x47,   0xf0,   0xad,   0xd4,   0xa2,   0xaf,   0x9c,   0xa4,   0x72,   0xc0],
        [0xb7,	0xfd,	0x93,	0x26,	0x36,	0x3f,	0xf7,	0xcc,	0x34,	0xa5,	0xe5,	0xf1,	0x71,	0xd8,	0x31,	0x15],
        [0x04,	0xc7,	0x23,	0xc3,	0x18,	0x96,	0x05,	0x9a,	0x07,	0x12,	0x80,	0xe2,	0xeb,	0x27,	0xb2,	0x75],
        [0x09,	0x83,	0x2c,	0x1a,	0x1b,	0x6e,	0x5a,	0xa0,	0x52,	0x3b,	0xd6,	0xb3,	0x29,	0xe3,	0x2f,	0x84],
        [0x53,	0xd1,	0x00,	0xed,	0x20,	0xfc,	0xb1,	0x5b,	0x6a,	0xcb,	0xbe,	0x39,	0x4a,	0x4c,	0x58,	0xcf],
        [0xd0,	0xef,	0xaa,	0xfb,	0x43,	0x4d,	0x33,	0x85,	0x45,	0xf9,	0x02,	0x7f,	0x50,	0x3c,	0x9f,	0xa8],
        [0x51,	0xa3,	0x40,	0x8f,	0x92,	0x9d,	0x38,	0xf5,	0xbc,	0xb6,	0xda,	0x21,	0x10,	0xff,	0xf3,	0xd2],
        [0xcd,	0x0c,	0x13,	0xec,	0x5f,	0x97,	0x44,	0x17,	0xc4,	0xa7,	0x7e,	0x3d,	0x64,	0x5d,	0x19,	0x73],
        [0x60,	0x81,	0x4f,	0xdc,	0x22,	0x2a,	0x90,	0x88,	0x46,	0xee,	0xb8,	0x14,	0xde,	0x5e,	0x0b,	0xdb],
        [0xe0,	0x32,	0x3a,	0x0a,	0x49,	0x06,	0x24,	0x5c,	0xc2,	0xd3,	0xac,	0x62,	0x91,	0x95,	0xe4,	0x79],
        [0xe7,	0xc8,	0x37,	0x6d,	0x8d,	0xd5,	0x4e,	0xa9,	0x6c,	0x56,	0xf4,	0xea,	0x65,	0x7a,	0xae,	0x08],
        [0xba,	0x78,	0x25,	0x2e,	0x1c,	0xa6,	0xb4,	0xc6,	0xe8,	0xdd,	0x74,	0x1f,	0x4b,	0xbd,	0x8b,	0x8a],
        [0x70,	0x3e,	0xb5,	0x66,	0x48,	0x03,	0xf6,	0x0e,	0x61,	0x35,	0x57,	0xb9,	0x86,	0xc1,	0x1d,	0x9e],
        [0xe1,	0xf8,	0x98,	0x11,	0x69,	0xd9,	0x8e,	0x94,	0x9b,	0x1e,	0x87,	0xe9,	0xce,	0x55,	0x28,	0xdf],
        [0x8c,	0xa1,	0x89,	0x0d,	0xbf,	0xe6,	0x42,	0x68,	0x41,	0x99,	0x2d,	0x0f,	0xb0,	0x54,	0xbb,	0x16]
    ];


    for (let i = 0; i < state.length; i++) {
        state_hex = state[i].toString(16);

        if (state_hex.length == 2) {
            s_box.push(s_box_lookup[parseInt(`${state_hex[0]}`, 16)][parseInt(`${state_hex[1]}`, 16)]);
        }
        else {
            s_box.push(s_box_lookup[0][parseInt(`${state_hex[0]}`, 16)]);        
        }
    }

    return s_box;
}

// function to get the reverse sbox of an sboxed state
function get_reverse_sbox(state) {
    let s_box = [];

    let inverse_s_box_lookup = [
        [0x52,	0x09,	0x6a,	0xd5,	0x30,	0x36,	0xa5,	0x38,	0xbf,	0x40,	0xa3,	0x9e,	0x81,	0xf3,	0xd7,	0xfb],
        [0x7c,	0xe3,	0x39,	0x82,	0x9b,	0x2f,	0xff,	0x87,	0x34,	0x8e,	0x43,	0x44,	0xc4,	0xde,	0xe9,	0xcb],
        [0x54,	0x7b,	0x94,	0x32,	0xa6,	0xc2,	0x23,	0x3d,	0xee,	0x4c,	0x95,	0x0b,	0x42,  0xfa,	0xc3,	0x4e],
        [0x08,	0x2e,	0xa1,	0x66,	0x28,	0xd9,	0x24,	0xb2,	0x76,	0x5b,	0xa2,	0x49,	0x6d,	0x8b,	0xd1,	0x25],
        [0x72,	0xf8,	0xf6,	0x64,	0x86,	0x68,	0x98,	0x16,	0xd4,	0xa4,	0x5c,	0xcc,	0x5d,	0x65,	0xb6,	0x92],
        [0x6c,	0x70,	0x48,	0x50,	0xfd,	0xed,	0xb9,	0xda,	0x5e,	0x15,	0x46,	0x57,	0xa7,	0x8d,	0x9d,	0x84],
        [0x90,	0xd8,	0xab,	0x00,	0x8c,	0xbc,	0xd3,	0x0a,	0xf7,	0xe4,	0x58,	0x05,	0xb8,	0xb3,	0x45,	0x06],
        [0xd0,	0x2c,	0x1e,	0x8f,	0xca,	0x3f,	0x0f,	0x02,	0xc1,	0xaf,	0xbd,	0x03,	0x01,	0x13,	0x8a,	0x6b],
        [0x3a,	0x91,	0x11,	0x41,	0x4f,	0x67,	0xdc,	0xea,	0x97,	0xf2,	0xcf,	0xce,	0xf0,	0xb4,	0xe6,	0x73],
        [0x96,	0xac,	0x74,	0x22,	0xe7,	0xad,	0x35,	0x85,	0xe2,	0xf9,	0x37,	0xe8,	0x1c,	0x75,	0xdf,	0x6e],
        [0x47,	0xf1,	0x1a,	0x71,	0x1d,	0x29,	0xc5,	0x89,	0x6f,	0xb7,	0x62,	0x0e,	0xaa,	0x18,	0xbe,	0x1b],
        [0xfc,	0x56,	0x3e,	0x4b,	0xc6,	0xd2,	0x79,	0x20,	0x9a,	0xdb,	0xc0,	0xfe,	0x78,	0xcd,	0x5a,	0xf4],
        [0x1f,	0xdd,	0xa8,	0x33,	0x88,	0x07,	0xc7,	0x31,	0xb1,	0x12,	0x10,	0x59,	0x27,	0x80,	0xec,	0x5f],
        [0x60,	0x51,	0x7f,	0xa9,	0x19,	0xb5,	0x4a,	0x0d,	0x2d,	0xe5,	0x7a,	0x9f,	0x93,	0xc9,	0x9c,	0xef],
        [0xa0,	0xe0,	0x3b,	0x4d,	0xae,	0x2a,	0xf5,	0xb0,	0xc8,	0xeb,	0xbb,	0x3c,	0x83,	0x53,	0x99,	0x61],
        [0x17,	0x2b,	0x04,	0x7e,	0xba,	0x77,	0xd6,	0x26,	0xe1,	0x69,	0x14,	0x63,	0x55,	0x21,	0x0c,	0x7d]
    ];
 
    for (let i = 0; i < state.length; i++) {
        state_hex = state[i].toString(16);

        if (state_hex.length == 2) {
            s_box.push(inverse_s_box_lookup[parseInt(`${state_hex[0]}`, 16)][parseInt(`${state_hex[1]}`, 16)]);
        }
        else {
            s_box.push(inverse_s_box_lookup[0][parseInt(`${state_hex[0]}`, 16)]);        
        }
    }

    return s_box;
}

// key expansion algorithm
function expand_key(key) {
    rcon = [1, 2, 4, 8, 10, 32, 64, 128, 27, 54]

    let final_key = [];

    // weird inner loops, as there should be a 1-byte shift for key each position,
    // according to the protocol description
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
                    shifted.push(final_key[(i - 1) * 4 + k + (j + 1) % 4]);
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

// mix columns algorithm, as per algorithm specification
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

// reverse mix columns algorithm, as per algorithm specification
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

// encode a string into an array of bytes
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

// decode an array of bytes into a utf-8 string
function decode_string(byte_array) {
    let str = byte_array
    .map((byte) => {
        return String.fromCharCode(byte);
    })
    .join("");
     
    return str;
}

// encrypt a plain text using the key
function encrypt(plainText, key) {
    enc_text = encode_string(plainText);

    for (let i = enc_text.length; i < 16 * (plainText.length % 16); i++) {
        enc_text.push(0)
    }

    // segment the plain text into 16-byte chunks and encrypt each separately
    let enc_text_segments = [[]]
    let counter = 0;

    for (let i = 0; i < enc_text.length; i++) {
        if (i % 16 == 0 && i > 0) {
            enc_text_segments.push([]);
            counter++;
        }

        enc_text_segments[counter].push(enc_text[i]);
    }

    let ciphers = [];

    // encryption
    enc_text_segments.forEach((enc_text) => {
        let round_keys = get_round_keys(expand_key(key));

        let cipher_text = addRoundKey(enc_text, round_keys[0]);

        for (let i = 1; i < 10; i++) {
            // sub bytes
            cipher_text = get_sbox(cipher_text);

            // shift rows
            shift_rows(cipher_text);
            // mix rows
            cipher_text = mix_columns(cipher_text);
            // add round key
            cipher_text = addRoundKey(cipher_text, round_keys[i]);
        }
        
        cipher_text = get_sbox(cipher_text);
        shift_rows(cipher_text);
        cipher_text = addRoundKey(cipher_text, round_keys[10]);

        let enc_cipher =  cipher_text;

        for (let i = enc_cipher.length; i < 16; i++) {
            enc_cipher.push(0)
        }

        ciphers.push(cipher_text);
    });

    return ciphers;
}

// decrypt the plain text using the key
function decrypt(ciphers, key) {
    let plains = [];

    // decryption
    ciphers.forEach((cipher_text) => {
        let round_keys = get_round_keys(expand_key(key));

        let plain_text = addRoundKey(cipher_text, round_keys[10]);
        reverse_shift_rows(plain_text);
        plain_text = get_reverse_sbox(plain_text);

        for (let i = 9; i > 0; i--) {
            // add round key
            plain_text = addRoundKey(plain_text, round_keys[i]);
            // mix rows
            plain_text = reverse_mix_columns(plain_text);
            // shift rows
            reverse_shift_rows(plain_text);

            // sub bytes
            plain_text = get_reverse_sbox(plain_text);
        }

        plain_text = addRoundKey(plain_text, round_keys[0]);

        plains.push(plain_text);
    });

    plains = plains.filter(item => !(item.every(element => element == 0)));

    // concatenate the decrypted 16-byte chunks
    let plain_text = plains.flat();

    return decode_string(plain_text);
}

module.exports = {encrypt, decrypt};