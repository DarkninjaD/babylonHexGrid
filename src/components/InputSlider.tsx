interface InputSliderProps {
  labelName: string | null;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  max: number | null;
  min: number | null;
}

const InputSlider = ({
  labelName,
  value,
  setValue,
  max,
  min,
}: InputSliderProps) => {
  let safeMax = max == null ? 100 : max;
  let safeMin = min == null ? 0 : min;

  return (
    <div>
      {labelName != null ? <label>{labelName}</label> : <></>}
      <input
        id={value.toString()}
        type="range"
        max={safeMax}
        min={safeMin}
        value={value}
        className="slider"
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
      {value}
    </div>
  );
};

export default InputSlider;
