declare module "vite/client" {
  export interface ImportMetaEnv {
    readonly VITE_APP_TITLE?: string;
    readonly [key: string]: string | undefined;
  }

  export interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
