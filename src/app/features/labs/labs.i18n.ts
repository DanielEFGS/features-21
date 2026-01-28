import { LabCatalogItem, LabContent } from './labs.models';

type LabStatus = 'planned' | 'in-progress' | 'done';
type LabLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type LabId = LabCatalogItem['id'];

export const LAB_I18N = {
  status: {
    planned: $localize`:@@labStatusPlanned:planned`,
    'in-progress': $localize`:@@labStatusInProgress:in-progress`,
    done: $localize`:@@labStatusDone:done`
  } satisfies Record<LabStatus, string>,
  level: {
    Beginner: $localize`:@@labLevelBeginner:Beginner`,
    Intermediate: $localize`:@@labLevelIntermediate:Intermediate`,
    Advanced: $localize`:@@labLevelAdvanced:Advanced`
  } satisfies Record<LabLevel, string>
} as const;

/**
 * Spanish overrides for catalog cards and lab content.
 * Keep English as the source language; we merge overrides at runtime using LOCALE_ID.
 */
const LAB_TRANSLATIONS: Partial<
  Record<
    string,
    {
      catalog?: Partial<Record<LabId, Partial<LabCatalogItem>>>;
      content?: Partial<Record<LabId, Partial<LabContent>>>;
    }
  >
> = {
  es: {
    catalog: {
      signals: {
        title: 'Señales',
        duration: '30-40 min',
        summary: 'Modela estado local con señales, deriva con computed y usa effects solo para efectos secundarios.'
      },
      httpresource: {
        title: 'httpResource',
        summary: 'Obtén datos de forma reactiva con resources, estados de carga y solicitudes abortables.'
      },
      'rxjs-interop': {
        title: 'Interop RxJS',
        summary: 'Conecta señales y observables usando toSignal y toObservable.'
      },
      routing: {
        title: 'Enrutamiento',
        summary: 'Rutas lazy, datos de ruta y guards con patrones modernos.'
      },
      di: {
        summary: 'Inyecta servicios con inject(), tokens y proveedores por ruta.'
      },
      forms: {
        title: 'Formularios',
        summary: 'Signal Forms con validación basada en modelo, estado de campo y reglas de esquema.'
      },
      animations: {
        title: 'Animaciones',
        summary: 'Animaciones de entrada/salida, motion CSS reutilizable y transiciones de ruta.'
      },
      'style-guide': {
        title: 'Guía de estilos',
        summary: 'Aplica nombres, estructura y reglas de lint de forma consistente.'
      },
      tailwind: {
        summary: 'Construye UI limpia con utilidades y reutiliza primitivas compartidas.'
      },
      'a11y-aria': {
        title: 'A11y y Aria',
        summary: 'Angular Aria y utilidades CDK de foco para mantener la UI accesible.'
      },
      pwa: {
        summary: 'Cache de app shell, flujo de instalación y aviso de actualización (sin cachear la API).'
      },
      testing: {
        summary: 'Patrones unitarios con Vitest: specs aptas para SSR, mocks HTTP y harness de router.'
      },
      performance: {
        title: 'Performance',
        summary: 'Budgets, estrategias de defer/lazy y límites de assets/red.'
      },
      'custom-build': {
        title: 'Build personalizada',
        summary: 'Diseña un pipeline de build con estrategia de cache y validaciones SSR.'
      },
      cdk: {
        summary: 'Overlays CDK, herramientas de foco y portals para primitivas reutilizables.'
      }
    },
    content: {
      signals: {
        tagline: 'Construye un panel de comparación con señales.',
        summary:
          'Las señales son el estado reactivo nativo en Angular. Modela selección, deriva con computed y usa effects solo para efectos secundarios.',
        outcomes: [
          'Modelar estado local con señales.',
          'Usar computed para derivar valores sin lógica en plantilla.',
          'Usar effect solo para efectos secundarios no reactivos.',
          'Actualizar señales con set y update.',
          'Saber cuándo una derivación pertenece a computed.'
        ],
        prerequisites: [
          'Componentes standalone y OnPush.',
          'Control de flujo moderno (@if, @for).',
          'Layout básico de Pokédex y navegación.',
          'NgOptimizedImage para imágenes estáticas.'
        ],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Las señales te dan estado síncrono con seguimiento automático de dependencias.',
            paragraphs: [
              'Una signal guarda un valor. Una computed deriva valores nuevos. Un effect reacciona a cambios para ejecutar efectos secundarios.',
              'La meta es sacar estado y derivaciones del template para que la UI sea simple y predecible.'
            ]
          },
          {
            id: 'core-apis',
            title: 'APIs clave',
            summary: 'signal, computed y effect cubren la mayoría del estado local.',
            bullets: [
              'signal(valor): crea un valor con lectura y escritura.',
              'computed(fn): deriva un valor cuando cambian sus dependencias.',
              'effect(fn): ejecuta efectos secundarios cuando cambian las dependencias.'
            ],
            callouts: [
              {
                tone: 'tip',
                title: 'Usa effect con moderación',
                text: 'Úsalo para APIs no reactivas (storage, analytics, escritura en DOM). No lo uses para derivar estado.'
              }
            ]
          },
          {
            id: 'derived-state',
            title: 'Estado derivado',
            summary: 'Calcula etiquetas, filtros y límites con computed.',
            paragraphs: [
              'El estado derivado limpia el template y facilita las pruebas.',
              'Evita filtrar, ordenar o condicionar directamente en la plantilla.'
            ]
          },
          {
            id: 'effects',
            title: 'Effects y efectos secundarios',
            summary: 'Persiste la selección en storage con un effect seguro para cliente.',
            paragraphs: [
              'Los effects corren al cambiar dependencias. Protege el acceso a APIs del navegador para SSR.',
              'Si puedes derivar el valor, usa computed en lugar de effect.'
            ]
          },
          {
            id: 'linked-signal',
            title: 'Estado dependiente con linkedSignal',
            summary: 'Úsalo cuando un estado depende de otro valor de signal.',
            paragraphs: [
              'linkedSignal deriva un valor que aún puede actualizarse localmente.',
              'Útil cuando quieres un valor por defecto que cambia con entradas pero permite interacción.'
            ],
            callouts: [
              {
                tone: 'note',
                title: 'Opcional en este lab',
                text: 'linkedSignal es buen siguiente paso después de dominar signal, computed y effect.'
              }
            ]
          }
        ],
        exercise: {
          title: 'Ejercicio: Panel de comparación',
          goal: 'Crea un panel compacto que permita seleccionar hasta tres Pokémon.',
          tasks: [
            'Crea una lista de Pokémon disponible (mock es válido).',
            'Crea una lista de nombres seleccionados.',
            'Deriva texto de resumen y estado de límite con computed.',
            'Desactiva el botón "Agregar" cuando se alcance el límite.',
            'Persiste la selección en sessionStorage con un effect protegido para SSR.'
          ],
          success: [
            'El resumen se actualiza al instante al seleccionar.',
            'El botón Agregar se bloquea en tres ítems.',
            'Al quitar un ítem se desbloquea Agregar.',
            'No hay lógica de filtrado en la plantilla.'
          ],
          stretch: [
            'Añade una acción de limpiar todo usando update.',
            'Muestra un mensaje breve cuando se alcance el límite.'
          ]
        }
      },
      httpresource: {
        tagline: 'Carga datos reactivos con httpResource.',
        summary:
          'httpResource entrega estados tipados de carga/éxito/error con cancelación integrada. Practica dedupe y abortos seguros.',
        outcomes: [
          'Crear recursos con estados tipados.',
          'Cancelar y reiniciar cargas sin fugas.',
          'Separar render (UI) de orquestación de datos.',
          'Respetar SSR/Hydration al consumir recursos.'
        ],
        prerequisites: ['Standalone + OnPush.', 'Control de flujo moderno.', 'Cliente HTTP tipado de PokéAPI.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'httpResource envuelve HttpClient con estado reactivo y seguimiento de status.',
            paragraphs: [
              'Un recurso expone value, status y error como señales fáciles de enlazar en plantillas.',
              'Cuando cambian las señales de entrada, la petición se vuelve a ejecutar automáticamente.'
            ]
          },
          {
            id: 'core-apis',
            title: 'APIs clave',
            summary: 'Usa resource.value, resource.status y resource.error para guiar la UI.',
            bullets: [
              'httpResource(() => config): crea una petición reactiva.',
              'resource.value(): payload actual (undefined mientras carga).',
              'resource.status(): idle, loading, error o success.',
              'resource.reload(): fuerza un refetch.'
            ]
          },
          {
            id: 'optimization',
            title: 'Estrategias de optimización',
            summary: 'Controla la frecuencia de cambios de entrada para evitar peticiones extra.',
            bullets: [
              'Usa una señal de entrada pendiente y aplícala con botón o Enter.',
              'Debounce del input con RxJS y toSignal cuando deba buscar al tipear.',
              'Desactiva el botón mientras carga para no encolar solicitudes.'
            ]
          },
          {
            id: 'parsing',
            title: 'Parsing y view models',
            summary: 'Convierte payloads a la forma que necesita tu UI.',
            paragraphs: [
              'Usa parse para mapear DTOs a view models.',
              'Mantén el parseo cerca del recurso para reducir lógica en la plantilla.'
            ]
          },
          {
            id: 'ui-states',
            title: 'Estados de UI',
            summary: 'Mantén feedback claro para loading, error y empty.',
            paragraphs: [
              'Deriva el status con computed y pínchalo directo en la plantilla.',
              'Usa un estado vacío neutral antes de la primera petición.'
            ]
          }
        ],
        exercise: {
          title: 'Ejercicio: Búsqueda reactiva',
          goal: 'Crear un buscador de Pokémon que use httpResource con estados claros.',
          tasks: [
            'Configurar httpResource con una señal de query.',
            'Mostrar loading, error, empty y success.',
            'Añadir recarga controlada (botón o debounce).',
            'Parsear el payload a un view model simple.'
          ],
          success: [
            'El estado cambia sin lógica extra en plantilla.',
            'El botón se desactiva al cargar.',
            'La vista empty aparece antes de la primera búsqueda.',
            'El parsing mantiene la plantilla limpia.'
          ],
          stretch: [
            'Añadir cancelación manual.',
            'Guardar el último resultado en cache local.'
          ]
        }
      },
      'rxjs-interop': {
        tagline: 'Conecta señales y observables.',
        summary: 'Aprende toSignal y toObservable para puentear RxJS y señales sin fugas ni bucles.',
        outcomes: [
          'Convertir streams a señales de forma segura.',
          'Exponer señales a código basado en RxJS.',
          'Controlar cancelación y suscripciones.',
          'Evitar ciclos entre señales y observables.'
        ],
        prerequisites: ['Conocimientos básicos de RxJS.', 'Señales, computed y effect.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'toSignal y toObservable permiten puentear RxJS y señales con seguridad.',
            paragraphs: [
              'Convierte observables a señales para consumirlos en plantillas sin suscripciones manuales.',
              'Exponer una señal como observable permite integrarse con APIs que esperan streams.'
            ]
          },
          {
            id: 'bridging',
            title: 'Puentear sin ciclos',
            summary: 'Evita bucles cuando señales y observables se alimentan entre sí.',
            bullets: [
              'Lee la señal dentro de toObservable pero evita escribirle desde ese mismo stream.',
              'Prefiere subjects dedicados para entrada de usuario y señales derivadas para UI.'
            ],
            callouts: [
              {
                tone: 'warn',
                title: 'Cuidado con efectos recursivos',
                text: 'Un effect que emite al subject que alimenta la señal puede generar loops.'
              }
            ]
          },
          {
            id: 'cancellation',
            title: 'Cancelación y limpieza',
            summary: 'Asegura que las suscripciones no queden vivas.',
            bullets: [
              'toSignal cancela automáticamente al destruir el componente.',
              'Para streams manuales, usa takeUntilDestroyed o signalDestroyed.'
            ]
          }
        ],
        exercise: {
          title: 'Ejercicio: puente RxJS â†’ signal',
          goal: 'Convertir un stream a señal y exponerlo como observable sin ciclos.',
          tasks: [
            'Crear un Subject de búsqueda.',
            'Usar toSignal con debounce en el stream.',
            'Exponer la señal como observable con toObservable.',
            'Mostrar el valor actual y contar emisiones.'
          ],
          success: [
            'El valor se actualiza sin lag.',
            'Sin suscripciones duplicadas.',
            'Sin bucles entre señal y observable.',
            'Se limpia correctamente al destruir.'
          ],
          stretch: ['Añadir retry/backoff opcional.', 'Persistir la última búsqueda en storage.']
        }
      },
      routing: {
        tagline: 'Patrones modernos de enrutamiento.',
        summary: 'Rutas lazy, datos de ruta, guards y proveedores por ruta con el router funcional.',
        outcomes: [
          'Definir rutas lazy y providers scoped.',
          'Usar route data para personalizar vistas.',
          'Aplicar guards/resolvers modernos.',
          'Documentar render mode por ruta.'
        ],
        prerequisites: ['Routes standalone.', 'Conocer RenderMode (SSR/SSG/CSR).'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'El router funcional permite rutas lazy, datos y providers por ruta sin NgModules.',
            paragraphs: [
              'Cada ruta puede definir RenderMode y providers sin heredar singletons innecesarios.',
              'Los datos de ruta evitan duplicar constantes en los componentes.'
            ]
          },
          {
            id: 'route-data',
            title: 'Datos de ruta',
            summary: 'Usa data para títulos, layout o flags de la vista.',
            bullets: [
              'Injecta ActivatedRouteSnapshot para leer data tipada.',
              'Evita hardcodear labels en el componente.'
            ]
          },
          {
            id: 'guards',
            title: 'Guards y resolvers',
            summary: 'Aísla validaciones y fetch inicial.',
            bullets: [
              'Los guards pueden usar inject() y providers de la propia ruta.',
              'Resolver datos antes de cargar la vista reduce flicker.'
            ]
          }
        ]
      },
      di: {
        tagline: 'Inyección con inject() y tokens.',
        summary: 'Scoped providers, tokens y patrones de DI modernos sin constructors.',
        outcomes: [
          'Reemplazar inyección por constructor con inject().',
          'Crear y usar tokens para configuración.',
          'Scope de providers por ruta/componente.',
          'Evitar singletons innecesarios.'
        ],
        prerequisites: ['Standalone + OnPush.', 'Conceptos básicos de servicios.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'inject() simplifica la DI y permite tokens con tipado.',
            bullets: [
              'Usa tokens para valores de configuración.',
              'Define providers en componentes o rutas para limitar el scope.'
            ]
          },
          {
            id: 'scopes',
            title: 'Scopes de provider',
            summary: 'Reduce singletons innecesarios.',
            paragraphs: [
              'Providers en rutas o componentes se destruyen con su host.',
              'Mejora tests y evita fugas de estado.'
            ]
          }
        ]
      },
      forms: {
        tagline: 'Formularios con señales.',
        summary: 'Modelos reactivos con signal forms, estado de campos y validación declarativa.',
        outcomes: [
          'Construir formularios con FormSignal.',
          'Definir esquemas y reglas de validación.',
          'Leer estado de campo (touched/dirty).',
          'Sincronizar UI con valores derivados.'
        ],
        prerequisites: ['Señales y computed.', 'Conocer validación y tipos en formularios.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'FormSignal modela formularios con estado y validación tipada.',
            bullets: [
              'Define esquema y reglas en un solo lugar.',
              'Usa field state para UX (touched/dirty/errors).'
            ]
          },
          {
            id: 'validation',
            title: 'Validación',
            summary: 'Combina reglas built-in y esquemas.',
            bullets: [
              'required, email y minLength como base.',
              'Schema rules para consistencia.'
            ]
          }
        ]
      },
      animations: {
        tagline: 'Animaciones de entrada/salida.',
        summary: 'animate.enter y animate.leave para microinteracciones, más reutilización de motion CSS.',
        outcomes: [
          'Añadir enter/leave accesibles.',
          'Reutilizar animaciones CSS con clases.',
          'Sincronizar timing con estados de UI.',
          'Evitar parpadeos en SSR/hydration.'
        ],
        prerequisites: ['Control de estados en UI.', 'Conocer CSS keyframes/transitions.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'animate.enter/leave manejan clases de animación en montaje y desmontaje.'
          },
          {
            id: 'timing',
            title: 'Timing y limpieza',
            summary: 'Angular limpia las clases al terminar la animación.',
            bullets: [
              'Usa keyframes o transitions y define estado final consistente.',
              'Evita parpadeos en SSR asegurando estilos iniciales.'
            ]
          }
        ]
      },
      'style-guide': {
        tagline: 'Aplicar la Guía de estilo.',
        summary: 'Nombres, estructura y reglas de lint consistentes en todas las features.',
        outcomes: [
          'Nombrar archivos y selectores de forma consistente.',
          'Mantener estructura por feature.',
          'Seguir convenciones de señales y control de flujo.',
          'Aplicar reglas de lint/tipos sin excepciones.'
        ],
        prerequisites: ['Repasar sección de naming y prefijos.', 'Conocer Angular Style Guide.'],
        sections: [
          {
            id: 'naming',
            title: 'Nomenclatura',
            summary: 'Prefijos únicos y kebab-case en archivos.',
            bullets: [
              'Selector con prefijo único por proyecto.',
              'Sin sufijo component en archivos.'
            ]
          },
          {
            id: 'structure',
            title: 'Estructura por feature',
            summary: 'Mantén archivos de un componente juntos.',
            bullets: [
              'feature/<componente>/<componente>.{ts,html,css,spec.ts}',
              'Tests junto al código.'
            ]
          }
        ]
      },
      tailwind: {
        tagline: 'Utilidades Tailwind en Angular.',
        summary: 'Crea UI limpia con utilidades reutilizables y patrones de composición.',
        outcomes: [
          'Configurar Tailwind en Angular.',
          'Componer clases sin cadenas enormes.',
          'Extraer utilidades compartidas.',
          'Mantener accesibilidad con utilidades.'
        ],
        prerequisites: ['Base de CSS/utility-first.', 'Proyecto ya configurado con Tailwind.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Tailwind ayuda a componer UI con utilidades cortas y reutilizables.'
          },
          {
            id: 'composition',
            title: 'Composición',
            summary: 'Evita mega-strings de clases.',
            bullets: [
              'Extrae utilidades compartidas cuando se repiten.',
              'Prioriza clases cortas y legibles.'
            ]
          }
        ]
      },
      'a11y-aria': {
        tagline: 'Accesibilidad con Angular Aria.',
        summary: 'Patrones de foco, roles y labels con Angular Aria y CDK.',
        outcomes: [
          'Aplicar roles/labels en controles.',
          'Gestionar foco con utilidades CDK.',
          'Validar checklist AXE/WCAG AA.',
          'Diseñar estados de error y disabled accesibles.'
        ],
        prerequisites: ['Conocer WCAG/AXE básico.', 'Componentes con estados claros.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Angular Aria ofrece patrones accesibles; el CDK ayuda con foco y overlays.'
          },
          {
            id: 'labels',
            title: 'Labels y roles',
            summary: 'Siempre define aria-label/aria-labelledby y roles adecuados.',
            bullets: [
              'Inputs y botones con label explícito.',
              'Mensajes de error asociados por aria-describedby.'
            ]
          }
        ]
      },
      pwa: {
        tagline: 'App shell y actualización.',
        summary: 'PWA instalable con cache del app shell y flujo de actualización seguro.',
        outcomes: [
          'Habilitar Service Worker sin cachear API.',
          'Configurar manifest y íconos.',
          'Implementar aviso de actualización.',
          'Medir impacto en bundle y budgets.'
        ],
        prerequisites: ['SSR listo.', 'Comprender restricciones de cache.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Objetivo: app shell cacheado, sin cachear API; avisar nuevas versiones.'
          },
          {
            id: 'updates',
            title: 'Aviso de actualización',
            summary: 'Informa cuando hay nueva versión del SW.',
            bullets: [
              'Escucha eventos de actualización.',
              'Ofrece botón para recargar con foco accesible.'
            ]
          }
        ]
      },
      testing: {
        tagline: 'Pruebas con Vitest en Angular.',
        summary: 'Patrones de unit/SSR-safe specs, mocks HTTP y harness del router.',
        outcomes: [
          'Configurar Vitest con Angular.',
          'Mockear httpResource y router.',
          'Escribir specs seguras para SSR.',
          'Cubrir casos de loading/error.'
        ],
        prerequisites: ['Fundamentos de Vitest.', 'Conocer testing utilities de Angular.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Vitest puede usarse con Angular para specs rápidas y seguras para SSR.'
          },
          {
            id: 'mocks',
            title: 'Mocks y harness',
            summary: 'Aísla dependencias para que las specs no dependan de window/document.',
            bullets: [
              'Mockea httpResource/HttpClient y router para controlar estados.',
              'Evita acceder a APIs de navegador en specs SSR-safe.'
            ]
          }
        ]
      },
      performance: {
        tagline: 'Budgets y estrategias de performance.',
        summary: 'Limitar assets, defer/lazy, imágenes y red para mantener budgets.',
        outcomes: [
          'Configurar y respetar budgets.',
          'Usar defer views y lazy assets.',
          'Optimizar imágenes y concurrencia.',
          'Medir LCP/CLS/TTI en laboratorios.'
        ],
        prerequisites: ['Conocer métricas Web Vitals.', 'SSR/hydration activos.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Budgets guían tamaños; defer/lazy ayuda a cumplirlos.'
          },
          {
            id: 'assets',
            title: 'Assets y red',
            summary: 'Carga diferida y límites claros por bundle.',
            bullets: [
              'Aplica defer/lazy en assets pesados.',
              'Limita concurrencia para evitar saturar red.'
            ]
          }
        ]
      },
      'custom-build': {
        tagline: 'Pipeline de build a medida.',
        summary: 'Define pasos de build, validaciones SSR y estrategias de cache.',
        outcomes: [
          'Diseñar pasos custom del pipeline.',
          'Agregar checks SSR/hydration.',
          'Controlar tamaños y hashing.',
          'Documentar tradeoffs de la pipeline.'
        ],
        prerequisites: ['Conocer angular.json y builder.', 'Conceptos de cache/CDN.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'Una pipeline custom permite validar SSR, tamaños y cacheo.'
          },
          {
            id: 'validation',
            title: 'Validación de build',
            summary: 'Agrega pasos para budgets y SSR.',
            bullets: [
              'Scripts que fallen el build si se excede un umbral.',
              'Checks de hydration/SSR antes de desplegar.'
            ]
          }
        ]
      },
      cdk: {
        tagline: 'Primitivas reutilizables con CDK.',
        summary: 'Overlays, focus y portals para componer UI accesible y reusable.',
        outcomes: [
          'Crear overlays básicos con CDK.',
          'Gestionar foco y trapping.',
          'Usar portals para composición.',
          'Integrar con Angular Aria cuando aplique.'
        ],
        prerequisites: ['Base de A11y.', 'Conceptos de overlay/portal.'],
        sections: [
          {
            id: 'overview',
            title: 'Resumen',
            summary: 'CDK provee overlays, foco y portals para componer UI accesible.'
          },
          {
            id: 'focus',
            title: 'Foco y trapping',
            summary: 'Mantén foco dentro de overlays y devuélvelo al cerrar.',
            bullets: [
              'Usa utilidades de foco para trapping.',
              'Devuelve el foco al disparador tras cerrar.'
            ]
          }
        ]
      }
    }
  }
};

/** Ejercicios en español para labs que aún no tienen override completo. */
const LAB_EXERCISE_ES: Partial<Record<LabId, Pick<LabContent, 'exercise'>>> = {
  'rxjs-interop': {
    exercise: {
      title: 'Ejercicio: puente RxJS & signal',
      goal: 'Convertir un stream a señal y exponerlo como observable sin ciclos.',
      tasks: [
        'Crear un Subject de búsqueda.',
        'Usar toSignal con debounce en el stream.',
        'Exponer la señal como observable con toObservable.',
        'Mostrar el valor actual y contar emisiones.'
      ],
      success: [
        'El valor se actualiza sin lag.',
        'Sin suscripciones duplicadas.',
        'Sin bucles entre señal y observable.',
        'Se limpia correctamente al destruir.'
      ],
      stretch: ['Añadir retry/backoff opcional.', 'Persistir la última búsqueda en storage.']
    }
  },
  routing: {
    exercise: {
      title: 'Ejercicio: ruta lazy con datos',
      goal: 'Crear una ruta lazy con data y un provider scoped a la ruta.',
      tasks: [
        'Definir route data para el título.',
        'Proveer un token solo en esa ruta.',
        'Renderizar el título desde data.',
        'Verificar que el provider no existe fuera.'
      ],
      success: [
        'El título viene de data.',
        'El token scoped no se filtra.',
        'La ruta carga lazy sin romper SSR.',
        'El guard/resolver corre una vez.'
      ],
      stretch: ['Agregar prefetch opcional.', 'Probar un RenderMode diferente.']
    }
  },
  di: {
    exercise: {
      title: 'Ejercicio: token de configuración',
      goal: 'Crear un token y consumirlo con inject() en un scope de ruta.',
      tasks: [
        'Definir un token con valor por defecto.',
        'Proveerlo en una ruta específica.',
        'Consumirlo vía inject en servicio/guard.',
        'Mostrar el valor en la UI para probar el scope.'
      ],
      success: [
        'El valor cambia según la ruta.',
        'Sin inyección por constructor.',
        'El proveedor no se filtra.',
        'SSR sin errores.'
      ],
      stretch: ['Añadir factory async para el token.', 'Documentar tradeoffs.']
    }
  },
  forms: {
    exercise: {
      title: 'Ejercicio: formulario de login',
      goal: 'Crear un login con validación required/email y estado de campo.',
      tasks: [
        'Definir FormSignal con email y password.',
        'Agregar reglas required/email.',
        'Mostrar errores al tocar el campo.',
        'Deshabilitar submit si es inválido.'
      ],
      success: [
        'Errores solo tras interacción.',
        'Submit deshabilitado cuando corresponde.',
        'Señales reflejan estado de campo.',
        'Sin lógica condicional en la plantilla.'
      ],
      stretch: ['Añadir regla de longitud mínima.', 'Contador de campos dirty.']
    }
  },
  animations: {
    exercise: {
      title: 'Ejercicio: lista animada',
      goal: 'Animar entrada y salida de ítems con slide/fade.',
      tasks: [
        'Agregar animate.enter en la lista.',
        'Agregar animate.leave con fade/slide.',
        'Probar eliminación múltiple rápida.',
        'Mantener foco y contraste accesibles.'
      ],
      success: [
        'Enter/leave sin saltos.',
        'Clases se limpian al terminar.',
        'Funciona con teclado/lector.',
        'Sin parpadeos tras hydration.'
      ],
      stretch: ['Añadir transición de ruta opcional.', 'Hacer la animación configurable.']
    }
  },
  'style-guide': {
    exercise: {
      title: 'Ejercicio: auditoría de nombres',
      goal: 'Revisar un componente y alinearlo a la Guía (nombres, rutas, selectores).',
      tasks: [
        'Verificar nombres de archivos/selector.',
        'Asegurar ruta en feature folder.',
        'Usar @if/@for en lugar de *ngIf/*ngFor.',
        'Mantener OnPush y signals.'
      ],
      success: [
        'Selector con prefijo único.',
        'Archivos en la carpeta correcta.',
        'Control de flujo moderno aplicado.',
        'Sin ngClass/ngStyle.'
      ],
      stretch: ['Añadir lint rule personalizada.', 'Documentar el cambio.']
    }
  },
  tailwind: {
    exercise: {
      title: 'Ejercicio: tarjeta utilitaria',
      goal: 'Construir una tarjeta reusable con clases Tailwind concisas.',
      tasks: [
        'Crear una tarjeta con padding y borde.',
        'Extraer una utilidad compartida de layout.',
        'Aplicar estados hover/focus visibles.',
        'Verificar contraste y tamaños.'
      ],
      success: [
        'Clases concisas (sin mega-string).',
        'Utilidad compartida reutilizada.',
        'Foco visible en todos los estados.',
        'Layout se mantiene en mobile.'
      ],
      stretch: ['Agregar tema oscuro opcional.', 'Crear variante con slots.']
    }
  },
  'a11y-aria': {
    exercise: {
      title: 'Ejercicio: control accesible',
      goal: 'Añadir labels, rol y foco gestionado a un control interactivo.',
      tasks: [
        'Agregar aria-label/aria-describedby adecuados.',
        'Implementar foco visible y trapping si aplica.',
        'Probar navegación por teclado completa.',
        'Pasar un chequeo AXE básico.'
      ],
      success: [
        'Usable solo con teclado.',
        'Foco siempre visible.',
        'Labels correctos en lector.',
        'AXE sin violaciones críticas.'
      ],
      stretch: ['Mensajes de error accesibles.', 'Soportar locales en mensajes.']
    }
  },
  pwa: {
    exercise: {
      title: 'Ejercicio: aviso de actualización',
      goal: 'Detectar nueva versión y mostrar prompt accesible.',
      tasks: [
        'Escuchar actualizaciones del SW.',
        'Mostrar banner con botón de recarga.',
        'Dar rol/status accesible al banner.',
        'Probar en offline/online.'
      ],
      success: [
        'Banner solo con nueva versión.',
        'Foco puede llegar al botón.',
        'Recarga actualiza la app.',
        'Sin cachear respuestas de la API.'
      ],
      stretch: ['Diferir el aviso.', 'Registrar métricas de uso.']
    }
  },
  testing: {
    exercise: {
      title: 'Ejercicio: spec SSR-safe',
      goal: 'Escribir una prueba sin depender de window/document y que cubra loading/error.',
      tasks: [
        'Crear un componente simple con estados.',
        'Mockear httpResource o HttpClient.',
        'Evitar uso de window/document.',
        'Verificar render de loading/error/success.'
      ],
      success: [
        'La spec pasa en entorno SSR.',
        'Mocks no filtran estado global.',
        'Se cubren los tres estados.',
        'Router/harness se limpian al final.'
      ],
      stretch: ['Añadir test de concurrencia.', 'Medir cobertura mínima.']
    }
  },
  performance: {
    exercise: {
      title: 'Ejercicio: aplicar budget',
      goal: 'Definir y comprobar budgets en angular.json y optimizar un asset.',
      tasks: [
        'Ajustar budgets de bundle inicial.',
        'Marcar un asset para lazy/defer.',
        'Medir antes/después (peso/transfer).',
        'Documentar el cambio.'
      ],
      success: [
        'El build respeta el budget nuevo.',
        'El asset carga lazy/defer.',
        'Hay mejora medible en peso.',
        'No se rompe la UI.'
      ],
      stretch: ['Agregar reporter simple de tamaños.', 'Optimizar imágenes adicionales.']
    }
  },
  'custom-build': {
    exercise: {
      title: 'Ejercicio: paso de validación',
      goal: 'Añadir un paso de validación de bundle o SSR en el pipeline.',
      tasks: [
        'Definir un script de verificación.',
        'Integrarlo al flujo de build.',
        'Fallar el build si se supera un umbral.',
        'Documentar el resultado.'
      ],
      success: [
        'El build falla si el umbral se supera.',
        'El paso no alarga demasiado el tiempo.',
        'La documentación explica cuándo ajustar.',
        'SSR sigue funcionando.'
      ],
      stretch: ['Agregar cache de resultados.', 'Publicar reporte resumido.']
    }
  },
  cdk: {
    exercise: {
      title: 'Ejercicio: overlay básico',
      goal: 'Crear un overlay con trap de foco y cierre accesible.',
      tasks: [
        'Abrir/cerrar overlay con botón.',
        'Trap de foco dentro del overlay.',
        'Cerrar con Escape y click afuera.',
        'Anunciar contenido con aria-modal/aria-label.'
      ],
      success: [
        'Solo un overlay abierto a la vez.',
        'Foco vuelve al disparador al cerrar.',
        'Escape y click fuera funcionan.',
        'Compatible con lector de pantalla.'
      ],
      stretch: ['Agregar animación ligera.', 'Crear un servicio reusable de overlay.']
    }
  }
};

export function localizeCatalogItem(item: LabCatalogItem | null, locale: string): LabCatalogItem | null {
  if (!item) return null;
  const overrides = LAB_TRANSLATIONS[locale]?.catalog?.[item.id];
  return overrides ? { ...item, ...overrides } : item;
}

export function localizeLabContent(content: LabContent | null, locale: string): LabContent | null {
  if (!content) return null;
  const overrides = LAB_TRANSLATIONS[locale]?.content?.[content.id];
  const exerciseOverride = LAB_EXERCISE_ES[content.id];
  return overrides || exerciseOverride ? { ...content, ...overrides, ...exerciseOverride } : content;
}
// $localize is provided globally via polyfills (angular.json). Add type here to satisfy TS.
declare const $localize: (s: TemplateStringsArray, ...args: any[]) => string;




