import React, { useRef, useState, useEffect } from 'react';
import { LatLngBounds } from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.scss';
import { IParcel, IParcelDetail } from 'actions/parcelsActions';
import { ParcelPopupView } from '../ParcelPopupView';
import { Container, Row } from 'react-bootstrap';
import MapNavBar from '../MapNavBar';
import MapFilterBar from '../MapFilterBar';
import { ILookupCode } from 'actions/lookupActions';

type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
  parcels: IParcel[];
  agencies: ILookupCode[];
  propertyClassifications: ILookupCode[];
  activeParcel?: IParcelDetail | null;
  onParcelClick?: (obj: IParcel) => void;
  onPopupClose?: (obj: IParcel) => void;
  onViewportChanged?: (bounds: LatLngBounds | null, agencyId: number | null, propertyClassificationId: number | null) => void;
};

const Map: React.FC<MapProps> = props => {
  // props
  const { parcels, activeParcel } = props;
  const mapRef = useRef<LeafletMap>(null);
  const [agencyId, setAgencyFilterId] = useState<number | null>(null);
  const [propertyClassificationId, setPropertyClassificationId] = useState<number | null>(null);
  useEffect(() => {
    handleViewportChanged(agencyId, propertyClassificationId);
  }, [agencyId, propertyClassificationId]);

  const getBounds = () => {
    if (!mapRef.current) {
      return null;
    }
    return mapRef.current?.leafletElement.getBounds();
  }
  const handleParcelClick = (parcel: IParcel) => {
    if (props.onParcelClick) {
      props.onParcelClick(parcel);
    }
  };
  const handlePopupClose = (parcel: IParcel) => {
    if (props.onPopupClose) {
      props.onPopupClose(parcel);
    }
  };
  const handleViewportChanged = (agencyId: number | null = null, propertyClassificationId: number | null = null) => {
    const e = getBounds();
    if (props.onViewportChanged) {
      props.onViewportChanged(e, agencyId, propertyClassificationId);
    }
  };
  const handleAgencyChanged = (agencyId: number | null) => {
    setAgencyFilterId(agencyId);
  }
  const handlePropertyClassificationChanged = (propertyClassificationId: number | null) => {
    setPropertyClassificationId(propertyClassificationId);
  }

  return (
    <Container fluid={true}>
      <Row>
        <MapNavBar />
        <MapFilterBar agencyLookupCodes={props.agencies} propertyClassifications={props.propertyClassifications} onSelectAgency={handleAgencyChanged} onSelectPropertyClassification={handlePropertyClassificationChanged} />
        <LeafletMap
          ref={mapRef}
          center={[props.lat, props.lng]}
          zoom={props.zoom}
          whenReady={() => handleViewportChanged()}
          onViewportChanged={() => handleViewportChanged()}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {parcels && parcels.map(parcel => {
            return (
              <Marker key={parcel.id} position={[parcel.latitude, parcel.longitude]} onClick={() => handleParcelClick(parcel)} />
            );
          })}

          {activeParcel && (
            <Popup position={[activeParcel.latitude, activeParcel.longitude]} offset={[0, -25]} onClose={() => handlePopupClose(activeParcel)}>
              <ParcelPopupView parcelDetail={activeParcel} />
            </Popup>
          )}
        </LeafletMap>
      </Row>
    </Container>
  );
};

export default Map;
