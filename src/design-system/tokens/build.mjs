// Genera src/design-system/tokens/theme.generated.css a partir de tokens.json.
// Correr con `pnpm tokens:build`. NO editar theme.generated.css a mano — se sobreescribe.
//
// Nota sobre tipografía: `typography.fontFamily` en tokens.json es la fuente de verdad
// conceptual, pero la carga real de fuentes (next/font) vive en src/app/layout.tsx porque
// Next.js necesita generar sus propias variables CSS (--font-geist-sans, etc). Si cambiás
// las fuentes acá, actualizá layout.tsx a mano para que coincidan (ver rules/design-system.md).
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'css/teko-theme',
  format: ({ dictionary }) => {
    const primitives = [];
    const light = [];
    const dark = [];
    let radius = null;

    for (const token of dictionary.allTokens) {
      const path = token.path;
      const value = token.value ?? token.$value;

      if (path[0] === 'radius' && path[1] === 'base') {
        radius = value;
        continue;
      }

      if (path[0] === 'theme') {
        const varName = path[path.length - 1];
        const line = `  --${varName}: ${value};`;
        if (path[1] === 'light') light.push(line);
        else if (path[1] === 'dark') dark.push(line);
        continue;
      }

      if (path[0] === 'color') {
        // color.brand.primary.500 -> --teko-primary-500 · color.semantic.danger -> --teko-danger
        const rest = path.slice(1).filter((segment) => segment !== 'brand');
        primitives.push(`  --teko-${rest.join('-')}: ${value};`);
      }
    }

    return [
      '/* GENERADO por `pnpm tokens:build` a partir de tokens.json — no editar a mano. */',
      ':root {',
      radius ? `  --radius: ${radius};` : null,
      ...primitives,
      ...light,
      '}',
      '',
      '.dark {',
      ...dark,
      '}',
      '',
    ]
      .filter((line) => line !== null)
      .join('\n');
  },
});

const sd = new StyleDictionary({
  source: ['src/design-system/tokens/tokens.json'],
  platforms: {
    css: {
      transforms: [],
      buildPath: 'src/design-system/tokens/',
      files: [
        {
          destination: 'theme.generated.css',
          format: 'css/teko-theme',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
