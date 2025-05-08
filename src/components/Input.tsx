type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = '', ...props }: InputProps) => {
  const base = 'px-2 py-1 rounded font-medium border-1 border-solid rounded-sm border-gray-400';
  return (
    <input
      className={`${base} ${className}`}
      {...props}
    />
  );
}

export default Input;