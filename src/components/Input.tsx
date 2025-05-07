type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'primary';
};

const Button = ({ variant = 'primary', className = '', ...props }: InputProps) => {
  const base = 'px-2 py-1 rounded font-medium';
  const variants = {
    primary: 'border-1 border-solid rounded-sm border-gray-400',
  };
  return (
    <input
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;