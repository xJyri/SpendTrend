const TODAY = new Date();
  let currentYear  = TODAY.getFullYear();
  let currentMonth = TODAY.getMonth();
  let viewYear     = TODAY.getFullYear();
  let currentTab   = 'month';
  let monthChart   = null;
  let yearChart    = null;
  let yearCatChart = null;
  let currentLang  = localStorage.getItem('st_lang') || 'fi';

  let dpYear  = TODAY.getFullYear();
  let dpMonth = TODAY.getMonth();
  let selectedDate = new Date(TODAY);
  let editingModalTxId = null;

  let excludedCats = new Set();
  let monthExcludedCats = new Set();

  const I18N = {
    fi: {
      monthTab: 'Kuukausi', yearTab: 'Vuosi',
      monthExpenses: 'Menot tässä kuussa', budgetLeft: 'Budjetti jäljellä',
      addExpense: 'Lisää meno', amount: 'Summa (€)', date: 'Päivämäärä', category: 'Kategoria', description: 'Kuvaus',
      descPlaceholder: 'Valinnainen...',
      budgetPlaceholder: 'esim. 600',
      monthBudgetShort: 'Budj.',
      budgetLimit: 'Budjettiraja', monthBudget: 'Kuukausibudjetti (€)', set: 'Aseta',
      monthByCategory: 'Menot kategorioittain', entries: 'Kirjaukset',
      yearOverview: 'Vuosikatsaus', yearBudget: 'Vuosibudjetti ja toteuma', yearBudgetTotal: 'Budjetoitu yhteensä',
      yearExpenseTotal: 'Kulutettu yhteensä', diff: 'Erotus',
      yearCats: 'Menot kategorioittain — suurimmasta pienimpään (klikkaa piilottaaksesi/näyttääksesi)',
      yearCatChart: 'Menot kategorioittain (vuosi)', yearMonthly: 'Menot kuukausittain (väripinottu kategorioittain)',
      monthGrid: 'Kuukaudet — klikkaa siirtyäksesi',
      resetMonth: 'Nollaa kuukausi',
      confirmResetMonth: 'Nollataanko kuukausi? Tämä poistaa menot ja budjetin.',
      fillAmountDate: 'Täytä summa ja päivämäärä.',
      wrongMonthDate: 'Valittu päivämäärä ei kuulu näkyvään kuukauteen. Vaihda päivä samalle kuukaudelle.',
      giveBudget: 'Anna budjettiraja.',
      noBudget: 'Ei asetettu',
      noEntriesYet: 'Ei menokirjauksia vielä',
      noExpensesMonth: 'Ei menoja tässä kuussa.<br>Lisää ensimmäinen meno!',
      noCategoriesMonth: 'Ei kategorioita tässä kuussa',
      noEntries: 'Ei menokirjauksia.',
      yearTotal: 'Vuosiyhteensä',
      budgetUsedLabel: '{spent} / {budget} käytetty ({pct}%)',
      budgetExceeded: 'Budjetti ylitetty! Olet käyttänyt {amount} liikaa.',
      budgetWarning: 'Huom! Olet käyttänyt {pct}% budjetistasi — jäljellä {remaining}.',
      delete: 'Poista',
      edit: 'Muokkaa',
      saveChanges: 'Tallenna muutos',
      editEntry: 'Muokkaa kirjausta',
      cancel: 'Peruuta',
      save: 'Tallenna',
      weekdays: ['Ma','Ti','Ke','To','Pe','La','Su'],
      budgetHint: 'Aseta kuukausibudjetteja, niin näet vuositasolla oletko yli vai ali budjetin.',
      underYear: 'Hyvä! Olet vuosibudjetissa {amount} edellä.',
      overYear: 'Huom! Olet vuosibudjetista {amount} yli.',
      monthsFull: ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
      monthsShort: ['Tam','Hel','Maa','Huh','Tou','Kes','Hei','Elo','Syy','Lok','Mar','Jou']
    },
    en: {
      monthTab: 'Month', yearTab: 'Year',
      monthExpenses: 'Expenses this month', budgetLeft: 'Budget left',
      addExpense: 'Add expense', amount: 'Amount (€)', date: 'Date', category: 'Category', description: 'Description',
      descPlaceholder: 'Optional...',
      budgetPlaceholder: 'e.g. 600',
      monthBudgetShort: 'Budget',
      budgetLimit: 'Budget limit', monthBudget: 'Monthly budget (€)', set: 'Set',
      monthByCategory: 'Expenses by category', entries: 'Entries',
      yearOverview: 'Year overview', yearBudget: 'Year budget vs actual', yearBudgetTotal: 'Total budgeted',
      yearExpenseTotal: 'Total spent', diff: 'Difference',
      yearCats: 'Expenses by category — largest to smallest (click to hide/show)',
      yearCatChart: 'Expenses by category (year)', yearMonthly: 'Expenses by month (stacked by category)',
      monthGrid: 'Months — click to open',
      resetMonth: 'Reset month',
      confirmResetMonth: 'Reset this month? This clears expenses and budget.',
      fillAmountDate: 'Please fill amount and date.',
      wrongMonthDate: 'Selected date is outside current month. Pick a date from the current month.',
      giveBudget: 'Enter a budget.',
      noBudget: 'Not set',
      noEntriesYet: 'No expense entries yet',
      noExpensesMonth: 'No expenses this month.<br>Add your first expense!',
      noCategoriesMonth: 'No categories in this month',
      noEntries: 'No expense entries.',
      yearTotal: 'Year total',
      budgetUsedLabel: '{spent} / {budget} used ({pct}%)',
      budgetExceeded: 'Budget exceeded! You are {amount} over.',
      budgetWarning: 'Heads up! You have used {pct}% of your budget — {remaining} left.',
      delete: 'Delete',
      edit: 'Edit',
      saveChanges: 'Save changes',
      editEntry: 'Edit entry',
      cancel: 'Cancel',
      save: 'Save',
      weekdays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      budgetHint: 'Set monthly budgets to see yearly over/under status.',
      underYear: 'Great! You are {amount} under yearly budget.',
      overYear: 'Heads up! You are {amount} over yearly budget.',
      monthsFull: ['January','February','March','April','May','June','July','August','September','October','November','December'],
      monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    }
  };
  const t = (k) => I18N[currentLang][k] || k;

  const EXPENSE_CATS = [
    { key:'Ruokakauppa', fi:'Ruokakauppa', en:'Groceries', emoji:'🛒' },
    { key:'Liikenne', fi:'Liikenne', en:'Transport', emoji:'🚌' },
    { key:'Asuminen', fi:'Asuminen', en:'Housing', emoji:'🏠' },
    { key:'Viihde', fi:'Viihde', en:'Entertainment', emoji:'🎮' },
    { key:'Kahvila', fi:'Kahvila', en:'Cafe', emoji:'☕' },
    { key:'Vaatteet', fi:'Vaatteet', en:'Clothing', emoji:'👕' },
    { key:'Terveys', fi:'Terveys', en:'Health', emoji:'💊' },
    { key:'Ruoka', fi:'Ruoka', en:'Dining', emoji:'🍕' },
    { key:'Muu', fi:'Muu', en:'Other', emoji:'📦' },
  ];
  const CAT_COLORS = ['#a3e635','#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#64748b'];

  function catColor(name) {
    const i = EXPENSE_CATS.findIndex((c) => c.key === name);
    return CAT_COLORS[i >= 0 ? i : CAT_COLORS.length - 1];
  }
  function catLabel(name) {
    const found = EXPENSE_CATS.find((c) => c.key === name);
    if (!found) return name;
    return currentLang === 'fi' ? found.fi : found.en;
  }

  function txKey(y,m)  { return `st_tx_${y}_${m}`; }
  function budKey(y,m) { return `st_bud_${y}_${m}`; }
  function getTxs(y,m) { try { return JSON.parse(localStorage.getItem(txKey(y,m)))||[]; } catch{ return []; } }
  function saveTxs(txs){ localStorage.setItem(txKey(currentYear,currentMonth), JSON.stringify(txs)); }
  function getBudget(y,m) { return parseFloat(localStorage.getItem(budKey(y,m)))||0; }
  function saveBudget(v)  { localStorage.setItem(budKey(currentYear,currentMonth), v); }

  function fmt(n) { return n.toLocaleString('fi-FI',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }
  function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function fmtDate(d) { const [y,m,day]=d.split('-'); return `${day}.${m}.${y}`; }
  function formatGroupedNumberInput(raw) {
    const cleaned = raw.replace(/\s+/g,'').replace(',', '.').replace(/[^\d.]/g,'');
    if (!cleaned) return '';
    const [intPart, decPart] = cleaned.split('.');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decPart !== undefined ? `${grouped}.${decPart.slice(0,2)}` : grouped;
  }
  function parseGroupedNumber(raw) {
    if (!raw) return NaN;
    return parseFloat(raw.replace(/\s+/g,'').replace(',', '.'));
  }
  function monthNamesFull() { return I18N[currentLang].monthsFull; }
  function monthNamesShort() { return I18N[currentLang].monthsShort; }

  function applyI18n() {
    const map = {
      'tab-month':'monthTab','tab-year':'yearTab','lbl-month-expenses':'monthExpenses','lbl-budget-left':'budgetLeft',
      'ttl-add-expense':'addExpense','lbl-amount':'amount','lbl-date':'date','lbl-category':'category','lbl-desc':'description',
      'btn-add-expense':'addExpense','ttl-budget-limit':'budgetLimit','lbl-month-budget':'monthBudget','btn-set-budget':'set',
      'ttl-cat-month':'monthByCategory','ttl-entries':'entries','ttl-year-overview':'yearOverview','ttl-year-budget':'yearBudget',
      'lbl-year-budget-total':'yearBudgetTotal','lbl-year-expense-total':'yearExpenseTotal','lbl-year-diff':'diff',
      'ttl-year-cats':'yearCats','ttl-year-cat-chart':'yearCatChart','ttl-year-monthly':'yearMonthly','ttl-month-grid':'monthGrid'
    };
    Object.entries(map).forEach(([id,key]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = t(key);
    });
    document.getElementById('inp-desc').placeholder = t('descPlaceholder');
    document.getElementById('inp-budget').placeholder = t('budgetPlaceholder');
    I18N[currentLang].weekdays.forEach((d, i) => {
      const wd = document.getElementById(`wd-${i}`);
      if (wd) wd.textContent = d;
    });
    const select = document.getElementById('inp-category');
    const editSelect = document.getElementById('edit-category');
    if (select) {
      const currentValue = select.value;
      const options = EXPENSE_CATS.map((c)=>`<option value="${c.key}">${c.emoji} ${currentLang==='fi'?c.fi:c.en}</option>`).join('');
      select.innerHTML = options;
      if (editSelect) editSelect.innerHTML = options;
      if (currentValue) select.value = currentValue;
    }
    const langBtn = document.getElementById('lang-switch');
    langBtn.textContent = currentLang === 'fi' ? 'FI' : 'EN';
    const resetBtn = document.getElementById('btn-reset-current-month');
    if (resetBtn) resetBtn.textContent = t('resetMonth');
    document.getElementById('ttl-edit-expense').textContent = t('editEntry');
    document.getElementById('lbl-edit-amount').textContent = t('amount');
    document.getElementById('lbl-edit-date').textContent = t('date');
    document.getElementById('lbl-edit-category').textContent = t('category');
    document.getElementById('lbl-edit-desc').textContent = t('description');
    document.getElementById('btn-edit-cancel').textContent = t('cancel');
    document.getElementById('btn-edit-save').textContent = t('save');
    updateMonthLabel();
    if (currentTab === 'month') renderMonth(); else renderYear();
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('st_lang', lang);
    applyI18n();
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'fi' ? 'en' : 'fi');
  }

  function syncSelectedDateToCurrentMonth() {
    const currentDay = selectedDate ? selectedDate.getDate() : 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    selectedDate = new Date(currentYear, currentMonth, Math.min(currentDay, daysInMonth));
    dpYear = currentYear;
    dpMonth = currentMonth;
    const dd = selectedDate.getDate().toString().padStart(2,'0');
    const mm = (selectedDate.getMonth()+1).toString().padStart(2,'0');
    document.getElementById('date-display-text').textContent = `${dd}.${mm}.${selectedDate.getFullYear()}`;
  }

  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (i===0&&tab==='month')||(i===1&&tab==='year')));
    document.getElementById('view-month').classList.toggle('active', tab==='month');
    document.getElementById('view-year').classList.toggle('active',  tab==='year');
    document.getElementById('header-month-nav').classList.toggle('nav-hidden', tab!=='month');
    document.getElementById('header-year-nav').classList.toggle('nav-hidden', tab!=='year');
    if (tab==='month') renderMonth(); else renderYear();
  }

  function prevMonth() {
    currentMonth--;
    if(currentMonth<0){currentMonth=11;currentYear--;}
    updateMonthLabel();
    syncSelectedDateToCurrentMonth();
    renderMonth();
  }

  function nextMonth() {
    currentMonth++;
    if(currentMonth>11){currentMonth=0;currentYear++;}
    updateMonthLabel();
    syncSelectedDateToCurrentMonth();
    renderMonth();
  }

  function updateMonthLabel() {
    document.getElementById('month-label').textContent = `${monthNamesFull()[currentMonth]} ${currentYear}`;
  }

  function jumpToMonthYear() {
    const y = parseInt(document.getElementById('jump-year-select').value, 10);
    const m = parseInt(document.getElementById('jump-month-select').value, 10);
    if (Number.isNaN(y) || Number.isNaN(m)) return;
    currentYear = y;
    currentMonth = m;
    if (currentTab === 'year') viewYear = y;
    syncSelectedDateToCurrentMonth();
    document.getElementById('header-month-popup').classList.remove('open');
    updateMonthLabel();
    if (currentTab === 'month') renderMonth(); else renderYear();
  }

  function openMonthPicker(e) {
    if (e) e.stopPropagation();
    const popup = document.getElementById('header-month-popup');
    const monthSelect = document.getElementById('jump-month-select');
    const yearSelect = document.getElementById('jump-year-select');
    monthSelect.innerHTML = monthNamesFull().map((m,idx)=>`<option value="${idx}">${m}</option>`).join('');
    const baseYear = currentTab === 'year' ? viewYear : currentYear;
    yearSelect.innerHTML = Array.from({length:21}, (_,i)=>baseYear-10+i).map(y=>`<option value="${y}">${y}</option>`).join('');
    monthSelect.value = String(currentMonth);
    yearSelect.value = String(baseYear);
    popup.classList.toggle('open');
  }

  function toggleDatePicker(e) {
    e.stopPropagation();
    const popup = document.getElementById('date-popup');
    const disp  = document.getElementById('date-display');
    const open  = popup.classList.toggle('open');
    disp.classList.toggle('open', open);
    if (open) renderDP();
  }

  document.addEventListener('click', () => {
    document.getElementById('date-popup').classList.remove('open');
    document.getElementById('date-display').classList.remove('open');
    document.getElementById('header-month-popup').classList.remove('open');
  });

  function dpNav(e, dir) {
    e.stopPropagation();
    dpMonth += dir;
    if (dpMonth<0){dpMonth=11;dpYear--;}
    if (dpMonth>11){dpMonth=0;dpYear++;}
    renderDP();
  }

  function renderDP() {
    document.getElementById('dp-month-label').textContent = monthNamesFull()[dpMonth]+' '+dpYear;
    const first  = new Date(dpYear, dpMonth, 1).getDay();
    const days   = new Date(dpYear, dpMonth+1, 0).getDate();
    const prevDays = new Date(dpYear, dpMonth, 0).getDate();
    const offset = (first+6)%7;
    let html = '';
    for (let i=offset-1;i>=0;i--) html+=`<button class="dp-day other" onclick="pickDay(event,${dpYear},${dpMonth-1},${prevDays-i})">${prevDays-i}</button>`;
    for (let d=1;d<=days;d++) {
      const isToday = d===TODAY.getDate()&&dpMonth===TODAY.getMonth()&&dpYear===TODAY.getFullYear();
      const isSel   = selectedDate&&d===selectedDate.getDate()&&dpMonth===selectedDate.getMonth()&&dpYear===selectedDate.getFullYear();
      const cls = isSel?'selected':isToday?'today':'';
      html+=`<button class="dp-day ${cls}" onclick="pickDay(event,${dpYear},${dpMonth},${d})">${d}</button>`;
    }
    const total = offset+days;
    const fill  = total%7===0?0:7-total%7;
    for (let d=1;d<=fill;d++) html+=`<button class="dp-day other" onclick="pickDay(event,${dpYear},${dpMonth+1},${d})">${d}</button>`;
    document.getElementById('dp-days').innerHTML = html;
  }

  function pickDay(e, y, m, d) {
    e.stopPropagation();
    selectedDate = new Date(y, m, d);
    dpYear  = selectedDate.getFullYear();
    dpMonth = selectedDate.getMonth();
    const dd = selectedDate.getDate().toString().padStart(2,'0');
    const mm = (selectedDate.getMonth()+1).toString().padStart(2,'0');
    document.getElementById('date-display-text').textContent = `${dd}.${mm}.${selectedDate.getFullYear()}`;
    document.getElementById('date-popup').classList.remove('open');
    document.getElementById('date-display').classList.remove('open');
    renderDP();
  }

  function getDateStr() {
    if (!selectedDate) return null;
    const d = selectedDate.getDate().toString().padStart(2,'0');
    const m = (selectedDate.getMonth()+1).toString().padStart(2,'0');
    return `${selectedDate.getFullYear()}-${m}-${d}`;
  }

  function addTransaction() {
    const amount = parseGroupedNumber(document.getElementById('inp-amount').value);
    const date   = getDateStr();
    const cat    = document.getElementById('inp-category').value;
    const desc   = document.getElementById('inp-desc').value.trim();

    if (!amount||amount<=0||!date) { alert(t('fillAmountDate')); return; }

    const txDate = new Date(date);
    if (txDate.getFullYear() !== currentYear || txDate.getMonth() !== currentMonth) {
      alert(t('wrongMonthDate'));
      return;
    }

    const txs = getTxs(currentYear,currentMonth);
    txs.push({id:Date.now(),amount,date,category:cat,desc});
    saveTxs(txs);
    document.getElementById('inp-amount').value='';
    document.getElementById('inp-desc').value='';
    renderMonth();
  }

  function startEditTx(id) {
    const tx = getTxs(currentYear,currentMonth).find(t => t.id === id);
    if (!tx) return;
    editingModalTxId = id;
    document.getElementById('edit-amount').value = formatGroupedNumberInput(String(tx.amount));
    document.getElementById('edit-desc').value = tx.desc || '';
    document.getElementById('edit-category').value = tx.category;
    document.getElementById('edit-date').value = tx.date;
    document.getElementById('edit-modal-backdrop').classList.add('open');
  }

  function deleteTx(id) {
    if (editingModalTxId === id) editingModalTxId = null;
    saveTxs(getTxs(currentYear,currentMonth).filter(t=>t.id!==id));
    renderMonth();
  }

  function closeEditModal() {
    editingModalTxId = null;
    document.getElementById('edit-modal-backdrop').classList.remove('open');
  }

  function saveEditTx() {
    if (!editingModalTxId) return;
    const amount = parseGroupedNumber(document.getElementById('edit-amount').value);
    const date = document.getElementById('edit-date').value;
    const category = document.getElementById('edit-category').value;
    const desc = document.getElementById('edit-desc').value.trim();
    if (!amount || amount <= 0 || !date) { alert(t('fillAmountDate')); return; }
    const txs = getTxs(currentYear,currentMonth);
    const idx = txs.findIndex(t => t.id === editingModalTxId);
    if (idx >= 0) txs[idx] = { ...txs[idx], amount, date, category, desc };
    saveTxs(txs);
    closeEditModal();
    renderMonth();
  }

  function setBudget() {
    const v = parseGroupedNumber(document.getElementById('inp-budget').value);
    if (Number.isNaN(v) || v < 0){alert(t('giveBudget'));return;}
    saveBudget(v);
    renderMonth();
  }

  function toggleMonthCat(cat) {
    monthExcludedCats.has(cat) ? monthExcludedCats.delete(cat) : monthExcludedCats.add(cat);
    renderMonth();
  }

  function renderMonth() {
    updateMonthLabel();
    const txs    = getTxs(currentYear,currentMonth);
    const budget = getBudget(currentYear,currentMonth);
    const total  = txs.reduce((s,t)=>s+t.amount,0);

    document.getElementById('stat-expenses').textContent = fmt(total);

    const budgetSet = localStorage.getItem(budKey(currentYear,currentMonth)) !== null;
    if (budgetSet) {
      const rem = budget-total;
      const pct = budget <= 0 ? (total > 0 ? 100 : 0) : Math.min(total/budget*100,100);
      const statEl = document.getElementById('stat-budget');
      statEl.textContent = fmt(Math.max(rem,0));
      statEl.style.color = rem<=0?'var(--red)':rem<budget*0.2?'var(--yellow)':'var(--blue)';
      document.getElementById('inp-budget').value = formatGroupedNumberInput(String(budget));
      const fill = document.getElementById('budget-bar-fill');
      fill.style.width = pct+'%';
      fill.className = 'budget-bar-fill'+(pct>=100?' danger':pct>=80?' warn':'');
      document.getElementById('budget-bar-label').textContent = t('budgetUsedLabel')
        .replace('{spent}', fmt(total))
        .replace('{budget}', fmt(budget))
        .replace('{pct}', Math.round(pct));
      document.getElementById('budget-bar-wrap').style.display = 'block';
      const banner = document.getElementById('warning-banner');
      if (pct>=100 && total > budget) {
        banner.style.display='flex'; banner.className='danger-banner';
        document.getElementById('warning-text').textContent=t('budgetExceeded').replace('{amount}', fmt(total-budget));
      } else if (pct>=80) {
        banner.style.display='flex'; banner.className='';
        document.getElementById('warning-text').textContent=t('budgetWarning')
          .replace('{pct}', Math.round(pct))
          .replace('{remaining}', fmt(rem));
      } else { banner.style.display='none'; }
    } else {
      document.getElementById('stat-budget').textContent=t('noBudget');
      document.getElementById('stat-budget').style.color='var(--muted)';
      document.getElementById('budget-bar-wrap').style.display='none';
      document.getElementById('warning-banner').style.display='none';
    }

    const monthAllCatTotals = {};
    txs.forEach(t => { monthAllCatTotals[t.category] = (monthAllCatTotals[t.category] || 0) + t.amount; });
    const filteredTxs = txs.filter(t => !monthExcludedCats.has(t.category));

    const catMap={};
    filteredTxs.forEach(t=>{catMap[t.category]=(catMap[t.category]||0)+t.amount;});
    const labels=Object.keys(catMap), data=Object.values(catMap);
    const displayLabels = labels.map(catLabel);
    const ctx=document.getElementById('chart-cat').getContext('2d');
    if(monthChart) monthChart.destroy();
    if(labels.length===0){
      monthChart=null; ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
      ctx.fillStyle='#6b7280'; ctx.font='13px DM Mono,monospace'; ctx.textAlign='center';
      ctx.fillText(t('noEntriesYet'),ctx.canvas.width/2,ctx.canvas.height/2);
    } else {
      monthChart=new Chart(ctx,{
        type:'doughnut',
        data:{labels:displayLabels,datasets:[{data,backgroundColor:labels.map(catColor),borderWidth:0,hoverOffset:6}]},
        options:{responsive:true,maintainAspectRatio:false,cutout:'65%',
          plugins:{
            legend:{
              position:'right',
              labels:{
                color:'#9ca3af',font:{family:'DM Mono',size:11},boxWidth:10,padding:12,
                generateLabels(chart) {
                  const values = chart.data.datasets[0].data;
                  const labels = chart.data.labels || [];
                  const sum = values.reduce((s,v)=>s+v,0) || 1;
                  return labels.map((label, idx) => ({
                    text: `${label} (${Math.round(((values[idx] ?? 0) / sum) * 100)}%)`,
                    fillStyle: chart.data.datasets[0].backgroundColor[idx],
                    strokeStyle: chart.data.datasets[0].backgroundColor[idx],
                    fontColor: '#9ca3af',
                    lineWidth: 0,
                    hidden: !chart.getDataVisibility(idx),
                    index: idx
                  }));
                }
              }
            },
            tooltip:{callbacks:{label:c=>{
              const vals = c.dataset.data;
              const sum = vals.reduce((s,v)=>s+v,0) || 1;
              const raw = Number(c.raw) || 0;
              const pct = Math.round((raw / sum) * 100);
              return ` ${c.label}: ${raw.toLocaleString('fi-FI',{minimumFractionDigits:2})} € (${pct}%)`;
            }}}
          }
        }
      });
    }

    const monthSortedAll = Object.entries(monthAllCatTotals).sort((a,b)=>b[1]-a[1]);
    document.getElementById('month-cat-filter-list').innerHTML = monthSortedAll.length===0
      ? `<div class="empty-state" style="padding:8px 0">${t('noCategoriesMonth')}</div>`
      : monthSortedAll.map(([cat,total])=>`
        <div class="month-filter-item ${monthExcludedCats.has(cat)?'excluded':''}" onclick="toggleMonthCat('${cat}')">
          <div class="cat-dot-sm" style="background:${catColor(cat)}"></div>
          <span class="month-filter-label">${catLabel(cat)}</span>
          <span class="month-filter-amt">${fmt(total)}</span>
          <span class="cat-check">${monthExcludedCats.has(cat)?'○':'●'}</span>
        </div>`).join('');

    const list=document.getElementById('tx-list');
    const sorted=[...txs].sort((a,b)=>b.date.localeCompare(a.date));
    list.innerHTML=sorted.length===0
      ?`<div class="empty-state">${t('noExpensesMonth')}</div>`
      :sorted.map(tx=>`
        <div class="tx-item">
          <div class="tx-dot" style="background:${catColor(tx.category)}"></div>
          <div class="tx-info">
            <div class="tx-desc">${catLabel(tx.category)}${tx.desc?' — '+esc(tx.desc):''}</div>
            <div class="tx-meta">${fmtDate(tx.date)}</div>
          </div>
          <div class="tx-amount">−${fmt(tx.amount)}</div>
          <div class="tx-actions">
            <button class="tx-edit" onclick="startEditTx(${tx.id})" title="${t('edit')}">✎</button>
            <button class="tx-delete" onclick="deleteTx(${tx.id})" title="${t('delete')}">×</button>
          </div>
        </div>`).join('');
  }

  function yearNav(dir) { viewYear+=dir; renderYear(); }

  function getYearData() {
    const catTotals={}, monthTotals=new Array(12).fill(0), monthCatTotals={};
    for(let m=0;m<12;m++) {
      getTxs(viewYear,m).forEach(t=>{
        if(excludedCats.has(t.category)) return;
        catTotals[t.category]=(catTotals[t.category]||0)+t.amount;
        monthTotals[m]+=t.amount;
        if (!monthCatTotals[t.category]) monthCatTotals[t.category] = new Array(12).fill(0);
        monthCatTotals[t.category][m] += t.amount;
      });
    }
    return {catTotals,monthTotals,monthCatTotals};
  }

  function getAllCatTotals() {
    const c={};
    for(let m=0;m<12;m++) getTxs(viewYear,m).forEach(t=>{c[t.category]=(c[t.category]||0)+t.amount;});
    return c;
  }

  function toggleCat(cat) {
    excludedCats.has(cat)?excludedCats.delete(cat):excludedCats.add(cat);
    renderYear();
  }

  function goToMonth(m) {
    currentMonth=m;
    currentYear=viewYear;
    syncSelectedDateToCurrentMonth();
    switchTab('month');
  }

  function resetMonthData(m, e) {
    if (e) e.stopPropagation();
    if (!confirm(t('confirmResetMonth'))) return;
    localStorage.removeItem(txKey(viewYear, m));
    localStorage.removeItem(budKey(viewYear, m));
    renderYear();
  }

  function resetCurrentMonth() {
    if (!confirm(t('confirmResetMonth'))) return;
    localStorage.removeItem(txKey(currentYear, currentMonth));
    localStorage.removeItem(budKey(currentYear, currentMonth));
    renderMonth();
  }

  function renderYear() {
    document.getElementById('year-label').textContent = `${viewYear}`;
    const allCats = getAllCatTotals();
    const {catTotals, monthTotals, monthCatTotals} = getYearData();
    const monthBudgets = Array.from({length:12}, (_,m)=>getBudget(viewYear,m));
    const sortedAll = Object.entries(allCats).sort((a,b)=>b[1]-a[1]);

    const sorted = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
    const maxAllCat = sortedAll[0]?.[1]||1;
    document.getElementById('year-cat-bars').innerHTML = sortedAll.length===0
      ? `<div class="empty-state">${t('noEntries')}</div>`
      : sortedAll.map(([cat,total])=>`
        <div class="cat-bar-row toggleable ${excludedCats.has(cat)?'excluded':''}" onclick="toggleCat('${cat}')">
          <div class="cat-bar-header">
            <span class="cat-bar-name">${catLabel(cat)}</span>
            <span class="cat-bar-val">${fmt(total)} ${excludedCats.has(cat)?'○':'●'}</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width:${(total/maxAllCat*100).toFixed(1)}%;background:${catColor(cat)}"></div>
          </div>
        </div>`).join('');

    const yearBudgetTotal = Array.from({length:12}, (_,m)=>getBudget(viewYear,m)).reduce((s,v)=>s+v,0);
    const yearExpenseTotal = Array.from({length:12}, (_,m)=>getTxs(viewYear,m).reduce((sum,t)=>sum+t.amount,0)).reduce((s,v)=>s+v,0);
    const yearDiff = yearBudgetTotal - yearExpenseTotal;
    document.getElementById('year-budget-total').textContent = fmt(yearBudgetTotal);
    document.getElementById('year-expense-total').textContent = fmt(yearExpenseTotal);
    const diffEl = document.getElementById('year-budget-diff');
    diffEl.textContent = `${yearDiff>=0?'+':'−'}${fmt(Math.abs(yearDiff))}`;
    diffEl.style.color = yearDiff >= 0 ? 'var(--green)' : 'var(--red)';
    const noteEl = document.getElementById('year-budget-note');
    if (yearBudgetTotal <= 0) {
      noteEl.textContent = t('budgetHint');
      noteEl.style.color = 'var(--muted)';
    } else if (yearDiff >= 0) {
      noteEl.textContent = t('underYear').replace('{amount}', fmt(yearDiff));
      noteEl.style.color = 'var(--green)';
    } else {
      noteEl.textContent = t('overYear').replace('{amount}', fmt(Math.abs(yearDiff)));
      noteEl.style.color = 'var(--red)';
    }

    const yCtx=document.getElementById('year-chart').getContext('2d');
    if(yearChart) yearChart.destroy();
    const sortedCats = Object.keys(monthCatTotals).sort((a,b)=>(catTotals[b]||0)-(catTotals[a]||0));
    yearChart=new Chart(yCtx,{
      type:'bar',
      data:{
        labels:monthNamesShort(),
        datasets:sortedCats.map(cat => ({
          label: catLabel(cat),
          data: monthCatTotals[cat],
          backgroundColor: catColor(cat),
          borderRadius: 4,
          borderSkipped: false,
          stack: 'month_stack'
        }))
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{legend:{display:true, labels:{color:'#9ca3af', font:{family:'DM Mono',size:11}}},tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${fmt(c.raw)}`}}},
        scales:{
          x:{stacked:true, grid:{color:'#2a2d35'},ticks:{color:'#6b7280',font:{family:'DM Mono',size:11}}},
          y:{stacked:true, grid:{color:'#2a2d35'},ticks:{color:'#6b7280',font:{family:'DM Mono',size:11},callback:v=>v+' €'}}
        }
      }
    });

    const catCtx=document.getElementById('year-cat-chart').getContext('2d');
    if(yearCatChart) yearCatChart.destroy();
    yearCatChart = new Chart(catCtx, {
      type: 'bar',
      data: {
        labels: sorted.map(([cat]) => catLabel(cat)),
        datasets: [{
          label: t('yearTotal'),
          data: sorted.map(([, total]) => total),
          backgroundColor: sorted.map(([cat]) => catColor(cat)),
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ` ${fmt(c.raw)}` } }
        },
        scales: {
          x: { grid: { color:'#2a2d35' }, ticks: { color:'#6b7280', font:{family:'DM Mono',size:11} } },
          y: { grid: { color:'#2a2d35' }, ticks: { color:'#6b7280', font:{family:'DM Mono',size:11}, callback:v=>v+' €' } }
        }
      }
    });

    const maxM=Math.max(...monthTotals,1);
    document.getElementById('month-grid').innerHTML = monthNamesShort().map((name,i)=>{
      const v=monthTotals[i], pct=(v/maxM*100).toFixed(1);
      const b = monthBudgets[i];
      return `<div class="month-mini ${v===0?'empty':''}" onclick="goToMonth(${i})">
        <div class="month-mini-name">${name}</div>
        <div class="month-mini-val">${v===0?'–':fmt(v)}</div>
        <div class="month-mini-budget">${t('monthBudgetShort')}: ${b>0?fmt(b):'–'}</div>
        <div class="month-reset" onclick="resetMonthData(${i}, event)" title="${t('resetMonth')}">×</div>
        <div class="month-mini-bar"><div class="month-mini-fill" style="width:${v===0?0:pct}%"></div></div>
      </div>`;
    }).join('');
  }

  document.getElementById('inp-category').innerHTML = EXPENSE_CATS.map((c)=>`<option value="${c.key}">${c.emoji} ${currentLang==='fi'?c.fi:c.en}</option>`).join('');
  document.getElementById('inp-amount').addEventListener('input', (e) => {
    e.target.value = formatGroupedNumberInput(e.target.value);
  });
  document.getElementById('inp-budget').addEventListener('input', (e) => {
    e.target.value = formatGroupedNumberInput(e.target.value);
  });
  document.getElementById('edit-amount').addEventListener('input', (e) => {
    e.target.value = formatGroupedNumberInput(e.target.value);
  });
  ['inp-amount','inp-desc','inp-category','date-display'].forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addTransaction(); }
    });
  });
  document.getElementById('inp-budget').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); setBudget(); }
  });
  ['edit-amount','edit-date','edit-category','edit-desc'].forEach((id) => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); saveEditTx(); }
    });
  });
  syncSelectedDateToCurrentMonth();
  applyI18n();
