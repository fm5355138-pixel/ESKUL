document.addEventListener('DOMContentLoaded',()=>{
	const links=document.querySelectorAll('a[href^="#"]');
	links.forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const id=a.getAttribute('href').slice(1);const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth'});}})});
	const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('in-view');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.12 }) : null;

	const headerRight = document.querySelector('.header-right');
	const authButtons = document.querySelector('.auth-buttons');
	const storedUser = (()=>{
		try {
			const sessionUser = sessionStorage.getItem('loggedInStudent');
			if (sessionUser) return JSON.parse(sessionUser);
			const localUser = localStorage.getItem('loggedInStudent');
			return localUser ? JSON.parse(localUser) : null;
		} catch (error) {
			return null;
		}
	})();

	const resolveCurrentStudent = (user) => {
		if (!user) return user;
		if (user.kelas) return user;
		try {
			const students = JSON.parse(localStorage.getItem('students') || '[]');
			const match = students.find((student) => String(student.nis) === String(user.nis));
			if (!match) {
				if (String(user.nis) === '12345') {
					const fallback = { ...user, nis: '12345', name: user.name || 'Siswa Demo', kelas: 'XII RPL 1', email: 'demo@smktarunabangsa.sch.id' };
					if (sessionStorage.getItem('loggedInStudent')) sessionStorage.setItem('loggedInStudent', JSON.stringify(fallback));
					if (localStorage.getItem('loggedInStudent')) localStorage.setItem('loggedInStudent', JSON.stringify(fallback));
					return fallback;
				}
				return user;
			}
			const hydrated = { ...user, ...match };
			if (sessionStorage.getItem('loggedInStudent')) sessionStorage.setItem('loggedInStudent', JSON.stringify(hydrated));
			if (localStorage.getItem('loggedInStudent')) localStorage.setItem('loggedInStudent', JSON.stringify(hydrated));
			return hydrated;
		} catch (error) {
			return user;
		}
	};
	const currentStudent = resolveCurrentStudent(storedUser);

	const clearStudentSession = () => {
		sessionStorage.removeItem('loggedInStudent');
		localStorage.removeItem('loggedInStudent');
	};

	if (storedUser) {
		document.querySelectorAll('.auth-buttons').forEach((buttonGroup) => {
			buttonGroup.classList.add('hidden');
		});
	}

	if (currentStudent && headerRight && authButtons) {
		const userStatus = document.createElement('div');
		userStatus.className = 'user-status';
		userStatus.innerHTML = `<span class="user-chip">Halo, ${currentStudent.name || 'Siswa'}</span><button class="logout-btn" type="button">Keluar</button>`;
		headerRight.insertBefore(userStatus, authButtons);
		const logoutBtn = userStatus.querySelector('.logout-btn');
		logoutBtn.addEventListener('click', () => {
			clearStudentSession();
			window.location.reload();
		});
	}

	const portalName = document.getElementById('portal-name');
	const portalNis = document.getElementById('portal-nis');
	const portalKelas = document.getElementById('portal-kelas');
	const portalSection = document.getElementById('student-portal');
	if (currentStudent && portalSection) {
		portalSection.classList.remove('hidden');
		portalName.textContent = currentStudent.name || 'Siswa';
		portalNis.textContent = currentStudent.nis || '-';
		portalKelas.textContent = currentStudent.kelas || 'Belum terdaftar';
	}

	if (currentStudent) {
		document.querySelectorAll('.auth-buttons').forEach((buttonGroup) => {
			buttonGroup.classList.add('hidden');
		});
	}

	const onLogout = document.querySelector('.logout-btn');
	if (onLogout) {
		onLogout.addEventListener('click', () => {
			clearStudentSession();
			window.location.href = 'index.html';
		});
	}

	// Intersection Observer for fade-up elements
	// Mobile nav toggle
	const navToggle = document.querySelector('.nav-toggle');
	const navToggleLeft = document.querySelector('.nav-toggle-left');
	const mainNav = document.getElementById('main-navigation');
	const navToggleRight = document.querySelector('.nav-toggle-right');
	if(navToggle && mainNav){
		navToggle.addEventListener('click', ()=>{
			const expanded = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!expanded));
			const leftPanel = document.getElementById('left-panel');
			// Open left-panel (overlay) if present, otherwise mobile-drawer, regardless of width
			if(leftPanel){ leftPanel.classList.toggle('open'); leftPanel.setAttribute('aria-hidden', String(expanded)); return; }
			const mobileDrawer = document.getElementById('mobile-drawer');
			if(mobileDrawer){ mobileDrawer.classList.toggle('active'); const mobileOverlay = document.getElementById('mobile-overlay'); if(mobileOverlay) mobileOverlay.classList.toggle('active'); return; }
			mainNav.style.display = expanded ? '' : 'flex';
		});
	}

	// wire left hamburger to open mobile panel/drawer directly
	if(navToggleLeft){
		navToggleLeft.addEventListener('click', (event)=>{
			event.stopPropagation();
			const leftPanel = document.getElementById('left-panel');
			if(leftPanel){ leftPanel.classList.toggle('open'); leftPanel.setAttribute('aria-hidden', String(!leftPanel.classList.contains('open'))); return; }
			const mobileDrawer = document.getElementById('mobile-drawer');
			const mobileOverlay = document.getElementById('mobile-overlay');
			if(mobileDrawer){ const active = mobileDrawer.classList.toggle('active'); if(mobileOverlay) mobileOverlay.classList.toggle('active'); return; }
			// fallback: toggle main nav
			if(mainNav){ const isShown = mainNav.style.display === 'flex'; mainNav.style.display = isShown ? '' : 'flex'; }
		});
	}

	// no temporary hamburger handlers remain
	if(navToggleRight){
		const leftPanel = document.getElementById('left-panel');
		navToggleRight.addEventListener('click', (e)=>{
			const expanded = navToggleRight.getAttribute('aria-expanded') === 'true';
			navToggleRight.setAttribute('aria-expanded', String(!expanded));
			if(navToggle) navToggle.setAttribute('aria-expanded', String(!expanded));
			// If a left-panel exists and we're on a small screen, open that overlay.
			if(leftPanel && window.innerWidth <= 720){
				leftPanel.classList.toggle('open');
				leftPanel.setAttribute('aria-hidden', String(expanded));
				return;
			}
			// Otherwise toggle the main navigation (desktop fallback)
			if(mainNav){ mainNav.style.display = expanded ? '' : 'flex'; }
		});
	}

	// Scrollspy: highlight active nav link based on sections in view
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.main-nav .nav-link');

	function updateActiveLink(){
		let found = false;
		sections.forEach(sec=>{
			const rect = sec.getBoundingClientRect();
			if(!found && rect.top <= 120 && rect.bottom > 120){
				const id = sec.id;
				navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#'+id || (l.getAttribute('href')==='index.html' && id==='')));
				found = true;
			}
		});
		if(!found){ // top of page
			navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='index.html'));
		}
	}

	window.addEventListener('scroll', updateActiveLink, {passive:true});
	updateActiveLink();

	// Auto-close mobile nav after clicking a link
	const mainNavLinks = document.querySelectorAll('#main-navigation .nav-link');
	mainNavLinks.forEach(l=>{
		l.addEventListener('click', ()=>{
			if(window.innerWidth <= 720 && mainNav){ mainNav.style.display = ''; navToggle.setAttribute('aria-expanded','false'); }
		});
	});

	// Also ensure right toggle reset
	mainNavLinks.forEach(l=>{
		l.addEventListener('click', ()=>{
			if(window.innerWidth <= 720 && mainNav){ if(navToggleRight) navToggleRight.setAttribute('aria-expanded','false'); }
		});
	});

	// Close left panel when clicking links inside it or clicking outside
	const _leftPanel = document.getElementById('left-panel');
	if(_leftPanel){
		_leftPanel.addEventListener('click', (ev)=>{
			const target = ev.target;
			if(target.tagName === 'A' || target.classList.contains('close-btn')){
				_leftPanel.classList.remove('open');
				if(navToggleLeft) navToggleLeft.setAttribute('aria-expanded', 'false');
				if(navToggleRight) navToggleRight.setAttribute('aria-expanded','false');
			}
		});
		document.addEventListener('click', (ev)=>{
			if(!_leftPanel.classList.contains('open')) return;
			const clickedToggle = navToggleLeft && (ev.target === navToggleLeft || navToggleLeft.contains(ev.target));
			const clickedAltToggle = navToggleRight && (ev.target === navToggleRight || navToggleRight.contains(ev.target));
			if(clickedToggle || clickedAltToggle) return;
			const inside = _leftPanel.contains(ev.target);
			if(!inside){
				_leftPanel.classList.remove('open');
				if(navToggleLeft) navToggleLeft.setAttribute('aria-expanded', 'false');
				if(navToggleRight) navToggleRight.setAttribute('aria-expanded', 'false');
			}
		});
	}

	document.querySelectorAll('.nav-dropdown-toggle').forEach((toggleButton) => {
		toggleButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const dropdown = toggleButton.parentElement;
			const expanded = dropdown.classList.toggle('is-open');
			toggleButton.setAttribute('aria-expanded', String(expanded));
		});
	});

	// Mobile drawer (jadwal.html uses a different drawer system)
	const mobileDrawer = document.getElementById('mobile-drawer');
	const mobileOverlay = document.getElementById('mobile-overlay');
	const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.menu-toggle');
	const closeDrawerBtn = document.getElementById('close-drawer');
	if(menuToggle && mobileDrawer){
		const openDrawer = ()=>{ mobileDrawer.classList.add('active'); if(mobileOverlay) mobileOverlay.classList.add('active'); if(navToggleRight) navToggleRight.setAttribute('aria-expanded','true'); };
		const closeDrawer = ()=>{ mobileDrawer.classList.remove('active'); if(mobileOverlay) mobileOverlay.classList.remove('active'); if(navToggleRight) navToggleRight.setAttribute('aria-expanded','false'); };
		menuToggle.addEventListener('click', ()=>{ if(mobileDrawer.classList.contains('active')) closeDrawer(); else openDrawer(); });
		if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
		if(mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);
		// close when clicking links in drawer
		mobileDrawer.addEventListener('click', (ev)=>{ if(ev.target.tagName === 'A' || ev.target.classList.contains('mobile-link')) closeDrawer(); });
		// also let the right-side hamburger open this drawer if present
		if(navToggleRight){
			navToggleRight.addEventListener('click', ()=>{
				if(mobileDrawer.classList.contains('active')) closeDrawer(); else openDrawer();
			});
		}
	}

	// Parallax effect for hero background blobs
	const heroBg = document.querySelector('.hero-bg');
	if(heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
		window.addEventListener('scroll', ()=>{
			const sc = window.scrollY;
			// subtle translate for depth
			heroBg.style.transform = `translateY(${sc * -0.05}px)`;
		}, {passive:true});
	}
	const observer = new IntersectionObserver((entries)=>{
		entries.forEach(entry=>{
			if(entry.isIntersecting){
				entry.target.classList.add('in-view');
				observer.unobserve(entry.target);
			}
		});
	},{threshold:0.12});

	document.querySelectorAll('.fade-up').forEach(el=>observer.observe(el));
});

// Simple client-side management: add entries and persist to localStorage
const storage = {
	pembina: 'ex_pembina',
	prestasi: 'ex_prestasi',
	jadwal: 'ex_jadwal'
};

function loadJSON(key){try{return JSON.parse(localStorage.getItem(key))||[]}catch(e){return []}}
function saveJSON(key,data){localStorage.setItem(key,JSON.stringify(data))}

function createPembinaNode(item){
	const div=document.createElement('div');div.className='card entry-item fade-up';
	div.innerHTML=`<h4>Nama: ${escapeHtml(item.name)}</h4><p>Ekskul: ${escapeHtml(item.ekskul)}</p><p>Jadwal Latihan: ${escapeHtml(item.jadwal||'—')}</p><p>${escapeHtml(item.bio||'')}</p><div class="entry-actions"><button class="btn btn-outline small-action remove-pb">Hapus</button></div>`;
	return div;
}

function createPrestasiNode(item){
	const art=document.createElement('article');art.className='achievement entry-item fade-up';
	art.innerHTML=`<h4>${escapeHtml(item.title)} ${item.year?`(${escapeHtml(item.year)})`:''}</h4><p>${escapeHtml(item.desc||'')}</p><div class="entry-actions"><button class="btn btn-outline small-action remove-ps">Hapus</button></div>`;
	return art;
}

function createJadwalRow(item){
	const tr=document.createElement('tr');
	tr.innerHTML = `<td><span class="badge-day">${escapeHtml(item.hari)}</span></td><td class="ekskul-name">${escapeHtml(item.ekskul)}</td><td class="time-text">${escapeHtml(item.waktu)} <div style="float:right"><button class="btn btn-outline small-action remove-jd">Hapus</button></div></td><td>${escapeHtml(item.lokasi||'')}</td>`;
	return tr;
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]})}

document.addEventListener('DOMContentLoaded',()=>{
	// Toggle form buttons
	const toggle = (btnId, formId, cancelId)=>{
		const btn=document.getElementById(btnId), form=document.getElementById(formId), cancel=document.getElementById(cancelId);
		if(!btn||!form) return; btn.addEventListener('click',()=>{form.style.display=form.style.display==='none'?'block':'none'});
		if(cancel) cancel.addEventListener('click',()=>{form.style.display='none'});
	};
	toggle('toggle-pembina-form','pembina-form','cancel-pb');
	toggle('toggle-prestasi-form','prestasi-form','cancel-ps');
	toggle('toggle-jadwal-form','jadwal-form','cancel-jd');

	// Load and render
	const pbList=document.getElementById('pembina-list');
	const psList=document.getElementById('prestasi-list');
	const jdTable=document.getElementById('jadwal-list');

		// Seed default pembina entries if none exist
		const defaultPembina = [
			{name: 'Budi Santoso', ekskul: 'Klub Robotika', jadwal: 'Selasa & Kamis, 15:30 - 17:30', bio: 'Budi adalah lulusan Teknik Elektro yang telah memimpin tim robotika sekolah selama 5 tahun dengan fokus pada desain mekanik dan pemrograman mikrokontroler.'},
			{name: 'Siti Maharani', ekskul: 'Paduan Suara', jadwal: 'Senin & Rabu, 16:00 - 17:30', bio: 'Siti adalah musisi berpengalaman yang pernah menjadi vokalis paduan suara universitas dan mengajar teknik vokal dan harmoni.'},
			{name: 'Andi Rahman', ekskul: 'Basket', jadwal: 'Selasa, Kamis & Sabtu, 16:00 - 18:00', bio: 'Andi adalah pelatih bersertifikat yang fokus pada pengembangan keterampilan dasar dan strategi tim.'}
		];
		const existing = loadJSON(storage.pembina);
		if(!existing || existing.length === 0){
			saveJSON(storage.pembina, defaultPembina);
		}
		const pbs = loadJSON(storage.pembina); pbs.forEach(i=>{ if(pbList) pbList.appendChild(createPembinaNode(i)); });

		// Ekskul list stored separately so index.html can render dynamically
		const ekskulKey = 'ex_ekskul';
		const defaultEkskul = [
			{ name: 'Futsal', desc: 'Latihan teknik, taktik, dan kebugaran untuk pertandingan antar sekolah.', coach: 'Budi Santoso', room: 'SMK Taruna Bangsa' },
			{ name: 'Basket', desc: 'Pengembangan skill dribbling, shooting, dan strategi tim untuk kompetisi.', coach: 'Andi Rahman', room: 'SMK Taruna Bangsa' },
			{ name: 'Volley', desc: 'Latihan passing, serve, dan kerja sama tim untuk turnamen antar sekolah.', coach: 'Siti Maharani', room: 'SMK Taruna Bangsa' },
			{ name: 'Paskibra', desc: 'Pelatihan baris-berbaris, kedisiplinan, dan tata upacara.', coach: 'Pembina Paskibra', room: 'SMK Taruna Bangsa' },
			{ name: 'Pencak Silat', desc: 'Latihan teknik bela diri, ketahanan fisik, dan etika pencak silat.', coach: 'Pembina Pencak Silat', room: 'SMK Taruna Bangsa' },
			{ name: 'Musik', desc: 'Latihan instrumen, aransemen, dan persiapan pentas seni sekolah.', coach: 'Pembina Musik', room: 'SMK Taruna Bangsa' },
			{ name: 'Esport Nasa', desc: 'Latihan strategi permainan, komunikasi tim, dan persiapan kompetisi.', coach: 'Pembina Esport', room: 'SMK Taruna Bangsa' },
			{ name: 'Polsis', desc: 'Latihan keamanan sekolah, kedisiplinan, dan kesiapsiagaan siswa.', coach: 'Pembina Polsis', room: 'SMK Taruna Bangsa' }
		];
		if(!localStorage.getItem(ekskulKey)) saveJSON(ekskulKey, defaultEkskul);

		const ekskuls = loadJSON(ekskulKey);
		const ekskulList = document.getElementById('ekskul-list');
		const ekskulGrid = document.querySelector('.ekskul-grid');
		const coachMap = {
			Futsal: 'Budi Santoso', Basket: 'Andi Rahman', Volley: 'Siti Maharani',
			Paskibra: 'Pembina Paskibra', 'Pencak Silat': 'Pembina Pencak Silat',
			Musik: 'Pembina Musik', 'Esport Nasa': 'Pembina Esport', Polsis: 'Pembina Polsis'
		};
		const colorMap = {
			Futsal: '#059669', Basket: '#2563eb', Volley: '#7c3aed', Paskibra: '#d97706',
			'Pencak Silat': '#dc2626', Musik: '#0f766e', 'Esport Nasa': '#4f46e5', Polsis: '#15803d'
		};
		function renderEkskul(){
			if(!ekskulList && !ekskulGrid) return;
			const target = ekskulGrid || ekskulList;
			target.innerHTML = '';
			ekskuls.forEach(e=>{
				const card = document.createElement('div'); card.className='ekskul-card fade-up';
				card.innerHTML = `<div class="ekskul-body"><h3><a class="ekskul-name" style="--ekskul-color:${colorMap[e.name] || '#0f766e'}" href="ekskul-detail.html?name=${encodeURIComponent(e.name)}">${escapeHtml(e.name)}</a></h3><p>${escapeHtml(e.desc||'')}</p><p class="ekskul-coach">Pembina: <strong>${escapeHtml(e.coach || coachMap[e.name] || 'Pembina ekskul')}</strong></p><p class="ekskul-room">Tempat latihan: <strong>SMK Taruna Bangsa</strong></p><p style="margin-top:8px"><a href="ekskul-detail.html?name=${encodeURIComponent(e.name)}" class="card-link">Lihat Profil &rarr;</a></p></div>`;
				target.appendChild(card);
			});
			observeNew();
		}
		renderEkskul();

		const pss = loadJSON(storage.prestasi); if(psList) pss.forEach(i=>psList.appendChild(createPrestasiNode(i)));
		const jds = loadJSON(storage.jadwal); if(jdTable) jds.forEach(i=>jdTable.appendChild(createJadwalRow(i)));

		// Admin panel bindings (if present on this page)
		const adminPanel = document.getElementById('admin-panel');
		if(adminPanel){
			const ekskulSelect = document.getElementById('jadwal-ekskul');
			function populateEkskulSelect(){ if(!ekskulSelect) return; ekskulSelect.innerHTML=''; ekskuls.forEach(e=>{ const opt=document.createElement('option'); opt.value=e.name; opt.textContent=e.name; ekskulSelect.appendChild(opt); }); }
			populateEkskulSelect();

			document.getElementById('add-ekskul').addEventListener('click', ()=>{
				const name = document.getElementById('new-ekskul-name').value.trim();
				const desc = document.getElementById('new-ekskul-desc').value.trim();
				if(!name) return alert('Nama ekskul dibutuhkan');
				exskuls.push({name,desc}); saveJSON(ekskulKey,exskuls); renderEkskul(); populateEkskulSelect(); document.getElementById('new-ekskul-name').value=''; document.getElementById('new-ekskul-desc').value='';
			});

			document.getElementById('add-jadwal').addEventListener('click', ()=>{
				const hari = document.getElementById('jadwal-hari').value; const eks = document.getElementById('jadwal-ekskul').value; const waktu = document.getElementById('jadwal-waktu').value; const lokasi = document.getElementById('jadwal-lokasi').value;
				if(!eks || !waktu) return alert('Pilih ekskul dan waktu');
				jds.push({hari,ekskul:eks,waktu,lokasi}); saveJSON(storage.jadwal,jds); if(jdTable) jdTable.appendChild(createJadwalRow({hari,ekskul:eks,waktu,lokasi}));
			});

			document.getElementById('reset-data').addEventListener('click', ()=>{ if(!confirm('Reset semua data demo?')) return; localStorage.clear(); location.reload(); });
		}

	// Submit handlers
	const pbForm=document.getElementById('pembina-form');
	if(pbForm){pbForm.addEventListener('submit',e=>{
		e.preventDefault();const item={name:pbForm['name'].value,ekskul:pbForm['ekskul'].value,jadwal:pbForm['jadwal'].value,bio:pbForm['bio'].value};
		pbs.push(item);saveJSON(storage.pembina,pbs);pbList.appendChild(createPembinaNode(item));pbForm.reset();pbForm.style.display='none';observeNew();});}

	const psForm=document.getElementById('prestasi-form');
	if(psForm){psForm.addEventListener('submit',e=>{e.preventDefault();const item={title:psForm['title'].value,year:psForm['year'].value,desc:psForm['desc'].value};pss.push(item);saveJSON(storage.prestasi,pss);psList.appendChild(createPrestasiNode(item));psForm.reset();psForm.style.display='none';observeNew();});}

	const jdForm=document.getElementById('jadwal-form');
	if(jdForm){jdForm.addEventListener('submit',e=>{e.preventDefault();const item={hari:jdForm['hari'].value,ekskul:jdForm['ekskul'].value,waktu:jdForm['waktu'].value};jds.push(item);saveJSON(storage.jadwal,jds);jdTable.appendChild(createJadwalRow(item));jdForm.reset();jdForm.style.display='none';});}

	// Delegated remove handlers
	document.body.addEventListener('click',e=>{
		if(e.target.classList.contains('remove-pb')){
			const node=e.target.closest('.entry-item');const idx=Array.from(pbList.children).indexOf(node); if(idx>-1){pbs.splice(idx,1);saveJSON(storage.pembina,pbs);node.remove();}
		}
		if(e.target.classList.contains('remove-ps')){
			const node=e.target.closest('.entry-item');const idx=Array.from(psList.children).indexOf(node); if(idx>-1){pss.splice(idx,1);saveJSON(storage.prestasi,pss);node.remove();}
		}
		if(e.target.classList.contains('remove-jd')){
			const tr=e.target.closest('tr');const idx=Array.from(jdTable.querySelectorAll('tr')).indexOf(tr)-0; // includes header? safer:
			// find index among body rows
			const rows=Array.from(jdTable.querySelectorAll('tbody tr'));
			const rowIndex=rows.indexOf(tr);
			if(rowIndex>-1){jds.splice(rowIndex,1);saveJSON(storage.jadwal,jds);tr.remove();}
		}
	});

	// Observe newly added fade-up elements
	function observeNew(){
		document.querySelectorAll('.fade-up:not(.in-view)').forEach(el=>{
			if (revealObserver) revealObserver.observe(el);
			else el.classList.add('in-view');
		});
	}
	observeNew();
});