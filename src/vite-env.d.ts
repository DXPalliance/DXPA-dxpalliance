/// <reference types="vite/client" />

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "3dmol" {
  export type AtomSpec = any;
  export type GLViewer = any;
  export const AtomSpec: any;
  export const GLViewer: any;
  export const createViewer: any;
}
