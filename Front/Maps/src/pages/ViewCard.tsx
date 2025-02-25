import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ViewCardProps {
    cartItems: any[];
    total: number;
}

const ViewCard = (props: ViewCardProps) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [conektaCargado, setConektaCargado] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [userData, setUserData] = useState<any>({}); // Corrección aquí

    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.conekta.io/js/latest/conekta.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log('Conekta script loaded');
            setConektaCargado(true);

            if (window.Conekta) {
                window.Conekta.setPublicKey('key_Pxl2AViTVn0qywVBHwbcb0M');
                console.log('Conekta public key set');
            } else {
                console.error('Conekta object not found');
                setMensajeError('Conekta no se cargó correctamente.');
            }
        };

        script.onerror = () => {
            setMensajeError('Error loading Conekta script');
            console.error('Error loading Conekta script');
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8084/api/auth/getCart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log('Datos del carro:', response.data);
                    setUserData(response.data);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    } else {
                        console.error(error);
                    }
                });
        } else {
            navigate('/login');
        }
    }, []);

    const generarToken = (cardData: any) => {
        return new Promise((resolve, reject) => {
            if (!(window as any).Conekta) {
                console.error('❌ Conekta no está disponible en window.');
                reject(new Error("Conekta no está disponible."));
                return;
            }

            console.log('Conekta is available');
            window.Conekta.Token.create({ card: cardData }, (tokenResponse: any) => {
                console.log(' Respuesta de Conekta:', tokenResponse);
                if (tokenResponse.object === 'error') {
                    reject(new Error(tokenResponse.message_to_purchaser));
                } else {
                    resolve(tokenResponse.id);
                }
            });
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
            setMensajeError('Por favor, completa todos los campos.');
            return;
        }

        try {
            const token_id = await generarToken({
                number: cardNumber,
                name: cardName,
                exp_year: `20${cardExpiry.slice(2, 4)}`,
                exp_month: cardExpiry.slice(0, 2),
                cvc: cardCvc,
            });

            // Simulación de datos del usuario (reemplaza con tus datos reales)
            const userData = {
                name: 'Nombre del usuario',
                email: 'usuario@ejemplo.com',
                phone: '1234567890',
            };

            const orderData = {
                token_id,
                totalPrice: props.total,
                cartItems: props.cartItems,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
            };

            console.log('Datos del pedido a enviar:', orderData); // Log para depuración

            const response = await axios.post('http://localhost:8084/api/orders/confirmOrder', orderData);

            if (response.status === 201) {
                setMensajeExito('Pago realizado con éxito.');
                setMensajeError('');
            } else {
                setMensajeError(`Error al procesar el pago: ${response.data.message || 'Error desconocido'}`); // Mensaje de error más detallado
            }
        } catch (error: any) {
            setMensajeError(`Error al procesar el pago: ${error.response?.data?.message || error.message}`); // Mensaje de error más detallado
            console.error('Error al procesar el pago:', error);
        }
    };

    return (
        <div>
            <h2>Confirmar Pedido</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Número de tarjeta:</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} title="Número de tarjeta" placeholder="Número de tarjeta" />
                </div>
                <div>
                    <label>Nombre en la tarjeta:</label>
                    <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} title="Nombre en la tarjeta" placeholder="Nombre en la tarjeta" />
                </div>
                <div>
                    <label>Fecha de expiración (MM/AA):</label>
                    <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} title="Fecha de expiración" placeholder="MM/AA" />
                </div>
                <div>
                    <label>CVC:</label>
                    <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} title="CVC" placeholder="CVC" />
                </div>
                <button type="submit">Pagar</button>
                {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
                {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
            </form>
        </div>
    );
};

export default ViewCard;