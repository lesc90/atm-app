type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

const Button = ({
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const base = 'px-4 py-2 rounded font-medium transition my-2';
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none'
  const variants = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-700 cursor-pointer',
    secondary: 'bg-stone-200 text-gray hover:bg-stone-300 cursor-pointer text-sm'
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className} ${disabled ? disabledStyles : ''}`}
      disabled={disabled}
      {...props}
    />
  );
}

export default Button;