import { Request, Response } from 'express';
import axios from 'axios';

const API_KEY = 'AIzaSyDAtj6oTfmn4y2v96lBX6dWheAi8ujKcPQ'; 

const FIXED_ORIGIN = '25.535243102338683, -103.32011697187971';

export const getDirections = async (req: Request, res: Response) => { 
    const { destination } = req.query; 

    if (!destination) {
        return res.status(400).json({ error: 'Se requiere el parámetro destination (punto A)' });
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

export const simulateDelivery = async (req: Request, res: Response) => { 
    const { destination } = req.query; 

    if (!destination) {
        return res.status(400).json({ error: 'Se requiere el parámetro destination (punto A)' });
    }

    try {
        // aqui se obtiene la ruta entre los dos puntos
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${FIXED_ORIGIN}&destination=${destination}&key=${API_KEY}`;
        const directionsResponse = await axios.get(directionsUrl);

        if (directionsResponse.data.status !== 'OK') {
            return res.status(400).json({ error: directionsResponse.data.error_message || 'Error al obtener direcciones' });
        }

        const route = directionsResponse.data.routes[0];
        const steps = route.legs[0].steps;

        // simula el movimiento del repartidor xd
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

export default {
    getDirections,
    simulateDelivery,
};