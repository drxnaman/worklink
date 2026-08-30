// ============================================================
// WorkLink — Application Logic
// ============================================================

// ---------- STATE ----------
const S = {
  view: 'home',
  prevView: null,
  cat: null,
  worker: null,
  bookMode: null,
  appt: { day: null, ts: null, pricing: null },
  bidAmt: null,
  agreedAmt: null,
  payAmt: null,
  user: JSON.parse(localStorage.getItem('wl_user') || 'null'),
  map: null,
  mapMarkers: [],
};

// ---------- ROUTING ----------
function gotoView(viewId, opts) {
  opts = opts || {};
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  var el = document.getElementById('view-' + viewId);
  if (!el) return;
  el.classList.add('active');
  S.prevView = S.view;
  S.view = viewId;
  window.scrollTo(0, 0);
  closeNav();
  switch (viewId) {
    case 'home':          initHome(); break;
    case 'quick-fix':     initQF(); break;
    case 'map':           initMap(opts); break;
    case 'schedule-cats': initSchedCats(); break;
    case 'browse':        initBrowse(opts); break;
    case 'profile':       initProfile(); break;
    case 'appt':          initAppt(); break;
    case 'bid':           initBid(); break;
    case 'negotiate':     initChat(); break;
    case 'payment':       initPayment(opts); break;
    case 'confirm':       initConfirm(opts); break;
    case 'bookings':      initBookings(); break;
  }
}
function goHome() { gotoView('home'); return false; }
function gotoBookings() { if (!S.user) { openAuth(true); return; } gotoView('bookings'); }
function goBackFromProfile() { if (S.bookMode === 'quick-fix') gotoView('map'); else gotoView('browse'); }
function goBackBid() { gotoView(S.prevView || 'profile'); }
function goBackPay() { gotoView(S.prevView || 'profile'); }

// ---------- HELPERS ----------
function getCat(id) { return CATEGORIES.find(function(c){ return c.id === id; }); }
function getWorker(id) { return WORKERS.find(function(w){ return w.id === id; }); }
function starsText(r) { var f = Math.round(r); return '\u2605'.repeat(f) + '\u2606'.repeat(5 - f); }

function catCard(c, onClickStr) {
  return '<div class="cat-card" onclick="' + onClickStr + '">' +
    '<div class="cat-icon">' + c.icon + '</div>' +
    '<div class="cat-name">' + c.name + '</div>' +
    '<div class="cat-desc">' + c.desc + '</div></div>';
}

// ---------- HOME ----------
function initHome() {
  var grid = document.getElementById('home-cats');
  if (grid) grid.innerHTML = CATEGORIES.map(function(c){
    return catCard(c, "showCatChoice('" + c.id + "')");
  }).join('');
}

function showCatChoice(catId) {
  S.cat = catId;
  var c = getCat(catId);
  openModal(
    '<div style="text-align:center">' +
    '<div style="font-size:2.5rem;margin-bottom:.75rem">' + c.icon + '</div>' +
    '<h2 style="margin-bottom:.35rem">' + c.name + '</h2>' +
    '<p style="margin-bottom:1.75rem;font-size:.92rem">How would you like to find a ' + c.name.toLowerCase() + '?</p>' +
    '<div style="display:flex;flex-direction:column;gap:.65rem">' +
    '<button class="btn btn-acc btn-lg btn-full" onclick="closeModal();S.bookMode=\'quick-fix\';gotoView(\'map\',{cat:\'' + catId + '\'})">\ud83d\udd34 Quick Fix \u2014 Find Nearby Now</button>' +
    '<button class="btn btn-p btn-lg btn-full" onclick="closeModal();S.bookMode=\'schedule\';gotoView(\'browse\',{cat:\'' + catId + '\'})">\ud83d\udcc5 Schedule \u2014 Browse & Book</button>' +
    '<button class="btn btn-g btn-full" onclick="closeModal()">Cancel</button>' +
    '</div></div>'
  );
}

// ---------- QUICK FIX ----------
function initQF() {
  var grid = document.getElementById('qf-cats');
  if (grid) grid.innerHTML = CATEGORIES.map(function(c){
    return catCard(c, "S.cat='" + c.id + "';S.bookMode='quick-fix';gotoView('map',{cat:'" + c.id + "'})");
  }).join('');
}

// ---------- MAP ----------
function initMap(opts) {
  if (opts && opts.cat) S.cat = opts.cat;
  var c = getCat(S.cat);
  document.getElementById('map-hdr-title').textContent = (c ? c.icon : '') + ' ' + (c ? c.name : '') + 's Near You';
  var workers = WORKERS.filter(function(w){ return w.category === S.cat; });
  renderMapStrip(workers);

  setTimeout(function(){
    if (S.map) { S.map.remove(); S.map = null; }
    var defLat = 28.6139, defLng = 77.2090;
    S.map = L.map('leaflet-map', { zoomControl: true }).setView([defLat, defLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '\u00a9 <a href="https://openstreetmap.org">OpenStreetMap</a>', maxZoom: 19
    }).addTo(S.map);
    S.mapMarkers = [];
    workers.forEach(function(w){
      var icon = L.divIcon({
        className: '',
        html: '<div style="width:38px;height:38px;border-radius:50%;background:' + w.color + ';border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:white;font-size:.75rem;font-weight:700;cursor:pointer">' + w.initials + '</div>',
        iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -22]
      });
      var mk = L.marker([w.lat, w.lng], { icon: icon }).addTo(S.map);
      mk.bindPopup(mapPopup(w), { maxWidth: 230 });
      mk.on('click', function(){ highlightCard(w.id); });
      S.mapMarkers.push({ id: w.id, marker: mk });
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos){
        var lat = pos.coords.latitude, lng = pos.coords.longitude;
        S.map.setView([lat, lng], 14);
        L.circleMarker([lat, lng], { radius: 10, fillColor: '#1565C0', color: 'white', weight: 3, fillOpacity: 1 })
          .addTo(S.map).bindPopup('<b>\ud83d\udccd Your Location</b>');
      }, function(){});
    }
  }, 80);
}

function mapPopup(w) {
  var cat = getCat(w.category);
  return '<div class="map-popup">' +
    '<div class="mp-name">' + w.name + '</div>' +
    '<div class="mp-trade">' + (cat ? cat.name : '') + ' \u00b7 ' + w.city + '</div>' +
    '<div class="mp-rating">' + starsText(w.rating) + ' ' + w.rating + ' (' + w.reviewCount + ' reviews)</div>' +
    '<div class="mp-price">\u20b9' + w.minRate + ' \u2013 \u20b9' + w.maxRate + '</div>' +
    '<div class="mp-btns">' +
    '<button class="mp-btn mp-btn-p" onclick="mapBid(' + w.id + ')">\ud83d\udcb0 Bid a Price</button>' +
    '<button class="mp-btn mp-btn-o" onclick="mapNegotiate(' + w.id + ')">\ud83e\udd1d Negotiate</button>' +
    '<button class="mp-btn mp-btn-g" onclick="mapProfile(' + w.id + ')">View Full Profile</button>' +
    '</div></div>';
}
function mapBid(id) { S.worker = getWorker(id); S.bookMode = 'quick-fix'; S.prevView = 'map'; gotoView('bid'); }
function mapNegotiate(id) { S.worker = getWorker(id); S.bookMode = 'quick-fix'; S.prevView = 'map'; gotoView('negotiate'); }
function mapProfile(id) { S.worker = getWorker(id); gotoView('profile'); }

function renderMapStrip(workers) {
  var strip = document.getElementById('map-strip');
  if (!workers.length) { strip.innerHTML = '<p style="color:#94A3B8;padding:1rem">No workers available for this category right now.</p>'; return; }
  strip.innerHTML = workers.map(function(w){
    var cat = getCat(w.category);
    return '<div class="mini-card" id="mc-' + w.id + '" onclick="selectMapWorker(' + w.id + ')">' +
      '<div class="mini-top"><div class="mini-av" style="background:' + w.color + '">' + w.initials + '</div>' +
      '<div><div class="mini-name">' + w.name + '</div><div class="mini-trade">' + (cat ? cat.name : '') + '</div></div></div>' +
      '<div class="mini-rating">' + starsText(w.rating) + ' ' + w.rating + '</div>' +
      '<div class="mini-price">\u20b9' + w.minRate + ' \u2013 \u20b9' + w.maxRate + ' &nbsp;\u00b7&nbsp; ' +
      (w.available ? '<span style="color:#22C55E;font-weight:700">Available</span>' : '<span style="color:#94A3B8">Busy</span>') + '</div>' +
      '<div class="mini-btns">' +
      '<button class="btn btn-p btn-sm" onclick="event.stopPropagation();mapBid(' + w.id + ')">\ud83d\udcb0 Bid</button>' +
      '<button class="btn btn-o btn-sm" onclick="event.stopPropagation();mapNegotiate(' + w.id + ')">\ud83e\udd1d Chat</button></div></div>';
  }).join('');
}
function sortMapWorkers() {
  var sort = document.getElementById('map-sort').value;
  var workers = WORKERS.filter(function(w){ return w.category === S.cat; });
  if (sort === 'rating') workers.sort(function(a,b){ return b.rating - a.rating; });
  else if (sort === 'price') workers.sort(function(a,b){ return a.minRate - b.minRate; });
  renderMapStrip(workers);
}
function highlightCard(id) {
  document.querySelectorAll('.mini-card').forEach(function(c){ c.classList.remove('sel'); });
  var card = document.getElementById('mc-' + id);
  if (card) { card.classList.add('sel'); card.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }); }
}
function selectMapWorker(id) { highlightCard(id); S.worker = getWorker(id); }

// ---------- SCHEDULE CATEGORIES ----------
function initSchedCats() {
  var grid = document.getElementById('sched-cats');
  if (grid) grid.innerHTML = CATEGORIES.map(function(c){
    return catCard(c, "S.cat='" + c.id + "';S.bookMode='schedule';gotoView('browse',{cat:'" + c.id + "'})");
  }).join('');
}

// ---------- BROWSE ----------
function initBrowse(opts) {
  if (opts && opts.cat) S.cat = opts.cat;
  var c = getCat(S.cat);
  document.getElementById('browse-title').textContent = (c ? c.icon : '') + ' ' + (c ? c.name : '') + 's';
  renderGrid();
}
function renderGrid() {
  var sort = (document.getElementById('sort-sel') || {}).value || 'rating';
  var avail = (document.getElementById('avail-sel') || {}).value || 'all';
  var list = WORKERS.filter(function(w){ return w.category === S.cat; });
  if (avail === 'now') list = list.filter(function(w){ return w.available; });
  list.sort(function(a,b){
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price')  return a.minRate - b.minRate;
    if (sort === 'exp')    return b.experience - a.experience;
    return 0;
  });
  var grid = document.getElementById('worker-grid');
  if (!list.length) { grid.innerHTML = '<p style="padding:2rem;color:#94A3B8;text-align:center">No workers found. Try adjusting filters.</p>'; return; }
  grid.innerHTML = list.map(workerCard).join('');
}
function workerCard(w) {
  var cat = getCat(w.category);
  return '<div class="worker-card" onclick="openProfile(' + w.id + ')">' +
    '<div class="wc-head"><div class="wc-av" style="background:' + w.color + '">' + w.initials + '</div>' +
    '<div class="wc-info"><div class="wc-name">' + w.name + '</div>' +
    '<div class="wc-trade">' + (cat ? cat.name : '') + ' \u00b7 ' + w.city + '</div>' +
    '<div class="wc-stars"><span style="color:#F59E0B">' + starsText(w.rating) + '</span> <span class="stars-val">' + w.rating + '</span><span class="stars-cnt">(' + w.reviewCount + ')</span></div></div>' +
    '<div class="avail-dot ' + (w.available ? 'dot-on' : 'dot-off') + '" title="' + (w.available ? 'Available' : 'Busy') + '"></div></div>' +
    '<div class="wc-body"><div class="wc-stats">' +
    '<div class="wc-stat"><div class="wc-stat-v">' + w.jobsDone + '</div><div class="wc-stat-l">Jobs</div></div>' +
    '<div class="wc-stat"><div class="wc-stat-v">' + w.experience + 'yr</div><div class="wc-stat-l">Exp</div></div>' +
    '<div class="wc-stat"><div class="wc-stat-v">' + w.responseTime + '</div><div class="wc-stat-l">Response</div></div></div>' +
    '<div class="wc-price">Rate: <strong>\u20b9' + w.minRate + '\u2013\u20b9' + w.maxRate + '</strong> \u00b7 <span class="' + (w.available ? 'avail-on' : 'avail-off') + '">' + (w.available ? 'Available' : 'Busy') + '</span></div>' +
    '<div class="wc-btns">' +
    '<button class="btn btn-p btn-sm" onclick="event.stopPropagation();S.worker=getWorker(' + w.id + ');S.prevView=\'browse\';gotoView(\'bid\')">\ud83d\udcb0 Bid</button>' +
    '<button class="btn btn-o btn-sm" onclick="event.stopPropagation();S.worker=getWorker(' + w.id + ');S.prevView=\'browse\';gotoView(\'negotiate\')">\ud83e\udd1d Chat</button>' +
    '<button class="btn btn-g btn-sm" onclick="event.stopPropagation();openProfile(' + w.id + ')">Profile \u2192</button></div></div></div>';
}
function openProfile(id) { S.worker = getWorker(id); gotoView('profile'); }

// ---------- PROFILE ----------
function initProfile() {
  var w = S.worker; if (!w) return;
  var cat = getCat(w.category);
  document.getElementById('profile-body').innerHTML =
    '<div class="profile-hero"><div class="profile-hero-in">' +
    '<div class="profile-av" style="background:' + w.color + '">' + w.initials + '</div>' +
    '<div class="profile-main">' +
    '<div class="profile-name">' + w.name + '</div>' +
    '<div class="profile-trade">' + (cat ? cat.icon + ' ' + cat.name : '') + ' \u00b7 ' + w.city + '</div>' +
    '<div class="profile-meta">' +
    '<span class="profile-meta-it">\ud83c\udfc6 ' + w.jobsDone + ' Jobs</span>' +
    '<span class="profile-meta-it">\u23f1\ufe0f ' + w.responseTime + '</span>' +
    '<span class="profile-meta-it">\ud83d\udcc5 ' + w.experience + ' yrs exp</span></div>' +
    '<div class="profile-rating"><div class="rating-big">' + w.rating + '</div><div>' +
    '<div class="rating-stars">' + starsText(w.rating) + '</div>' +
    '<div class="rating-cnt">' + w.reviewCount + ' reviews</div></div></div>' +
    '<div class="profile-badges">' +
    '<span class="badge ' + (w.available ? 'badge-avail' : 'badge-busy') + '">\u25cf ' + (w.available ? 'Available Now' : 'Currently Busy') + '</span>' +
    '<span class="badge badge-rate">\u20b9' + w.minRate + '\u2013\u20b9' + w.maxRate + '</span></div>' +
    '<div class="profile-action-btns">' +
    '<button class="btn btn-succ btn-lg" onclick="S.prevView=\'profile\';gotoView(\'appt\')">\ud83d\udcc5 Book Appointment</button>' +
    '<button class="btn btn-p btn-lg" onclick="S.prevView=\'profile\';gotoView(\'bid\')">\ud83d\udcb0 Bid Price</button>' +
    '<button class="btn btn-o btn-lg" onclick="S.prevView=\'profile\';gotoView(\'negotiate\')">\ud83e\udd1d Negotiate</button>' +
    '</div></div></div></div>' +
    '<div class="profile-body">' +
    '<div class="psec"><h3>\ud83d\udccb About</h3><p style="color:var(--text)">' + w.bio + '</p></div>' +
    '<div class="psec"><h3>\ud83d\udcca Stats</h3><div class="stats-row">' +
    '<div class="stat-box"><div class="stat-v">' + w.jobsDone + '</div><div class="stat-l">Jobs Done</div></div>' +
    '<div class="stat-box"><div class="stat-v">' + w.rating + '\u2605</div><div class="stat-l">Rating</div></div>' +
    '<div class="stat-box"><div class="stat-v">' + w.experience + 'yr</div><div class="stat-l">Experience</div></div></div></div>' +
    '<div class="psec"><h3>\ud83d\udd27 Skills</h3><div class="skills-list">' + w.skills.map(function(s){ return '<span class="skill-chip">' + s + '</span>'; }).join('') + '</div></div>' +
    '<div class="psec"><h3>\ud83d\udcbc Past Works</h3>' + w.pastWorks.map(function(pw){
      return '<div class="pw-item"><div class="pw-title">' + pw.title + ' <span style="color:#F59E0B;font-size:.82rem">' + starsText(pw.rating) + '</span></div>' +
        '<div class="pw-meta">\ud83d\udccd ' + pw.location + ' \u00b7 \ud83d\udcc5 ' + pw.date + '</div>' +
        '<div class="pw-desc">' + pw.description + '</div></div>';
    }).join('') + '</div>' +
    '<div class="psec"><h3>\ud83d\udcac Customer Reviews</h3>' + w.reviews.map(function(r){
      return '<div class="rev-item"><div class="rev-head">' +
        '<div class="rev-av">' + r.initials + '</div><div><div class="rev-name">' + r.name + '</div><div class="rev-date">' + r.date + '</div></div>' +
        '<div class="rev-stars">' + starsText(r.rating) + '</div></div>' +
        '<div class="rev-text">"' + r.text + '"</div></div>';
    }).join('') + '</div></div>';
}

// ---------- APPOINTMENT ----------
function initAppt() {
  var w = S.worker; if (!w) return;
  var cat = getCat(w.category);
  S.appt = { day: null, ts: null, pricing: null };
  var days = [];
  for (var i = 1; i <= 7; i++) { var d = new Date(); d.setDate(d.getDate() + i); days.push(d); }
  document.getElementById('appt-body').innerHTML =
    '<div class="form-wrap">' +
    '<div class="worker-banner"><div class="wb-av" style="background:' + w.color + '">' + w.initials + '</div>' +
    '<div><div class="wb-name">' + w.name + '</div><div class="wb-sub">' + (cat?cat.name:'') + ' \u00b7 \u2b50' + w.rating + ' \u00b7 ' + w.city + '</div></div></div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcc5 Select Date</label><div class="day-row">' +
    days.map(function(d, i){
      return '<div class="day-card" id="day-' + i + '" onclick="pickDay(' + i + ',\'' + d.toDateString() + '\')">' +
        '<div class="day-wd">' + d.toLocaleDateString('en',{weekday:'short'}) + '</div>' +
        '<div class="day-d">' + d.getDate() + '</div>' +
        '<div class="day-m">' + d.toLocaleDateString('en',{month:'short'}) + '</div></div>';
    }).join('') + '</div></div>' +
    '<div class="form-group"><label class="form-label">\u23f0 Select Time Slot</label><div class="ts-row">' +
    '<div class="ts-card" id="ts-0" onclick="pickTS(0,\'Morning (8 AM \u2013 12 PM)\')"><div class="ts-icon">\ud83c\udf05</div><div class="ts-name">Morning</div><div class="ts-hr">8 AM \u2013 12 PM</div></div>' +
    '<div class="ts-card" id="ts-1" onclick="pickTS(1,\'Afternoon (12 PM \u2013 4 PM)\')"><div class="ts-icon">\u2600\ufe0f</div><div class="ts-name">Afternoon</div><div class="ts-hr">12 PM \u2013 4 PM</div></div>' +
    '<div class="ts-card" id="ts-2" onclick="pickTS(2,\'Evening (4 PM \u2013 8 PM)\')"><div class="ts-icon">\ud83c\udf06</div><div class="ts-name">Evening</div><div class="ts-hr">4 PM \u2013 8 PM</div></div></div></div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcb0 Pricing Method</label><div class="price-row">' +
    '<div class="price-choice" id="pc-fixed" onclick="pickPricing(\'fixed\')"><div class="pc-icon">\ud83c\udff7\ufe0f</div><div class="pc-name">Fixed Rate</div><div class="pc-desc">Pay \u20b9' + w.minRate + '\u2013\u20b9' + w.maxRate + '</div></div>' +
    '<div class="price-choice" id="pc-bid" onclick="pickPricing(\'bid\')"><div class="pc-icon">\ud83d\udcb0</div><div class="pc-name">My Budget</div><div class="pc-desc">Set your price</div></div></div>' +
    '<div id="bid-field" style="display:none;margin-top:.75rem"><label class="form-label">Your Budget</label>' +
    '<div class="amt-wrap"><span class="amt-pfx">\u20b9</span><input class="amt-input" id="appt-bid-amt" type="number" placeholder="Enter budget" min="100" /></div></div></div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcdd Describe the Work</label>' +
    '<textarea class="f-input" id="appt-desc" placeholder="E.g., Fix leaking kitchen tap, install new flush, etc."></textarea></div>' +
    '<button class="btn btn-p btn-full btn-lg" onclick="submitAppt()">Confirm Booking \u2192</button></div>';
}
function pickDay(i, dateStr) {
  document.querySelectorAll('.day-card').forEach(function(c){ c.classList.remove('sel'); });
  var el = document.getElementById('day-' + i); if (el) el.classList.add('sel');
  S.appt.day = dateStr;
}
function pickTS(i, label) {
  document.querySelectorAll('.ts-card').forEach(function(c){ c.classList.remove('sel'); });
  var el = document.getElementById('ts-' + i); if (el) el.classList.add('sel');
  S.appt.ts = label;
}
function pickPricing(mode) {
  document.querySelectorAll('.price-choice').forEach(function(c){ c.classList.remove('sel'); });
  var el = document.getElementById('pc-' + mode); if (el) el.classList.add('sel');
  S.appt.pricing = mode;
  document.getElementById('bid-field').style.display = mode === 'bid' ? 'block' : 'none';
}
function submitAppt() {
  if (!S.appt.day) { toast('Please select a date', 'warning'); return; }
  if (!S.appt.ts)  { toast('Please select a time slot', 'warning'); return; }
  if (!S.appt.pricing) { toast('Please choose a pricing method', 'warning'); return; }
  var desc = (document.getElementById('appt-desc') || {}).value || '';
  if (!desc.trim()) { toast('Please describe the work', 'warning'); return; }
  var amount;
  if (S.appt.pricing === 'fixed') { amount = S.worker.minRate; }
  else { amount = parseInt((document.getElementById('appt-bid-amt') || {}).value || '0');
    if (!amount || amount < 100) { toast('Please enter a valid budget (min \u20b9100)', 'warning'); return; } }
  S.bidAmt = amount; S.prevView = 'appt'; gotoView('payment', { amount: amount, source: 'appt' });
}

// ---------- BID ----------
function initBid() {
  var w = S.worker; if (!w) return;
  var cat = getCat(w.category);
  var fname = w.name.split(' ')[0];
  document.getElementById('bid-body').innerHTML =
    '<div class="form-wrap">' +
    '<div class="worker-banner"><div class="wb-av" style="background:' + w.color + '">' + w.initials + '</div>' +
    '<div><div class="wb-name">' + w.name + '</div><div class="wb-sub">' + (cat?cat.name:'') + ' \u00b7 \u2b50' + w.rating + ' \u00b7 Rate: \u20b9' + w.minRate + '\u2013\u20b9' + w.maxRate + '</div></div></div>' +
    '<div class="info-box">\ud83d\udca1 <strong>How bidding works:</strong> Enter your budget. If ' + fname + ' agrees, the job is confirmed and you proceed to payment.</div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcbc What work do you need?</label><input class="f-input" id="bid-title" placeholder="E.g., Fix bathroom pipe leak" /></div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcdd Describe in detail</label><textarea class="f-input" id="bid-desc" placeholder="Describe work, location in home, urgency..." rows="4"></textarea></div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcb0 Your Budget Offer</label>' +
    '<div class="amt-wrap"><span class="amt-pfx">\u20b9</span><input class="amt-input" id="bid-amt" type="number" placeholder="Enter budget" min="100" /></div>' +
    '<p style="font-size:.8rem;margin-top:.4rem;color:var(--muted)">Typical rate: \u20b9' + w.minRate + '\u2013\u20b9' + w.maxRate + '</p></div>' +
    '<div class="form-group"><label class="form-label">\ud83d\udcc5 Preferred Date (optional)</label>' +
    '<input class="f-input" id="bid-date" type="date" min="' + new Date(Date.now()+86400000).toISOString().split('T')[0] + '" /></div>' +
    '<button class="btn btn-p btn-full btn-lg" id="bid-submit-btn" onclick="submitBid()">Send Bid to ' + fname + ' \u2192</button></div>';
}
function submitBid() {
  var title = (document.getElementById('bid-title') || {}).value || '';
  var desc  = (document.getElementById('bid-desc') || {}).value || '';
  var amt   = parseInt((document.getElementById('bid-amt') || {}).value || '0');
  if (!title.trim()) { toast('Please describe the work', 'warning'); return; }
  if (!desc.trim())  { toast('Please add details', 'warning'); return; }
  if (!amt || amt < 100) { toast('Enter a valid budget (min \u20b9100)', 'warning'); return; }
  var btn = document.getElementById('bid-submit-btn');
  btn.innerHTML = '\u23f3 Sending bid...'; btn.disabled = true;
  setTimeout(function(){
    toast('\ud83c\udf89 ' + S.worker.name.split(' ')[0] + ' accepted your bid of \u20b9' + amt + '!', 'success');
    S.bidAmt = amt; S.prevView = 'bid'; gotoView('payment', { amount: amt, source: 'bid' });
  }, 2000);
}

// ---------- NEGOTIATE / CHAT ----------
function initChat() {
  var w = S.worker; if (!w) return;
  S.agreedAmt = null;
  document.getElementById('chat-hdr').innerHTML =
    '<button class="btn-back" onclick="gotoView(\'' + (S.prevView || 'profile') + '\')" style="flex-shrink:0">\u2190 Back</button>' +
    '<div class="chat-av" style="background:' + w.color + '">' + w.initials + '</div>' +
    '<div><div class="chat-wname">' + w.name + '</div><div class="chat-wstatus">\ud83d\udfe2 Online \u00b7 ' + (getCat(w.category)||{}).name + '</div></div>';
  document.getElementById('chat-msgs').innerHTML = '';
  document.getElementById('chat-qr').innerHTML = '';
  document.getElementById('chat-input').value = '';
  setTimeout(function(){
    addMsg('worker', 'Hello! I am ' + w.name.split(' ')[0] + '. What work do you need done? I am available to help you.');
    setReplies([
      { text: 'I need help with a job', action: 'need_work' },
      { text: 'What is your rate?', action: 'ask_rate' },
      { text: 'Are you available today?', action: 'ask_avail' },
    ]);
  }, 400);
}
function addMsg(who, text) {
  var w = S.worker;
  var now = new Date().toLocaleTimeString('en', { hour:'2-digit', minute:'2-digit' });
  var el = document.createElement('div');
  el.className = 'msg ' + (who === 'worker' ? 'msg-w' : 'msg-u');
  if (who === 'worker') {
    el.innerHTML = '<div class="msg-av2" style="background:' + w.color + '">' + w.initials + '</div><div><div class="bubble bubble-w">' + text + '</div><div class="msg-time">' + now + '</div></div>';
  } else {
    el.innerHTML = '<div><div class="bubble bubble-u">' + text + '</div><div class="msg-time" style="text-align:right">' + now + '</div></div>';
  }
  var msgs = document.getElementById('chat-msgs');
  msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
}
function setReplies(replies) {
  document.getElementById('chat-qr').innerHTML = replies.map(function(r){
    return '<button class="qr-btn ' + (r.css || '') + '" onclick="doReply(\'' + r.action + '\')">' + r.text + '</button>';
  }).join('');
}

var CHAT_ACTIONS = {
  need_work: function(w) { return {
    user: 'I need a ' + (getCat(w.category)||{}).name.toLowerCase() + ' for some work at my place.',
    worker: 'Sure! I handle all kinds of ' + (getCat(w.category)||{}).name.toLowerCase() + ' work. Describe what needs to be done?',
    replies: [
      { text: 'What is your rate?', action: 'ask_rate' },
      { text: 'Can you do it for \u20b9' + Math.round(w.minRate*0.85) + '?', action: 'low_bid' },
      { text: 'I can pay \u20b9' + w.minRate, action: 'offer_min' },
    ] }; },
  ask_rate: function(w) { return {
    user: 'What is your rate for this kind of work?',
    worker: 'My standard rate is \u20b9' + w.minRate + '\u2013\u20b9' + w.maxRate + ' depending on work. I can give a precise quote once I know the job.',
    replies: [
      { text: 'Can you do it for \u20b9' + Math.round(w.minRate*0.85) + '?', action: 'low_bid' },
      { text: 'I accept \u20b9' + w.minRate, action: 'accept_min', css: 'qr-agree' },
      { text: 'Tell me about your experience', action: 'ask_exp' },
    ] }; },
  ask_avail: function(w) { return {
    user: 'Are you available today?',
    worker: w.available ? 'Yes! I can be there within ' + w.responseTime + '. Confirm job details and payment.' : 'I am busy today but can fit you in tomorrow. What time works?',
    replies: [
      { text: 'What is your rate?', action: 'ask_rate' },
      { text: 'I accept \u20b9' + w.minRate, action: 'accept_min', css: 'qr-agree' },
    ] }; },
  low_bid: function(w) { return {
    user: 'Can you do it for \u20b9' + Math.round(w.minRate*0.85) + '?',
    worker: 'That is below my standard. My best price is \u20b9' + w.minRate + ' \u2014 quality work with genuine materials.',
    replies: [
      { text: 'I accept \u20b9' + w.minRate, action: 'accept_min', css: 'qr-agree' },
      { text: 'How about \u20b9' + Math.round(w.minRate*0.92) + '?', action: 'mid_bid' },
    ] }; },
  mid_bid: function(w) { var p = Math.round(w.minRate*0.95); return {
    user: 'How about \u20b9' + Math.round(w.minRate*0.92) + '?',
    worker: 'Alright, I can do it for \u20b9' + p + ' \u2014 final offer. Fair deal?',
    replies: [
      { text: 'Deal! \u20b9' + p, action: 'agree_mid', css: 'qr-agree' },
      { text: 'I accept \u20b9' + w.minRate, action: 'accept_min', css: 'qr-agree' },
    ] }; },
  accept_min: function(w) { return {
    user: 'Sounds good! I agree to \u20b9' + w.minRate + '.',
    worker: 'Great! Deal confirmed at \u20b9' + w.minRate + '. Proceed to payment and I will be there on time!',
    agreedAmt: w.minRate,
    replies: [{ text: '\u2705 Proceed to Payment', action: 'pay', css: 'qr-agree' }],
  }; },
  agree_mid: function(w) { var p = Math.round(w.minRate*0.95); return {
    user: 'Deal! Agreed at \u20b9' + p + '.',
    worker: 'Perfect! Confirmed at \u20b9' + p + '. Proceed to payment!',
    agreedAmt: p,
    replies: [{ text: '\u2705 Proceed to Payment', action: 'pay', css: 'qr-agree' }],
  }; },
  offer_min: function(w) { return {
    user: 'I can pay \u20b9' + w.minRate + '.',
    worker: 'That works! Go ahead and confirm with payment.',
    agreedAmt: w.minRate,
    replies: [{ text: '\u2705 Proceed to Payment', action: 'pay', css: 'qr-agree' }],
  }; },
  ask_exp: function(w) { return {
    user: 'Tell me about your experience.',
    worker: 'I have ' + w.experience + ' years experience, ' + w.jobsDone + '+ jobs, ' + w.rating + '\u2b50 rating from ' + w.reviewCount + ' reviews. You are in safe hands!',
    replies: [
      { text: 'I accept \u20b9' + w.minRate, action: 'accept_min', css: 'qr-agree' },
      { text: 'Can you do it for \u20b9' + Math.round(w.minRate*0.85) + '?', action: 'low_bid' },
    ] }; },
};

function doReply(action) {
  var w = S.worker;
  if (action === 'pay') {
    var amt = S.agreedAmt || w.minRate;
    S.prevView = 'negotiate'; gotoView('payment', { amount: amt, source: 'negotiate' }); return;
  }
  var fn = CHAT_ACTIONS[action]; if (!fn) return;
  var flow = fn(w);
  addMsg('user', flow.user);
  document.getElementById('chat-qr').innerHTML = '';
  setTimeout(function(){
    addMsg('worker', flow.worker);
    if (flow.agreedAmt) S.agreedAmt = flow.agreedAmt;
    setReplies(flow.replies || []);
  }, 1100);
}
function sendMsg() {
  var inp = document.getElementById('chat-input');
  var text = (inp.value || '').trim(); if (!text) return;
  addMsg('user', text); inp.value = '';
  var w = S.worker;
  var resps = [
    'I understand. Let me check.',
    'For \u20b9' + w.minRate + ' I can handle that. Shall we confirm?',
    'That sounds doable. When would you like me to come?',
    'With ' + w.experience + ' years of experience, I assure quality work.',
    'No problem! Just confirm details and I will be there.',
  ];
  setTimeout(function(){
    addMsg('worker', resps[Math.floor(Math.random() * resps.length)]);
    setReplies([
      { text: 'I accept \u20b9' + w.minRate, action: 'accept_min', css: 'qr-agree' },
      { text: 'Tell me about your experience', action: 'ask_exp' },
    ]);
  }, 1000);
}

// ---------- PAYMENT ----------
function initPayment(opts) {
  var w = S.worker; if (!w) return;
  var cat = getCat(w.category);
  var base = (opts && opts.amount) || S.bidAmt || w.minRate;
  var fee = Math.round(base * 0.05);
  var total = base + fee;
  S.payAmt = total;
  document.getElementById('pay-body').innerHTML =
    '<div class="pay-wrap">' +
    '<div class="pay-summary"><div class="pay-amount-label">Total Amount</div>' +
    '<div class="pay-amount">\u20b9' + total + '</div>' +
    '<div class="pay-fee-note">Includes \u20b9' + fee + ' platform fee \u00b7 Held in escrow</div>' +
    '<div class="pay-worker-row"><div class="pay-wm-av" style="background:' + w.color + '">' + w.initials + '</div>' +
    '<span>' + w.name + ' \u00b7 ' + (cat?cat.name:'') + '</span></div>' +
    (S.appt.day ? '<div style="font-size:.8rem;color:var(--muted);margin-top:.4rem">\ud83d\udcc5 ' + S.appt.day + ' \u00b7 ' + S.appt.ts + '</div>' : '') + '</div>' +
    '<div class="card-form"><h3>\ud83d\udcb3 Pay by Card</h3>' +
    '<div class="form-group"><label class="form-label">Cardholder Name</label><input class="f-input" id="cn" placeholder="Name on card" /></div>' +
    '<div class="form-group"><label class="form-label">Card Number</label><input class="f-input" id="cnum" placeholder="1234 5678 9012 3456" maxlength="19" oninput="fmtCard(this)" /></div>' +
    '<div class="card-row"><div class="form-group"><label class="form-label">Expiry</label><input class="f-input" id="cexp" placeholder="MM / YY" maxlength="7" oninput="fmtExp(this)" /></div>' +
    '<div class="form-group"><label class="form-label">CVV</label><input class="f-input" id="ccvv" placeholder="\u2022\u2022\u2022" maxlength="3" type="password" /></div></div>' +
    '<button class="btn btn-p btn-full btn-lg" id="pay-btn" onclick="doPay(' + total + ')">\ud83d\udd12 Pay Securely \u20b9' + total + '</button>' +
    '<div class="sec-note">\ud83d\udd12 Encrypted & secure. Funds released after work completion.</div></div>' +
    '<div class="or-div">\u2014\u2014 or pay with \u2014\u2014</div>' +
    '<div class="alt-pay">' +
    '<button class="btn btn-o" onclick="upiPay(' + total + ')">\ud83d\udcf1 UPI / GPay</button>' +
    '<button class="btn btn-o" onclick="netBankPay(' + total + ')">\ud83c\udfe6 Net Banking</button></div></div>';
}
function fmtCard(inp) { var v = inp.value.replace(/\D/g,'').substring(0,16); inp.value = v.replace(/(.{4})/g,'$1 ').trim(); }
function fmtExp(inp) { var v = inp.value.replace(/\D/g,'').substring(0,4); if (v.length > 2) v = v.substring(0,2) + ' / ' + v.substring(2); inp.value = v; }
function doPay(total) {
  var cn = (document.getElementById('cn') || {}).value || '';
  var num = ((document.getElementById('cnum') || {}).value || '').replace(/\s/g,'');
  var exp = (document.getElementById('cexp') || {}).value || '';
  var cvv = (document.getElementById('ccvv') || {}).value || '';
  if (!cn.trim()) { toast('Enter cardholder name', 'warning'); return; }
  if (num.length < 16) { toast('Enter valid card number', 'warning'); return; }
  if (exp.length < 7) { toast('Enter expiry date', 'warning'); return; }
  if (cvv.length < 3) { toast('Enter CVV', 'warning'); return; }
  var btn = document.getElementById('pay-btn');
  btn.innerHTML = '<span style="display:inline-block;width:18px;height:18px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:6px"></span> Processing...';
  btn.disabled = true;
  setTimeout(function(){ gotoView('confirm', { amount: total }); }, 2200);
}
function upiPay(total) {
  openModal(
    '<div style="text-align:center;padding:.5rem"><div style="font-size:3rem;margin-bottom:.75rem">\ud83d\udcf1</div>' +
    '<h2 style="margin-bottom:.4rem">UPI Payment</h2><p style="margin-bottom:1.25rem;font-size:.88rem">Pay using any UPI app</p>' +
    '<div style="background:#F5F7FA;border-radius:12px;padding:1.5rem;margin-bottom:1.25rem">' +
    '<div style="font-size:.82rem;color:#64748B;margin-bottom:.3rem">UPI ID</div>' +
    '<div style="font-family:monospace;font-size:1.1rem;font-weight:700;color:#1565C0">worklink@upi</div>' +
    '<div style="font-size:.85rem;color:#64748B;margin-top:.5rem">Amount: \u20b9' + total + '</div></div>' +
    '<button class="btn btn-succ btn-full btn-lg" onclick="closeModal();gotoView(\'confirm\',{amount:' + total + '})">\u2713 I Have Completed Payment</button></div>');
}
function netBankPay(total) { toast('Redirecting to Net Banking...', 'info'); setTimeout(function(){ gotoView('confirm', { amount: total }); }, 1500); }

// ---------- CONFIRMATION ----------
function initConfirm(opts) {
  var w = S.worker; if (!w) return;
  var cat = getCat(w.category);
  var amount = (opts && opts.amount) || S.payAmt || w.minRate;
  var id = 'WL-' + Math.random().toString(36).slice(2,8).toUpperCase();
  var fname = w.name.split(' ')[0];
  MOCK_BOOKINGS.unshift({
    id: id, workerId: w.id, workerName: w.name, category: cat?cat.name:'',
    type: S.bookMode === 'quick-fix' ? 'Quick Fix' : 'Scheduled',
    date: S.appt.day || 'As agreed', timeSlot: S.appt.ts || 'As agreed',
    status: 'confirmed', amount: amount, description: 'New booking'
  });
  document.getElementById('confirm-body').innerHTML =
    '<div class="confirm-wrap"><div class="check-circle">\u2705</div>' +
    '<h1>Booking Confirmed!</h1><p>Payment successful. ' + fname + ' has been notified.</p>' +
    '<div class="booking-card"><div class="booking-id">Booking ID: ' + id + '</div>' +
    '<div class="bk-row"><span class="bk-label">Worker</span><span class="bk-value">' + w.name + '</span></div>' +
    '<div class="bk-row"><span class="bk-label">Trade</span><span class="bk-value">' + (cat?cat.icon+' '+cat.name:'') + '</span></div>' +
    '<div class="bk-row"><span class="bk-label">Date</span><span class="bk-value">' + (S.appt.day||'As agreed') + '</span></div>' +
    '<div class="bk-row"><span class="bk-label">Time</span><span class="bk-value">' + (S.appt.ts||'To be confirmed') + '</span></div>' +
    '<div class="bk-row"><span class="bk-label">Amount</span><span class="bk-value" style="color:var(--success)">\u20b9' + amount + '</span></div>' +
    '<div class="bk-row"><span class="bk-label">Status</span><span class="bk-value"><span class="status-pill s-confirmed">\u2713 Confirmed</span></span></div></div>' +
    '<div class="confirm-actions">' +
    '<button class="btn btn-p btn-full btn-lg" onclick="gotoBookings()">\ud83d\udccb View My Bookings</button>' +
    '<button class="btn btn-o btn-full" onclick="goHome()">\ud83c\udfe0 Back to Home</button></div>' +
    '<div class="escrow-note">\ud83d\udd12 Your \u20b9' + amount + ' is held in escrow. Released to ' + fname + ' only after you confirm work completion.</div></div>';
  S.appt = { day: null, ts: null, pricing: null };
}

// ---------- BOOKINGS ----------
function initBookings() {
  if (!S.user) { openAuth(true); return; }
  var body = document.getElementById('bookings-body');
  if (!MOCK_BOOKINGS.length) {
    body.innerHTML = '<div class="bookings-list"><div class="empty-state"><div class="empty-icon">\ud83d\udccb</div><h3>No bookings yet</h3><p>Find a worker to get started!</p><button class="btn btn-p" onclick="goHome()">Find Workers</button></div></div>';
    return;
  }
  body.innerHTML = '<div class="bookings-list">' + MOCK_BOOKINGS.map(function(b){
    return '<div class="bk-item"><div class="bk-item-head"><div><div class="bk-item-name">' + b.workerName + '</div><div class="bk-item-sub">' + b.category + ' \u00b7 ' + b.type + '</div></div>' +
      '<span class="status-pill s-' + b.status + '">' + b.status.charAt(0).toUpperCase() + b.status.slice(1) + '</span></div>' +
      '<div class="bk-meta"><span>\ud83d\udcc5 ' + b.date + '</span><span>\u23f0 ' + b.timeSlot + '</span><span>\u20b9' + b.amount + '</span></div>' +
      '<div class="bk-desc">' + b.description + '</div>' +
      '<div class="bk-actions">' +
      (b.status === 'confirmed' ? '<button class="btn btn-o btn-sm" onclick="toast(\'Calling worker...\',\'info\')">\ud83d\udcde Contact</button><button class="btn btn-sm" style="color:#EF4444;border-color:#EF4444;background:#fff" onclick="cancelBk(\'' + b.id + '\')">Cancel</button>' : '') +
      (b.status === 'completed' ? '<button class="btn btn-p btn-sm" onclick="openReview(\'' + b.id + '\')">\u2b50 Review</button>' : '') +
      '</div></div>';
  }).join('') + '</div>';
}
function cancelBk(id) {
  var bk = MOCK_BOOKINGS.find(function(b){ return b.id === id; });
  if (bk) { bk.status = 'cancelled'; toast('Booking cancelled. Refund in 3\u20135 days.', 'info'); initBookings(); }
}
var _revRating = 0;
function openReview(id) {
  _revRating = 0;
  openModal('<h2 style="margin-bottom:.5rem">Leave a Review</h2><p style="margin-bottom:1.25rem;font-size:.88rem">How was your experience?</p>' +
    '<div style="display:flex;justify-content:center;gap:.5rem;font-size:2.2rem;margin-bottom:1.5rem">' +
    [1,2,3,4,5].map(function(i){ return '<span id="rs-' + i + '" onclick="pickStar(' + i + ')" style="cursor:pointer">\u2606</span>'; }).join('') + '</div>' +
    '<div class="form-group"><textarea class="f-input" id="rev-text" placeholder="Share your experience..." rows="3"></textarea></div>' +
    '<button class="btn btn-p btn-full" onclick="submitReview()">Submit Review</button>');
}
function pickStar(n) { _revRating = n; for (var i=1;i<=5;i++){ var el=document.getElementById('rs-'+i); if(el) el.textContent = i<=n ? '\u2b50' : '\u2606'; } }
function submitReview() { if (!_revRating) { toast('Select a star rating', 'warning'); return; } closeModal(); toast('Thank you for your review!', 'success'); }

// ---------- AUTH ----------
function openAuth(redir) {
  openModal(
    '<div><div class="auth-tabs"><button class="auth-tab act" id="atab-login" onclick="switchTab(\'login\')">Sign In</button>' +
    '<button class="auth-tab" id="atab-reg" onclick="switchTab(\'reg\')">Register</button></div>' +
    '<div id="apane-login">' +
    '<div class="form-group"><label class="form-label">Email or Phone</label><input class="f-input" id="l-email" placeholder="your@email.com" /></div>' +
    '<div class="form-group"><label class="form-label">Password</label><input class="f-input" type="password" id="l-pass" placeholder="Enter password" /></div>' +
    '<button class="btn btn-p btn-full btn-lg" onclick="doLogin(' + (redir?'true':'false') + ')">Sign In \u2192</button></div>' +
    '<div id="apane-reg" class="auth-pane hidden">' +
    '<div class="form-group"><label class="form-label">Full Name</label><input class="f-input" id="r-name" placeholder="Your name" /></div>' +
    '<div class="form-group"><label class="form-label">Email</label><input class="f-input" id="r-email" placeholder="your@email.com" /></div>' +
    '<div class="form-group"><label class="form-label">Phone</label><input class="f-input" id="r-phone" placeholder="+91 XXXXX XXXXX" /></div>' +
    '<div class="form-group"><label class="form-label">City</label><input class="f-input" id="r-city" placeholder="Delhi, Mumbai..." /></div>' +
    '<div class="form-group"><label class="form-label">Password</label><input class="f-input" type="password" id="r-pass" placeholder="Create password" /></div>' +
    '<button class="btn btn-p btn-full btn-lg" onclick="doRegister(' + (redir?'true':'false') + ')">Create Account \u2192</button></div></div>');
}
function switchTab(tab) {
  document.getElementById('atab-login').classList.toggle('act', tab==='login');
  document.getElementById('atab-reg').classList.toggle('act', tab==='reg');
  document.getElementById('apane-login').classList.toggle('hidden', tab!=='login');
  document.getElementById('apane-reg').classList.toggle('hidden', tab!=='reg');
}
function doLogin(redir) {
  var email = (document.getElementById('l-email')||{}).value||'';
  var pass  = (document.getElementById('l-pass')||{}).value||'';
  if (!email.trim() || !pass) { toast('Fill in all fields', 'warning'); return; }
  S.user = { name: email.split('@')[0] || 'User', email: email };
  localStorage.setItem('wl_user', JSON.stringify(S.user));
  closeModal(); toast('Welcome back!', 'success'); updateNavUser();
  if (redir) gotoView('bookings');
}
function doRegister(redir) {
  var name  = (document.getElementById('r-name')||{}).value||'';
  var email = (document.getElementById('r-email')||{}).value||'';
  var phone = (document.getElementById('r-phone')||{}).value||'';
  var city  = (document.getElementById('r-city')||{}).value||'';
  var pass  = (document.getElementById('r-pass')||{}).value||'';
  if (!name.trim()||!email.trim()||!phone.trim()||!city.trim()||!pass) { toast('Fill in all fields', 'warning'); return; }
  S.user = { name: name, email: email, phone: phone, city: city };
  localStorage.setItem('wl_user', JSON.stringify(S.user));
  closeModal(); toast('Welcome to WorkLink, ' + name.split(' ')[0] + '!', 'success'); updateNavUser();
  if (redir) gotoView('bookings');
}
function updateNavUser() {
  var btn = document.getElementById('btn-signin');
  if (btn && S.user) btn.textContent = '\ud83d\udc64 ' + S.user.name.split(' ')[0];
}

// ---------- MODAL ----------
function openModal(html) { document.getElementById('modal-body').innerHTML = html; document.getElementById('modal-overlay').classList.add('open'); }
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
function handleOverlayClick(e) { if (e.target === document.getElementById('modal-overlay')) closeModal(); }

// ---------- TOAST ----------
function toast(msg, type) {
  var t = document.createElement('div');
  t.className = 'toast toast-' + (type || 'info');
  t.textContent = msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(function(){ t.remove(); }, 3500);
}

// ---------- NAV TOGGLE ----------
function toggleNav() { document.getElementById('nav-links').classList.toggle('open'); }
function closeNav() { var nl = document.getElementById('nav-links'); if (nl) nl.classList.remove('open'); }

// ---------- BOOT ----------
document.addEventListener('DOMContentLoaded', function() {
  gotoView('home');
  updateNavUser();
  var ci = document.getElementById('chat-input');
  if (ci) ci.addEventListener('keypress', function(e){ if (e.key === 'Enter') sendMsg(); });
});
