# Lab: A11y & Aria

Keep the UI keyboard-friendly, labelled, and screen-reader aware using Angular Aria and CDK focus utilities.

## Objetivo
- Mantener un orden de tabulación predecible y restaurar el foco al cerrar paneles o diálogos.
- Conectar labels, helper text y errores con `for`/`id` y `aria-describedby`.
- Anunciar cambios dinámicos (resultados, errores) con regiones en vivo sin robar el foco.

## Prerrequisitos
- Componentes standalone y `ChangeDetectionStrategy.OnPush`.
- Conocer los helpers de Angular Aria (labels, listbox, tabs, disclosure).
- Poder correr chequeos AXE o similares en local.

## Implementación mínima
1) **Etiquetas y descripciones**: usa `<label for>` + `id` en inputs, y `aria-describedby` para helper/error. Evita `div` clicable; usa elementos nativos (`button`, `a`).
2) **Foco y navegación**: aplica `cdkFocusInitial` solo donde el patrón lo requiere y restaura el foco al trigger al cerrar el panel. Evita trampas de foco sin escape.
3) **Anuncios**: añade una región `aria-live="polite"` para comunicar resultados o errores asíncronos. No muevas el foco a la región.
4) **Motion/contraste**: respeta `prefers-reduced-motion` y verifica contraste AA en texto y estados (hover/focus).

## Demo (en la página del lab)
- Panel con controles etiquetados y helper text enlazado.
- Región `aria-live` que anuncia el recuento de resultados sin alterar el foco.
- Estilos de foco visibles y variante `prefers-reduced-motion`.

## Do / Don’t
- Do: ordenar el tab stop según lectura y usar roles solo cuando el elemento nativo no resuelve el patrón.
- Do: cerrar overlays en `Escape` y restaurar foco al trigger.
- Don’t: suprimir outlines de foco; estilízalos en su lugar.
- Don’t: usar `aria-live` en cada cambio trivial; solo para cambios relevantes.

## Ejercicio guiado
- Conecta labels y helper/error con `aria-describedby`.
- Asegura que el foco va al header del panel al abrir y vuelve al trigger al cerrar.
- Añade una región en vivo que anuncie “Resultados: N” tras cada cambio.

## Validación y pruebas
- Recorrido completo con teclado: sin trampas, foco visible, cierre con `Escape`.
- Ejecuta AXE o similar y resuelve labels, landmarks y contraste.
- Prueba en modo `prefers-reduced-motion` y alto contraste del SO.
- Smoke SSR/CSR: evita acceder a `document/window` fuera de guards.

## Referencias
- https://angular.dev/guide/aria/overview
- https://angular.dev/guide/aria/components
- https://angular.dev/guide/accessibility
- https://material.angular.io/cdk/a11y/overview
