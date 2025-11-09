import QRCode from 'react-native-qrcode-svg';

export const qrService = {
  // Generar QR para pago (seller side)
  generatePaymentQR(amount, receivingWalletUrl) {
    const paymentData = {
      type: 'payment',
      amount: amount.toString(),
      receivingWalletUrl: receivingWalletUrl,
      timestamp: Date.now()
    };
    return JSON.stringify(paymentData);
  },

  // Generar QR con datos de producto
  generateProductData(product) {
    const qrData = {
      type: 'product',
      id: product._id || product.id,
      name: product.nombre || product.name,
      price: product.precio || product.price,
      stock: product.stock || 0
    };
    return JSON.stringify(qrData);
  },

  // Generar QR con el carrito (legacy - mantener por compatibilidad)
  generateCartQR(cartData) {
    return JSON.stringify({
      type: 'cart',
      items: cartData.items,
      total: cartData.total,
      timestamp: cartData.timestamp
    });
  },

  // Parsear datos de QR de pago
  parsePaymentQR(qrData) {
    try {
      const data = JSON.parse(qrData);
      
      if (data.type !== 'payment') {
        console.error('QR is not a payment QR');
        return null;
      }

      if (!data.amount || !data.receivingWalletUrl) {
        console.error('Payment QR missing required fields');
        return null;
      }

      return {
        amount: parseFloat(data.amount),
        receivingWalletUrl: data.receivingWalletUrl,
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('Error parsing payment QR:', error);
      return null;
    }
  },

  // Parsear datos de QR de producto (legacy)
  parseQRData(qrData) {
    try {
      const data = JSON.parse(qrData);
      
      if (data.type === 'payment') {
        return this.parsePaymentQR(qrData);
      }

      // Validar que tenga los campos necesarios
      if (!data.id || !data.name || !data.price) {
        console.error('QR data missing required fields');
        return null;
      }

      return {
        type: 'product',
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

  // Validar si un QR tiene el formato correcto
  isValidQR(qrData) {
    const parsed = this.parseQRData(qrData);
    return parsed !== null;
  },

  // Validar si es un QR de pago
  isPaymentQR(qrData) {
    try {
      const data = JSON.parse(qrData);
      return data.type === 'payment';
    } catch {
      return false;
    }
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