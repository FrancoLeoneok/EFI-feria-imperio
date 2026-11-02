export interface PlatformPayment {
  titular: string;
  alias: string;
  cvu: string;
  demostracion: boolean;
}

// Replace with the platform's registered banking details before accepting money.
export const PLATFORM_PAYMENT: PlatformPayment = {
  titular: 'Feria Imperio',
  alias: 'feria.imperio',
  cvu: '',
  demostracion: true,
};
