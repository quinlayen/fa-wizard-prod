import { ChangeEvent } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function PhoneInput({ value, onChange, required = false, disabled = false }: PhoneInputProps) {
  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters
    const cleaned = input.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length > 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length > 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 0) {
      return `(${cleaned}`;
    }
    return '';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  const isValid = value === '' || /^\(\d{3}\) \d{3}-\d{4}$/.test(value);

  return (
    <div className="form-control w-full">
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="(555) 555-5555"
        className={`input input-bordered w-full placeholder:opacity-60 ${!isValid ? 'input-error' : ''}`}
        required={required}
        disabled={disabled}
        maxLength={14} // (XXX) XXX-XXXX
      />
      {!isValid && value !== '' && (
        <label className="label">
          <span className="label-text-alt text-error">Please enter a valid phone number</span>
        </label>
      )}
    </div>
  );
} 