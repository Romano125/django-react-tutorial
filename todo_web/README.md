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
import React from 'react';
import ReactDOM from 'react-dom';

import { TodoMain } from './pages'

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <TodoMain />
  </React.StrictMode>,
  document.getElementById('root')
);
```

Kako bi provjerili da sve radi ispravno pokrećemo sljedeću naredbu:
* `npm start`

Na [http://localhost:3000/](http://localhost:3000/) trebali bi vidjeti ispis `Hello from todo main app!`.


## Postavljanje store-a

U sklopu projekta koristit ćemo Redux Toolkit koji nam olakšava rad sa store-om, pisanje akcija, koristenje reducera.

Instaliramo ga pomoću sljedeće komande: `npm install @reduxjs/toolkit`

[function based component]: https://www.robinwieruch.de/react-function-component
[memoizaciju]: https://codeburst.io/understanding-memoization-in-3-minutes-2e58daf33a19
