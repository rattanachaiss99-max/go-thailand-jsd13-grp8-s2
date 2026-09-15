export interface Guide {
  id: string;
  name: string;
  avatar: string;
  heroImage?: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerDay: number;
  specialties: string[];
  languages: string[];
  bio: string;
  yearsExp: string;
  travelersCount: string;
  verified: boolean;
  services: GuideService[];
}

export interface GuideService {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface BookingState {
  guideId: string;
  guide: Guide;
  date: string;
  guests: number;
  duration: string;
  meetingPoint: string;
  specialRequests: string;
  guideFee: number;
  serviceFee: number;
  totalAmount: number;
  traveler: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  payment: {
    method: 'card' | 'promptpay';
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    agreedToTerms: boolean;
  };
  bookingReference: string;
  createdAt?: string;
}

export type PageStep = 1 | 2 | 3 | 4 | 5;
