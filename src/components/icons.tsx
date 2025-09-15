export const CardHubLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#EC4899" /> 
          <stop offset="25%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="75%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90V70C38.9543 70 30 61.0457 30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50H90C90 27.9086 72.0914 10 50 10Z"
        fill="url(#logoGradient)"
      />
    </svg>
);
