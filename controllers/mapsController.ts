import { Request, Response } from 'express';
import axios from 'axios';
import DeliveryAddress from '../db/models/DeliveryAddress';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const FIXED_ORIGIN = '25.535243102338683, -103.32011697187971'; 

export const getDirections = async (req: Request, res: Response): Promise<void> => {
  const { destination } = req.query;

  if (!destination) {
    res.status(400).json({ error: 'Se requiere el parámetro destination (punto A)' });
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${FIXED_ORIGIN}&destination=${destination}&key=${API_KEY}`;
    const response = await axios.get(url);

    if (response.data.status === 'OK') {
      res.json(response.data);
    } else {
      res.status(400).json({ error: response.data.error_message || 'Error al obtener direcciones' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la API de Google Maps' });
  }
};

export const simulateDelivery = async (req: Request, res: Response): Promise<void> => {
  const { destination } = req.query;

  if (!destination) {
    res.status(400).json({ error: 'Se requiere el parámetro destination (punto A)' });
    return;
  }

  try {
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${FIXED_ORIGIN}&destination=${destination}&key=${API_KEY}`;
    const directionsResponse = await axios.get(directionsUrl);

    if (directionsResponse.data.status !== 'OK') {
      res.status(400).json({ error: directionsResponse.data.error_message || 'Error al obtener direcciones' });
      return;
    }

    const route = directionsResponse.data.routes[0];
    const steps = route.legs[0].steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        console.log(`Repartidor en camino: ${step.html_instructions}`);
        currentStep++;
      } else {
        clearInterval(interval);
        console.log('Repartidor ha llegado al destino');
      }
    }, 5000);

    res.json({ message: 'Simulación de entrega iniciada', route });
  } catch (error) {
    res.status(500).json({ error: 'Error al simular la entrega' });
  }
};


export const saveDeliveryAddress = async (req: RequestWithUser, res: Response): Promise<void> => {
  const { address, latitude, longitude } = req.body;
  const peopleId = req.peopleId;

  if (!peopleId) {
    res.status(401).json({ error: "No autenticado: peopleId no encontrado en el token" });
    return;
  }

  if (!address || !latitude || !longitude) {
    res.status(400).json({ error: "Se requieren address, latitude y longitude" });
    return;
  }

  try {
    const newAddress = await DeliveryAddress.create({
      peopleId,
      address,
      latitude,
      longitude,
    });

    res.status(201).json({ message: 'Dirección guardada correctamente', newAddress });
  } catch (error) {
    console.error("Error al guardar la dirección:", error);
    res.status(500).json({ error: "Error al guardar la dirección" });
  }
};


type RequestWithUser = Request & { peopleId?: number };

export const getDeliveryAddresses = async (req: RequestWithUser, res: Response): Promise<void> => {
  const peopleId = req.peopleId;

  if (!peopleId) {
    res.status(401).json({ error: "No autenticado: peopleId no encontrado en el token" });
    return;
  }

  try {
    const addresses = await DeliveryAddress.findAll({ where: { peopleId } });

    if (!addresses.length) {
      res.status(404).json({ error: "No se encontraron direcciones para este usuario" });
      return;
    }

    res.json(addresses);
  } catch (error) {
    console.error("Error al obtener las direcciones:", error);
    res.status(500).json({ error: "Error al obtener las direcciones" });
  }
};
  
