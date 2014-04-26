importScripts('perlin-noise-classical.js');
var noise = new ClassicalNoise();

//                 range in, range out
function linear(i, a1, b1,   a2, b2   ){
    return ((i - a1) * (b2 - a2) / (b1 - a1)) + a2;
}

function value(x, y, z){
    return noise.noise(x/900, y/900, z?z:0) +
        noise.noise(x/250, y/250, z?z:0) +
        noise.noise(x/90, y/60, z?z:0)/9 +
        noise.noise(x/3, y/3, 0)/100 +
        linear(y, 0, height, -1, 1) +
        Math.pow(linear(x, 0, width, -1, 1), 4);
}

function FakeRandom(values){
    this.values = values;
    this.random = function random(){
        return this.values.pop();
    };
    return this;
}

var width = 0;
var height = 0;

onmessage = function(e){
    if(e.data[0] == 'seed'){ // ['seed', [123, 456, 789, ...]]
        noise = new ClassicalNoise(new FakeRandom(e.data[1]));
    }
    else if(e.data[0] == 'size'){
        width = e.data[1][0];
        height = e.data[1][1];
    } else if(e.data[0] == 'req'){
        postMessage(['resp', e.data[1], value(e.data[1][0], e.data[1][1], e.data[1][2])]);
    }
};
