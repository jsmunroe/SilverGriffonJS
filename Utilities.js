class Randomizer {
    static nextInt(min, max) {
        if (min && !max) { // to support "nextInt(n)"
            max = min;
            min = 0;
        }

        var range = max - min;
        var value = Math.floor(Math.random() * range) + min;

        return value;
    }

    static pick(set) {
        if (!set instanceof Array || set.length <= 0)
            return null;

        var idx = Randomizer.nextInt(set.length);
        return set[idx];
    }

    static pickIndex(set) {
        if (!set instanceof Array || set.length <= 0)
            return null;

        var idx = Randomizer.nextInt(set.length);
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




// Graphs and Algorithms

// Represents an edge from source to sink with capacity
var Edge = function(source, sink, capacity) {
    this.source = source;
    this.sink = sink;
    this.capacity = capacity;
};

// Main class to manage the network
var Graph = function() {
    this.edges = {};
    this.nodes = [];
    this.nodeMap = {};
    
    // Add a node to the graph
    this.addNode = function(node) {
        if (this.nodeMap[node])
            return;

        this.nodes.push(node);
        this.nodeMap[node] = this.nodes.length-1;
        this.edges[node] = [];
    };

    // Does node exist in graph?`
    this.nodeExists = function(node) {
        return this.nodeMap[node] != void 0;
    };

    // Add an edge from source to sink with capacity
    this.addEdge = function(source, sink, capacity) {
        // Create the two edges = one being the reverse of the other    
        this.edges[source].push(new Edge(source, sink, capacity));
        this.edges[sink].push(new Edge(sink, source, capacity));
    };
    
    // Does edge from source to sink exist?
    this.edgeExists = function(source, sink) {
        if(this.edges[source] !== undefined) 
            for(var i=0;i<this.edges[source].length;i++)
                if(this.edges[source][i].sink == sink)
                    return this.edges[source][i];
        return null;
    };
};








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


/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(){

  // initialise the queue and offset
  var queue  = [];
  var offset = 0;

  // Returns the length of the queue.
  this.getLength = function(){
    return (queue.length - offset);
  }

  // Returns true if the queue is empty, and false otherwise.
  this.isEmpty = function(){
    return (queue.length == 0);
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  this.enqueue = function(item){
    queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  this.dequeue = function(){

    // if the queue is empty, return immediately
    if (queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
      queue  = queue.slice(offset);
      offset = 0;
    }

    // return the dequeued item
    return item;

  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  this.peek = function(){
    return (queue.length > 0 ? queue[offset] : undefined);
  }

}

