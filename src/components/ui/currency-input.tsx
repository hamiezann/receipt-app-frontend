import { Input } from "./input";

interface CurrencyInputProps {
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  props?: string[];
}
const CurrencyInput = ({ value, onChange, ...props }: CurrencyInputProps) => {
  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, "");
    const numericValue = parseFloat(digitsOnly) / 100;

    if (isNaN(numericValue)) {
      onChange(0);
    } else {
      onChange(numericValue);
    }
  };

  // 4. Format the number back to 0.00 string for the display
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* <span
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {symbol}
      </span> */}
      <Input
        {...props}
        type="text"
        inputMode="decimal"
        value={formattedValue}
        onChange={handleInputChange}
        style={{ paddingLeft: "20px", textAlign: "left", ...props.style }}
      />
    </div>
  );
};

export default CurrencyInput;
