/* Addresses supplied by the project owner. Navigation always uses the Hebrew
 * address, independently of UI language. No guessed coordinates or GPS reads. */
window.YtekSites = [
 {name:'Школа «Ха-Мегиним», Хайфа',he:'בית ספר המגינים, חיפה',address:'ул. Ицхак Бен-Цви, 12, Хайфа',addressHe:'יצחק בן צבי 12, חיפה',real:true},
 {name:'Гимназия «Модиим», Рамат-Ган',he:'גימנסיה מודיעים, רמת גן',address:'ул. Ора, 6, Рамат-Ган',addressHe:'אורה 6, רמת גן',real:true},
 {name:'Школа «Орен», Хайфа',he:'בית הספר ״אורן״, חיפה',real:false},
 {name:'Школа «Римон», Кармиэль',he:'בית הספר ״רימון״, כרמיאל',real:false}
];
window.schoolCard = function(name) {
 const index=YtekSites.findIndex(s=>s.name===name),s=YtekSites[index];
 if(!s)return '<span>Ожидается назначение</span>';
 return `<div class="school-card"><h3>${s.name}</h3><p class="muted small">${s.real?s.address:'Демонстрационный объект · адрес не задан'}</p><button type="button" class="btn secondary button soft route-button" ${s.real?'':'disabled'} onclick="openSchoolRoute(${index})">Маршрут</button></div>`;
};
window.schoolLinks = function(index) {
 const s=YtekSites[index];if(!s?.real)return null;
 const query=encodeURIComponent(s.addressHe+', ישראל');
 return {waze:'https://waze.com/ul?q='+query+'&navigate=yes',google:'https://www.google.com/maps/dir/?api=1&destination='+query+'&travelmode=driving&dir_action=navigate',yandex:'yandexnavi://map_search?text='+query,web:'https://yandex.ru/maps/?text='+query};
};
window.openSchoolRoute = function(index) {
 const s=YtekSites[index],links=schoolLinks(index);if(!links)return;
 let dialog=document.getElementById('routeDialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='routeDialog';dialog.setAttribute('aria-labelledby','routeTitle');document.body.append(dialog);}
 dialog.innerHTML=`<div class="row"><h2 id="routeTitle">Выберите навигатор</h2><button type="button" class="btn secondary back" aria-label="Закрыть" onclick="document.getElementById('routeDialog').close()">×</button></div><h3>${s.name}</h3><p>${s.address}</p><div class="route-links"><a href="${links.waze}">Waze</a><a href="${links.google}">Google Maps</a><a href="${links.yandex}">Яндекс Навигатор</a></div><p class="small muted">Навигатор откроет указанный адрес. Проверьте найденную точку перед поездкой.</p><p class="small muted">Яндекс Навигатор должен быть установлен. Если он не открылся:</p><a class="link" href="${links.web}">Открыть Яндекс Карты в браузере</a>`;
 dialog.showModal();
};
