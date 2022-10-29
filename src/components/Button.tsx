import { ButtonHTMLAttributes, FC, HTMLInputTypeAttribute, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  loading?: boolean;
}
export const Button: FC<Props> = ({
  children, onClick, type='button', disabled = false, loading = false,
}) => <button
  onClick={onClick}
  disabled={disabled || loading}
  type={type}
  className="
    bg-rose-500
    hover:bg-rose-700
    text-white
    font-medium
    rounded-md
    min-w-full
    p-2
    ">
  {!loading ? children : <Spinner/>}
</button>;
