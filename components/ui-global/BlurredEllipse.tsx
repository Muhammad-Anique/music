export default function BlurredEllipse() {
    return (
      <svg
        width="747"
        height="222"
        viewBox="0 0 747 222"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <g filter="url(#filter0_f_5_874)">
          <ellipse
            cx="391"
            cy="111"
            rx="371"
            ry="91"
            fill="url(#paint0_radial_5_874)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_5_874"
            x="0"
            y="0"
            width="782"
            height="222"
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
              stdDeviation="10"
              result="effect1_foregroundBlur_5_874"
            />
          </filter>
          <radialGradient
            id="paint0_radial_5_874"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(391 111) rotate(90) scale(91 371)"
          >
            <stop stopColor="#1B255E" />
            <stop offset="1" stopColor="#1B255E" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  