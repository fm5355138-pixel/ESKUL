document.addEventListener('DOMContentLoaded',()=>{
	const links=document.querySelectorAll('a[href^="#"]');
	links.forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const id=a.getAttribute('href').slice(1);const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth'});}})});
	const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('masuk-layar');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.12 }) : null;

	const headerRight = document.querySelector('.menu-kanan');
	const authButtons = document.querySelector('.tombol-akun');
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
		document.querySelectorAll('.tombol-akun').forEach((buttonGroup) => {
			buttonGroup.classList.add('tersembunyi');
		});
	}

	if (currentStudent && headerRight && authButtons) {
		const userStatus = document.createElement('div');
		userStatus.className = 'status-pengguna';
		userStatus.innerHTML = `<span class="chip-pengguna">Halo, ${currentStudent.name || 'Siswa'}</span><button class="tombol-keluar" type="button">Keluar</button>`;
		headerRight.insertBefore(userStatus, authButtons);
		const logoutBtn = userStatus.querySelector('.tombol-keluar');
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
		portalSection.classList.remove('tersembunyi');
		portalName.textContent = currentStudent.name || 'Siswa';
		portalNis.textContent = currentStudent.nis || '-';
		portalKelas.textContent = currentStudent.kelas || 'Belum terdaftar';
	}

	if (currentStudent) {
		document.querySelectorAll('.tombol-akun').forEach((buttonGroup) => {
			buttonGroup.classList.add('tersembunyi');
		});
	}

	const onLogout = document.querySelector('.tombol-keluar');
	if (onLogout) {
		onLogout.addEventListener('click', () => {
			clearStudentSession();
			window.location.href = 'index.html';
		});
	}

	// Tombol navigasi ponsel
	const navToggle = document.querySelector('.tombol-navigasi');
	const navToggleLeft = document.querySelector('.tombol-navigasi-kiri');
	const mainNav = document.getElementById('main-navigation');
	const navToggleRight = document.querySelector('.tombol-navigasi-kanan');
	if(navToggle && mainNav){
		navToggle.addEventListener('click', ()=>{
			const expanded = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!expanded));
			const leftPanel = document.getElementById('left-panel');
			// Buka left-panel (overlay) jika ada, kalau tidak pakai mobile-drawer, di segala lebar layar
			if(leftPanel){ leftPanel.classList.toggle('terbuka'); leftPanel.setAttribute('aria-hidden', String(expanded)); return; }
			const mobileDrawer = document.getElementById('mobile-drawer');
			if(mobileDrawer){ mobileDrawer.classList.toggle('aktif'); const mobileOverlay = document.getElementById('mobile-overlay'); if(mobileOverlay) mobileOverlay.classList.toggle('aktif'); return; }
			mainNav.style.display = expanded ? '' : 'flex';
		});
	}

	// Sambungkan hamburger kiri agar langsung membuka panel/drawer ponsel
	if(navToggleLeft){
		navToggleLeft.addEventListener('click', (event)=>{
			event.stopPropagation();
			const leftPanel = document.getElementById('left-panel');
			if(leftPanel){ leftPanel.classList.toggle('terbuka'); leftPanel.setAttribute('aria-hidden', String(!leftPanel.classList.contains('terbuka'))); return; }
			const mobileDrawer = document.getElementById('mobile-drawer');
			const mobileOverlay = document.getElementById('mobile-overlay');
			if(mobileDrawer){ const active = mobileDrawer.classList.toggle('aktif'); if(mobileOverlay) mobileOverlay.classList.toggle('aktif'); return; }
			// cadangan: buka/tutup navigasi utama
			if(mainNav){ const isShown = mainNav.style.display === 'flex'; mainNav.style.display = isShown ? '' : 'flex'; }
		});
	}

	if(navToggleRight){
		const leftPanel = document.getElementById('left-panel');
		navToggleRight.addEventListener('click', (e)=>{
			const expanded = navToggleRight.getAttribute('aria-expanded') === 'true';
			navToggleRight.setAttribute('aria-expanded', String(!expanded));
			if(navToggle) navToggle.setAttribute('aria-expanded', String(!expanded));
			// Jika ada left-panel dan layar kecil, buka overlay itu.
			if(leftPanel && window.innerWidth <= 720){
				leftPanel.classList.toggle('terbuka');
				leftPanel.setAttribute('aria-hidden', String(expanded));
				return;
			}
			// Kalau tidak, buka navigasi utama (cadangan desktop)
			if(mainNav){ mainNav.style.display = expanded ? '' : 'flex'; }
		});
	}

	// Scrollspy: hanya aktif untuk navigasi anchor dalam satu halaman (mis. <a href="#section">)
	// Link antar-halaman (index.html, pembina.html, dst.) memakai class "aktif" statis di HTML.
	const anchorLinks = Array.from(document.querySelectorAll('.navigasi-utama .tautan-navigasi[href^="#"]'));
	const sections = anchorLinks.map(l => document.getElementById(l.getAttribute('href').slice(1))).filter(Boolean);
	const navLinks = document.querySelectorAll('.navigasi-utama .tautan-navigasi');

	if (anchorLinks.length && sections.length) {
		function updateActiveLink(){
			let found = false;
			sections.forEach(sec=>{
				const rect = sec.getBoundingClientRect();
				if(!found && rect.top <= 120 && rect.bottom > 120){
					const id = sec.id;
					anchorLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#'+id));
					found = true;
				}
			});
			if(!found){
				anchorLinks.forEach(l=>l.classList.remove('aktif'));
			}
		}
		window.addEventListener('scroll', updateActiveLink, {passive:true});
		updateActiveLink();
	}

	// Tutup navigasi ponsel otomatis setelah link diklik
	const mainNavLinks = document.querySelectorAll('#main-navigation .tautan-navigasi');
	mainNavLinks.forEach(l=>{
		l.addEventListener('click', ()=>{
			if(window.innerWidth <= 720 && mainNav){ mainNav.style.display = ''; navToggle.setAttribute('aria-expanded','false'); }
		});
	});

	// Pastikan tombol kanan juga direset
	mainNavLinks.forEach(l=>{
		l.addEventListener('click', ()=>{
			if(window.innerWidth <= 720 && mainNav){ if(navToggleRight) navToggleRight.setAttribute('aria-expanded','false'); }
		});
	});

	// Tutup left panel saat link di dalamnya diklik atau klik di luar
	const _leftPanel = document.getElementById('left-panel');
	if(_leftPanel){
		_leftPanel.addEventListener('click', (ev)=>{
			const target = ev.target;
			if(target.tagName === 'A' || target.classList.contains('tombol-tutup')){
				_leftPanel.classList.remove('terbuka');
				if(navToggleLeft) navToggleLeft.setAttribute('aria-expanded', 'false');
				if(navToggleRight) navToggleRight.setAttribute('aria-expanded','false');
			}
		});
		document.addEventListener('click', (ev)=>{
			if(!_leftPanel.classList.contains('terbuka')) return;
			const clickedToggle = navToggleLeft && (ev.target === navToggleLeft || navToggleLeft.contains(ev.target));
			const clickedAltToggle = navToggleRight && (ev.target === navToggleRight || navToggleRight.contains(ev.target));
			if(clickedToggle || clickedAltToggle) return;
			const inside = _leftPanel.contains(ev.target);
			if(!inside){
				_leftPanel.classList.remove('terbuka');
				if(navToggleLeft) navToggleLeft.setAttribute('aria-expanded', 'false');
				if(navToggleRight) navToggleRight.setAttribute('aria-expanded', 'false');
			}
		});
	}

	document.querySelectorAll('.tombol-menu-turun').forEach((toggleButton) => {
		toggleButton.addEventListener('click', (event) => {
			event.stopPropagation();
			const dropdown = toggleButton.parentElement;
			const expanded = dropdown.classList.toggle('terbuka');
			toggleButton.setAttribute('aria-expanded', String(expanded));
		});
	});

	// Drawer ponsel (jadwal.html memakai sistem drawer berbeda)
	const mobileDrawer = document.getElementById('mobile-drawer');
	const mobileOverlay = document.getElementById('mobile-overlay');
	const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.tombol-menu');
	const closeDrawerBtn = document.getElementById('close-drawer');
	if(menuToggle && mobileDrawer){
		const openDrawer = ()=>{ mobileDrawer.classList.add('aktif'); if(mobileOverlay) mobileOverlay.classList.add('aktif'); if(navToggleRight) navToggleRight.setAttribute('aria-expanded','true'); };
		const closeDrawer = ()=>{ mobileDrawer.classList.remove('aktif'); if(mobileOverlay) mobileOverlay.classList.remove('aktif'); if(navToggleRight) navToggleRight.setAttribute('aria-expanded','false'); };
		menuToggle.addEventListener('click', ()=>{ if(mobileDrawer.classList.contains('aktif')) closeDrawer(); else openDrawer(); });
		if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
		if(mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);
		// tutup saat link di dalam drawer diklik
		mobileDrawer.addEventListener('click', (ev)=>{ if(ev.target.tagName === 'A' || ev.target.classList.contains('tautan-ponsel')) closeDrawer(); });
		// hamburger sisi kanan juga bisa membuka drawer ini jika ada
		if(navToggleRight){
			navToggleRight.addEventListener('click', ()=>{
				if(mobileDrawer.classList.contains('aktif')) closeDrawer(); else openDrawer();
			});
		}
	}

	// Efek parallax untuk blob latar sorotan
	const heroBg = document.querySelector('.sorotan-latar');
	if(heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
		window.addEventListener('scroll', ()=>{
			const sc = window.scrollY;
			// geser halus untuk kesan kedalaman
			heroBg.style.transform = `translateY(${sc * -0.05}px)`;
		}, {passive:true});
	}
	if('IntersectionObserver' in window){
		const observer = new IntersectionObserver((entries)=>{
			entries.forEach(entry=>{
				if(entry.isIntersecting){
					entry.target.classList.add('masuk-layar');
					observer.unobserve(entry.target);
				}
			});
		},{threshold:0.12});

		document.querySelectorAll('.muncul-halus').forEach(el=>observer.observe(el));
	}

	// Slider sorotan (fade) - beranda
	(function(){
		const slides = document.querySelectorAll('.sorotan-slide');
		const dots = document.querySelectorAll('.sorotan-titik button');
		const prevBtn = document.querySelector('.sorotan-panah-kiri');
		const nextBtn = document.querySelector('.sorotan-panah-kanan');
		const hero = document.querySelector('.sorotan');
		if(!slides.length) return;

		let current = 0;
		let timer = null;
		const INTERVAL = 5000;
		const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		function goTo(index){
			current = (index + slides.length) % slides.length;
			slides.forEach((slide, i) => slide.classList.toggle('aktif', i === current));
			dots.forEach((dot, i) => dot.classList.toggle('aktif', i === current));
		}
		function nextSlide(){ goTo(current + 1); }
		function prevSlide(){ goTo(current - 1); }
		function startAuto(){
			if(reducedMotion) return;
			stopAuto();
			timer = setInterval(nextSlide, INTERVAL);
		}
		function stopAuto(){ if(timer){ clearInterval(timer); timer = null; } }

		if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
		if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });
		dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

		if(hero){
			hero.addEventListener('mouseenter', stopAuto);
			hero.addEventListener('mouseleave', startAuto);
		}

		startAuto();
	})();
});

// Pengelolaan sederhana di sisi klien: tambah entri dan simpan ke localStorage
const storage = {
	pembina: 'ex_pembina',
	prestasi: 'ex_prestasi',
	jadwal: 'ex_jadwal'
};

function loadJSON(key){try{return JSON.parse(localStorage.getItem(key))||[]}catch(e){return []}}
function saveJSON(key,data){localStorage.setItem(key,JSON.stringify(data))}

function createPembinaNode(item){
	const div=document.createElement('div');div.className = 'kartu entri muncul-halus';
	div.innerHTML=`<h4>Nama: ${escapeHtml(item.name)}</h4><p>Ekskul: ${escapeHtml(item.ekskul)}</p><p>Jadwal Latihan: ${escapeHtml(item.jadwal||'—')}</p><p>${escapeHtml(item.bio||'')}</p><div class="aksi-entri"><button class="tombol tombol-garis aksi-kecil hapus-pb">Hapus</button></div>`;
	return div;
}

function createPrestasiNode(item){
	const art=document.createElement('article');art.className = 'prestasi entri muncul-halus';
	art.innerHTML=`<h4>${escapeHtml(item.title)} ${item.year?`(${escapeHtml(item.year)})`:''}</h4><p>${escapeHtml(item.desc||'')}</p><div class="aksi-entri"><button class="tombol tombol-garis aksi-kecil hapus-ps">Hapus</button></div>`;
	return art;
}

function createJadwalRow(item){
	const tr=document.createElement('tr');
	tr.innerHTML = `<td><span class="lencana-hari">${escapeHtml(item.hari)}</span></td><td class="nama-ekskul">${escapeHtml(item.ekskul)}</td><td class="teks-waktu">${escapeHtml(item.waktu)} <div style="float:right"><button class="tombol tombol-garis aksi-kecil hapus-jd">Hapus</button></div></td><td>${escapeHtml(item.lokasi||'')}</td>`;
	return tr;
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]})}

document.addEventListener('DOMContentLoaded',()=>{
	// Sembunyikan/tampilkan form lewat tombol
	const toggle = (btnId, formId, cancelId)=>{
		const btn=document.getElementById(btnId), form=document.getElementById(formId), cancel=document.getElementById(cancelId);
		if(!btn||!form) return; btn.addEventListener('click',()=>{form.style.display=form.style.display==='none'?'block':'none'});
		if(cancel) cancel.addEventListener('click',()=>{form.style.display='none'});
	};
	toggle('toggle-pembina-form','pembina-form','cancel-pb');
	toggle('toggle-prestasi-form','prestasi-form','cancel-ps');
	toggle('toggle-jadwal-form','jadwal-form','cancel-jd');

	// Muat dan tampilkan data
	const pbList=document.getElementById('pembina-list');
	const psList=document.getElementById('prestasi-list');
	const jdTable=document.getElementById('jadwal-list');

		// Isi data pembina bawaan jika belum ada
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

		// Daftar ekskul disimpan terpisah agar index.html bisa me-render dinamis
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
		const ekskulGrid = document.querySelector('.kisi-ekskul');
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
				const card = document.createElement('div'); card.className = 'kartu-ekskul muncul-halus';
				card.innerHTML = `<div class="isi-ekskul"><h3><a class="nama-ekskul" style="--ekskul-color:${colorMap[e.name] || '#0f766e'}" href="ekskul-detail.html?name=${encodeURIComponent(e.name)}">${escapeHtml(e.name)}</a></h3><p>${escapeHtml(e.desc||'')}</p><p class="pembina-ekskul">Pembina: <strong>${escapeHtml(e.coach || coachMap[e.name] || 'Pembina ekskul')}</strong></p><p class="tempat-ekskul">Tempat latihan: <strong>SMK Taruna Bangsa</strong></p><p style="margin-top:8px"><a href="ekskul-detail.html?name=${encodeURIComponent(e.name)}" class="kartu-tautan">Lihat Profil &rarr;</a></p></div>`;
				target.appendChild(card);
			});
			observeNew();
		}
		renderEkskul();

		const pss = loadJSON(storage.prestasi); if(psList) pss.forEach(i=>psList.appendChild(createPrestasiNode(i)));
		const jds = loadJSON(storage.jadwal); if(jdTable) jds.forEach(i=>jdTable.appendChild(createJadwalRow(i)));

		// Kaitkan panel admin (jika ada di halaman ini)
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

	// Penanganan submit form
	const pbForm=document.getElementById('pembina-form');
	if(pbForm){pbForm.addEventListener('submit',e=>{
		e.preventDefault();const item={name:pbForm['name'].value,ekskul:pbForm['ekskul'].value,jadwal:pbForm['jadwal'].value,bio:pbForm['bio'].value};
		pbs.push(item);saveJSON(storage.pembina,pbs);pbList.appendChild(createPembinaNode(item));pbForm.reset();pbForm.style.display='none';observeNew();});}

	const psForm=document.getElementById('prestasi-form');
	if(psForm){psForm.addEventListener('submit',e=>{e.preventDefault();const item={title:psForm['title'].value,year:psForm['year'].value,desc:psForm['desc'].value};pss.push(item);saveJSON(storage.prestasi,pss);psList.appendChild(createPrestasiNode(item));psForm.reset();psForm.style.display='none';observeNew();});}

	const jdForm=document.getElementById('jadwal-form');
	if(jdForm){jdForm.addEventListener('submit',e=>{e.preventDefault();const item={hari:jdForm['hari'].value,ekskul:jdForm['ekskul'].value,waktu:jdForm['waktu'].value};jds.push(item);saveJSON(storage.jadwal,jds);jdTable.appendChild(createJadwalRow(item));jdForm.reset();jdForm.style.display='none';});}

	// Penanganan hapus lewat event delegation
	document.body.addEventListener('click',e=>{
		if(e.target.classList.contains('hapus-pb')){
			const node=e.target.closest('.entri');const idx=Array.from(pbList.children).indexOf(node); if(idx>-1){pbs.splice(idx,1);saveJSON(storage.pembina,pbs);node.remove();}
		}
		if(e.target.classList.contains('hapus-ps')){
			const node=e.target.closest('.entri');const idx=Array.from(psList.children).indexOf(node); if(idx>-1){pss.splice(idx,1);saveJSON(storage.prestasi,pss);node.remove();}
		}
		if(e.target.classList.contains('hapus-jd')){
			const tr=e.target.closest('tr');
			// cari indeks di antara baris body
			const rows=Array.from(jdTable.querySelectorAll('tbody tr'));
			const rowIndex=rows.indexOf(tr);
			if(rowIndex>-1){jds.splice(rowIndex,1);saveJSON(storage.jadwal,jds);tr.remove();}
		}
	});

	// Awasi elemen fade-up yang baru ditambahkan
	function observeNew(){
		document.querySelectorAll('.muncul-halus:not(.masuk-layar)').forEach(el=>{
			if (revealObserver) revealObserver.observe(el);
			else el.classList.add('masuk-layar');
		});
	}
	observeNew();
});