export default function BlurredCircleLeft() {
    return (
      <svg
        width="648"
        height="1295"
        viewBox="0 0 648 1295"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <g filter="url(#filter0_f_10_1514)">
          <circle
            cx="0.5"
            cy="647.5"
            r="447.5"
            fill="url(#paint0_radial_10_1514)"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_10_1514"
            x="-647"
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
              result="effect1_foregroundBlur_10_1514"
            />
          </filter>
          <radialGradient
            id="paint0_radial_10_1514"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(0.5 647.5) rotate(90) scale(447.5)"
          >
            <stop stopColor="#1B255E" />
            <stop offset="1" stopColor="#1B255E" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  