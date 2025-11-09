
# Tap&Pay: Seamless Cross-Border Payments

## Interledger Hackathon 2025 Project

Tap&Pay is a mobile application designed to revolutionize the way tourists make payments abroad, eliminating currency barriers, high fees, and reliance on cash.

## The Problem: Broken Tourist Payments

International tourists face serious challenges when traveling to countries with different currencies:

**High Costs and Fees:** They are forced to exchange money and pay high bank fees, losing value in every transaction.

**Risk and Time Loss:** Relying on cash increases the risk of theft and wastes time searching for exchange offices.

**Friction for Local Businesses:** Vendors lose sales because they lack digital infrastructure to accept international payments smoothly. A clear example is public transport, where tourists’ lack of local currency causes delays and losses.

## The Solution: Tap&Pay

Tap&Pay is a mobile app that enables instant payments using NFC (contact) or QR codes, powered by the OpenPayments standard.

**How it works:**

- The Vendor enters the price of the product or service in their local currency and activates payment mode.
- The Tourist pays by simply tapping their phone (NFC) or scanning the QR code.
- **Automatic Conversion:** The system converts the amount in real time and transfers the funds via the ILP (Interledger Protocol).
- **Confirmation:** Both parties receive instant notifications and a digital receipt.

## Value Proposition and Impact

| Category | Benefit |
|----------|---------|
| For the Tourist | Eliminates the need for cash and currency exchange. Ensures fast, secure, and transparent payments. |
| For the Merchant | Increases sales by capturing the tourist market, reduces checkout friction, and promotes digital adoption. |
| Economic / Social | Promotes financial inclusion, supports the local economy, and contributes to a global and interoperable payment ecosystem. |

Tap&Pay positions itself as an instant, low-cost cross-border payment platform, with a business model combining a transaction fee under 1% and premium memberships for high-volume merchants.

## Technical Description and Architecture

### Key Technologies

| Component | Technology | Main Use |
|-----------|------------|----------|
| Frontend (App) | React Native with Expo | Mobile user interface (iOS/Android) |
| Backend (API) | Node.js with REST API | Business logic, authentication, and transaction management |
| Payments | OpenPayments API | Currency conversion and settlement management |
| Connectivity | ILP Protocol | International payment routing |
| Database | MongoDB | Storage of user data, transactions, and authentication |

---

## 🏗 Solution Architecture

The payment flow is designed to be secure and efficient:

📱 Tap&Pay Mobile App  
⬇️ (NFC / QR PUSH)  
🖥️ Backend / REST API (Node.js)  
⬇️ (OpenPayments Transaction)  
💳 OpenPayments API  
⬇️ (Routing and Settlement)  
🌐 ILP (Interledger Protocol) Network  
⬇️  
🏦 Financial Institutions (Origin & Destination)

**Quick Flow Explanation:**

1. The user initiates a payment from the mobile app via **NFC or QR**.  
2. The request reaches the **backend**, which validates the transaction and communicates with the payment API.  
3. **OpenPayments API** handles currency conversion and fund settlement.  
4. The **ILP protocol** routes the payment internationally.  
5. Finally, **banks or financial institutions** receive the transaction in their local currency.

## Requirements and Installation

**Prerequisites**

Make sure you have the following installed:

- Node.js (v18 or higher)  
- npm (included with Node.js)  
- Git  
- MongoDB Atlas Account: For the database  
- Ngrok: Needed to expose the local API to the Internet (required by Expo and payment simulation)

### 1️. MongoDB Setup

- Create a MongoDB Atlas account and set up a cluster.  
- Obtain your cluster connection string.  
- In the `backend/` folder, create a `.env` file and add your connection string:

```env
# In backend/.env
MONGO_URI="YOUR_MONGODB_CONNECTION_STRING_HERE"
```

2️. Clone the Repository
```bash
git clone https://github.com/JoseFloreano/TransportInterledger
cd TransportInterledger
```

3️. Install Dependencies

Install npm dependencies for both backend and frontend.

Backend (Node.js API)
```bash
cd backend
npm install
cd ..
```


Frontend (React Native with Expo)
```bash
cd frontend
npm install
cd ..
```
4️. Run the Backend (API)

The Node.js backend must be running and publicly accessible, as the Expo mobile app and OpenPayments services need to interact with it.

Start Local Server
```bash
cd backend
node server.js
```

The server will start at http://localhost:3000 (or the configured port).

Expose API with Ngrok

Open a new terminal and run:
```bash
ngrok http 3000
```

Ngrok will provide a public URL (e.g., https://xxxxxx.ngrok-free.app).
Update the frontend API base URL (frontend/App.js or wherever requests are defined) with this public URL.

5️. Run the Frontend (React Native with Expo)

Ensure the Expo Go app is installed on your mobile device.
```bash
cd frontend
npx expo start
```

Team MembersRoleMember(s)
BackendJosé Luis Floreano Hernández, Alejandro Román Salazar Bravo
FrontendLeonardo Martínez Contreras, Álvaro Alexander Velázquez Matus




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

## Tecnologías Clave

| Componente | Tecnología | Uso Principal |
|------------|------------|---------------|
| Frontend (App) | React Native con Expo | Interfaz de usuario móvil (iOS/Android) |
| Backend (API) | Node.js con REST API | Lógica de negocio, autenticación y gestión de transacciones |
| Pagos | OpenPayments API | Conversión de divisas y gestión de liquidación |
| Conectividad | ILP Protocol | Enrutamiento internacional de los pagos |
| Base de Datos | MongoDB | Almacenamiento de datos de usuario, transacciones y autenticación |

---

## 🏗 Arquitectura de la Solución

El flujo de pago está diseñado para ser seguro y eficiente:

El flujo de pago está diseñado para ser seguro y eficiente:

📱 App Móvil Tap&Pay
⬇️ (NFC / QR PUSH)
🖥️ Backend / REST API (Node.js)
⬇️ (Transacción OpenPayments)
💳 OpenPayments API
⬇️ (Enrutamiento y Liquidación)
🌐 ILP (Interledger Protocol) Network
⬇️
🏦 Instituciones Financieras (Origen y Destino)

**Explicación rápida del flujo:**

1. El usuario inicia un pago desde la app móvil mediante **NFC o QR**.  
2. La solicitud llega al **backend**, que valida la transacción y comunica con la API de pagos.  
3. **OpenPayments API** gestiona la conversión de divisas y la liquidación de fondos.  
4. El **protocolo ILP** enruta el pago internacionalmente.  
5. Finalmente, los **bancos o instituciones financieras** reciben la transacción en su moneda local.

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
```bash

git clone https://github.com/JoseFloreano/TransportInterledger
cd TransportInterledger
```


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













