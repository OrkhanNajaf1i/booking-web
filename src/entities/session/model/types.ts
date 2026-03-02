// Backend-dən gələn User obyekti
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'staff' | 'provider_owner' | 'solo_practitioner';
  avatar?: string;
  business_id?: string;
  email_verified: boolean;
  is_active: boolean;
  is_owner: boolean;
  created_at: string;
}

// Login/Register response
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

// Register Request Body
export interface RegisterDto {
  email: string;
  full_name: string;
  password: string;
  phone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshResponse {
    success: boolean,
    data: {
        access_token: string,
        expires_in: number,
        token_type: string
    },
    message: string
}