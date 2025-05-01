// components/ToneSlider.tsx
import { FC } from "react";

interface ToneSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ToneSlider: FC<ToneSliderProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="tone" className="block text-sm font-medium">
        Tone
      </label>
      <input
        id="tone"
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs">
        <span>Casual</span>
        <span>Formal</span>
      </div>
    </div>
  );
};

export default ToneSlider;
