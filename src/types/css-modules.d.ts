/**
 * @fileoverview CSS Modules Type Declarations
 *
 * ZWECK:
 * - TypeScript-Support für CSS-Module (*.module.css)
 * - Ermöglicht import styles from './Component.module.css'
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 */

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: string;
  export default css;
}
