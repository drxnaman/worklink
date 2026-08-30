// ============================================================
// WorkLink Worker Portal — Application Logic
// ============================================================

// ---------- STATE ----------
var S = {
  view: 'dashboard',
  reqTab: 'pending',
  histTab: 'all',
  chatEmployer: null,
  chatJobId: null,
};

// ---------- HELPERS ----------
function getEmp(id) { return EMPLOYERS[id] || { name:'Unknown', initials:'?', color:'#999' }; }
function starsText(r) { var f = Math.round(r); return '\u2605'.repeat(f) + '\u2606'.repeat(5-f); }
function toast(msg, type) {
  var t = document.createElement('div');
  t.className = 'toast toast-' + (type||'info');
  t.textContent = msg;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(function(){ t.remove(); }, 3500);
}
function openModal(html) { document.getElementById('modal-body').innerHTML = html; document.getElementById('modal-overlay').classList.add('open'); }
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
function handleOverlayClick(e) { if (e.target === document.getElementById('modal-overlay')) closeModal(); }
function toggleNav() { document.getElementById('nav-links').classList.toggle('open'); }
function closeNav() { var n = document.getElementById('nav-links'); if (n) n.classList.remove('open'); }

// ---------- ROUTING ----------
function goTo(viewId) {
  document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
  var el = document.getElementById('view-' + viewId);
  if (el) el.classList.add('active');
  S.view = viewId;
  window.scrollTo(0, 0);
  closeNav();
  // Update nav active
  document.querySelectorAll('.nav-ghost').forEach(function(b){ b.classList.remove('act'); });
  var nt = document.getElementById('nt-' + viewId);
  if (nt) nt.classList.add('act');
  switch (viewId) {
    case 'dashboard': initDashboard(); break;
    case 'requests':  initRequests(); break;
    case 'active':    initActive(); break;
    case 'history':   initHistory(); break;
    case 'chat':      break; // chat is initialized via openChat()
    case 'profile':   initProfile(); break;
    case 'earnings':  initEarnings(); break;
  }
  return false;
}

// ---------- DASHBOARD ----------
function initDashboard() {
  // Greeting
  var hr = new Date().getHours();
  var greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('dash-name').textContent = greet + ', ' + WORKER.name.split(' ')[0] + '!';

  // Stats
  var pending = JOB_REQUESTS.filter(function(j){ return j.status === 'pending'; }).length;
  var active  = JOB_REQUESTS.filter(function(j){ return j.status === 'accepted'; }).length;
  document.getElementById('dash-stats').innerHTML =
    '<div class="stat-card"><div class="sc-icon">\ud83d\udce9</div><div class="sc-val">' + pending + '</div><div class="sc-label">Pending Requests</div></div>' +
    '<div class="stat-card"><div class="sc-icon">\ud83d\udd27</div><div class="sc-val">' + active + '</div><div class="sc-label">Active Jobs</div></div>' +
    '<div class="stat-card"><div class="sc-icon">\ud83d\udcb0</div><div class="sc-val">\u20b9' + EARNINGS.thisMonth + '</div><div class="sc-label">This Month</div></div>' +
    '<div class="stat-card"><div class="sc-icon">\u2b50</div><div class="sc-val">' + WORKER.rating + '</div><div class="sc-label">Rating (' + WORKER.reviewCount + ')</div></div>';

  // Update badge
  document.getElementById('req-badge').textContent = pending;
  document.getElementById('tc-pending').textContent = pending;

  // Availability
  document.getElementById('avail-cb').checked = WORKER.available;
  updateAvailText();

  // Activity
  document.getElementById('activity-feed').innerHTML = ACTIVITY.map(function(a){
    return '<div class="feed-item"><span class="feed-icon">' + a.icon + '</span><span class="feed-text">' + a.text + '</span><span class="feed-time">' + a.time + '</span></div>';
  }).join('');
}

function toggleAvail() {
  WORKER.available = document.getElementById('avail-cb').checked;
  updateAvailText();
  toast(WORKER.available ? 'You are now online and accepting jobs!' : 'You are now offline.', WORKER.available ? 'success' : 'warning');
}

function updateAvailText() {
  var el = document.getElementById('avail-text');
  if (WORKER.available) {
    el.className = 'avail-status avail-on';
    el.innerHTML = '\ud83d\udfe2 Online \u2014 Accepting Jobs';
  } else {
    el.className = 'avail-status avail-off';
    el.innerHTML = '\u26aa Offline \u2014 Not Accepting Jobs';
  }
}

// ---------- JOB REQUESTS ----------
function initRequests() {
  switchReqTab(S.reqTab);
}

function switchReqTab(tab) {
  S.reqTab = tab;
  // Update tab buttons
  var tabs = document.querySelectorAll('#req-tabs .tab');
  tabs.forEach(function(t){ t.classList.remove('act'); });
  var labels = { pending: 0, accepted: 1, declined: 2 };
  if (tabs[labels[tab]]) tabs[labels[tab]].classList.add('act');

  var jobs = JOB_REQUESTS.filter(function(j){ return j.status === tab; });
  var list = document.getElementById('req-list');

  if (!jobs.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">' +
      (tab === 'pending' ? '\ud83d\udce9' : tab === 'accepted' ? '\u2705' : '\u274c') +
      '</div><h3>No ' + tab + ' requests</h3><p>' +
      (tab === 'pending' ? 'New job requests will appear here.' : tab === 'accepted' ? 'Jobs you accept will show here.' : 'Declined jobs will appear here.') +
      '</p></div>';
    return;
  }

  list.innerHTML = jobs.map(function(j){
    var emp = getEmp(j.employer);
    var html = '<div class="job-card">' +
      '<div class="jc-head"><div class="jc-title">' + j.title + '</div>' +
      '<span class="type-badge ' + (j.type === 'Quick Fix' ? 'tb-qf' : 'tb-sched') + '">' + j.type + '</span></div>' +
      '<div class="jc-employer"><div class="jc-emp-av" style="background:' + emp.color + '">' + emp.initials + '</div>' +
      '<div><div class="jc-emp-name">' + emp.name + '</div><div class="jc-emp-time">' + j.createdAt + '</div></div></div>' +
      '<div class="jc-desc">' + j.description + '</div>' +
      '<div class="jc-meta"><span>\ud83d\udcc5 ' + j.date + '</span><span>\u23f0 ' + j.timeSlot + '</span><span>\ud83d\udccd ' + j.location + '</span></div>' +
      '<div class="jc-price">\u20b9' + j.offeredPrice + '</div>';

    if (tab === 'pending') {
      html += '<div class="jc-btns">' +
        '<button class="btn btn-succ btn-sm" onclick="acceptJob(\'' + j.id + '\')">\u2705 Accept</button>' +
        '<button class="btn btn-danger btn-sm" onclick="declineJob(\'' + j.id + '\')">\u274c Decline</button>' +
        '<button class="btn btn-accent btn-sm" onclick="openChat(\'' + j.employer + '\',\'' + j.id + '\')">\ud83d\udcac Negotiate</button></div>';
    } else if (tab === 'accepted') {
      var statusLabel = j.jobStatus === 'en_route' ? 'En Route' : j.jobStatus === 'in_progress' ? 'In Progress' : 'Accepted';
      html += '<div style="margin-bottom:.5rem"><span class="status-pill s-' + (j.jobStatus || 'accepted') + '">' + statusLabel + '</span></div>';
      html += '<div class="jc-btns">' +
        '<button class="btn btn-accent btn-sm" onclick="openChat(\'' + j.employer + '\',\'' + j.id + '\')">\ud83d\udcac Chat</button></div>';
    } else if (tab === 'declined') {
      html += '<div style="font-size:.82rem;color:var(--muted)">Reason: ' + (j.declineReason || 'Not specified') + '</div>';
    }
    html += '</div>';
    return html;
  }).join('');
}

function acceptJob(id) {
  var job = JOB_REQUESTS.find(function(j){ return j.id === id; });
  if (job) {
    job.status = 'accepted';
    job.jobStatus = 'en_route';
    toast('\u2705 Job accepted! ' + getEmp(job.employer).name + ' has been notified.', 'success');
    ACTIVITY.unshift({ icon: '\u2705', text: 'You accepted: ' + job.title, time: 'Just now', type: 'accepted' });
    updateBadge();
    switchReqTab('pending');
  }
}

function declineJob(id) {
  openModal(
    '<div style="text-align:center">' +
    '<div style="font-size:2.5rem;margin-bottom:.75rem">\u274c</div>' +
    '<h2 style="margin-bottom:.75rem">Decline this job?</h2>' +
    '<div class="form-group"><label class="form-label">Reason (optional)</label>' +
    '<select class="f-input" id="decline-reason">' +
    '<option value="Price too low">Price too low</option>' +
    '<option value="Not available">Not available at that time</option>' +
    '<option value="Too far">Location too far</option>' +
    '<option value="Other">Other</option></select></div>' +
    '<div style="display:flex;gap:.5rem">' +
    '<button class="btn btn-danger btn-full" onclick="confirmDecline(\'' + id + '\')">Confirm Decline</button>' +
    '<button class="btn btn-g btn-full" onclick="closeModal()">Cancel</button></div></div>'
  );
}

function confirmDecline(id) {
  var reason = (document.getElementById('decline-reason') || {}).value || 'Not specified';
  var job = JOB_REQUESTS.find(function(j){ return j.id === id; });
  if (job) {
    job.status = 'declined';
    job.declineReason = reason;
    closeModal();
    toast('Job declined.', 'info');
    updateBadge();
    switchReqTab('pending');
  }
}

function updateBadge() {
  var pending = JOB_REQUESTS.filter(function(j){ return j.status === 'pending'; }).length;
  document.getElementById('req-badge').textContent = pending;
  document.getElementById('tc-pending').textContent = pending;
}

// ---------- ACTIVE JOBS ----------
function initActive() {
  var jobs = JOB_REQUESTS.filter(function(j){ return j.status === 'accepted'; });
  var el = document.getElementById('active-list');
  if (!jobs.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">\ud83d\udd27</div><h3>No active jobs</h3><p>Accept a job request to get started!</p><button class="btn btn-p" onclick="goTo(\'requests\')">View Requests</button></div>';
    return;
  }
  el.innerHTML = jobs.map(function(j){
    var emp = getEmp(j.employer);
    var st = j.jobStatus || 'en_route';
    var stLabel = st === 'en_route' ? '\ud83d\ude97 En Route' : st === 'in_progress' ? '\ud83d\udd27 In Progress' : '\u23f3 Awaiting';
    return '<div class="job-card">' +
      '<div class="jc-head"><div class="jc-title">' + j.title + '</div>' +
      '<span class="status-pill s-' + st + '">' + stLabel + '</span></div>' +
      '<div class="jc-employer"><div class="jc-emp-av" style="background:' + emp.color + '">' + emp.initials + '</div>' +
      '<div><div class="jc-emp-name">' + emp.name + '</div><div class="jc-emp-time">' + j.createdAt + '</div></div></div>' +
      '<div class="jc-desc">' + j.description + '</div>' +
      '<div class="jc-meta"><span>\ud83d\udcc5 ' + j.date + '</span><span>\u23f0 ' + j.timeSlot + '</span><span>\ud83d\udccd ' + j.location + '</span></div>' +
      '<div class="jc-price">\u20b9' + j.offeredPrice + '</div>' +
      '<div class="jc-btns">' +
      (st === 'en_route' ? '<button class="btn btn-p btn-sm" onclick="updateJobStatus(\'' + j.id + '\',\'in_progress\')">\ud83d\udd27 Mark In Progress</button>' : '') +
      (st === 'in_progress' ? '<button class="btn btn-succ btn-sm" onclick="completeJob(\'' + j.id + '\')">\u2705 Mark Complete</button>' : '') +
      '<button class="btn btn-accent btn-sm" onclick="openChat(\'' + j.employer + '\',\'' + j.id + '\')">\ud83d\udcac Contact</button>' +
      '<button class="btn btn-g btn-sm" onclick="toast(\'Calling \' + getEmp(\'' + j.employer + '\').name + \'...\',\'info\')">\ud83d\udcde Call</button>' +
      '</div></div>';
  }).join('');
}

function updateJobStatus(id, status) {
  var job = JOB_REQUESTS.find(function(j){ return j.id === id; });
  if (job) {
    job.jobStatus = status;
    var label = status === 'in_progress' ? 'In Progress' : status;
    toast('\ud83d\udd27 Job marked as: ' + label, 'success');
    initActive();
  }
}

function completeJob(id) {
  openModal(
    '<div style="text-align:center">' +
    '<div style="font-size:2.5rem;margin-bottom:.75rem">\u2705</div>' +
    '<h2 style="margin-bottom:.5rem">Mark Job Complete?</h2>' +
    '<p style="margin-bottom:1.25rem;font-size:.88rem">The employer will be notified and payment will be released from escrow.</p>' +
    '<div style="display:flex;gap:.5rem">' +
    '<button class="btn btn-succ btn-full" onclick="confirmComplete(\'' + id + '\')">Confirm Complete</button>' +
    '<button class="btn btn-g btn-full" onclick="closeModal()">Cancel</button></div></div>'
  );
}

function confirmComplete(id) {
  var job = JOB_REQUESTS.find(function(j){ return j.id === id; });
  if (job) {
    var fee = Math.round(job.offeredPrice * 0.10); // 10% worker fee
    var net = job.offeredPrice - fee;
    job.status = 'completed';
    job.completedAt = new Date().toLocaleDateString('en', { month:'short', day:'numeric', year:'numeric' });
    job.earned = net;
    EARNINGS.thisMonth += net;
    EARNINGS.totalBalance += net;
    EARNINGS.totalEarned += net;
    EARNINGS.transactions.unshift({
      id: 'TXN-' + Math.random().toString(36).slice(2,5).toUpperCase(),
      jobId: job.id, employer: job.employer, title: job.title,
      date: job.completedAt, gross: job.offeredPrice, fee: fee, net: net, status: 'credited'
    });
    ACTIVITY.unshift({ icon: '\ud83d\udcb0', text: '\u20b9' + net + ' earned for ' + job.title, time: 'Just now', type: 'earning' });
    closeModal();
    toast('\ud83c\udf89 Job complete! \u20b9' + net + ' has been credited to your account.', 'success');
    initActive();
  }
}

// ---------- JOB HISTORY ----------
function initHistory() {
  switchHistTab(S.histTab);
}

function switchHistTab(tab) {
  S.histTab = tab;
  var tabs = document.querySelectorAll('#hist-tabs .tab');
  tabs.forEach(function(t){ t.classList.remove('act'); });
  var labels = { all: 0, completed: 1, cancelled: 2 };
  if (tabs[labels[tab]]) tabs[labels[tab]].classList.add('act');

  var jobs = JOB_REQUESTS.filter(function(j){
    if (tab === 'all') return j.status === 'completed' || j.status === 'cancelled';
    return j.status === tab;
  });

  var list = document.getElementById('hist-list');
  if (!jobs.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">\ud83d\udccb</div><h3>No ' + tab + ' records</h3><p>Past job history will be listed here.</p></div>';
    return;
  }

  list.innerHTML = jobs.map(function(j){
    var emp = getEmp(j.employer);
    var isComp = j.status === 'completed';
    return '<div class="job-card">' +
      '<div class="jc-head"><div class="jc-title">' + j.title + '</div>' +
      '<span class="status-pill ' + (isComp ? 's-completed' : 's-cancelled') + '">' + (isComp ? '\u2713 Completed' : '\u2715 Cancelled') + '</span></div>' +
      '<div class="jc-employer"><div class="jc-emp-av" style="background:' + emp.color + '">' + emp.initials + '</div>' +
      '<div><div class="jc-emp-name">' + emp.name + '</div><div class="jc-emp-time">Completed on ' + (j.completedAt || j.date) + '</div></div></div>' +
      '<div class="jc-desc">' + j.description + '</div>' +
      '<div class="jc-meta"><span>\ud83d\udccd ' + j.location + '</span><span>\ud83d\udcc5 ' + j.date + '</span>' +
      (isComp ? '<span style="color:var(--success);font-weight:700">\ud83d\udcb0 Earned: \u20b9' + (j.earned || j.offeredPrice) + '</span>' : '') +
      '</div>' +
      (j.review ? '<div style="background:var(--bg);border-radius:8px;padding:.6rem .8rem;margin-top:.5rem;font-size:.84rem;font-style:italic;color:var(--text)">' +
        '<span style="color:#F59E0B;font-style:normal">' + starsText(j.rating || 5) + '</span> &ldquo;' + j.review + '&rdquo;</div>' : '') +
      (j.cancelReason ? '<div style="font-size:.82rem;color:var(--danger);margin-top:.4rem">Cancellation reason: ' + j.cancelReason + '</div>' : '') +
      '</div>';
  }).join('');
}

// ---------- CHAT / NEGOTIATION ----------
var CHAT_DATA = {};

function openChat(empId, jobId) {
  S.chatEmployer = empId;
  S.chatJobId = jobId;
  var emp = getEmp(empId);
  var job = JOB_REQUESTS.find(function(j){ return j.id === jobId; });

  goTo('chat');

  document.getElementById('chat-hdr').innerHTML =
    '<button class="btn-back" onclick="goTo(\'requests\')" style="color:var(--primary);background:none;border:none;cursor:pointer;font-weight:700;font-size:1.1rem;padding:0 .5rem 0 0">\u2190 Back</button>' +
    '<div class="chat-av" style="background:' + emp.color + '">' + emp.initials + '</div>' +
    '<div><div class="chat-wname">' + emp.name + '</div>' +
    '<div class="chat-wstatus">\ud83d\udfe2 Online \u00b7 ' + (job ? job.title : 'Job Discussion') + '</div></div>';

  var msgsContainer = document.getElementById('chat-msgs');
  msgsContainer.innerHTML = '';

  var key = empId + '_' + (jobId || 'general');
  if (!CHAT_DATA[key]) {
    var jobPrice = job ? job.offeredPrice : 350;
    CHAT_DATA[key] = [
      { who: 'emp', text: 'Hello! I posted a request for: ' + (job ? job.title : 'plumbing work') + '. My budget is \u20b9' + jobPrice + '. Can you take this up?', time: 'Just now' }
    ];
  }

  renderChatMsgs(key);
  setChatReplies(job);
}

function renderChatMsgs(key) {
  var msgs = CHAT_DATA[key] || [];
  var el = document.getElementById('chat-msgs');
  var emp = getEmp(S.chatEmployer);

  el.innerHTML = msgs.map(function(m){
    var isWorker = m.who === 'worker';
    return '<div class="msg ' + (isWorker ? 'msg-u' : 'msg-w') + '">' +
      (!isWorker ? '<div class="msg-av2" style="background:' + emp.color + '">' + emp.initials + '</div>' : '') +
      '<div><div class="bubble ' + (isWorker ? 'bubble-u' : 'bubble-w') + '">' + m.text + '</div>' +
      '<div class="msg-time">' + m.time + '</div></div></div>';
  }).join('');
  el.scrollTop = el.scrollHeight;
}

function setChatReplies(job) {
  var price = job ? job.offeredPrice : 350;
  var counterPrice = Math.round(price * 1.25);
  var replies = [
    { text: 'I accept \u20b9' + price + ', let\'s proceed!', action: 'accept', price: price },
    { text: 'Can we do \u20b9' + counterPrice + ' considering material & effort?', action: 'counter', price: counterPrice },
    { text: 'What is the exact location & floor?', action: 'location' },
    { text: 'I am available to visit immediately.', action: 'avail' }
  ];

  document.getElementById('chat-qr').innerHTML = replies.map(function(r, idx){
    return '<button class="qr-btn ' + (r.action === 'accept' ? 'qr-agree' : '') + '" onclick="triggerQuickReply(' + idx + ')">' + r.text + '</button>';
  }).join('');
}

function triggerQuickReply(idx) {
  var job = JOB_REQUESTS.find(function(j){ return j.id === S.chatJobId; });
  var price = job ? job.offeredPrice : 350;
  var counterPrice = Math.round(price * 1.25);
  var options = [
    { text: 'I accept \u20b9' + price + ', let\'s proceed!', reply: 'Thank you! That sounds great. Please come at the scheduled time. I will keep everything ready.', action: 'accept' },
    { text: 'Can we do \u20b9' + counterPrice + ' considering material & effort?', reply: 'Fair enough, \u20b9' + counterPrice + ' works for me as long as quality work is assured. Deal!', action: 'counter', newPrice: counterPrice },
    { text: 'What is the exact location & floor?', reply: 'It is Flat 302, 3rd Floor, Block C. Lift is working. Call me when you reach the gate!', action: 'info' },
    { text: 'I am available to visit immediately.', reply: 'Perfect! I am at home right now, see you soon.', action: 'info' }
  ];

  var opt = options[idx];
  if (!opt) return;

  var key = S.chatEmployer + '_' + (S.chatJobId || 'general');
  var now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  CHAT_DATA[key].push({ who: 'worker', text: opt.text, time: now });
  renderChatMsgs(key);
  document.getElementById('chat-qr').innerHTML = '';

  setTimeout(function(){
    var respTime = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    CHAT_DATA[key].push({ who: 'emp', text: opt.reply, time: respTime });
    renderChatMsgs(key);

    if (opt.action === 'counter' && job) {
      job.offeredPrice = opt.newPrice;
      toast('Employer agreed to revised price \u20b9' + opt.newPrice + '!', 'success');
    }
    if (opt.action === 'accept' && job && job.status === 'pending') {
      job.status = 'accepted';
      job.jobStatus = 'en_route';
      updateBadge();
      toast('Job confirmed & moved to Active Jobs!', 'success');
    }

    setChatReplies(job);
  }, 1000);
}

function sendChatMsg() {
  var inp = document.getElementById('chat-input');
  var text = (inp.value || '').trim();
  if (!text) return;
  inp.value = '';

  var key = S.chatEmployer + '_' + (S.chatJobId || 'general');
  var now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  CHAT_DATA[key].push({ who: 'worker', text: text, time: now });
  renderChatMsgs(key);

  var job = JOB_REQUESTS.find(function(j){ return j.id === S.chatJobId; });
  var responses = [
    'Sounds good! Looking forward to having this resolved.',
    'Understood. Please let me know once you are on the way.',
    'Okay, thank you for clarifying.',
    'Sure, that works for me.'
  ];

  setTimeout(function(){
    var resp = responses[Math.floor(Math.random() * responses.length)];
    var respTime = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    CHAT_DATA[key].push({ who: 'emp', text: resp, time: respTime });
    renderChatMsgs(key);
    setChatReplies(job);
  }, 1100);
}

// ---------- PROFILE ----------
function initProfile() {
  var el = document.getElementById('profile-body');
  el.innerHTML =
    '<div class="profile-section">' +
    '<div class="profile-header">' +
    '<div class="profile-av-lg" style="background:' + WORKER.color + '">' + WORKER.initials + '</div>' +
    '<div class="profile-name-edit">' +
    '<h2 style="margin-bottom:.2rem">' + WORKER.name + '</h2>' +
    '<p style="color:var(--primary);font-weight:700;font-size:.9rem">\ud83d\udd27 ' + WORKER.category + ' &middot; ' + WORKER.city + '</p>' +
    '<p style="font-size:.82rem;color:var(--muted);margin-top:.2rem">Member since ' + WORKER.memberSince + '</p>' +
    '</div></div>' +
    '<div class="profile-stat-row">' +
    '<div class="ps-box"><div class="ps-v">' + WORKER.jobsDone + '</div><div class="ps-l">Jobs Completed</div></div>' +
    '<div class="ps-box"><div class="ps-v">' + WORKER.rating + '\u2605</div><div class="ps-l">Customer Rating</div></div>' +
    '<div class="ps-box"><div class="ps-v">' + WORKER.reviewCount + '</div><div class="ps-l">Total Reviews</div></div>' +
    '<div class="ps-box"><div class="ps-v">' + WORKER.experience + ' yrs</div><div class="ps-l">Experience</div></div>' +
    '</div></div>' +

    '<div class="profile-section">' +
    '<h3>\ud83d\udcdd About & Bio</h3>' +
    '<div class="form-group"><label class="form-label">Profile Description</label>' +
    '<textarea class="f-input" id="p-bio" rows="3">' + WORKER.bio + '</textarea></div>' +
    '<div class="form-group"><label class="form-label">Phone Number</label>' +
    '<input class="f-input" id="p-phone" value="' + WORKER.phone + '" /></div>' +
    '<div class="form-group"><label class="form-label">City</label>' +
    '<input class="f-input" id="p-city" value="' + WORKER.city + '" /></div>' +
    '</div>' +

    '<div class="profile-section">' +
    '<h3>\ud83d\udd27 Skills & Specialties</h3>' +
    '<div class="skills-list" id="profile-skills">' +
    WORKER.skills.map(function(s, idx){
      return '<span class="skill-chip">' + s + ' <span class="chip-x" onclick="removeSkill(' + idx + ')">&times;</span></span>';
    }).join('') +
    '</div>' +
    '<div class="add-skill-row">' +
    '<input class="f-input" id="new-skill-input" placeholder="Add a new skill (e.g. Solar Geyser, Gas Piping)..." />' +
    '<button class="btn btn-p btn-sm" onclick="addSkill()">+ Add</button>' +
    '</div></div>' +

    '<div class="profile-section">' +
    '<h3>\ud83d\udcb0 Standard Rate Range</h3>' +
    '<p style="font-size:.84rem;color:var(--muted);margin-bottom:.8rem">Employers will see this range when browsing your profile.</p>' +
    '<div class="rate-row">' +
    '<div class="rate-field"><label class="form-label" style="margin:0">Min \u20b9</label><input class="f-input" id="p-minrate" type="number" value="' + WORKER.minRate + '" /></div>' +
    '<div class="rate-field"><label class="form-label" style="margin:0">Max \u20b9</label><input class="f-input" id="p-maxrate" type="number" value="' + WORKER.maxRate + '" /></div>' +
    '</div></div>' +

    '<div class="profile-section">' +
    '<h3>\ud83c\udfe6 Bank & Payout Details</h3>' +
    '<p style="font-size:.85rem;color:var(--text);margin-bottom:.5rem"><strong>Linked Account:</strong> ' + WORKER.bankAccount + '</p>' +
    '<p style="font-size:.8rem;color:var(--muted)">Earnings are deposited to this account upon withdrawal.</p>' +
    '</div>' +

    '<div style="display:flex;gap:.75rem;margin-top:1.25rem">' +
    '<button class="btn btn-p btn-lg btn-full" onclick="saveProfile()">\ud83d\udcbe Save Profile Changes</button>' +
    '</div>' +

    '<div class="profile-section" style="margin-top:1.5rem">' +
    '<h3>\u2b50 Customer Reviews (' + REVIEWS.length + ')</h3>' +
    REVIEWS.map(function(r){
      var emp = getEmp(r.employer);
      return '<div class="rev-item">' +
        '<div class="rev-head"><div class="rev-av" style="background:' + emp.color + '">' + emp.initials + '</div>' +
        '<div><div class="rev-name">' + emp.name + '</div><div class="rev-job">' + r.jobTitle + ' &middot; ' + r.date + '</div></div>' +
        '<div class="rev-stars">' + starsText(r.rating) + '</div></div>' +
        '<div class="rev-text">&ldquo;' + r.text + '&rdquo;</div></div>';
    }).join('') +
    '</div>';
}

function removeSkill(idx) {
  WORKER.skills.splice(idx, 1);
  initProfile();
}

function addSkill() {
  var inp = document.getElementById('new-skill-input');
  var val = (inp.value || '').trim();
  if (val && WORKER.skills.indexOf(val) === -1) {
    WORKER.skills.push(val);
    initProfile();
  }
}

function saveProfile() {
  var bio = (document.getElementById('p-bio') || {}).value;
  var phone = (document.getElementById('p-phone') || {}).value;
  var city = (document.getElementById('p-city') || {}).value;
  var minR = parseInt((document.getElementById('p-minrate') || {}).value);
  var maxR = parseInt((document.getElementById('p-maxrate') || {}).value);

  if (bio) WORKER.bio = bio.trim();
  if (phone) WORKER.phone = phone.trim();
  if (city) WORKER.city = city.trim();
  if (minR) WORKER.minRate = minR;
  if (maxR) WORKER.maxRate = maxR;

  toast('Profile updated successfully!', 'success');
}

// ---------- EARNINGS ----------
function initEarnings() {
  var el = document.getElementById('earnings-body');
  el.innerHTML =
    '<div class="earn-hero">' +
    '<div class="earn-label">AVAILABLE BALANCE FOR WITHDRAWAL</div>' +
    '<div class="earn-bal">\u20b9' + EARNINGS.totalBalance.toLocaleString() + '</div>' +
    '<button class="btn btn-white btn-lg" onclick="withdrawModal()">\ud83c\udfe6 Withdraw to Bank Account</button>' +
    '<div class="earn-row">' +
    '<div class="earn-box"><div class="earn-box-v">\u20b9' + EARNINGS.thisMonth.toLocaleString() + '</div><div class="earn-box-l">This Month Net</div></div>' +
    '<div class="earn-box"><div class="earn-box-v">\u20b9' + EARNINGS.totalEarned.toLocaleString() + '</div><div class="earn-box-l">Lifetime Total Earned</div></div>' +
    '</div></div>' +

    '<div style="margin-bottom:.85rem;display:flex;align-items:center;justify-content:space-between">' +
    '<h3>\ud83d\udcc4 Transaction History</h3>' +
    '<span style="font-size:.8rem;color:var(--muted)">WorkLink platform fee: 5%</span>' +
    '</div>' +

    '<div class="txn-list">' +
    EARNINGS.transactions.map(function(t){
      var isCred = t.status === 'credited';
      return '<div class="txn-item">' +
        '<div class="txn-icon ' + (isCred ? 'txn-credit' : 'txn-debit') + '">' + (isCred ? '\u2193' : '\u2191') + '</div>' +
        '<div class="txn-info">' +
        '<div class="txn-title">' + t.title + '</div>' +
        '<div class="txn-date">' + t.date + (t.fee ? ' &middot; Gross: \u20b9' + t.gross + ' (Fee: \u20b9' + t.fee + ')' : '') + '</div></div>' +
        '<div class="txn-amt ' + (t.net > 0 ? 'txn-pos' : 'txn-neg') + '">' + (t.net > 0 ? '+' : '') + '\u20b9' + Math.abs(t.net) + '</div>' +
        '</div>';
    }).join('') +
    '</div>';
}

function withdrawModal() {
  if (EARNINGS.totalBalance <= 0) {
    toast('No balance available to withdraw.', 'warning');
    return;
  }
  openModal(
    '<div style="text-align:center">' +
    '<div style="font-size:2.5rem;margin-bottom:.6rem">\ud83c\udfe6</div>' +
    '<h2 style="margin-bottom:.35rem">Withdraw Funds</h2>' +
    '<p style="font-size:.88rem;color:var(--muted);margin-bottom:1.2rem">Transfer balance to your registered bank account</p>' +
    '<div style="background:var(--bg);border-radius:10px;padding:1rem;margin-bottom:1.2rem;text-align:left">' +
    '<div style="font-size:.8rem;color:var(--muted)">Bank Account</div>' +
    '<div style="font-weight:700;font-size:1rem;color:var(--text);margin-top:.2rem">' + WORKER.bankAccount + '</div>' +
    '<div style="font-size:.82rem;color:var(--success);margin-top:.4rem">\u2713 Verified & Active</div>' +
    '</div>' +
    '<div class="form-group" style="text-align:left">' +
    '<label class="form-label">Withdrawal Amount (\u20b9)</label>' +
    '<input class="f-input" id="withdraw-amt" type="number" value="' + EARNINGS.totalBalance + '" max="' + EARNINGS.totalBalance + '" min="100" />' +
    '</div>' +
    '<button class="btn btn-p btn-full btn-lg" onclick="confirmWithdraw()">Confirm Transfer &rarr;</button>' +
    '<button class="btn btn-g btn-full" style="margin-top:.5rem" onclick="closeModal()">Cancel</button>' +
    '</div>'
  );
}

function confirmWithdraw() {
  var amtInput = document.getElementById('withdraw-amt');
  var amt = parseInt(amtInput ? amtInput.value : 0);
  if (!amt || amt <= 0 || amt > EARNINGS.totalBalance) {
    toast('Please enter a valid amount up to \u20b9' + EARNINGS.totalBalance, 'warning');
    return;
  }

  EARNINGS.totalBalance -= amt;
  var today = new Date().toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
  EARNINGS.transactions.unshift({
    id: 'TXN-' + Math.random().toString(36).slice(2,5).toUpperCase(),
    jobId: null, employer: null, title: 'Bank withdrawal (' + WORKER.bankAccount + ')',
    date: today, gross: 0, fee: 0, net: -amt, status: 'withdrawn'
  });
  ACTIVITY.unshift({ icon: '\ud83c\udfe6', text: 'Withdrew \u20b9' + amt + ' to ' + WORKER.bankAccount, time: 'Just now', type: 'withdrawal' });

  closeModal();
  toast('\ud83c\udf89 \u20b9' + amt + ' initiated for bank transfer! Expected in 1-2 hours.', 'success');
  initEarnings();
}

// ---------- BOOT ----------
document.addEventListener('DOMContentLoaded', function() {
  // Set worker details in top bar
  var navAv = document.getElementById('nav-av');
  if (navAv) navAv.textContent = WORKER.initials;
  var navName = document.getElementById('nav-name');
  if (navName) navName.textContent = WORKER.name.split(' ')[0];

  // Set dash avatar
  var dashAv = document.getElementById('dash-av');
  if (dashAv) dashAv.textContent = WORKER.initials;

  // Initialize view
  goTo('dashboard');

  // Bind Enter key on chat
  var chatInp = document.getElementById('chat-input');
  if (chatInp) {
    chatInp.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendChatMsg();
    });
  }
});
