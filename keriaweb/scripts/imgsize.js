const fs = require('fs');

function getDimensions(file) {
    // very basic png dimension reader
    const data = fs.readFileSync(file);
    if (data.toString('ascii', 1, 4) === 'PNG') {
        const width = data.readUInt32BE(16);
        const height = data.readUInt32BE(20);
        console.log(`${file}: ${width}x${height}`);
    }
}

getDimensions('c:/Users/MY-PC/Downloads/keria/keria-web-user-main/keriaweb/public/images/stream-donate/soop_link.png');
getDimensions('c:/Users/MY-PC/Downloads/keria/keria-web-user-main/keriaweb/public/images/stream-donate/pin_icon.png');
