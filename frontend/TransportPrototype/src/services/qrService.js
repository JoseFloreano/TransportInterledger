import QRCode from 'react-native-qrcode-svg';

export const qrService = {

  // Generar QR
  generateProductData(product) {
    const qrData = {
      id: product._id || product.id,
      name: product.nombre || product.name,
      price: product.precio || product.price,
      stock: product.stock || 0
    };
    return JSON.stringify(qrData);
  },

  // Generar qr con el Carrito
   generateCartQR(cartData) {
    return JSON.stringify({
      type: 'cart',
      items: cartData.items,
      total: cartData.total,
      timestamp: cartData.timestamp
    });
  },

  // Leer QR
  parseQRData(qrData) {
    try {
      const data = JSON.parse(qrData);
      
      // Validar que tenga los campos necesarios
      if (!data.id || !data.name || !data.price) {
        console.error('QR data missing required fields');
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        price: parseFloat(data.price),
        stock: parseInt(data.stock) || 0
      };
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  },

  // Valida si un QR tiene el formato correcto
  isValidQR(qrData) {
    const parsed = this.parseQRData(qrData);
    return parsed !== null;
  }
};

// Componente QR que puedes usar directamente

export const QRCodeComponent = ({ 
  value, 
  size = 200, 
  backgroundColor = 'white', 
  color = 'black' 
}) => {
  return (
    <QRCode
      value={value}
      size={size}
      backgroundColor={backgroundColor}
      color={color}
    />
  );
};