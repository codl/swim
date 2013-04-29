scenery = {
    files: [
        "art/SHIP1.png",
        "art/SHIP2.png",
        "art/SHIP3.png",
        "art/AIR1.png",
        "art/BRUSH0.png",
        "art/BRUSH1.png",
        "art/BRUSH2.png",
        "art/BRUSH3.png",
        "art/BRUSH4.png",
        "art/BRUSH5.png",
        "art/BRUSH6.png",
        "art/BRUSH7.png",
        "art/BRUSH8.png",
        "art/BRUSH9.png",
        "art/BRUSH10.png",
        "art/BRUSH11.png",
        "art/BRUSH12.png",
        "art/BRUSH13.png",
        "art/BRUSH14.png"
    ],
    assets: {},
    load: function(filename){
        with(scenery){
            if(!assets[filename]){
                assets[filename] = {
                    image: new Image(),
                    readyState: 0
                }
                assets[filename].image.src = filename;
                assets[filename].image.onload = function(){
                    assets[filename].readyState = 1;
                    scenery.load(filename);
                };
            }
            else if(assets[filename].readyState === 1){
                with(assets[filename]){
                    assets[filename].canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    assets[filename].context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0);
                    var img = context.getImageData(0, 0, image.width, image.height);
                    assets[filename].anchors = findAnchors(img);
                    context.putImageData(img, 0, 0);
                    readyState = 2;
                }
            }
        }
    },

    findAnchors: function(img){
        var anchors = []
        for(var x = 0; x < img.width; x++)
            for(var y = 0; y < img.height; y++)
                if(img.data[(x + y * img.width) * 4 + 0] == 0 &&
                        img.data[(x + y * img.width) * 4 + 1] == 255 &&
                        img.data[(x + y * img.width) * 4 + 2] == 0 &&
                        img.data[(x + y * img.width) * 4 + 3] == 255){
                    anchors.push([x, y]);
                    img.data[(x + y * img.width) * 4 + 0] = 255;
                    img.data[(x + y * img.width) * 4 + 2] = 255;
                }
        return anchors;

    },

    place: function(count){
        if(count <= 0){
            console.log("Done placing scenery.");
            map.imageData = map.context.getImageData(0, 0, map.width, map.height);
            if(scenery.onready){
                var f = scenery.onready;
                scenery.onready = null;
                f();
            }
            return;
        }

        var filename = scenery.files[Math.floor(Math.random() * scenery.files.length)];

        progress(98, "Placing scenery: " + filename + "...");

        var asset = scenery.assets[filename];
        if(!asset || asset.readyState !== 2){
            window.setTimeout(scenery.place, 0, count);
            return;
        }
        var done = false;
        var touched_water = false;
        var touched_ground= false;
        var x = Math.floor(Math.random() * map.width);
        var y = Math.floor(Math.random() * map.height);
        var tries = 0;
        var f = function(){
            tries += 1;
            if(asset.anchors.length === 0){
                console.error("This piece of scenery doesn't have any anchors: " + filename);
                window.setTimeout(scenery.place, 0, count-1);
            }
            var anchored = true
            for(var i = 0; anchored && i < asset.anchors.length; i++){
                if(!map.collide(x + asset.anchors[i][0], y + asset.anchors[i][1])){
                    anchored = false;
                    break;
                }
            }
            if(touched_ground && touched_water){
                done = true;
                if(!anchored)
                    y += 1;
            }
            else if(anchored){
                touched_ground = true;
                y -= 1;
            }
            else{
                touched_water = true;
                y += 1;
            }
            if(!done){
                if(tries > map.height){
                    console.warn("Giving up on " + filename);
                    window.setTimeout(scenery.place, 0, count-1);
                }
                else if(tries % 1000 === 0){
                    window.setTimeout(f, 0);
                }
                else
                    f();
                return;
            }
            else{
                map.context.drawImage(asset.canvas, x, y);
                window.setTimeout(scenery.place, 0, count-1);
            }
        }
        f();
    }
}

registeronload(function(){
    for(var i = 0; i < scenery.files.length; i++)
        scenery.load(scenery.files[i]);
});
