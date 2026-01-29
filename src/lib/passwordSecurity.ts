/**
 * Password security utilities using Have I Been Pwned API
 * Uses k-anonymity to check passwords without exposing them
 */

/**
 * Checks if a password has been exposed in known data breaches
 * Uses the HIBP Pwned Passwords API with k-anonymity
 * @param password - The password to check
 * @returns Object with isLeaked boolean and count of times found
 */
export async function checkPasswordLeaked(password: string): Promise<{
  isLeaked: boolean;
  count: number;
  error?: string;
}> {
  try {
    // Hash the password using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Split hash for k-anonymity: send only first 5 chars
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Query HIBP API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true' // Adds padding to prevent response length analysis
      }
    });
    
    if (!response.ok) {
      console.error('HIBP API error:', response.status);
      return { isLeaked: false, count: 0, error: 'Passwort-Prüfung fehlgeschlagen' };
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Check if our suffix is in the response
    for (const line of lines) {
      const [hashSuffix, countStr] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        const count = parseInt(countStr.trim(), 10);
        return { isLeaked: true, count };
      }
    }
    
    return { isLeaked: false, count: 0 };
  } catch (error) {
    console.error('Error checking password:', error);
    return { isLeaked: false, count: 0, error: 'Passwort-Prüfung fehlgeschlagen' };
  }
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns Object with isValid boolean and validation messages
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  messages: string[];
  score: number;
} {
  const messages: string[] = [];
  let score = 0;
  
  // Minimum length
  if (password.length >= 8) {
    score += 1;
  } else {
    messages.push('Mindestens 8 Zeichen erforderlich');
  }
  
  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    messages.push('Mindestens ein Kleinbuchstabe erforderlich');
  }
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    messages.push('Mindestens ein Großbuchstabe erforderlich');
  }
  
  // Contains number
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    messages.push('Mindestens eine Zahl erforderlich');
  }
  
  // Contains special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    messages.push('Mindestens ein Sonderzeichen empfohlen');
  }
  
  // Length bonus
  if (password.length >= 12) {
    score += 1;
  }
  
  return {
    isValid: score >= 4 && password.length >= 8,
    messages,
    score
  };
}

/**
 * Format the leak count for display
 */
export function formatLeakCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)} Millionen`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)} Tausend`;
  }
  return count.toString();
}
