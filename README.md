# Tap&Pay: Pagos Transfronterizos Sin Esfuerzo

## Proyecto Interledger Hackathon 2025

Tap&Pay es una aplicación móvil diseñada para revolucionar la forma en que los turistas realizan pagos en el extranjero, eliminando las barreras de las divisas, las altas comisiones y la dependencia del efectivo.

## El Problema: Pagos Turísticos Rotos

Los turistas internacionales enfrentan serios desafíos al viajar a países con monedas distintas a la suya:

Altos Costos y Comisiones: Se ven obligados a cambiar dinero y pagar comisiones bancarias elevadas, perdiendo valor en cada transacción.

Riesgo y Pérdida de Tiempo: Depender del efectivo incrementa el riesgo de robo y desperdicia tiempo buscando casas de cambio.

Fricción para el Comercio Local: Los vendedores pierden ventas porque carecen de infraestructura digital para aceptar pagos internacionales de forma fluida. Un ejemplo claro es en el transporte público, donde la falta de moneda local por parte del turista causa retrasos y pérdidas.

## La Solución: Tap&Pay

Tap&Pay es una aplicación móvil que permite realizar pagos instantáneos mediante tecnología NFC (contacto) o código QR, potenciada por el estándar OpenPayments.

¿Cómo funciona?

El Vendedor ingresa el precio del producto o servicio en su moneda local y activa el modo de pago.

El Turista paga simplemente acercando su teléfono (NFC) o escaneando el código QR.

Conversión Automática: El sistema convierte el monto en tiempo real y transfiere los fondos a través del protocolo ILP (Interledger Protocol).

Confirmación: Ambas partes reciben una notificación instantánea y un recibo digital.

## Valor Propuesto e Impacto

Categoría

Beneficio

Para el Turista

Elimina la necesidad de efectivo y el cambio de divisas. Garantiza pagos rápidos, seguros y transparentes.

Para el Comerciante

Aumenta las ventas al captar al mercado turístico, reduce la fricción en la caja y promueve la adopción digital.

Económico/Social

Fomenta la inclusión financiera, apoya la economía local y contribuye a un ecosistema de pagos global e interoperable.

Tap&Pay se posiciona como una plataforma de pagos transfronterizos instantánea y de bajo costo, con un modelo de negocio que combina una tarifa de transacción inferior al 1% con membresías premium para comerciantes de alto volumen.

## Descripción Técnica y Arquitectura

Tecnologías Clave

Componente

Tecnología

Uso Principal

Frontend (App)

React Native con Expo

Interfaz de usuario móvil (iOS/Android).

Backend (API)

Node.js con REST API

Lógica de negocio, autenticación y gestión de transacciones.

Pagos

OpenPayments API

Conversión de divisas, gestión de liquidación.

Conectividad

ILP Protocol

Enrutamiento internacional de los pagos.

Base de Datos

MongoDB

Almacenamiento de datos de usuario, transacciones y autenticación.

Arquitectura de la Solución

El flujo de pago está diseñado para ser seguro y eficiente:

App Móvil Tap&Pay
      ↓ (NFC/QR PUSH)
Backend/REST API (Node.js)
      ↓ (Transacción OpenPayments)
OpenPayments API
      ↓ (Enrutamiento y Liquidación)
ILP (Interledger Protocol) Network
      ↓
Instituciones Financieras (Origen y Destino)

## Requisitos e Instalación

Requisitos Previos

Asegúrate de tener instalado lo siguiente:

Node.js (v18 o superior)

npm (incluido con Node.js)

Git

Cuenta MongoDB Atlas: Para la base de datos.

Ngrok: Necesario para exponer la API local a Internet (requerido por Expo y la simulación de pagos).

1️. Configuración de MongoDB

Crea una cuenta en MongoDB Atlas y configura un cluster.

Obtén la cadena de conexión de tu cluster.

En la carpeta backend/, crea un archivo .env y añade tu cadena de conexión:

# En el archivo backend/.env
MONGO_URI="TU_CADENA_DE_CONEXION_MONGODB_AQUI"


2️. Clonar el Repositorio

git clone https://github.com/JoseFloreano/TransportInterledger
cd TransportInterledger


3️. Instalación de Dependencias

Ejecuta npm install tanto para el backend como para el frontend:

# Instalación del Backend (Node.js API)

```bash
cd backend
npm install
cd ..
```

# Instalación del Frontend (React Native con Expo)

```bash
cd frontend
npm install
cd ..
```

4️. Ejecución del Backend (API)

El backend de Node.js debe estar corriendo y ser accesible públicamente, ya que la aplicación móvil de Expo y los servicios de OpenPayments necesitan interactuar con él.

Iniciar el Servidor Local:

```bash
cd backend
node server.js
```

El servidor se iniciará en http://localhost:3000 (o el puerto configurado).

Exponer la API con Ngrok:
En una nueva terminal, inicia Ngrok para crear un túnel público a tu API local:

```bash
ngrok http 3000
```

Ngrok te proporcionará una URL pública (ej: https://xxxxxx.ngrok-free.app).

Actualizar el Frontend:
Debes actualizar la URL base de la API dentro del código del frontend (en frontend/App.js o donde se definan las peticiones) con la URL pública de Ngrok que acabas de obtener.

5️. Ejecución del Frontend (React Native con Expo)

Asegúrate de tener la aplicación Expo Go instalada en tu dispositivo móvil.

Ejecuta el comando para iniciar el proyecto Expo:

```bash
cd frontend
npx expo start
```

Escanea el código QR que aparece en la terminal o en la ventana del navegador con la aplicación Expo Go en tu móvil para cargar la aplicación Tap&Pay.

## Viabilidad y Plan de Adopción

- Mercado Potencial: Más de 1.4 mil millones de turistas internacionales anualmente.

- Adopción Tecnológica: El 95% de los smartphones modernos soportan NFC o QR.

- Rendimiento: Pagos completados en menos de 10 segundos con tarifas por debajo del 1%.

- El plan de sostenibilidad incluye programas piloto en aeropuertos y mercados clave, alianzas estratégicas con empresas Fintech y gobiernos locales, y una expansión inicial enfocada en Latinoamérica, financiada por los ingresos por transacción.

## Miembros del Equipo


- **Backend**: José Luis Floreano Hernández, Alejandro Román Salazar Bravo

- **Frontend**: Leonardo Martínez Contreras, Álvaro Alexander Velázquez Matus
