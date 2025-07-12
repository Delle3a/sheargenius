import type { SVGProps } from 'react';

export function BarberPole(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="4" r="2" />
      <circle cx="12" cy="20" r="2" />
      <path d="M12 6v12" />
      <path d="M17.1 7.9l-10.2 10.2" />
      <path d="M6.9 7.9l10.2 10.2" />
      <path d="M12 6V4" />
      <path d="M12 20v-2" />
    </svg>
  );
}
