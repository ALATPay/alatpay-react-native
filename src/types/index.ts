export interface ALATPayProps {
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  amount: number;
  currency: Currency;
  businessId: string;
  apiKey: string;
  onTransaction: (data: any) => void;
  onClose: (data: any) => void;
  customerPhoneNumber?: string;
  autoStart?: boolean;
  metadata?: object;
  ref: React.ReactElement;
  color?: string;
  environment?: 'dev' | 'sandbox' | 'live';
}

export interface ALATPayRef {
  startTransaction: () => void;
  endTransaction: () => void;
}

export type Currency = 'NGN' | 'USD' | 'EUR';
