import { Spinner } from './Spinner';
import {
  type ButtonHTMLAttributes,
  type FC,
  HTMLInputTypeAttribute,
  type ReactNode,
} from 'react';

type Props = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};
export const Button: FC<Props> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      className="
    bg-rose-500
    hover:bg-rose-700
    text-white
    font-medium
    rounded-md
    min-w-full
    p-2
    "
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {!loading ? children : <Spinner />}
    </button>
  );
};
