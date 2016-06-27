class Randomizer {
    static pick(set) {
        if (!set instanceof Array || set.length <= 0)
            return null;

        var idx = Math.floor(Math.random() * set.length);
        return set[idx];
    }

    static pickIndex(set) {
        if (!set instanceof Array || set.length <= 0)
            return null;

        var idx = Math.floor(Math.random() * set.length);
        return idx;
    }

    static pickWithFreq(set, getFreq) {
        if (!set instanceof Array || set.length <= 0)
            return null;

        if (!getFreq instanceof Function)
            getFreq = (i => i);

        var totalFreq = set.sum(i => getFreq(i));
        var ordered = set.orderBy(i => getFreq(i));

        var factor = Math.random() * totalFreq;

        var picked;

        for (var i = 0; i <= set.length; i++) {
            var item = set[i];
            
            var freq = getFreq(item);
            if (freq > factor) {
                return item;
            }

            factor -= freq;
        }

        return null;
    }

    static pickIndexWithFreq(set, getFreq) {
        if (!set instanceof Array || set.length <= 0)
            return null;

        getFreq = getFreq || (i => i);

        var totalFreq = set.sum(i => getFreq(i));
        var ordered = set.orderBy(i => getFreq(i));

        var factor = Math.random() * totalFreq;

        var picked;

        for (var i = 0; i <= set.length; i++) {
            var item = set[i];
            
            var freq = getFreq(item);
            if (freq > factor) {
                return i;
            }

            factor -= freq;
        }

        return -1;
    }
}

// String extensions

String.prototype.equalsNoCase = function(other) {
    return this.toLocaleLowerCase() === (other + '').toLocaleLowerCase();
}



// Array extensions

Array.prototype.orderBy = function(selector, compare) {
    selector = selector || (a => a);
    compare = compare || this._compare;

    var ordered = this.slice(0);
    ordered.sort((a,b) => compare(selector(a), selector(b)));

    return ordered;
}

Array.prototype._compare = function(first, second) {
    if (first < second) 
        return -1;
    else if (first > second) 
        return 1;
    else 
        return 0;
}

Array.prototype.sum = function(selector) {
    var sum = 0;

    this.forEach(i => {
        sum += selector(i);
    });

    return sum;
}


Array.prototype.first = function(predicate) {
    if (this.length <= 0)
        return void 0;

    if (!predicate)
        return this[0];
    
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (predicate(item)) {
            return item;
        }
    }
    return void 0;
}

Array.prototype.last = function() {
    if (this.length <= 0)
        return void 0;

    this[this.length - 1];
}

Array.prototype.where = function(predicate) {
    var res = [];

    this.forEach(i => {
        if (predicate(i))
            res.push(i);
    });

    return res;
}
