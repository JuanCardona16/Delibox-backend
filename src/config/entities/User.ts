export interface Base {
  uuid: string;
  createdAt: string;
  updatedAt: string;
}

// Customer.ts
export interface Customer extends Base  {
  username: string; // Nombre del cliente
  email: string; // Correo electrónico del cliente
  password: string; // Contraseña del cliente
  phone: string; // Teléfono del cliente
  rol: string
  address: [
    {
      addressLine1: string; // Dirección principal de la dirección
    }
  ];
} 

export type CustomerDto = Omit<Customer, 'uuid' | "rol | createdAt" | "updatedAt">
export type CustomerDtoUpdate = Partial<CustomerDto>

// Admin.ts
export interface Admin extends Base {
  username: string; // Nombre del cliente
  email: string; // Correo electrónico del cliente
  password: string; // Contraseña del cliente
  restaurantId?: string; // ID del restaurante al que pertenece el administrador
  rol: string
  address: [
    {
      addressLine1: string; // Dirección principal de la dirección
    }
  ];
  phone: string; // Teléfono del administrador
}

export type AdminDto = Omit<Admin, 'uuid' | "rol | createdAt" | "updatedAt">
export type AdminDtoUpdate = Partial<AdminDto>

// Order.ts
export interface Order {
  uuid: string; // identicador del pedido
  userId: string; // ID del usuario que hizo el pedido
  products: {
    productId: string; // ID del producto en el pedido
    quantity: number; // Cantidad del producto
    ingredients: string[]; // Ingredientes seleccionados para el producto
  }[];
  estimatedPreparationTime: string; // Tiempo estimado de preparación del pedido
  shippingCost: string; // Costo de envío del pedido
  totalPrice: number; // Precio total del pedido
  orderDate: string; // Fecha en que se realizó el pedido
  status: string; // Estado actual del pedido (ej., "pendiente", "en preparación")
  deliveryAddress: string; // Dirección de entrega del pedido
  discount?: string; // Descuento aplicado al pedido, si corresponde
}

// Category
export interface Category {
  uuid: string; // ID único de la categoria
  name: string; // nombre de la categoria
}; 

// Product.ts
export interface Product {
  uuid: string; // ID único del producto
  name: string; // Nombre del producto
  description: string; // Descripción del producto
  price: number; // Precio del producto
  category: Category; // Categoría del producto
  size?: string; // Tamaño del producto, si aplica
  isAvailable: boolean; // Indica si el producto está disponible
  options?: {
    name: string; // Nombre de la opción adicional
    additionalCost: number; // Costo adicional de la opción
  }[];
}

// Restaurant.ts
export interface Restaurant {
  uuid: string; // ID único del restaurante
  adminId: Admin; // Administrador del restaurante
  name: string; // Nombre del restaurante
  address: string; // Dirección del restaurante
  phone: string; // Teléfono del restaurante
  email: string; // Correo electrónico del restaurante
  menu: Product[]; // Menú de productos disponibles en el restaurante
  operatingHours: string; // Horario de funcionamiento del restaurante
}

// Payment.ts
export interface Payment {
  uuid: string; // ID único del pago
  orderId: string; // ID del pedido asociado al pago
  customerId: string; // ID del cliente que realizó el pago
  amount: number; // Monto total del pago
  paymentMethod: string; // Método de pago (ej., "tarjeta de crédito", "efectivo")
  status: "pending" | "completed" | "failed"; // Estado del pago (pendiente, completado, fallido)
  paymentDate: string; // Fecha de realización del pago
}

// Delivery.ts
export interface Delivery {
  uuid: string; // ID único de la entrega
  orderId: string; // ID del pedido asociado a la entrega
  driverId: string; // ID del repartidor asignado a la entrega
  estimatedDeliveryTime: string; // Tiempo estimado para la entrega
  actualDeliveryTime?: string; // Tiempo real de entrega (opcional)
  status: "pending" | "on_route" | "delivered" | "canceled"; // Estado de la entrega (pendiente, en ruta, entregado, cancelado)
}

// Driver.ts
export interface Driver {
  uuid: string; // ID único del repartidor
  restaurantId: string; // ID del restaurante al que pertenece el repartidor
  name: string; // Nombre del repartidor
  phone: string; // Teléfono del repartidor
  licensePlate: string; // Matrícula del vehículo del repartidor
  status: "available" | "on_delivery"; // Estado del repartidor (disponible, en entrega)
}
