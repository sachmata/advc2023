// https://github.com/jensyt/imurmurhash-js

export default class MurmurHash3 {
    constructor(seed) {
        this.reset(seed);
    }

    // Incrementally add a string to this hash
    //
    // @param {string} key A UTF-16 or ASCII string
    // @return {object} this
    hash(key) {
        var h1, k1, i, top, len;

        len = key.length;
        this.len += len;

        k1 = this.k1;
        i = 0;
        switch (this.rem) {
            case 0:
                k1 ^= len > i ? key.charCodeAt(i++) & 0xffff : 0;
            case 1:
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 8 : 0;
            case 2:
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 16 : 0;
            case 3:
                k1 ^= len > i ? (key.charCodeAt(i) & 0xff) << 24 : 0;
                k1 ^= len > i ? (key.charCodeAt(i++) & 0xff00) >> 8 : 0;
        }

        this.rem = (len + this.rem) & 3; // & 3 is same as % 4
        len -= this.rem;
        if (len > 0) {
            h1 = this.h1;
            while (1) {
                k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1 = (h1 * 5 + 0xe6546b64) & 0xffffffff;

                if (i >= len) {
                    break;
                }

                k1 =
                    (key.charCodeAt(i++) & 0xffff) ^
                    ((key.charCodeAt(i++) & 0xffff) << 8) ^
                    ((key.charCodeAt(i++) & 0xffff) << 16);
                top = key.charCodeAt(i++);
                k1 ^= ((top & 0xff) << 24) ^ ((top & 0xff00) >> 8);
            }

            k1 = 0;
            switch (this.rem) {
                case 3:
                    k1 ^= (key.charCodeAt(i + 2) & 0xffff) << 16;
                case 2:
                    k1 ^= (key.charCodeAt(i + 1) & 0xffff) << 8;
                case 1:
                    k1 ^= key.charCodeAt(i) & 0xffff;
            }

            this.h1 = h1;
        }

        this.k1 = k1;

        return this;
    }

    // Get the result of this hash
    //
    // @return {number} The 32-bit hash
    result() {
        var k1, h1;

        k1 = this.k1;
        h1 = this.h1;

        if (k1 > 0) {
            k1 = (k1 * 0x2d51 + (k1 & 0xffff) * 0xcc9e0000) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (k1 * 0x3593 + (k1 & 0xffff) * 0x1b870000) & 0xffffffff;
            h1 ^= k1;
        }

        h1 ^= this.len;

        h1 ^= h1 >>> 16;
        h1 = (h1 * 0xca6b + (h1 & 0xffff) * 0x85eb0000) & 0xffffffff;
        h1 ^= h1 >>> 13;
        h1 = (h1 * 0xae35 + (h1 & 0xffff) * 0xc2b20000) & 0xffffffff;
        h1 ^= h1 >>> 16;

        return h1 >>> 0;
    }

    // Reset the hash object for reuse
    //
    // @param {number} seed An optional positive integer
    reset(seed) {
        this.h1 = typeof seed === 'number' ? seed : 0;
        this.rem = this.k1 = this.len = 0;

        return this;
    }
}
