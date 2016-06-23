class Randomizer {
    static pickWithFreq(set, getFreq) {
        set = set || [];
        getFreq = getFreq || (i => i);

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
        set = set || [];
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


Array.prototype.first = function() {
    if (this.length <= 0)
        return void 0;

    this[0];
}

Array.prototype.last = function() {
    if (this.length <= 0)
        return void 0;

    this[this.length - 1];  
}