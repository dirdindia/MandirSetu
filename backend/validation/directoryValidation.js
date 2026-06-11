import Joi from 'joi';

export const hotelValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().allow('').trim(),
  starRating: Joi.number().min(1).max(5).optional(),
  amenities: Joi.array().items(Joi.string().trim()).optional(),
  roomTypes: Joi.array().items(Joi.string().trim()).optional(),
  schedule: Joi.object({
    openTime: Joi.string().allow('').trim(),
    closeTime: Joi.string().allow('').trim(),
    alwaysOpen: Joi.boolean().optional()
  }).optional(),
  hasHall: Joi.boolean().optional(),
  foodAvailable: Joi.boolean().optional(),
  distanceFromNearestMandir: Joi.string().allow('').trim(),
  startingPrice: Joi.number().optional(),
  policies: Joi.array().items(Joi.string().trim()).optional(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required()
  }).required(),
  contact: Joi.object({
    managerName: Joi.string().allow('').trim(),
    phone: Joi.string().required(),
    email: Joi.string().email().allow('').trim(),
    website: Joi.string().allow('').trim()
  }).required(),
  profilePic: Joi.string().allow(''),
  gallery: Joi.array().items(Joi.string()).optional(),
  geolocation: Joi.object({
    latitude: Joi.string().allow(''),
    longitude: Joi.string().allow('')
  }).optional(),
  status: Joi.string().valid('active', 'pending', 'inactive').optional()
});

export const restaurantValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().allow('').trim(),
  cuisine: Joi.array().items(Joi.string().trim()).optional(),
  isVegetarianOnly: Joi.boolean().optional(),
  averageCostForTwo: Joi.number().optional(),
  schedule: Joi.object({
    openTime: Joi.string().allow('').trim(),
    closeTime: Joi.string().allow('').trim(),
    alwaysOpen: Joi.boolean().optional()
  }).optional(),
  amenities: Joi.array().items(Joi.string().trim()).optional(),
  seatingCapacity: Joi.number().optional(),
  fssaiLicense: Joi.string().allow('').trim(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required()
  }).required(),
  contact: Joi.object({
    managerName: Joi.string().allow('').trim(),
    phone: Joi.string().required(),
    email: Joi.string().email().allow('').trim(),
    website: Joi.string().allow('').trim()
  }).required(),
  profilePic: Joi.string().allow(''),
  gallery: Joi.array().items(Joi.string()).optional(),
  geolocation: Joi.object({
    latitude: Joi.string().allow(''),
    longitude: Joi.string().allow('')
  }).optional(),
  status: Joi.string().valid('active', 'pending', 'inactive').optional()
});

export const ashramValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().allow('').trim(),
  founder: Joi.string().allow('').trim(),
  facilities: Joi.array().items(Joi.string().trim()).optional(),
  accommodationAvailable: Joi.boolean().optional(),
  capacity: Joi.number().optional(),
  rules: Joi.string().allow('').trim(),
  dailySchedule: Joi.array().items(
    Joi.object({
      time: Joi.string().trim(),
      activity: Joi.string().trim()
    })
  ).optional(),
  schedule: Joi.object({
    openTime: Joi.string().allow('').trim(),
    closeTime: Joi.string().allow('').trim(),
    alwaysOpen: Joi.boolean().optional()
  }).optional(),
  donationAccepted: Joi.boolean().optional(),
  associatedMandir: Joi.string().allow('').trim(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required()
  }).required(),
  contact: Joi.object({
    managerName: Joi.string().allow('').trim(),
    phone: Joi.string().required(),
    email: Joi.string().email().allow('').trim(),
    website: Joi.string().allow('').trim()
  }).required(),
  profilePic: Joi.string().allow(''),
  gallery: Joi.array().items(Joi.string()).optional(),
  geolocation: Joi.object({
    latitude: Joi.string().allow(''),
    longitude: Joi.string().allow('')
  }).optional(),
  status: Joi.string().valid('active', 'pending', 'inactive').optional()
});

export const mandirDhamValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  establishedYear: Joi.string().allow('').trim(),
  mainDeity: Joi.string().required().trim(),
  description: Joi.string().allow('').trim(),
  category: Joi.string().allow('').trim(),
  schedule: Joi.object({
    openTime: Joi.string().allow('').trim(),
    closeTime: Joi.string().allow('').trim(),
  }).optional(),
  howToReach: Joi.object({
    bus: Joi.string().allow('').trim(),
    train: Joi.string().allow('').trim(),
    air: Joi.string().allow('').trim(),
  }).optional(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow('').trim(),
  website: Joi.string().allow('').trim(),
  profilePic: Joi.string().allow(''),
  gallery: Joi.array().items(Joi.string()).optional(),
  latitude: Joi.string().allow(''),
  longitude: Joi.string().allow(''),
  status: Joi.string().valid('active', 'pending', 'inactive').optional()
});

export const staffValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  dob: Joi.date().optional(),
  address: Joi.string().allow('').trim(),
  city: Joi.string().allow('').trim(),
  state: Joi.string().allow('').trim(),
  pincode: Joi.string().allow('').trim(),
  latitude: Joi.alternatives().try(Joi.string(), Joi.number()).allow(''),
  longitude: Joi.alternatives().try(Joi.string(), Joi.number()).allow(''),
  phone: Joi.string().required(),
  email: Joi.string().email().allow('').trim(),
  emergencyContact: Joi.string().allow('').trim(),
  password: Joi.string().required(),
  role: Joi.string().required().trim(),
  assignedMandir: Joi.string().hex().length(24).optional().allow(''),
  dateOfJoining: Joi.date().optional(),
  profilePic: Joi.string().allow(''),
  documentType: Joi.string().allow('').trim(),
  documentUrl: Joi.string().allow(''),
  status: Joi.string().valid('Active', 'Inactive', 'Suspended').optional()
});
