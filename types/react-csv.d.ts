declare module 'react-csv' {
  import { ComponentType, ReactNode } from 'react';

  interface CSVLinkProps {
    data: any[];
    filename?: string;
    headers?: string[];
    separator?: string;
    enclosingCharacter?: string;
    className?: string;
    target?: string;
    onClick?: () => void;
    children?: ReactNode;
  }

  export const CSVLink: ComponentType<CSVLinkProps>;
} 