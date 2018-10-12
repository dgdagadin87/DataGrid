const ENUM_ID = typeof Symbol === 'function' ? Symbol('enumeration id') : 1e+6;

const create_index = (items, indexBy) => {
    return items    
        .reduce((a,item) => {
            if (indexBy) {
                if (Array.isArray(indexBy) && indexBy.length > 0 && indexBy.every(k => item.hasOwnProperty(k))) {
                    let values = indexBy.map(k => item[k]);
                    const idx = get_hash (values);
                    if (idx) {
                        a[idx] = item;
                    }                
                }
                else if (typeof indexBy === 'string' && item.hasOwnProperty(indexBy)) {
                    const idx = item[indexBy];
                    if (idx) {
                        a[idx] = item;
                    }
                }
            }          
            else {
                item[ENUM_ID] = (0 | Math.random() * 9e+6).toString(36);
                a[ENUM_ID] = item;
            }  
            return a;
        },{});
};

const get_hash = values => {
    if (Array.isArray (values) && values.length > 0) {
        return btoa (values.join(''));
    }
    else if (typeof values === 'string') {
        return btoa(values);
    }
    else {
        return null;
    }
};

const rnd_str = L => {
    var s = '';
    var rnd_chr = () => {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    }
    while (s.length < L) s += rnd_chr();
    return s;
};

const serialize = obj => {
    return Object.keys(obj).map(k => obj[k]);
};

const sort = (items, field, asc) => {
    if (field) {
        return items
        .map((e, i) => { return {i: i, v: e}; })
        .sort((a, b) => {
            var left = a.v[field], right = b.v[field];

            if(left == null && right != null){
                return asc ? -1 : 1;
            }

            if(left != null && right == null){
                return asc ? 1 : -1;
            }

            if(typeof left == 'string') {
                left = left.toLowerCase();
            }

            if(typeof right == 'string') {
                right = right.toLowerCase();
            }

            if(left < right){
                return asc ? -1 : 1;
            }
            else if(left > right){
                return asc ? 1 : -1;
            }
            else if(left == right){
                var i = a.index, k = b.index;
                if(i < k){
                    return asc ? -1 : 1;
                }
                else if(i > k){
                    return asc ? 1 : -1;
                }
                else {
                    return 0;
                }
            }
        })
        .map(e => e.v);
    }
    else {
        return items;
    }
};

function convert_data ({fields, values, types}) {
    return values.map(x => {
        let item = fields.reduce((a, k, i) => {
            switch(types[i]){
                default:                    
                    a[k] = x[i];
                    break;                   
                case 'date':
                    switch (typeof x[i]) {
                        case 'string':
                            a[k] = new Date(x[i]);
                            break;
                        case 'number':
                            a[k] = new Date(x[i] * 1000);
                            break;
                        default:
                            break;
                    }                    
                    break;
                case 'time':
                    break;
            }
            switch (k) {
                case 'stereo':
                    const s = x[i];
                    a.stereo = typeof s === 'string' && s !== 'NONE';
                    break;                    
                default:
                    break;
            }
            return a;                    
        }, {});
        item.url = `//search.kosmosnimki.ru/QuickLookImage.ashx?id=${item.sceneid}`;
        return item;
    });    
}

export {create_index, serialize, sort, convert_data};