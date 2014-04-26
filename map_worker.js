onmessage = function onmessage(e){
    genMap(e.data.width, e.data.height);
};

importScripts('map_constants.js');

function log(msg){
    postMessage(['log', msg]);
}

function genMap(width, height){
    log('hi');
    var WORKERCOUNT = 10;

    // an array of 256 integers to seed the noise generators
    var seed = [];
    for(var _ = 0; _ < 256; _++)
        seed.push(Math.random());

    // initialize map, queues, workers, processed counter
    var map = [];
    for(_ = 0; _ < width * height; _++)
        map.push(UNKNOWN);

    var workers = [];

    var processed = 0, waiting = 0;

    function queue(x, y, z){
        map[x + width*y] = QUEUED;
        waiting += 1;
        workers[Math.floor(Math.random()) % WORKERCOUNT]
            .postMessage(["req", [x, y, z]]);
    }

    function receive(e){
        if(e.data[0] == 'resp'){
            processed += 1; waiting -= 1;
            var coords = e.data[1];
            var x = coords[0];
            var y = coords[1];
            var z = coords[2];
            var value = e.data[2];
            if(value > 0){
                map[width*y + x] = (z === 0)?FULL:FULLBG;
                if(x > 0 && map[width*y + x-1] === UNKNOWN)
                    queue(x-1, y, 0);
                if(x < width - 1 && map[width*y + x+1] === UNKNOWN)
                    queue(x+1, y, 0);
                if(y > 0 && map[width*(y-1) + x] === UNKNOWN)
                    queue(x, y-1, 0);
                if(y < width - 1 && map[width*(y+1) + x] === UNKNOWN)
                    queue(x, y+1, 0);
            }
            else {
                if(z === 0)
                    queue(x, y, 0.5);
                else
                    map[x + y*width] = EMPTY;
            }
            if(Math.floor(Math.random()*1000) == 1)
                postMessage(['progress', x/width * 90]);
            if(waiting <= 0){
                if(processed < width * height / 8)
                    // We landed on a tiny island or empty space, try again
                    setTimeout(genMap(width, height), 0);
                else {
                    postMessage(['done', map]);
                }
            }
        }
        else if(e.data[0] == 'log')
            log(e.data[1]);
        else
            throw ["whoa son what even is this?", e.data];
    }

    for(var i = 0; i < WORKERCOUNT; i++){
        workers[i] = new Worker('perlin_worker.js');
        workers[i].onmessage = receive;
        workers[i].postMessage(['seed', seed]);
        workers[i].postMessage(['size', [width, height]]);
    }

    queue(0, height-1, 0);
    log("bums");
}
