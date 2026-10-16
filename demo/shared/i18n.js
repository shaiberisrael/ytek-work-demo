/* Presentation adapter for the standalone demo: never translate stored values.
 * Original copy is retained per node so switching languages preserves live forms.
 * Employee text must be enclosed in [translate="no"]. */
(() => {
  const dictionary = window.YtekHebrew;
  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('(?<![А-Яа-яЁё])(' + Object.keys(dictionary).sort((a,b)=>b.length-a.length).map(escapeRegex).join('|') + ')(?![А-Яа-яЁё])', 'g');
  let lang = 'ru';
  try { if (localStorage.getItem('ytek-language') === 'he') lang = 'he'; } catch {}
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const translate = source => lang === 'he' ? source.replace(pattern, key => dictionary[key]) : source;
  const excluded = el => el.closest('script,style,[translate="no"],textarea');
  const observer = new MutationObserver(() => refresh());
  const config = {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['title','aria-label','placeholder','alt']};
  function refresh() {
    observer.disconnect();
    document.querySelectorAll('[data-today-date]').forEach(el=>el.textContent=new Date().toLocaleDateString(lang==='he'?'he-IL':'ru-RU',{day:'numeric',month:'long'}));
    // An option without an explicit value would otherwise change its business value.
    document.querySelectorAll('option:not([value])').forEach(el => el.value = el.textContent);
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement || excluded(node.parentElement)) continue;
      let record = originals.get(node);
      if (!record || node.data !== record.last) record = {source:node.data};
      record.last = translate(record.source);
      if (node.data !== record.last) node.data = record.last;
      originals.set(node,record);
    }
    document.querySelectorAll('[title],[aria-label],[placeholder],[alt],input[disabled]').forEach(el => {
      if (excluded(el)) return;
      const records = attributes.get(el) || {};
      for (const key of ['title','aria-label','placeholder','alt', ...(el.matches('input[disabled]')?['value']:[])]) {
        const current = el.getAttribute(key);
        if (current === null) continue;
        let record = records[key];
        if (!record || current !== record.last) record = {source:current};
        record.last = translate(record.source);
        if (current !== record.last) el.setAttribute(key,record.last);
        records[key] = record;
      }
      attributes.set(el,records);
    });
    document.querySelectorAll('.language-select').forEach(el=>el.value=lang);
    observer.observe(document.documentElement,config);
  }
  function setLanguage(value) {
    lang = value === 'he' ? 'he' : 'ru';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    try { localStorage.setItem('ytek-language',lang); } catch {}
    refresh();
    document.dispatchEvent(new CustomEvent('ytek-language-change',{detail:lang}));
  }
  window.YtekI18n = {get lang(){return lang},get locale(){return lang==='he'?'he-IL':'ru-RU'},t:translate,setLanguage,refresh};
  const picker = document.createElement('select');
  picker.className = 'language-select';
  picker.setAttribute('translate','no');
  picker.setAttribute('aria-label','Язык / שפה');
  picker.innerHTML = '<option value="ru" lang="ru">Русский</option><option value="he" lang="he">עברית</option>';
  picker.onchange = () => setLanguage(picker.value);
  (document.querySelector('.header-right') || document.querySelector('.top')).append(picker);
  document.addEventListener('invalid',event=>{
    const input=event.target;
    if(!input.setCustomValidity)return;
    input.setCustomValidity('');
    const v=input.validity;
    const ru=v.valueMissing?'Заполните это поле.':v.tooShort?`Минимум ${input.minLength} символов.`:v.rangeUnderflow?`Минимум: ${input.min}.`:v.rangeOverflow?`Максимум: ${input.max}.`:'Проверьте введённое значение.';
    const he=v.valueMissing?'יש למלא שדה זה.':v.tooShort?`לפחות ${input.minLength} תווים.`:v.rangeUnderflow?`מינימום: ${input.min}.`:v.rangeOverflow?`מקסימום: ${input.max}.`:'יש לבדוק את הערך שהוזן.';
    input.setCustomValidity(lang==='he'?he:ru);
  },true);
  document.addEventListener('input',event=>event.target.setCustomValidity?.(''));
  document.addEventListener('ytek-language-change',()=>document.querySelectorAll('input,select,textarea').forEach(el=>el.setCustomValidity('')));
  setLanguage(lang);
})();
