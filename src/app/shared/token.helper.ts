import { environment } from '../../environments/environment';

/**
 * Token Helper Utility
 * Manages JWT token storage and operations
 */
export class TokenHelper {
  private static readonly TOKEN_KEY = environment.tokenKey;

  /**
   * Save token to sessionStorage
   */
  static setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieve token from sessionStorage
   */
  static getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove token from sessionStorage
   */
  static removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if token exists
   */
  static hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Decode JWT token payload (without validation)
   * Returns null if token is invalid
   */
  static getTokenPayload(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(): boolean {
    const payload = this.getTokenPayload();
    if (!payload || !payload.exp) {
      return true;
    }

    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate < new Date();
  }
}
