export default function BlurredCircle() {
    return (
      <svg
        width="647"
        height="1295"
        viewBox="0 0 647 1295"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <g filter="url(#filter0_f_8_1191)">
          <circle
            cx="647.5"
            cy="647.5"
            r="447.5"
            fill="url(#paint0_radial_8_1191)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_8_1191"
            x="0"
            y="0"
            width="1295"
            height="1295"
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
              stdDeviation="100"
              result="effect1_foregroundBlur_8_1191"
            />
          </filter>
          <radialGradient
            id="paint0_radial_8_1191"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(647.5 647.5) rotate(90) scale(447.5)"
          >
            <stop stopColor="#FFD700" />
            <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  