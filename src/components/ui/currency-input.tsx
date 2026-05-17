import { Input } from "./input";

// 🟢 1. Extend standard HTML Input attributes so things like 'style' and 'placeholder' work natively
interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  id?: string;
  options?: string[];
  value: number; // 🟢 2. Changed from string to number
  onChange: (value: number) => void; // 🟢 3. Changed from string to number
}

// 🟢 4. Explicitly pull out 'style' alongside value/onChange so you can access it safely
const CurrencyInput = ({
  value,
  onChange,
  style,
  ...props
}: CurrencyInputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, "");
    const numericValue = parseFloat(digitsOnly) / 100;

    if (isNaN(numericValue)) {
      onChange(0);
    } else {
      onChange(numericValue);
    }
  };

  // Format the number back to 0.00 string for display safely
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

  return (
    <div
      style={{ position: "relative", display: "inline-block", width: "100%" }}
    >
      <Input
        {...props}
        type="text"
        inputMode="decimal"
        value={formattedValue}
        onChange={handleInputChange}
        // 🟢 5. Reference 'style' directly instead of 'props.style'
        style={{ paddingLeft: "20px", textAlign: "left", ...style }}
      />
    </div>
  );
};

export default CurrencyInput;
