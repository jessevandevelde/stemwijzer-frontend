# Stemwijzer frontend

Angular-frontend voor de openbare StemWijzer. Bezoekers beantwoorden dertig stellingen en krijgen daarna hun partijmatches en vergelijkingsspectrum te zien.

## Starten

Installeer Node.js volgens `.node-version` en voer daarna uit:

```sh
npm install
npm start
```

De ontwikkelserver draait op `http://127.0.0.1:4200`. De proxy stuurt verzoeken naar `/statements`, `/matching` en `/parties` door naar de backend op `http://127.0.0.1:3000`.

## Controles

- `npm run build`: maakt een productiebuild.
- `npm run typecheck`: controleert TypeScript zonder output te maken.
- `npm run eslint`: controleert TypeScript en Angular-templates met dezelfde regels als BetterJams. Angular-selectors gebruiken de prefix `stw`.
- `npm run eslint:fix`: past veilige ESLint-correcties toe.
- `npm run stylelint`: controleert CSS met dezelfde stijlregels als BetterJams.
- `npm run lint`: voert ESLint en Stylelint achter elkaar uit.
- `npm test`: voert de Angular-tests eenmalig uit zodra die zijn toegevoegd.

## Structuur

De frontend bevat alleen de bestanden die door de huidige vragenlijst en uitslag worden gebruikt:

```text
src/
  app/
    app.component.html
    app.component.ts
    app.routes.ts
    stemwijzer-page/
    types/
  styles/
    reset.css
    variables.css
  index.html
  main.ts
  styles.css
```
