const https = require('https');
const fs = require('fs');
const path = require('path');

const logos = {
  rasayana: 'https://gamaforce.wg.ugm.ac.id/wp-content/uploads/sites/724/2021/03/LogoRasayana2017Kotak-v1-1.png',
  fiachra: 'https://gamaforce.wg.ugm.ac.id/wp-content/uploads/sites/724/2021/03/Fiachra-FW-1.png',
  khageswara: 'https://gamaforce.wg.ugm.ac.id/wp-content/uploads/sites/724/2021/03/Khageswara-1.png',
  virachakra: 'https://gamaforce.wg.ugm.ac.id/wp-content/uploads/sites/724/2024/03/LOGO-VIRA.png',
  vayuastra: 'https://gamaforce.wg.ugm.ac.id/wp-content/uploads/sites/724/2023/10/vayuastra.png' 
};

const dir = path.join(__dirname, 'public', 'teams');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

Object.entries(logos).forEach(([name, url]) => {
  const dest = path.join(dir, `${name}.png`);
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if(response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${name}`);
      });
    } else {
      console.log(`Failed to download ${name}: ${response.statusCode}`);
      // fallback search for vayuastra
      if (name === 'vayuastra') {
          https.get('https://gamaforce.wg.ugm.ac.id/', (resp) => {
              let data = '';
              resp.on('data', (chunk) => { data += chunk; });
              resp.on('end', () => {
                  const match = data.match(/<img[^>]+src="([^">]+vayuastra[^">]*)"/i);
                  if (match) {
                      console.log('Found vayuastra at', match[1]);
                      const newFile = fs.createWriteStream(dest);
                      https.get(match[1].replace('-150x150', '').replace('-300x300', ''), (res) => { res.pipe(newFile); });
                  } else {
                      console.log('Vayuastra not found on homepage');
                  }
              });
          });
      }
    }
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading ${name}: ${err.message}`);
  });
});
