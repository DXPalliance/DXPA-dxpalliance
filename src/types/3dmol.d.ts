declare module "3dmol" {
  export interface ViewerSpec {
    backgroundColor?: string;
    antialias?: boolean;
  }

  export interface AtomSpec {
    b?: number;
    elem?: string;
    resn?: string;
    resi?: number;
    chain?: string;
  }

  export interface GLViewer {
    clear: () => void;
    addModel: (data: string, format: string) => unknown;
    setStyle: (
      sel: Record<string, unknown>,
      style: Record<string, unknown>
    ) => void;
    setBackgroundColor: (color: string | number) => void;
    zoomTo: () => void;
    render: () => void;
    resize: () => void;
    spin: (axisOrEnable: string | boolean, speed?: number) => void;
  }

  export function createViewer(
    element: HTMLElement,
    config?: ViewerSpec
  ): GLViewer;
}
