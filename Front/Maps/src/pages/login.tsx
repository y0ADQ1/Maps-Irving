import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ContenedorLogin = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(19, 18, 18);
`;

const LoginBox = styled.div`
  background-color: #333;
  padding: 40px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`;

const Titulo = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: white;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const BotonLogin = styled.button`
  background-color: #555;
  color: white;
  border: none;
  padding: 10px 20px;
  width: 100%;
  cursor: pointer;
  margin-top: 15px;
  &:hover {
    background-color: #777;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 14px;
`;

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (email === '' || password === '') {
      setError('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8082/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        setError(null);
        navigate('/'); 
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al conectar con el servidor');
    }
  };
  
  return (
    <ContenedorLogin>
      <LoginBox>
        <Titulo>Iniciar Sesión</Titulo>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleLogin}>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu email"
            />
          </FormGroup>
          <FormGroup>
            <Label>Contraseña:</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
            />
          </FormGroup>
          <BotonLogin type="submit">Iniciar</BotonLogin>
        </form>
      </LoginBox>
    </ContenedorLogin>
  );
};

export default Login;
