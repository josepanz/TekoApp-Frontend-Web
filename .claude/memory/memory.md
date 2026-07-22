# memory.md — tekoapp-frontend-web

> Sistema de memoria para sesiones de Claude en este proyecto.
> Al iniciar, leer: `documentation/context.md` + última sesión en `memory/sessions/`.

---

## Protocolo de inicio de sesión

Al comenzar cualquier sesión:

1. **Leer `documentation/context.md`** — estado actual del proyecto, stack, decisiones, pendientes
2. **Leer la sesión más reciente** en `memory/sessions/` (ordenar por nombre, tomar la última)
3. Confirmar: _"Retomando desde [resumen de 1 línea de dónde quedamos]"_
4. Si no existen esos archivos, crearlos con estructura vacía

---

## Protocolo de cierre de sesión

Cuando el usuario diga **"guarda sesión"** o **"compact"**:

Crear o actualizar `memory/sessions/session_N_user_accion.md` donde:

- `N` = número de sesión (incrementar del último existente)
- `user` = usuario que realizó la sesión, para no pisar numeración si trabajan varios developers
- `accion` = slug 2-3 palabras de lo hecho (ej: `scaffold_inicial`, `dominio_professionals`)

Si el usuario no lo dice y cierra la sesión/chat (Claude Code desktop o extensión VSCode), sé
proactivo y ejecutá el guardado vos.

También, proactivamente aprendé de los errores y soluciones aplicadas en cada sesión para no
repetirlas — si es posible, ajustá `rules/*.md` mientras iterás.

Sé proactivo y evaluá/reordená (archivá los viejos) las sesiones antiguas (> 5 sesiones atrás) →
`memory/sessions/archive/` (crear si no existe).

```markdown
# Sesión N — [Fecha] — [Descripción breve]

## Qué se hizo

- [Lista de cambios realizados]

## Decisiones tomadas

- [Por qué X sobre Y]

## Archivos modificados

- `ruta/archivo.ext` — descripción del cambio

## Próximos pasos

- [ ] Tarea pendiente 1

## Estado al cerrar

[1-2 líneas describiendo en qué punto quedó todo]
```

---

## Triggers automáticos

| Trigger                     | Acción                                                          |
| --------------------------- | --------------------------------------------------------------- |
| "nueva regla: ..."          | Agregar a `rules/*.md` correspondiente                          |
| "recuerda que siempre..."   | Agregar a `rules/*.md`                                          |
| "corrige esto..."           | Agregar corrección a `rules/*.md`                               |
| "guarda sesión" / "compact" | Crear archivo de sesión + actualizar `documentation/context.md` |
| "¿qué hicimos?"             | Leer y resumir la última sesión                                 |
| "¿dónde quedamos?"          | Leer `documentation/context.md` + última sesión y responder     |

---

## Estructura de archivos de memoria

```
.claude/
├── CLAUDE.md                   ← dominio + arquitectura + reglas críticas
├── agents/                     ← agentes especializados (code-reviewer, testing, tdd-refactor, design-system)
├── rules/                      ← reglas por categoría (typescript, test, design-system, infra)
├── documentation/
│   ├── context.md              ← estado vivo del proyecto (actualizar por sesión)
│   └── architecture.md         ← razonamiento profundo (BFF/auth, tokens) — no se carga automáticamente
└── memory/
    ├── memory.md                ← este archivo: protocolo de memoria
    └── sessions/                ← historial de sesiones (session_N_accion.md)
        └── archive/              ← sesiones viejas, > 5 atrás
```

---

## Economía de tokens

- Archivar sesiones antiguas (> 5 atrás) → `memory/sessions/archive/`
- `context.md` no debe superar 150 líneas — resumir agresivamente
- Al hacer "compact": resumir historial en la sesión y limpiar lo redundante
- Nunca copiar código completo en archivos de sesión — solo referencias a archivos y cambios
