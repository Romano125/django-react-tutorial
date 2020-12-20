# Todo application with Redux and Typescript

## Postavljanje projekta

Nalazimo se u `/TodoApp` te pokrećemo kreiranje našeg React projekta baziranog na Typescript-u:

- `npx create-react-app todo_web --template typescript`

Kako bi krenuli sa implementacijom brišemo sve iz `/src` direktorija te ostavljamo samo `index.css` i `index.tsx`.

Unutar `/src` kreiramo sljedeće direktorije:

- `/components` - u njega ćemo stavljati komponente koje se koriste na globalnoj razini
- `/constants` - iz njega exportamo globalne konstante
- `/pages` - u njega stavljamo definicije page-va (jedna stranica je page koji se sastoji iz više komponenti)
- `/store` - u njega stavljamo definiciju store-a
- `/style` - u njega stavljamo definicije stilova na globalnoj razini
- `/utils` - iz njega exportamo pomoćne funkcije koje koristimo na globalnoj razini

## Kreiranje page-a

Kreiramo page `TodoMain` u `src/pages` koji će sadržavati polje za unos todo-a, listu svih todo-a:

- `mkdir TodoMain`

Unutar stvorenog direktorija kreiramo `index.tsx` koji sadrži cijelu logiku za taj page te unutar njega definiramo inicijalni dizajn stranice:

```javascript
import React, { FC, memo } from "react";

const TodoMain: FC = () => {
  return (
    <div>
      <h1>Hello from todo main app!</h1>
    </div>
  );
};

export default memo(TodoMain);
```

Primjetite kako u gore navedenom kodu koristimo [function based component] i [memoizaciju] kako bi ubrzali izvršavanje naših funkcija (u ovom slučaju našeg page-a jer je on zapravo funkcija).

Memoizacija radi tako da cache-ira vrijednosti što bi značilo da se računanje provodi samo jednom, a kod ostalih poziva se već prethodno izračunata vrijednost se dohvaća iz cache-a čime se postiže ubrzanje.

Kako bi page bio vidljiv potrebno je u `src/pages` kreirati `index.ts` iz kojega ćemo raditi exportove kako bi se page-vi mogli jednostavno uključiti u našem glavnom `index.tsx` u root-u projekta (`/src`).

U `src/pages/index.ts` radimo export `TodoMain` page-a:

```javascript
export { default as TodoMain } from "./TodoMain";
```

Kreirani page dodajemo u `src/index.tsx` koji sada izgleda ovako:

```javascript
import React from "react";
import ReactDOM from "react-dom";

import { TodoMain } from "./pages";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <TodoMain />
  </React.StrictMode>,
  document.getElementById("root")
);
```

Kako bi provjerili da sve radi ispravno pokrećemo sljedeću naredbu:

- `npm start`

Na [http://localhost:3000/](http://localhost:3000/) trebali bi vidjeti ispis `Hello from todo main app!`.

## Postavljanje store-a

U sklopu projekta koristit ćemo Redux Toolkit koji nam olakšava rad sa store-om, pisanje akcija, koristenje reducera.

Instaliramo ga pomoću sljedeće komande: `npm i @reduxjs/toolkit`

Osim samog toolkit-a potrebno je instalirati i Redux: `npm i redux react-redux @types/react-redux`

U `src/store` kreiramo direktorij za nase reducere (`reducers/`) te unutar njega `index.ts` datoteku gdje cemo ukljuciti sve stvorene reducere kako bi ih kombinirali u jednu cijelinu i time izgradili nas store.

Nas `src/store/reducers/index.ts` izgleda ovako:

```javascript
import { combineReducers } from "redux";

export default combineReducers({
  // here we will be adding reducers
});
```

Konfiguraciju store-a (dodavanje reducer-a, middleware-a, ...) pisemo u `src/store/store.ts`:

```javascript
import reducers from "./reducers";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: reducers,
});
```

Gore navedeni `configureStore` iz Redux Toolkit-a automatski ukljucuje Redux Dev Tools preko kojega mozemo pratiti ponasanje nasih akcija ([redux dev tools]).

Kako bi mogli raditi sa store-om potrebno je napraviti ekport reducera i konfiguracije store-a te stvaramo u `src/store` novi `index.ts` iz kojega radimo export svih file-ova iz `store` direktorija:

```javascript
// src/store/index.ts
export { default as reducers } from "./reducers";
export { default as store } from "./store";
```

### Povezivanje aplikacije i store-a

Kako bi aplikacija mogla komunicirati sa nasim store-om u `src/index.tsx` dodajemo wrapper koji cijelu aplikaciju provida sa nasim store-om.

```javascript
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store";
import { TodoMain } from "./pages";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <TodoMain />
  </Provider>,
  document.getElementById("root")
);
```

## Style

Kao CSS framework u sklopu ovog tutoriala korititi cemo Bulma CSS, te instaliramo sljedece pakete potrebne za stiliziranje nase aplikacije:

- `npm i bulma`
- `npm i node-sass`

[function based component]: https://www.robinwieruch.de/react-function-component
[memoizaciju]: https://codeburst.io/understanding-memoization-in-3-minutes-2e58daf33a19
[redux dev tools]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
