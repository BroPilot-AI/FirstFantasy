const Jimp = require('jimp');

async function removeCheckerboard(path) {
    const img = await Jimp.read(path);
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    
    const bgColors = [];
    // Collect grays from top left 32x32 block (covers standard 16x16/8x8 checkerboard)
    for(let x=0; x<32; x++){
        for(let y=0; y<32; y++){
            const rgba = Jimp.intToRGBA(img.getPixelColor(x,y));
            if (Math.abs(rgba.r - rgba.g) < 10 && Math.abs(rgba.g - rgba.b) < 10) {
                let exists = false;
                for(let b of bgColors) {
                    if (Math.abs(b.r - rgba.r) < 10) { exists = true; break; }
                }
                if (!exists) bgColors.push(rgba);
            }
        }
    }
    console.log("Found BG Colors for " + path + ":", bgColors);
    
    // Flood fill
    let visited = new Set();
    let queue = [];
    for(let i=0; i<w; i++){
        queue.push([i, 0]); queue.push([i, h-1]);
    }
    for(let j=0; j<h; j++){
        queue.push([0, j]); queue.push([w-1, j]);
    }
    
    while(queue.length > 0) {
        let [x, y] = queue.pop();
        let key = x + "," + y;
        if(visited.has(key)) continue;
        visited.add(key);
        
        let c = img.getPixelColor(x, y);
        let isBg = false;
        const target = Jimp.intToRGBA(c);
        
        for(let b of bgColors) {
            if (Math.abs(target.r - b.r) < 15 && Math.abs(target.g - b.g) < 15 && Math.abs(target.b - b.b) < 15) {
                isBg = true;
                break;
            }
        }
        
        if (isBg) {
            img.setPixelColor(0x00000000, x, y);
            if(x > 0) queue.push([x-1, y]);
            if(x < w-1) queue.push([x+1, y]);
            if(y > 0) queue.push([x, y-1]);
            if(y < h-1) queue.push([x, y+1]);
        }
    }
    
    await img.writeAsync(path);
    console.log("Processed " + path);
}

async function run() {
    await removeCheckerboard('assets/cyber_building_1775236601593.png');
    await removeCheckerboard('assets/neon_tree_1775236618044.png');
    console.log("All backgrounds removed.");
}

run();
