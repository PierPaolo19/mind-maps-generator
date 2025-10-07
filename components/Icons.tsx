import React from 'react';

const iconBodies: { [key: string]: React.ReactNode } = {
  'arrow-left': (
    <>
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </>
  ),
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </>
  ),
  server: (
    <>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </>
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  ),
  bank: (
    <path d="M3 21h18M5 21V10l7-5 7 5v11M2 10h20"></path>
  ),
  scales: (
    <>
      <line x1="12" y1="2" x2="12" y2="22"></line><path d="M12 2L4 6l8 4 8-4-8-4z"></path>
      <path d="M12 22l-8-4 8-4 8 4-8 4z"></path><path d="M4 6v12"></path><path d="M20 6v12"></path>
    </>
  ),
  home: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </>
  ),
  plane: (
    <path d="M22 2L11 13l-3-1-3 4 5 2 7 7 4-11-11-11z"></path>
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </>
  ),
  truck: (
    <>
      <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
    </>
  ),
  factory: (
    <>
      <path d="M2 20h20M5 20V8l7-4 7 4v12M15 12h2M11 12h2M7 12h2"></path>
      <path d="M19 16h-2v-4h2v4zM11 20V12"></path>
    </>
  ),
  telecom: (
    <>
      <path d="M12 8V4m0 16v-4m-4-8H4m16 0h-4M8 12H4m16 0h-4m-4 4v4m-4-4H4m8 0v4m4-4h4m-4-4V4m-4 4h4m-4 0v4"></path>
      <circle cx="12" cy="12" r="2"></circle>
    </>
  ),
  bolt: (
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  ),
  car: (
    <>
      <path d="M14 16H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path>
      <line x1="5" y1="11" x2="9" y2="11"></line><line x1="18" y1="11" x2="22" y2="11"></line>
      <circle cx="7.5" cy="16.5" r="2.5"></circle><circle cx="17.5" cy="16.5" r="2.5"></circle>
    </>
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  ),
  building: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <line x1="9" y1="22" x2="15" y2="22"></line><line x1="12" y1="4" x2="12" y2="22"></line>
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5z"></path>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v2H6.5A2.5 2.5 0 0 1 4 5.5z"></path>
    </>
  ),
  pattern: (
    <>
      <circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle>
      <line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line>
      <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
    </>
  ),
  'horizontal-fn': (
    <path d="M21 12H3m18 0l-4-4m4 4l-4 4M3 12l4-4M3 12l4 4"></path>
  ),
  'industry-verticals': (
     <path d="M12 3v18m-4-4l4 4 4-4M8 3h8"></path>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </>
  ),
  chat: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </>
  ),
  loader: (
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  ),
  sparkles: (
    <>
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
      <path d="M5 5l1.5 1.5M17.5 17.5L19 19" />
    </>
  ),
  grid: (
      <>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </>
  ),
  close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </>
  )
};

export const IconBody: React.FC<{ name: string }> = ({ name }) => {
  return <>{iconBodies[name] || null}</>;
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const body = iconBodies[name];
  if (!body) {
    console.warn(`Icon with name "${name}" not found.`);
    return null;
  }
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {body}
    </svg>
  );
};
