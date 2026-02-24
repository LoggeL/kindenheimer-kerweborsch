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
      color: '#722F37',
      weight: 4,
      opacity: 0.65,
      dashArray: '8, 12',
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

    state.map.fitBounds(state.pathLayer.getBounds(), {
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
  // Initialize
  // ============================================
  function init() {
    dom.map = document.getElementById('map');
    if (!dom.map) return;

    initMap();
    initPanel();
    initLocation();
    initAboutModal();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
