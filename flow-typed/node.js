// @flow strict

declare module "perf_hooks" {
  declare module.exports: {
    performance: {
      now: () => number,
    }
  };
}

declare module "fs" {
  declare class FSPromises {
    mkdir(path: string | Buffer | URL, options?: { recursive?: boolean, mode?: number }): Promise<void>,
    mkdtemp(prefix: string, options?: string | { encoding?: string }): Promise<string>,
    readdir(path: string | Buffer | URL, options?: 'utf-8' | { encoding?: 'utf-8' }): Promise<Array<string>>,
    readFile(path: string | Buffer | URL, options?: 'utf-8' | { encoding?: 'utf-8', flag: string }): Promise<string>,
    unlink(path: string | Buffer | URL): Promise<void>,
    writeFile(path: string | Buffer | URL, data: string | Buffer | Uint8Array, options?: 'utf-8' | { encoding?: 'utf-8' }): Promise<void>,
  }
  declare export var promises: FSPromises;
}