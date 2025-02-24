import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface Address {
  id: number;
  peopleId: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface Location {
  lat: number;
  lng: number;
}

const Contenedor = styled.div`
  padding-top: 80px; 
  width: 100vw; 
  min-height: 100vh; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  background-color: rgb(19, 18, 18);
`;

const Contenido = styled.div`
  width: 90%; 
  max-width: 1200px; 
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 25.535243102338683,
  lng: -103.32011697187971,
};

const SeleccionarDireccion = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchAddresses = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:8084/api/auth/getDeliveryAddresses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data: Address[] = await response.json();
        setAddresses(data);
      } else {
        console.error("Error en la respuesta del servidor:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSelectAddress = (address: Address) => {
    console.log('Dirección seleccionada:', address);
    navigate('/confirmar-pedido', { state: { selectedAddress: address } });
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        throw new Error('No se pudo obtener la dirección');
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      throw error;
    }
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      alert('Por favor, selecciona una ubicación en el mapa.');
      return;
    }

    try {
      const address = await getAddressFromCoordinates(selectedLocation.lat, selectedLocation.lng);

      const token = getToken();
      const response = await fetch('http://127.0.0.1:8084/api/auth/saveDeliveryAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
        }),
      });

      if (response.ok) {
        alert('Ubicación guardada correctamente');
        fetchAddresses();
        setShowMapModal(false);
      } else {
        console.error("Error en la respuesta del servidor:", await response.text());
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <Contenedor>
      <Contenido>
        <h2>Selecciona una dirección de entrega</h2>
        <Button variant="primary" onClick={() => setShowMapModal(true)}>
          Seleccionar en el Mapa
        </Button>
        <ListGroup>
          {addresses.map(address => (
            <ListGroup.Item key={address.id}>
              <Card>
                <Card.Body>
                  <Card.Text>{address.address}</Card.Text>
                  <Button variant="primary" onClick={() => handleSelectAddress(address)}>
                    Seleccionar
                  </Button>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Selecciona tu ubicación en el mapa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                onClick={handleMapClick}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            ) : (
              <p>Cargando mapa...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMapModal(false)}>Cerrar</Button>
            <Button variant="primary" onClick={handleSaveLocation}>Guardar Ubicación</Button>
          </Modal.Footer>
        </Modal>
      </Contenido>
    </Contenedor>
  );
};

export default SeleccionarDireccion;