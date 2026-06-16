let scriptCalistir = document.getElementById('scriptCalistir');
let animasyonButon = document.getElementById('animasyonButon');

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function sayfaAcikMi() {
    let tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0]?.url?.includes('udim.koeri.boun.edu.tr/zeqmap/hgmmap.asp') || false;
}

scriptCalistir.addEventListener('click', async () => {
  let tab = await getCurrentTab();

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['script2.js']
  });
});

document.addEventListener('DOMContentLoaded', function() {
    // URL'yi yeni sekmede aç
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            chrome.tabs.create({ url: this.href });
        });
    });

    // Animasyon butonu için event listener
    document.getElementById('animasyonButon').addEventListener('click', async () => {
        if (!(await sayfaAcikMi())) {
            alert('Lütfen önce Kandilli Rasathanesi sayfasını açın!');
            return;
        }

        let tab = await getCurrentTab();
        const secilenSure = parseInt(document.getElementById('hizSecici')?.value || '150');
        
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: animasyonBaslat,
            args: [secilenSure]
        });
    });
});

function animasyonBaslat(timeout) {
  alert("animasyon başladı");
  console.log('animasyonBaslat tıklandı...')
  const imgTags = document.querySelectorAll('img.leaflet-marker-icon');
 
  //window.location='http://udim.koeri.boun.edu.tr/zeqmap/hgmmap.asp';
  const titleValues = [];

  for (let imgTag of imgTags) {
    titleValues.push(imgTag.title);
    imgTag.style.opacity = '0.5';
  }

  //titleValues.sort((a, b) => b.localeCompare(a));
  titleValues.sort((a, b) => a.localeCompare(b));

  const tdTag = document.querySelector(`td#clatlon`);

  for (let i = 0; i < titleValues.length; i++) {
    const currentTitle = titleValues[i];
    const currentImgTag = document.querySelector(`img.leaflet-marker-icon[title="${currentTitle}"]`);

    currentImgTag.style.display = 'none';

    setTimeout(() => {
      tdTag.innerHTML = currentTitle;
      currentImgTag.style.display = 'block';

    }, timeout * (i + 1));
  }
};