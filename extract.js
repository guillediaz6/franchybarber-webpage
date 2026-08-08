const fs = require('fs');
const path = require('path');

function processHtmlFile(htmlPath, cssPath, jsPath, cssHref, jsSrc) {
  let content = fs.readFileSync(htmlPath, 'utf-8');

  // Extract CSS
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    let cssContent = styleMatch[1];
    cssContent = cssContent.replace(/url\('fondo\.png'\)/g, "url('../img/fondo.png')");
    cssContent = cssContent.replace(/url\('portada\.jpeg'\)/g, "url('../img/portada.jpeg')");
    cssContent = cssContent.replace(/url\('historia_barber\.jpg'\)/g, "url('../img/historia_barber.jpg')");
    
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
    fs.writeFileSync(cssPath, cssContent.trim() + '\n', 'utf-8');
    
    content = content.replace(styleMatch[0], `<link rel="stylesheet" href="${cssHref}">`);
  }

  // Extract JS
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    let jsContent = scriptMatch[1];
    
    fs.mkdirSync(path.dirname(jsPath), { recursive: true });
    fs.writeFileSync(jsPath, jsContent.trim() + '\n', 'utf-8');
    
    content = content.replace(scriptMatch[0], `<script src="${jsSrc}"></script>`);
  }

  // Update HTML images
  content = content.replace(/src="logo\.png"/g, 'src="img/logo.png"');
  content = content.replace(/src="letrero\.png"/g, 'src="img/letrero.png"');
  content = content.replace(/src="portada\.jpeg"/g, 'src="img/portada.jpeg"');
  content = content.replace(/src="historia_barber\.jpg"/g, 'src="img/historia_barber.jpg"');
  content = content.replace(/src="(gallery-\d+\.jpg)"/g, 'src="img/$1"');

  fs.writeFileSync(htmlPath, content, 'utf-8');
}

processHtmlFile('index.html', 'css/styles.css', 'js/main.js', 'css/styles.css', 'js/main.js');
processHtmlFile('historia.html', 'css/historia.css', 'js/historia.js', 'css/historia.css', 'js/historia.js');
console.log('Done!');
