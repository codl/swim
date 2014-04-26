var map = {
    width: 5000,
    height: 2000,
    render: function(){
        context.drawImage(map.canvas, -viewport.x, -viewport.y);
    },
    collide: function(x, y){
        return x < 0 || x >= map.width ||
            y < 50 || y >= map.height ||
            map.imageData.data[(x + y*map.width) * 4 + 3] === 255;
    },

    generate: function generate(){
        var worker = new Worker('map_worker.js');
        console.log("generate!");
        worker.onmessage = function(e){
            if(e.data[0] == 'done'){
                var img = map.context.getImageData(0, 0, map.width, map.height);

                var mapdata = e.data[1];

                for (var i = 0; i < mapdata.length; i++){
                    var r, g, b;
                    r = g = b = 255;
                    var a = (mapdata[i] == FULL)? 255 : (mapdata[i] == FULLBG)? 31 : 0;
                    img.data[i*4 + 0] = r;
                    img.data[i*4 + 1] = g;
                    img.data[i*4 + 2] = b;
                    img.data[i*4 + 3] = a;
                }

                map.context.putImageData(img, 0, 0);
                map.imageData = img;

                scenery.place(70);
                fish.spawn(700);

                // place player
                x = -1; y = -1;
                while(map.collide(x, y)){
                    x = Math.floor(Math.random() * map.width);
                    y = Math.floor(Math.random() * 50) + 50;
                }
                player.realx = x;
                player.realy = y;

                // place viewpoint
                viewport.x = x - 100;
                viewport.y = y - 100;

                if(map.onready) map.onready();
            }
            else if(e.data[0] == 'log'){
                console.log(e.data[1]);
            }
            else if(e.data[0] == 'progress'){
                progress(e.data[1], "Generating map...");
            }
        };

        worker.postMessage({width: map.width, height: map.height});
    }

};

registeronload(function(){
    map.canvas = document.createElement("canvas");
    map.canvas.height = map.height;
    map.canvas.width = map.width;
    map.context = map.canvas.getContext("2d");
    map.perlin = new ClassicalNoise();
});
