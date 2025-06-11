import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button as FluentButton,
} from '@fluentui/react-components';
import { Location24Regular, Checkmark24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCompanyMapViewerStyles } from '../../styles/companyMapViewer.styles';
import { PinnedAddress, CompanyMapViewerProps } from '../../types/company';
import { configureLeafletMarkers, createCompanyIcon, createPinnedIcon } from '../../utils/leafletUtils';
import { getString } from '../../utils/translationHelper';

const CompanyMapViewer: React.FC<CompanyMapViewerProps> = ({
  isOpen,
  onClose,
  company,
  country = 'Norway',
  onAddressSelected,
  context
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinnedMarkerRef = useRef<L.Marker | null>(null);
  const [addressNotFound, setAddressNotFound] = useState(false);
  const [pinnedAddress, setPinnedAddress] = useState<PinnedAddress | null>(null);
  const [showMapInstructions, setShowMapInstructions] = useState(true);
  const styles = useCompanyMapViewerStyles();

  useEffect(() => {
    if (!isOpen || !company?.forretningsadresse || !mapRef.current) return;

    setAddressNotFound(false);
    setPinnedAddress(null);
    setShowMapInstructions(true);

    configureLeafletMarkers();

    const address = company.forretningsadresse;
    const fullAddress = [
      ...(address.adresse || []),
      address.postnummer,
      address.poststed,
      country
    ].filter(Boolean).join(', ');

    const companyIcon = createCompanyIcon();
    const pinnedIcon = createPinnedIcon();
    // Fallback coordinates for Norway, basically if an address is not found. It will show Norway on the map.
    const initializeMap = (lat = 60.472, lon = 8.4689, zoom = 6) => {
      // Initialize map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      if (!mapRef.current) return;

      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lon], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        try {
          // Geocode clicked location
          const reverseResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const reverseData = await reverseResponse.json();

          if (reverseData && reverseData.display_name) {
            if (pinnedMarkerRef.current && mapInstanceRef.current) {
              mapInstanceRef.current.removeLayer(pinnedMarkerRef.current);
            }

            if (mapInstanceRef.current) {
              pinnedMarkerRef.current = L.marker([lat, lng], { icon: pinnedIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup(`<b>📍 ${getString(context, 'map.pinnedlocation')}</b><br>${reverseData.display_name}`)
                .openPopup();
            }

            const addressComponents = reverseData.address || {};
            const streetNumber = addressComponents.house_number || '';
            const streetName = addressComponents.road || '';
            const suburb = addressComponents.suburb || addressComponents.neighbourhood || addressComponents.hamlet || '';
            const city = addressComponents.city || addressComponents.town || addressComponents.municipality || addressComponents.village || '';
            const postcode = addressComponents.postcode || '';

            let addressString = '';
            if (streetName) {
              addressString = streetName;
              if (streetNumber) {
                addressString += ` ${streetNumber}`;
              }
            } else if (suburb) {
              addressString = suburb;
            } else if (city) {
              addressString = city;
            } else {
              const displayParts = reverseData.display_name.split(', ');
              const meaningfulParts = displayParts.filter((part: string) => part && part.trim()).slice(0, 3);
              addressString = meaningfulParts.join(', ');
            }

            if (!addressString || addressString.trim() === '') {
              addressString = reverseData.display_name.split(', ').slice(0, 2).join(', ') || getString(context, 'map.pinnedlocation');
            }

            setPinnedAddress({
              lat,
              lng,
              displayName: reverseData.display_name,
              address: addressString.trim(),
              postnummer: postcode || '',
              poststed: city || ''
            });
          }
        } catch (error) {
          setAddressNotFound(true);
        }
      });
    };

    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          initializeMap(lat, lon, 15);

          if (mapInstanceRef.current) {
            L.marker([lat, lon], { icon: companyIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup(`<b>${company.navn}</b><br>${fullAddress}`)
              .openPopup();
          }
        } else {
          setAddressNotFound(true);
          initializeMap();
        }
      } catch (error) {
        setAddressNotFound(true);
        initializeMap();
      }
    };

    geocodeAddress();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (pinnedMarkerRef.current) {
        pinnedMarkerRef.current = null;
      }
    };
  }, [isOpen, company, country]);

  const handleUsePinnedAddress = () => {
    if (pinnedAddress && onAddressSelected) {
      onAddressSelected({
        adress: pinnedAddress.address,
        postnummer: pinnedAddress.postnummer,
        poststed: pinnedAddress.poststed,
        lat: pinnedAddress.lat,
        lng: pinnedAddress.lng
      });
      onClose();
    }
  };

  const handleClosePinnedAddress = () => {
    setPinnedAddress(null);
    if (pinnedMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(pinnedMarkerRef.current);
      pinnedMarkerRef.current = null;
    }
  };

  const handleCloseAddressNotFound = () => {
    setAddressNotFound(false);
  };

  const handleCloseMapInstructions = () => {
    setShowMapInstructions(false);
  };

  if (!company?.forretningsadresse) {
    return null;
  }

  const address = company.forretningsadresse;
  const displayAddress = [
    ...(address.adresse || []),
    address.postnummer,
    address.poststed
  ].filter(Boolean).join(', ');

  return (
    <Dialog open={isOpen} onOpenChange={(_event, data: { open: boolean }) => !data.open && onClose()}>
      <DialogSurface aria-labelledby="map-dialog-title" style={{ width: '700px', maxWidth: '90vw' }}>
        <DialogBody>
          <DialogTitle id="map-dialog-title">
            {getString(context, 'map.title')} - {company.navn}
          </DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: '16px' }}>
              <strong>{getString(context, 'map.companyAddress')}</strong> {displayAddress}
            </div>

            {pinnedAddress && (
              <div className={styles.pinnedAddressCard}>
                <button
                  className={styles.pinnedAddressCloseButton}
                  onClick={handleClosePinnedAddress}
                  aria-label={getString(context, 'map.pinnedAddress.closeAriaLabel')}
                >
                  <Dismiss24Regular />
                </button>
                <div className={styles.pinnedAddressHeader}>
                  <Location24Regular />
                  <span>{getString(context, 'map.pinnedAddress.header')}</span>
                </div>
                <div className={styles.pinnedAddressText}>
                  <div><strong>{getString(context, 'map.pinnedAddress.address')}</strong> {pinnedAddress.address}</div>
                  <div><strong>{getString(context, 'map.pinnedAddress.postalCode')}</strong> {pinnedAddress.postnummer}</div>
                  <div><strong>{getString(context, 'map.pinnedAddress.city')}</strong> {pinnedAddress.poststed}</div>
                </div>
              </div>
            )}

            <div className={styles.mapContainer}>
              <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: '8px' }} />
              {showMapInstructions && (
                <div className={styles.mapInstructions}>
                  <span>💡 {getString(context, 'map.instructions.text')}</span>
                  <button
                    className={styles.mapInstructionsCloseButton}
                    onClick={handleCloseMapInstructions}
                    aria-label={getString(context, 'map.instructions.closeAriaLabel')}
                  >
                    <Dismiss24Regular />
                  </button>
                </div>
              )}
              {addressNotFound && (
                <div className={styles.addressNotFoundOverlay}>
                  <span>⚠️ {getString(context, 'map.addressNotFound.text')}</span>
                  <button
                    className={styles.addressNotFoundCloseButton}
                    onClick={handleCloseAddressNotFound}
                    aria-label={getString(context, 'map.addressNotFound.closeAriaLabel')}
                  >
                    <Dismiss24Regular />
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions style={{ gap: '8px', flexWrap: 'wrap' }}>
            {pinnedAddress && (
              <FluentButton
                appearance="primary"
                icon={<Checkmark24Regular />}
                onClick={handleUsePinnedAddress}
              >
                {getString(context, 'map.pinnedAddress.usePinnedButton')}
              </FluentButton>
            )}
            <FluentButton appearance="secondary" onClick={onClose}>
              {getString(context, 'map.closeButton')}
            </FluentButton>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default CompanyMapViewer;