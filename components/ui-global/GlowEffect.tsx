
type GlowEffectProps = {
    color: string;
  };
  export default function GlowEffect({ color }: GlowEffectProps) {
    return (
      <svg
        width="225"
        height="225"
        viewBox="0 0 365 365"
        className="scale-110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_77_165)">
          <circle
            cx="182.5"
            cy="182.5"
            r="125.5"
            fill={`url(#paint0_radial_77_165_${color.replace("#", "")})`}
            fillOpacity="0.7"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_77_165"
            x="0.91061"
            y="0.91061"
            width="363.179"
            height="363.179"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="28.0447"
              result="effect1_foregroundBlur_77_165"
            />
          </filter>
          <radialGradient
            id={`paint0_radial_77_165_${color.replace("#", "")}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(182.5 182.5) rotate(90) scale(125.5)"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  