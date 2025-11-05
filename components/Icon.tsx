
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const ICONS: { [key: string]: React.ReactNode } = {
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.954 8.955M3 11.25V21h6V15h4.5v6H21V11.25" />,
  schedule: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" />,
  settings: <><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.19-.22 1.745 0 .55.219 1.02.684 1.11 1.226l.094.542c.063.372.363.66.742.742l.542.094c.542.09.955.57 1.11 1.11.22.553.22 1.19 0 1.744-.156.54-.638 1.02-1.11 1.11l-.542.094c-.379.08-.679.37-.742.742l-.094.542c-.09.542-.568 1.007-1.11 1.226-.554.22-1.19.22-1.745 0-.55-.219-1.02-.684-1.11-1.226l-.094-.542a.75.75 0 01-.742-.742l-.542-.094c-.542-.09-.955-.57-1.11-1.11-.22-.553-.22-1.19 0-1.744.156.54.638 1.02 1.11 1.11l.542-.094a.75.75 0 01.742-.742l.094-.542z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
  add: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
  trash: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />,
  sync: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667-11.668v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183" />,
  groups: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.082 2.72a3 3 0 01-4.682-2.72M12 12.72a3 3 0 01-3-3m3 3a3 3 0 003-3m-3 3v6.75m-3-6.75a3 3 0 013-3m3 3a3 3 0 00-3-3m-3 3a3 3 0 01-3-3m0 0a3 3 0 013-3m3 3a3 3 0 00-3-3" />,
  snooze: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M18 14.25h.008v.008H18v-.008zm-3.008 0h.008v.008h-.008v-.008zm-3.008 0h.008v.008h-.008v-.008zm-3.008 0h.008v.008h-.008v-.008z" />,
  ellipsis: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  bell: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.31 6.032l-1.32 1.32C2.175 17.935 2.45 18.5 3 18.5h18a2.25 2.25 0 002.25-2.25v-1.121a23.834 23.834 0 00-5.454-1.31z" />,
  inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 9h3.86a2.25 2.25 0 002.012-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.218a2.25 2.25 0 012.013 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.859M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
  'x-mark': <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  pencil: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />,
  'arrow-left': <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />,
  'question-mark-circle': <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />,
  'arrow-up-on-square': <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v12" />,
  'ellipsis-vertical': <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />,
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      {ICONS[name] || null}
    </svg>
  );
};

export default Icon;