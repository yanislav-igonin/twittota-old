import { type FC, type HTMLInputTypeAttribute } from 'react';

type Props = {
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
};
export const Input: FC<Props> = ({
  placeholder = '',
  type = 'text',
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <input
      className="border border-gray-300 rounded-md p-2 w-full"
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
};
