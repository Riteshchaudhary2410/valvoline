export const VEHICLE_DATA = {
  Bike: {
    brands: ['Hero', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'Royal Enfield', 'KTM'],
    models: {
      Hero: ['Hero Splendor', 'Hero Passion', 'Hero XPulse'],
      Honda: ['Honda CB Shine', 'Honda CB 150R', 'Honda CB 500'],
      Bajaj: ['Bajaj Pulsar', 'Bajaj CT100', 'Bajaj Dominar'],
      TVS: ['TVS Apache', 'TVS Star', 'TVS NT'],
      Yamaha: ['Yamaha FZS', 'Yamaha R15', 'Yamaha Fascino'],
      'Royal Enfield': ['Royal Enfield Bullet', 'Royal Enfield Classic', 'Royal Enfield Himalayan'],
      KTM: ['KTM Duke', 'KTM RC', 'KTM 390 Adventure'],
    },
    years: Array.from({ length: 10 }, (_, i) => 2024 - i),
    engines: {
      'Hero Splendor': ['100cc', '110cc'],
      'Honda CB Shine': ['125cc'],
      'Honda CB 150R': ['150cc'],
      'Bajaj Pulsar': ['150cc', '180cc', '200cc', '250cc'],
      'Bajaj CT100': ['100cc'],
      'TVS Apache': ['160cc', '180cc', '200cc'],
      'Yamaha FZS': ['150cc', '250cc'],
      'Yamaha R15': ['155cc', '250cc'],
      'Royal Enfield Bullet': ['350cc', '500cc'],
      'Royal Enfield Classic': ['350cc', '500cc', '650cc'],
      'Royal Enfield Himalayan': ['411cc'],
    },
  },
  Car: {
    brands: ['Honda', 'Hyundai', 'Maruti', 'Toyota', 'Mahindra', 'Tata', 'Kia', 'Renault'],
    models: {
      Honda: ['Honda City', 'Honda Civic', 'Honda CR-V', 'Honda Accord'],
      Hyundai: ['Hyundai i20', 'Hyundai i10', 'Hyundai Creta', 'Hyundai Venue'],
      Maruti: ['Maruti Swift', 'Maruti Baleno', 'Maruti Brezza', 'Maruti Ciaz'],
      Toyota: ['Toyota Fortuner', 'Toyota Innova', 'Toyota Glanza'],
      Mahindra: ['Mahindra XUV500', 'Mahindra XUV300', 'Mahindra Bolero'],
      Tata: ['Tata Nexon', 'Tata Harrier', 'Tata Punch', 'Tata Altroz'],
      Kia: ['Kia Sonnet', 'Kia Niro', 'Kia Seltos'],
      Renault: ['Renault Duster', 'Renault Kiger'],
    },
    years: Array.from({ length: 15 }, (_, i) => 2024 - i),
    engines: {
      'Honda City': ['1.5L Petrol', '1.5L Diesel'],
      'Honda Civic': ['1.8L Petrol'],
      'Honda CR-V': ['1.5L Turbo Petrol', '2.0L Petrol'],
      'Hyundai i20': ['1.2L Petrol', '1.5L Diesel'],
      'Hyundai i10': ['1.2L Petrol'],
      'Hyundai Creta': ['1.6L Petrol', '1.6L Diesel'],
      'Maruti Swift': ['1.2L Petrol'],
      'Maruti Baleno': ['1.2L Petrol'],
      'Tata Nexon': ['1.2L Petrol', '1.5L Diesel'],
      'Tata Harrier': ['2.0L Diesel'],
      'Toyota Fortuner': ['2.8L Diesel', '4.0L Petrol'],
    },
  },
  Truck: {
    brands: ['Tata', 'Ashok Leyland', 'Hino', 'Volvo', 'MAN', 'Eicher'],
    models: {
      Tata: ['Tata 407', 'Tata 709', 'Tata 1214', 'Tata T1'],
      'Ashok Leyland': ['Ashok Leyland 3500', 'Ashok Leyland 4021'],
      Hino: ['Hino 300 Series', 'Hino 500 Series'],
      Volvo: ['Volvo FM', 'Volvo FH', 'Volvo FL'],
      MAN: ['MAN TGX', 'MAN TGM'],
      Eicher: ['Eicher Pro 1000', 'Eicher Pro 2000'],
    },
    years: Array.from({ length: 10 }, (_, i) => 2024 - i),
    engines: {
      'Tata 407': ['4.2L Diesel'],
      'Tata 709': ['5.9L Diesel'],
      'Tata 1214': ['5.9L Diesel'],
      'Hino 300 Series': ['5.1L Diesel', '6.5L Diesel'],
      'Volvo FM': ['9L Diesel', '12.8L Diesel'],
      'MAN TGX': ['10.5L Diesel'],
    },
  },
};

export const getVehicleBrands = (vehicleType: string): string[] => {
  const vehicle = VEHICLE_DATA[vehicleType as keyof typeof VEHICLE_DATA];
  return vehicle?.brands || [];
};

export const getVehicleModels = (vehicleType: string, brand: string): string[] => {
  const vehicle = VEHICLE_DATA[vehicleType as keyof typeof VEHICLE_DATA];
  if (!vehicle) return [];

  const models = vehicle.models as Record<string, string[]>;
  return models[brand] || [];
};

export const getVehicleYears = (vehicleType: string): number[] => {
  const vehicle = VEHICLE_DATA[vehicleType as keyof typeof VEHICLE_DATA];
  return vehicle?.years || [];
};

export const getVehicleEngines = (vehicleType: string, model: string): string[] => {
  const vehicle = VEHICLE_DATA[vehicleType as keyof typeof VEHICLE_DATA];
  if (!vehicle) return [];

  const engines = vehicle.engines as Record<string, string[]>;
  return engines[model] || [];
};
