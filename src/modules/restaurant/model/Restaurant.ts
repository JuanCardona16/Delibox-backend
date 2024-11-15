import { Admin, Product } from "@/config/entities";

// Restaurant.ts
export interface Restaurant {
  uuid: string; // ID único del restaurante
  adminId: Admin; // Administrador del restaurante
  name: string; // Nombre del restaurante
  address: string; // Dirección del restaurante
  phone: string; // Teléfono del restaurante
  email: string; // Correo electrónico del restaurante
  menuId: string; // Menú de productos disponibles en el restaurante
  operatingHours: string; // Horario de funcionamiento del restaurante
}