import { ValidationResult, USAHockeyRegistration } from '@/types/player';

// Mock USA Hockey API service
// In production, this would connect to the actual USA Hockey registration system
export class USAHockeyService {
  private static readonly API_BASE_URL = 'https://api.usahockey.com/v1'; // Mock URL
  
  static async validateRegistration(registrationNumber: string): Promise<ValidationResult> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation logic - in production this would call USA Hockey API
      const mockValidRegistrations = [
        { id: '12345678', status: 'active', division: 'Adult Rec', expirationDate: '2025-08-31' },
        { id: '87654321', status: 'active', division: 'Youth 16U', expirationDate: '2025-08-31' },
        { id: '11111111', status: 'expired', division: 'Adult Rec', expirationDate: '2024-08-31' },
        { id: '22222222', status: 'suspended', division: 'Youth 14U', expirationDate: '2025-08-31' },
      ];
      
      const registration = mockValidRegistrations.find(reg => reg.id === registrationNumber);
      
      if (!registration) {
        return {
          isValid: false,
          status: 'not_found',
          message: 'USA Hockey registration number not found. Please verify the number and try again.'
        };
      }
      
      const isExpired = new Date(registration.expirationDate) < new Date();
      
      if (registration.status === 'suspended') {
        return {
          isValid: false,
          status: 'suspended',
          message: 'This USA Hockey registration is currently suspended. Please contact USA Hockey for assistance.'
        };
      }
      
      if (isExpired || registration.status === 'expired') {
        return {
          isValid: false,
          status: 'expired',
          expirationDate: registration.expirationDate,
          division: registration.division,
          message: `USA Hockey registration expired on ${registration.expirationDate}. Please renew your registration.`
        };
      }
      
      return {
        isValid: true,
        status: 'active',
        expirationDate: registration.expirationDate,
        division: registration.division,
        message: `Valid USA Hockey registration. Expires ${registration.expirationDate}.`
      };
      
    } catch (error) {
      return {
        isValid: false,
        status: 'not_found',
        message: 'Unable to validate registration. Please check your connection and try again.'
      };
    }
  }
  
  static async getPlayerRegistration(playerId: string): Promise<USAHockeyRegistration | null> {
    try {
      // Mock API call to get player's current registration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in production this would fetch from USA Hockey API
      return {
        id: 'reg-1',
        registrationNumber: '12345678',
        playerId: playerId,
        season: '2024-25',
        status: 'active',
        expirationDate: '2025-08-31',
        division: 'Adult Rec',
        birthYear: 1995,
        lastValidated: new Date().toISOString(),
        validationSource: 'usa_hockey_api'
      };
    } catch (error) {
      return null;
    }
  }
  
  static formatRegistrationNumber(input: string): string {
    // Remove any non-numeric characters and format
    const cleaned = input.replace(/\D/g, '');
    return cleaned.slice(0, 8); // USA Hockey IDs are typically 8 digits
  }
  
  static isValidFormat(registrationNumber: string): boolean {
    const cleaned = registrationNumber.replace(/\D/g, '');
    return cleaned.length === 8;
  }
}