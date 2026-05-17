"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderRangeButtonProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SliderRangeButton({
  options,
  value,
  onChange,
  className,
}: SliderRangeButtonProps) {
  const activeIndex = options.indexOf(value);
  const internalValue = [activeIndex !== -1 ? activeIndex : 0];

  const handleValueChange = (newValues: number[]) => {
    const index = newValues[0];
    if (options[index]) {
      onChange(options[index]);
    }
  };

  // Calculate segment width as a percentage of the total
  const segmentWidth = 100 / options.length;

  return (
    <div className={cn("relative flex w-full", className)}>
      <SliderPrimitive.Root
        min={0}
        max={options.length - 1}
        step={1}
        value={internalValue}
        onValueChange={handleValueChange}
        className="relative flex items-center select-none touch-none w-full h-12"
      >
        <SliderPrimitive.Track className="bg-muted relative grow rounded-xl h-full flex items-center p-1 overflow-hidden">
          {/* 
            THE FIX: 
            Instead of translateX(activeIndex * 100%), which drifts, 
            we set the 'left' style to exactly where that segment begins.
          */}
          <div
            className="absolute top-1 bottom-1 rounded-lg bg-primary transition-all duration-300 ease-in-out shadow-sm"
            style={{
              width: `calc(${segmentWidth}% - 8px)`, // Subtracting 8px accounts for p-1 (4px) on both sides
              left: `calc(${activeIndex * segmentWidth}% + 4px)`,
            }}
          />

          <div className="absolute inset-0 flex w-full h-full p-1">
            {options.map((opt, index) => (
              <div
                key={opt}
                className={cn(
                  "flex-1 flex items-center justify-center text-[10px] font-bold uppercase z-10 transition-colors duration-300",
                  index === activeIndex
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {opt}
              </div>
            ))}
          </div>
        </SliderPrimitive.Track>

        {/* 
           Invisible thumb. We keep it 0px wide so it doesn't interfere 
           with the visual alignment but still receives the 'drag' events.
        */}
        <SliderPrimitive.Thumb
          className="block h-10 w-0 focus:outline-none"
          aria-label="Select option"
        />
      </SliderPrimitive.Root>
    </div>
  );
}
