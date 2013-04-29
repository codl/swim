scenery = {
    files: [
        "art/SHIP1.png",
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
            // TODO màj imageData de la map
            return;
        }

        var filename = scenery.files[Math.floor(Math.random() * scenery.files.length)];

        var asset = scenery.assets[filename];
        if(!asset || asset.readyState !== 2){
            window.setTimeout(scenery.place, 0, count);
            return;
        }
        var done = false;
        var x, y;
        while(!done){
            x = Math.floor(Math.random() * (map.width - asset.image.width))
            y = Math.floor(Math.random() * (map.height - asset.image.height))
            var anchored = true
            while(true){
                for(var i = 0; anchored && i < asset.anchors.length; i++){
                    if(!map.collide(x + asset.anchors[i][0], y + asset.anchors[i][1])) anchored = false;
                }
                if(anchored){
                    done = true;
                    y -= 1;
                }
                else{
                    y += 1;
                    break;
                }
            }
        }

        map.context.drawImage(asset.canvas, x, y);

        window.setTimeout(scenery.place, 0, count-1);
    }
}

registeronload(function(){
    for(var i = 0; i < scenery.files.length; i++)
        scenery.load(scenery.files[i]);
});
