# Branding — qué está centralizado y qué no

Este documento cubre los 2 frontends (`TekoApp-Frontend-Web` y `TekoApp-Frontend-Mobile`). El
backend no tiene ningún concepto de branding — es puramente visual/de producto, vive en los
clientes.

## Ya centralizado (cambiar en un solo lugar)

| Qué                                                     | Dónde                                                                                                 | Repo                                |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Color de marca (primary/accent/neutral, claro y oscuro) | `src/design-system/tokens/tokens.json` → `color`/`theme`                                              | Web (fuente única, Mobile la reusa) |
| Tipografía                                              | `tokens.json` → `typography`                                                                          | Web                                 |
| Radios                                                  | `tokens.json` → `radius`                                                                              | Web                                 |
| **Nombre de la app (texto visible en runtime)**         | `tokens.json` → `content.appName`, expuesto vía `src/design-system/tokens/brand.ts` (`BRAND_NAME`)    | Web                                 |
| **Nombre de la app (texto visible en runtime)**         | `lib/l10n/{es,en}.arb` → `appTitle`, usado vía `onGenerateTitle` en `lib/app.dart`                    | Mobile                              |
| Rutas de logo/banner                                    | `tokens.json` → `content.logoPath`/`bannerPath` (`BRAND_LOGO_PATH`/`BRAND_BANNER_PATH` en `brand.ts`) | Web                                 |

`content` en `tokens.json` **no** pasa por `pnpm tokens:build` (es texto/rutas, no CSS) — se
consume importando `brand.ts` directo. Cambiar el nombre ahí actualiza automáticamente: el
`<title>` de todas las páginas (`layout.tsx`, `perfil/page.tsx`), el label de marca en el sidebar
de los 3 modos (admin/pro/cliente, vía interpolación `{brand}` en `messages/{es,en}.json`), y el
título de la pantalla de login.

**Mobile no comparte `tokens.json` para el nombre** — su `appTitle` vive en su propio `.arb`
(mismo mecanismo de una sola fuente, pero no la misma fuente que Web). Si el nombre cambia, hay
que actualizar los 2 lugares (Web `tokens.json` + Mobile `.arb`) — no hay sincronización
automática entre repos hoy.

## NO centralizable — requiere edición manual, archivo por archivo

Esto es así por límites reales de las plataformas, no por falta de tiempo de implementarlo:

### Web

- **`public/brand/logo.png`, `public/brand/banner.png`, `src/app/favicon.ico`**: son binarios.
  Rebrandear de verdad significa reemplazar estos 3 archivos — ningún mecanismo de config puede
  evitarlo. `favicon.ico` en particular sigue la convención de archivo estático de Next.js
  (`app/favicon.ico`), no una ruta configurable.
- Comentarios de código y nombres de paquete (`package.json`) que dicen "TekoApp" — cosméticos,
  sin impacto funcional, no vale la pena parametrizarlos.

### Mobile — el caso real difícil

El nombre de la app está repetido a mano en **6 archivos de configuración nativa/build**, todos
identificadores que Android/iOS/las stores tratan como parte de la IDENTIDAD de la app, no como
texto de UI:

| Archivo                                                             | Campo                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `pubspec.yaml`                                                      | `name:` (nombre del paquete Dart), `description:`                         |
| `android/app/build.gradle.kts`                                      | `namespace`/`applicationId` (`py.com.tekoapp.mobile`)                     |
| `android/app/src/main/AndroidManifest.xml`                          | `android:label`                                                           |
| `android/app/src/main/kotlin/py/com/tekoapp/mobile/MainActivity.kt` | paquete Kotlin (ruta de carpetas incluida)                                |
| `ios/Runner/Info.plist`                                             | `CFBundleDisplayName`, `CFBundleName`                                     |
| `ios/Flutter/AppFrameworkInfo.plist`                                | placeholder de Flutter (`"App"`) — no tocar, no es específico de esta app |

**Por qué esto no se puede centralizar en runtime**: `applicationId` (Android) y el bundle ID
(iOS) son la clave primaria con la que Google Play / App Store identifican la app publicada.
Cambiarlos DESPUÉS de publicar no es un rebrand — es publicar una app nueva desde cero (pierde
reviews, instalaciones existentes, y la asociación con la key de firma de Play App Signing). Antes
de tocar cualquiera de estos 6 archivos con una app ya publicada, confirmar explícitamente si la
intención es "cambiar cómo se ve" (nombre/ícono visible, seguro) o "cambiar qué app es" (bundle
ID/applicationId, irreversible una vez publicado).

**Proceso recomendado para un rebrand real de Mobile** (antes de publicar, o aceptando que es una
app nueva si ya está publicada):

1. Elegir el nuevo nombre/paquete.
2. Actualizar los 6 archivos de la tabla — a mano, no hay script todavía (podría agregarse uno si
   este proceso se repite más de una vez; hoy no existe porque nunca se ejecutó).
3. Actualizar `appTitle` en `lib/l10n/{es,en}.arb`.
4. Reemplazar `brand/logo.png`, `brand/banner.png`.
5. Actualizar `tokens.json` (Web) si el nombre/color de marca también cambia ahí.
6. `flutter clean` + rebuild completo (Android Studio/Xcode pueden cachear el `applicationId`/
   bundle ID viejo si no se limpia).
