/**
 * WeinPerPedes Map Application
 * Interactive wine hiking map for Bockenheim/Kindenheim
 */
;(() => {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    map: {
      center: [49.60502176933786, 8.173763751983644],
      defaultZoom: 14,
      locationZoom: 16,
      tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      labelsUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, Maxar, GeoEye, i-cubed, USDA FSA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      fitBoundsPadding: [50, 50]
    },
    path: {
      color: '#FF6600',
      weight: 6,
      opacity: 0.92,
      dashArray: null,
      lineJoin: 'round',
      lineCap: 'round'
    },
    geolocation: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  };

  // ============================================
  // State
  // ============================================
  const state = {
    map: null,
    markers: [],
    pathLayer: null,
    userMarker: null,
    accuracyCircle: null,
    watchId: null,
    isTracking: false,
    currentStation: null,
    isPanelExpanded: false
  };

  // ============================================
  // DOM Elements
  // ============================================
  const dom = {
    map: null,
    panel: null,
    panelTitle: null,
    panelContent: null,
    toggleBtn: null,
    closeBtn: null,
    locateBtn: null,
    aboutBtn: null,
    aboutModal: null,
    modalClose: null
  };

  // ============================================
  // Map Module
  // ============================================
  function initMap() {
    state.map = L.map('map').setView(CONFIG.map.center, CONFIG.map.defaultZoom);

    L.tileLayer(CONFIG.map.tileUrl, {
      attribution: CONFIG.map.attribution,
      maxZoom: 19
    }).addTo(state.map);

    // Labels overlay (Straßen, Ortsbezeichnungen)
    L.tileLayer(CONFIG.map.labelsUrl, {
      maxZoom: 19,
      opacity: 0.9
    }).addTo(state.map);

    addWalkingPath();
    addStationMarkers();
    addParkingMarkers();
    setupMapEvents();
  }

  function addWalkingPath() {
    if (!walkingPath?.length) return;

    const coords = walkingPath.map(p => [p.lat, p.lng]);
    state.pathLayer = L.polyline(coords, CONFIG.path).addTo(state.map);

    // Include parking spots in bounds so they're always visible
    const allPoints = [
      ...coords,
      ...(parkingSpots || []).map(p => [p.lat, p.lng])
    ];
    state.map.fitBounds(L.latLngBounds(allPoints), {
      padding: CONFIG.map.fitBoundsPadding
    });
  }

  function createStationIcon(stationId) {
    return L.divIcon({
      className: 'station-marker-icon',
      html: `<div class="station-marker">
        <div class="station-marker-pin"><i class="fas fa-wine-glass-alt"></i></div>
        <div class="station-marker-number">${stationId}</div>
      </div>`,
      iconSize: [32, 48],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });
  }

  function addStationMarkers() {
    if (!stations?.length) return;

    stations.forEach(station => {
      const icon = createStationIcon(station.id);
      const marker = L.marker([station.lat, station.lng], { icon })
        .addTo(state.map)
        .bindTooltip(station.name, { direction: 'top', offset: [0, -45] });

      marker.on('click', () => showStation(station));
      state.markers.push(marker);
    });
  }

  function createParkingIcon(id) {
    return L.divIcon({
      className: 'parking-marker-icon',
      html: `<div class="parking-marker"><span>P</span><div class="parking-label">${id}</div></div>`,
      iconSize: [36, 48],
      iconAnchor: [18, 44],
      popupAnchor: [0, -44]
    });
  }

  function addParkingMarkers() {
    if (!parkingSpots?.length) return;
    parkingSpots.forEach(spot => {
      const icon = createParkingIcon(spot.id);
      L.marker([spot.lat, spot.lng], { icon })
        .addTo(state.map)
        .bindTooltip(`<strong>${spot.name}</strong><br><span style="font-size:0.82rem">${spot.description}</span>`, {
          direction: 'top', offset: [0, -48], permanent: false, maxWidth: 220
        });
    });
  }

  function setupMapEvents() {
    window.addEventListener('resize', () => state.map?.invalidateSize());
  }

  // ============================================
  // Station Panel Module
  // ============================================
  function initPanel() {
    dom.panel = document.getElementById('station-panel');
    dom.panelTitle = document.getElementById('station-title');
    dom.panelContent = document.getElementById('station-content');
    dom.toggleBtn = document.getElementById('panel-toggle');
    dom.closeBtn = document.getElementById('panel-close');

    dom.toggleBtn?.addEventListener('click', togglePanel);
    dom.closeBtn?.addEventListener('click', hidePanel);

    setupPanelSwipe();
  }

  function setupPanelSwipe() {
    if (!dom.panel) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const panelHeader = dom.panel.querySelector('.panel-header');
    if (!panelHeader) return;

    panelHeader.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    panelHeader.addEventListener('touchmove', e => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
    }, { passive: true });

    panelHeader.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      const diff = currentY - startY;
      if (Math.abs(diff) > 50) {
        diff > 0 ? hidePanel() : expandPanel();
      }
    }, { passive: true });
  }

  function showStation(station) {
    state.currentStation = station;
    dom.panelTitle.textContent = station.name;
    dom.panelContent.innerHTML = '';

    // Description
    const desc = document.createElement('p');
    desc.className = 'station-description';
    desc.textContent = station.description;
    dom.panelContent.appendChild(desc);

    // Offerings
    if (station.offerings?.length) {
      const header = document.createElement('h3');
      header.className = 'offerings-header';
      header.textContent = 'Angebote';
      dom.panelContent.appendChild(header);

      const list = document.createElement('div');
      list.className = 'offerings-list';

      station.offerings.forEach(offering => {
        list.appendChild(createOfferingCard(offering));
      });

      dom.panelContent.appendChild(list);
    }

    showPanel();
  }

  function createOfferingCard(offering) {
    const card = document.createElement('div');
    card.className = 'offering-card';

    card.innerHTML = `
      <div class="offering-header">
        <h4 class="offering-name">${escapeHtml(offering.name)}</h4>
        <span class="offering-price">${escapeHtml(offering.price)}</span>
      </div>
      <p class="offering-description">${escapeHtml(offering.description)}</p>
    `;

    return card;
  }

  function showPanel() {
    dom.panel?.classList.add('visible');
    dom.panel?.classList.remove('collapsed');
    state.isPanelExpanded = true;
    updateToggleIcon();
  }

  function hidePanel() {
    dom.panel?.classList.remove('visible', 'collapsed');
    state.isPanelExpanded = false;
    state.currentStation = null;
  }

  function expandPanel() {
    dom.panel?.classList.remove('collapsed');
    state.isPanelExpanded = true;
    updateToggleIcon();
  }

  function collapsePanel() {
    dom.panel?.classList.add('collapsed');
    state.isPanelExpanded = false;
    updateToggleIcon();
  }

  function togglePanel() {
    state.isPanelExpanded ? collapsePanel() : expandPanel();
  }

  function updateToggleIcon() {
    const icon = dom.toggleBtn?.querySelector('i');
    if (icon) {
      icon.className = state.isPanelExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }
  }

  // ============================================
  // About Modal Module
  // ============================================
  function initAboutModal() {
    dom.aboutBtn = document.getElementById('about-btn');
    dom.aboutModal = document.getElementById('about-modal');
    dom.modalClose = document.getElementById('modal-close');

    dom.aboutBtn?.addEventListener('click', openAboutModal);
    dom.modalClose?.addEventListener('click', closeAboutModal);

    // Close on overlay click
    dom.aboutModal?.addEventListener('click', e => {
      if (e.target === dom.aboutModal) closeAboutModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && dom.aboutModal?.classList.contains('visible')) {
        closeAboutModal();
      }
    });
  }

  function openAboutModal() {
    dom.aboutModal?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeAboutModal() {
    dom.aboutModal?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ============================================
  // Location Module
  // ============================================
  function initLocation() {
    dom.locateBtn = document.getElementById('locate-btn');
    dom.locateBtn?.addEventListener('click', toggleTracking);
  }

  function toggleTracking() {
    state.isTracking ? stopTracking() : startTracking();
  }

  function startTracking() {
    if (!navigator.geolocation) {
      showToast('Ihr Browser unterstützt keine Standortverfolgung.');
      return;
    }

    state.isTracking = true;
    dom.locateBtn?.classList.add('active');

    navigator.geolocation.getCurrentPosition(
      pos => {
        updateLocation(pos.coords);
        centerOnUser(pos.coords);

        state.watchId = navigator.geolocation.watchPosition(
          p => updateLocation(p.coords),
          err => handleLocationError(err),
          CONFIG.geolocation
        );
      },
      err => handleLocationError(err),
      CONFIG.geolocation
    );
  }

  function stopTracking() {
    state.isTracking = false;
    dom.locateBtn?.classList.remove('active');

    if (state.watchId !== null) {
      navigator.geolocation.clearWatch(state.watchId);
      state.watchId = null;
    }

    if (state.userMarker) {
      state.map.removeLayer(state.userMarker);
      state.userMarker = null;
    }

    if (state.accuracyCircle) {
      state.map.removeLayer(state.accuracyCircle);
      state.accuracyCircle = null;
    }
  }

  function updateLocation(coords) {
    const { latitude: lat, longitude: lng, accuracy } = coords;

    if (!state.userMarker) {
      state.userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'user-marker',
          html: '<div class="user-marker-pulse"></div><div class="user-marker-dot"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(state.map);
    } else {
      state.userMarker.setLatLng([lat, lng]);
    }

    if (!state.accuracyCircle) {
      state.accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: 'rgba(102, 181, 254, 0.6)',
        fillColor: 'rgba(102, 181, 254, 0.15)',
        fillOpacity: 1,
        weight: 2
      }).addTo(state.map);
    } else {
      state.accuracyCircle.setLatLng([lat, lng]);
      state.accuracyCircle.setRadius(accuracy);
    }
  }

  function centerOnUser(coords) {
    state.map?.setView([coords.latitude, coords.longitude], CONFIG.map.locationZoom);
  }

  function handleLocationError(error) {
    stopTracking();

    const messages = {
      1: 'Standortzugriff wurde verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen.',
      2: 'Standort konnte nicht ermittelt werden.',
      3: 'Zeitüberschreitung bei der Standortermittlung.'
    };

    showToast(messages[error.code] || 'Standortfehler aufgetreten.');
  }

  // ============================================
  // Dev Mode (?dev=1)
  // ============================================
  function initDevMode() {
    const isDev = new URLSearchParams(window.location.search).get('dev') === '1';
    if (!isDev) return;

    let mode = 'route'; // 'route' | 'station' | 'parking'
    const routePoints = [];
    const routeMarkers = [];
    const newStations = [];
    const newParking = [];
    const addedMarkers = [];

    // ---- Badge ----
    const badge = document.createElement('div');
    badge.textContent = '⚙️ DEV';
    badge.style.cssText = `position:fixed;top:10px;left:50%;transform:translateX(-50%);
      background:#FF6600;color:#fff;font-size:11px;font-weight:700;
      padding:4px 10px;border-radius:12px;z-index:9999;pointer-events:none;letter-spacing:1px;`;
    document.body.appendChild(badge);

    // ---- Mode bar (top) ----
    const modeBar = document.createElement('div');
    modeBar.style.cssText = `position:fixed;top:44px;left:50%;transform:translateX(-50%);
      display:flex;gap:6px;z-index:9999;`;
    modeBar.innerHTML = `
      <button data-mode="route"   style="padding:5px 12px;border-radius:8px;border:2px solid #FF6600;background:#FF6600;color:#fff;font-size:12px;font-weight:700;cursor:pointer">🗺 Route</button>
      <button data-mode="station" style="padding:5px 12px;border-radius:8px;border:2px solid #555;background:rgba(0,0,0,0.7);color:#aaa;font-size:12px;cursor:pointer">🍷 Stand</button>
      <button data-mode="parking" style="padding:5px 12px;border-radius:8px;border:2px solid #555;background:rgba(0,0,0,0.7);color:#aaa;font-size:12px;cursor:pointer">🅿 Parkplatz</button>`;
    document.body.appendChild(modeBar);

    function setMode(m) {
      mode = m;
      modeBar.querySelectorAll('button').forEach(b => {
        const active = b.dataset.mode === m;
        b.style.background = active ? '#FF6600' : 'rgba(0,0,0,0.7)';
        b.style.color = active ? '#fff' : '#aaa';
        b.style.borderColor = active ? '#FF6600' : '#555';
      });
      document.getElementById('dev-hint').textContent =
        m === 'route'   ? 'Klick = Routenpunkt hinzufügen' :
        m === 'station' ? 'Klick = Neuer Weinstand (Name eingeben)' :
                          'Klick = Neuer Parkplatz (Name eingeben)';
    }
    modeBar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

    // ---- Bottom bar ----
    const bar = document.createElement('div');
    bar.style.cssText = `position:fixed;bottom:0;left:0;right:0;
      background:rgba(0,0,0,0.9);color:#FF6600;font-family:monospace;font-size:12px;
      padding:8px 12px;z-index:9999;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
      border-top:2px solid #FF6600;`;
    bar.innerHTML = `
      <span id="dev-hint" style="color:#aaa;flex:1;min-width:180px">Klick = Routenpunkt hinzufügen</span>
      <span id="dev-counts" style="color:#FF6600"></span>
      <button id="dev-undo" style="background:#555;border:none;color:#fff;padding:3px 8px;border-radius:5px;cursor:pointer;font-size:11px">↩ Undo</button>
      <button id="dev-reset" style="background:#900;border:none;color:#fff;padding:3px 8px;border-radius:5px;cursor:pointer;font-size:11px">🗑 Alles reset</button>
      <button id="dev-export" style="background:#FF6600;border:none;color:#fff;padding:3px 10px;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700">💾 stations.js exportieren</button>`;
    document.body.appendChild(bar);

    // ---- Name dialog ----
    const dialog = document.createElement('div');
    dialog.id = 'dev-dialog';
    dialog.style.cssText = `display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:#1a1a1a;border:2px solid #FF6600;border-radius:12px;padding:20px 24px;
      z-index:10000;min-width:280px;color:#fff;font-family:sans-serif;`;
    dialog.innerHTML = `
      <p id="dev-dialog-title" style="margin:0 0 12px;font-size:14px;font-weight:700;color:#FF6600"></p>
      <input id="dev-dialog-name" type="text" placeholder="Name..."
        style="width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid #555;
        background:#333;color:#fff;font-size:14px;margin-bottom:8px;">
      <input id="dev-dialog-desc" type="text" placeholder="Beschreibung (optional)"
        style="width:100%;box-sizing:border-box;padding:8px;border-radius:6px;border:1px solid #555;
        background:#333;color:#fff;font-size:14px;margin-bottom:14px;">
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button id="dev-dialog-cancel" style="padding:6px 14px;border-radius:6px;border:1px solid #555;background:#333;color:#aaa;cursor:pointer">Abbrechen</button>
        <button id="dev-dialog-ok"     style="padding:6px 14px;border-radius:6px;border:none;background:#FF6600;color:#fff;font-weight:700;cursor:pointer">Hinzufügen</button>
      </div>`;
    document.body.appendChild(dialog);

    let pendingCoord = null;
    function openDialog(lat, lng, type) {
      pendingCoord = { lat, lng };
      document.getElementById('dev-dialog-title').textContent =
        type === 'station' ? `🍷 Neuer Weinstand` : `🅿 Neuer Parkplatz`;
      document.getElementById('dev-dialog-name').value = '';
      document.getElementById('dev-dialog-desc').value = '';
      dialog.style.display = 'block';
      setTimeout(() => document.getElementById('dev-dialog-name').focus(), 50);
    }
    document.getElementById('dev-dialog-cancel').addEventListener('click', () => {
      dialog.style.display = 'none'; pendingCoord = null;
    });
    document.getElementById('dev-dialog-ok').addEventListener('click', confirmAdd);
    document.getElementById('dev-dialog-name').addEventListener('keydown', e => { if (e.key === 'Enter') confirmAdd(); });

    function confirmAdd() {
      const name = document.getElementById('dev-dialog-name').value.trim();
      const desc = document.getElementById('dev-dialog-desc').value.trim();
      if (!name || !pendingCoord) return;
      dialog.style.display = 'none';

      if (mode === 'station') {
        const id = (stations?.length || 0) + newStations.length + 1;
        newStations.push({ id, name, lat: pendingCoord.lat, lng: pendingCoord.lng, description: desc });
        const icon = createStationIcon(id);
        const m = L.marker([pendingCoord.lat, pendingCoord.lng], { icon }).addTo(state.map)
          .bindTooltip(`⭐ NEU: ${name}`, { direction: 'top', offset: [0, -45] });
        addedMarkers.push(m);
        showToast(`🍷 Stand "${name}" hinzugefügt (ID ${id})`);
      } else {
        const id = `P${(parkingSpots?.length || 0) + newParking.length + 1}`;
        newParking.push({ id, name, lat: pendingCoord.lat, lng: pendingCoord.lng, description: desc });
        const icon = createParkingIcon(id);
        const m = L.marker([pendingCoord.lat, pendingCoord.lng], { icon }).addTo(state.map)
          .bindTooltip(`⭐ NEU: ${name}`, { direction: 'top', offset: [0, -48] });
        addedMarkers.push(m);
        showToast(`🅿 Parkplatz "${name}" hinzugefügt (${id})`);
      }
      pendingCoord = null;
      updateCounts();
    }

    function updateCounts() {
      document.getElementById('dev-counts').textContent =
        `Route: ${routePoints.length}  |  Stände: ${newStations.length}  |  P: ${newParking.length}`;
    }

    // ---- Map click ----
    state.map.on('click', e => {
      if (dialog.style.display === 'block') return;
      const lat = parseFloat(e.latlng.lat.toFixed(7));
      const lng = parseFloat(e.latlng.lng.toFixed(7));

      if (mode === 'route') {
        routePoints.push({ lat, lng });
        const m = L.circleMarker([lat, lng], {
          radius: 6, color: '#FF6600', fillColor: '#FF6600', fillOpacity: 0.9, weight: 2
        }).addTo(state.map);
        const lbl = L.tooltip({ permanent: true, direction: 'top', offset: [0, -8] })
          .setContent(`${routePoints.length}`).setLatLng([lat, lng]);
        state.map.addLayer(lbl);
        routeMarkers.push({ m, lbl });
        document.getElementById('dev-hint').textContent = `[${routePoints.length}] lat: ${lat}, lng: ${lng}`;
      } else {
        openDialog(lat, lng, mode);
      }
      updateCounts();
    });

    // ---- Undo ----
    document.getElementById('dev-undo').addEventListener('click', () => {
      if (mode === 'route' && routePoints.length) {
        routePoints.pop();
        const last = routeMarkers.pop();
        if (last) { state.map.removeLayer(last.m); state.map.removeLayer(last.lbl); }
      } else if (mode === 'station' && newStations.length) {
        newStations.pop();
        const last = addedMarkers.pop();
        if (last) state.map.removeLayer(last);
      } else if (mode === 'parking' && newParking.length) {
        newParking.pop();
        const last = addedMarkers.pop();
        if (last) state.map.removeLayer(last);
      }
      updateCounts();
    });

    // ---- Reset ----
    document.getElementById('dev-reset').addEventListener('click', () => {
      routePoints.length = 0; newStations.length = 0; newParking.length = 0;
      routeMarkers.forEach(r => { state.map.removeLayer(r.m); state.map.removeLayer(r.lbl); });
      routeMarkers.length = 0;
      addedMarkers.forEach(m => state.map.removeLayer(m));
      addedMarkers.length = 0;
      document.getElementById('dev-hint').textContent = 'Klick = Routenpunkt hinzufügen';
      updateCounts();
    });

    // ---- Export stations.js ----
    document.getElementById('dev-export').addEventListener('click', () => {
      const allStations = [...(stations || []), ...newStations];
      const allParking  = [...(parkingSpots || []), ...newParking];
      const allRoute    = routePoints.length ? routePoints : (walkingPath || []);

      let out = `// stations.js — exportiert via Dev-Modus ${new Date().toISOString().slice(0,10)}\n\n`;
      out += `const stations = ${JSON.stringify(allStations, null, 2)};\n\n`;
      out += `const parkingSpots = ${JSON.stringify(allParking, null, 2)};\n\n`;
      out += `const walkingPath = ${JSON.stringify(allRoute, null, 2)};\n`;

      const blob = new Blob([out], { type: 'text/javascript' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'stations.js';
      a.click();
      showToast(`✅ stations.js exportiert (${allStations.length} Stände, ${allParking.length} Parkplätze, ${allRoute.length} Routenpunkte)`);
    });

    updateCounts();
  }

  // ============================================
  // Dev Mode 2 (?dev=2) — Drag & Edit existing markers
  // ============================================
  function initDevMode2() {
    const isDev2 = new URLSearchParams(window.location.search).get('dev') === '2';
    if (!isDev2) return;

    // Badge
    const badge = document.createElement('div');
    badge.textContent = '⚙️ DEV 2 — Ziehen zum Verschieben';
    badge.style.cssText = `position:fixed;top:10px;left:50%;transform:translateX(-50%);
      background:#9b00ff;color:#fff;font-size:11px;font-weight:700;
      padding:4px 12px;border-radius:12px;z-index:9999;pointer-events:none;white-space:nowrap;`;
    document.body.appendChild(badge);

    // Bottom bar
    const bar = document.createElement('div');
    bar.style.cssText = `position:fixed;bottom:0;left:0;right:0;
      background:rgba(0,0,0,0.9);color:#cc88ff;font-family:monospace;font-size:12px;
      padding:8px 12px;z-index:9999;display:flex;align-items:center;gap:10px;
      border-top:2px solid #9b00ff;`;
    bar.innerHTML = `
      <span id="d2-hint" style="color:#aaa;flex:1">Marker ziehen → neue Position wird gespeichert</span>
      <span id="d2-changes" style="color:#cc88ff">0 Änderungen</span>
      <button id="d2-reset" style="background:#900;border:none;color:#fff;padding:3px 8px;border-radius:5px;cursor:pointer;font-size:11px">↩ Reset</button>
      <button id="d2-export" style="background:#9b00ff;border:none;color:#fff;padding:3px 10px;border-radius:5px;cursor:pointer;font-size:12px;font-weight:700">💾 stations.js exportieren</button>`;
    document.body.appendChild(bar);

    const changedStations = {};
    const changedParking  = {};
    const originalPositions = {};

    function countChanges() {
      return Object.keys(changedStations).length + Object.keys(changedParking).length;
    }
    function updateBar(hint) {
      if (hint) document.getElementById('d2-hint').textContent = hint;
      const n = countChanges();
      document.getElementById('d2-changes').textContent = `${n} Änderung${n !== 1 ? 'en' : ''}`;
    }

    // Make station markers draggable
    setTimeout(() => {
      // Re-add station markers as draggable
      state.markers.forEach(m => state.map.removeLayer(m));
      state.markers.length = 0;

      (stations || []).forEach(station => {
        originalPositions[`s${station.id}`] = { lat: station.lat, lng: station.lng };
        const icon = createStationIcon(station.id);
        const marker = L.marker([station.lat, station.lng], { icon, draggable: true })
          .addTo(state.map)
          .bindTooltip(`${station.id}. ${station.name}`, { direction: 'top', offset: [0, -45] });

        marker.on('dragend', () => {
          const { lat, lng } = marker.getLatLng();
          changedStations[station.id] = {
            ...station,
            lat: parseFloat(lat.toFixed(7)),
            lng: parseFloat(lng.toFixed(7))
          };
          updateBar(`✅ Stand ${station.id} (${station.name}) verschoben`);
        });

        state.markers.push(marker);
      });

      // Re-add parking markers as draggable
      (parkingSpots || []).forEach(spot => {
        originalPositions[`p${spot.id}`] = { lat: spot.lat, lng: spot.lng };
        const icon = createParkingIcon(spot.id);
        const marker = L.marker([spot.lat, spot.lng], { icon, draggable: true })
          .addTo(state.map)
          .bindTooltip(`<strong>${spot.name}</strong>`, { direction: 'top', offset: [0, -48] });

        marker.on('dragend', () => {
          const { lat, lng } = marker.getLatLng();
          changedParking[spot.id] = {
            ...spot,
            lat: parseFloat(lat.toFixed(7)),
            lng: parseFloat(lng.toFixed(7))
          };
          updateBar(`✅ ${spot.id} (${spot.name}) verschoben`);
        });
      });

      updateBar();
    }, 500);

    // Reset
    document.getElementById('d2-reset').addEventListener('click', () => {
      Object.keys(changedStations).forEach(k => delete changedStations[k]);
      Object.keys(changedParking).forEach(k => delete changedParking[k]);
      // Reload page to reset marker positions
      window.location.reload();
    });

    // Export
    document.getElementById('d2-export').addEventListener('click', () => {
      const allStations = (stations || []).map(s =>
        changedStations[s.id] ? changedStations[s.id] : s
      );
      const allParking = (parkingSpots || []).map(p =>
        changedParking[p.id] ? changedParking[p.id] : p
      );

      let out = `// stations.js — exportiert via Dev-Modus 2 ${new Date().toISOString().slice(0,10)}\n\n`;
      out += `const stations = ${JSON.stringify(allStations, null, 2)};\n\n`;
      out += `const parkingSpots = ${JSON.stringify(allParking, null, 2)};\n\n`;
      out += `const walkingPath = ${JSON.stringify(walkingPath || [], null, 2)};\n`;

      const blob = new Blob([out], { type: 'text/javascript' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'stations.js';
      a.click();
      showToast(`✅ stations.js exportiert (${countChanges()} Änderungen)`);
    });
  }

  // ============================================
  // Utilities
  // ============================================
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(message) {
    const existing = document.querySelector('.toast');
    existing?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ============================================
  // Dev Mode (hidden: ?dev=1)
  // ============================================
  function initDevMode() {
    if (new URLSearchParams(window.location.search).get('dev') !== '1') return;

    // Dev panel
    const panel = document.createElement('div');
    panel.id = 'dev-panel';
    panel.innerHTML = `
      <style>
        #dev-panel{position:fixed;top:60px;right:10px;z-index:10000;background:rgba(0,0,0,0.88);color:#0f0;font-family:monospace;font-size:12px;padding:10px 14px;border-radius:8px;max-width:340px;max-height:70vh;overflow-y:auto;pointer-events:auto;backdrop-filter:blur(6px)}
        #dev-panel h3{margin:0 0 6px;color:#ff0;font-size:13px}
        #dev-panel .dev-log{margin:4px 0;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.1)}
        #dev-panel .dev-log .label{color:#aaa}
        #dev-panel .dev-log .coord{color:#0f0;cursor:pointer;user-select:all}
        #dev-panel button{background:#333;color:#0f0;border:1px solid #0f0;padding:4px 10px;border-radius:4px;cursor:pointer;margin:4px 4px 0 0;font-family:monospace;font-size:11px}
        #dev-panel button:hover{background:#0f0;color:#000}
        #dev-panel .dev-click-coord{color:#ff0;margin-top:6px}
        .dev-crosshair .leaflet-container{cursor:crosshair!important}
      </style>
      <h3>🔧 DEV MODE</h3>
      <div>Drag markers to reposition. Click map for coords.</div>
      <div id="dev-click-coord" class="dev-click-coord"></div>
      <div id="dev-log"></div>
      <div style="margin-top:8px">
        <button id="dev-copy-stations">📋 Copy stations.js</button>
        <button id="dev-copy-path">📋 Copy path</button>
      </div>
    `;
    document.body.appendChild(panel);
    document.body.classList.add('dev-crosshair');

    const logEl = document.getElementById('dev-log');
    const clickCoordEl = document.getElementById('dev-click-coord');

    // Re-create station markers as draggable
    state.markers.forEach(m => state.map.removeLayer(m));
    state.markers = [];
    stations.forEach(station => {
      const icon = createStationIcon(station.id);
      const marker = L.marker([station.lat, station.lng], { icon, draggable: true })
        .addTo(state.map)
        .bindTooltip(station.name, { direction: 'top', offset: [0, -45] });
      marker.on('click', () => showStation(station));
      marker.on('dragend', () => {
        const ll = marker.getLatLng();
        station.lat = ll.lat;
        station.lng = ll.lng;
        updateDevLog();
      });
      state.markers.push(marker);
    });

    // Re-create parking markers as draggable
    state.map.eachLayer(layer => {
      if (layer instanceof L.Marker && !state.markers.includes(layer) && layer !== state.userMarker) {
        // Check if it's a parking marker by icon class
        try { if (layer.options.icon?.options?.className === 'parking-marker-icon') state.map.removeLayer(layer); } catch(e) {}
      }
    });
    parkingSpots.forEach(spot => {
      const icon = createParkingIcon(spot.id);
      const m = L.marker([spot.lat, spot.lng], { icon, draggable: true })
        .addTo(state.map)
        .bindTooltip(`<strong>${spot.name}</strong>`, { direction: 'top', offset: [0, -48] });
      m.on('dragend', () => {
        const ll = m.getLatLng();
        spot.lat = ll.lat;
        spot.lng = ll.lng;
        updateDevLog();
      });
    });

    // Path editing: draggable vertices, click vertex to remove, click path to insert
    const vertexMarkers = [];

    function rebuildVertices() {
      vertexMarkers.forEach(vm => state.map.removeLayer(vm));
      vertexMarkers.length = 0;

      walkingPath.forEach((pt, idx) => {
        const vm = L.circleMarker([pt.lat, pt.lng], {
          radius: 6, color: '#FF6600', fillColor: '#fff', fillOpacity: 1, weight: 2
        }).addTo(state.map);

        // Drag vertex
        vm.on('mousedown', function(e) {
          L.DomEvent.stopPropagation(e);
          state.map.dragging.disable();
          const onMove = (ev) => {
            vm.setLatLng(ev.latlng);
            walkingPath[idx].lat = ev.latlng.lat;
            walkingPath[idx].lng = ev.latlng.lng;
            state.pathLayer.setLatLngs(walkingPath.map(p => [p.lat, p.lng]));
          };
          const onUp = () => {
            state.map.off('mousemove', onMove);
            state.map.off('mouseup', onUp);
            state.map.dragging.enable();
            updateDevLog();
          };
          state.map.on('mousemove', onMove);
          state.map.on('mouseup', onUp);
        });

        // Right-click vertex to remove
        vm.on('contextmenu', function(e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          if (walkingPath.length <= 2) { showToast('Need at least 2 path points'); return; }
          walkingPath.splice(idx, 1);
          state.pathLayer.setLatLngs(walkingPath.map(p => [p.lat, p.lng]));
          rebuildVertices();
          updateDevLog();
          showToast(`Removed vertex ${idx}`);
        });

        vertexMarkers.push(vm);
      });
    }
    rebuildVertices();

    // Click on path polyline → insert new vertex between nearest segment
    state.pathLayer.on('click', function(e) {
      L.DomEvent.stopPropagation(e);
      const clickLat = e.latlng.lat;
      const clickLng = e.latlng.lng;

      // Find nearest segment
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < walkingPath.length - 1; i++) {
        const a = walkingPath[i], b = walkingPath[i + 1];
        const dist = pointToSegmentDist(clickLat, clickLng, a.lat, a.lng, b.lat, b.lng);
        if (dist < bestDist) { bestDist = dist; bestIdx = i + 1; }
      }

      walkingPath.splice(bestIdx, 0, { lat: clickLat, lng: clickLng });
      state.pathLayer.setLatLngs(walkingPath.map(p => [p.lat, p.lng]));
      rebuildVertices();
      updateDevLog();
      showToast(`Inserted vertex at index ${bestIdx}`);
    });

    function pointToSegmentDist(px, py, ax, ay, bx, by) {
      const dx = bx - ax, dy = by - ay;
      const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
      const nx = ax + t * dx, ny = ay + t * dy;
      return Math.sqrt((px - nx) ** 2 + (py - ny) ** 2);
    }

    // Click map → show coords
    state.map.on('click', e => {
      const { lat, lng } = e.latlng;
      const text = `${lat.toFixed(14)}, ${lng.toFixed(14)}`;
      clickCoordEl.textContent = `📍 ${text}`;
      navigator.clipboard?.writeText(text);
    });

    function updateDevLog() {
      let html = '<h3 style="margin-top:8px">Stations</h3>';
      stations.forEach(s => {
        html += `<div class="dev-log"><span class="label">${s.id}. ${s.name}</span><br><span class="coord">${s.lat.toFixed(14)}, ${s.lng.toFixed(14)}</span></div>`;
      });
      html += '<h3 style="margin-top:8px">Parking</h3>';
      parkingSpots.forEach(p => {
        html += `<div class="dev-log"><span class="label">${p.id}</span><br><span class="coord">${p.lat.toFixed(14)}, ${p.lng.toFixed(14)}</span></div>`;
      });
      logEl.innerHTML = html;
    }
    updateDevLog();

    // Copy buttons
    document.getElementById('dev-copy-stations').addEventListener('click', () => {
      const out = generateStationsJS();
      navigator.clipboard?.writeText(out).then(() => showToast('stations.js copied!'));
    });

    document.getElementById('dev-copy-path').addEventListener('click', () => {
      const out = 'const walkingPath = [\n' +
        walkingPath.map(p => `  { lat: ${p.lat}, lng: ${p.lng} }`).join(',\n') +
        '\n];';
      navigator.clipboard?.writeText(out).then(() => showToast('Walking path copied!'));
    });

    function generateStationsJS() {
      let out = 'const stations = ' + JSON.stringify(stations, null, 2) + ';\n\n';
      out += 'const parkingSpots = ' + JSON.stringify(parkingSpots, null, 2) + ';\n\n';
      out += 'const walkingPath = [\n' +
        walkingPath.map(p => `  { lat: ${p.lat}, lng: ${p.lng} }`).join(',\n') +
        '\n];';
      return out;
    }
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    dom.map = document.getElementById('map');
    if (!dom.map) return;

    initMap();
    initPanel();
    initLocation();
    initAboutModal();
    initDevMode();
    initDevMode2();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
