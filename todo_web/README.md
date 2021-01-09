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

Ažuriramo `src/tsconfig.json` kako bi mogli koristiti apsolutne putanje kada radimo import modula te kako bi izbjegli korištenje `../../../`:

```javascript
// src/tsconfig.json
"compilerOptions": {
    "baseUrl": ".", // add only this line
    "target": "es6",
    ...
```

## Environment varijable

Instaliramo paket `dotenv` koji će nam omogućiti rad sa environment varijablama: `npm i dotenv`

Kao i kod backend-a dodat ćemo podršku za environment varijable te dodajemo sljedeći paket: `npm i dotenv`

Kreiramo u `src` dva nova file-a `.env` (sadrži definiciju naših environment varijabli te se ne verzionira) i `.env.example` (sadrži primjer varijabli koje treba postaviti u `.env`, verzionira se).

```
// src/.env
REACT_APP_API_URL=http://localhost:8000
```

```
// src/.env.example
REACT_APP_API_URL=place_your_api_url_here
```

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

Memoizacija radi tako da cache-ira vrijednosti što bi značilo da se računanje provodi samo jednom, a kod ostalih poziva se već prethodno izračunata vrijednost dohvaća iz cache-a čime se postiže ubrzanje.

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

Kako bi provjerili da sve radi ispravno pokrećemo sljedeću naredbu (koristite ju tijekom ovog tutoriala kako bi mogli provjeriti što se ispisuje u konzoli i kako se mijenja izgled stranice):

- `npm start`

Na [http://localhost:3000/](http://localhost:3000/) trebali bi vidjeti ispis `Hello from todo main app!`.

**NAPOMENA:** Kasnije kada se uključi komunikacija se serverom važno je da uz frontend server (`npm start`) bude pokrenut i backend server (`python3 manage.py runserver`).

### Props

Svaka komponenta u React-u može primati određene parametre iz svojih nadređenih komponenti te se ti parametri zovu propovi (props).

Na propove se može gledati kao da su to parametri funkcije (naša komponenta u ovom tutorialu zaista i je funkcija) koji se koriste unutar klasičnih HTML tagova.

Kako bi neki od propova mogli iskoristiti unutar našeg HTML koda potrebno ga je staviti unutar vitičastih zagrada (npr. `<p>{propName}</p>`).

Propovi se iskorištavaju u child komponentama te kako bi oni bili sinkronizirani sa podacima iz parent komponente koristiti ćemo hookove koji će nam omogućiti slušanje na njihove promjene.

Više o propovima možete pogledati [ovdje].

## Postavljanje store-a

U sklopu projekta koristit ćemo Redux Toolkit koji nam olakšava rad sa store-om, pisanje akcija, korištenje reducera.

Poštoje mnoge prakse kako najbolje organizirati Redux (ducks pattern, features pattern, ...) te ćemo u sklopu ovog tutoriala sve vezano za Redux (akcije, reducere, selectore) držati u jednom folderu (`src/store`).

Instaliramo ga pomoću sljedeće komande: `npm i @reduxjs/toolkit`

Osim samog toolkit-a potrebno je instalirati i Redux: `npm i redux react-redux @types/react-redux`

U `src/store` kreiramo direktorij za naše reducere (`reducers/`) te unutar njega `index.ts` datoteku gdje ćemo uključiti sve stvorene reducere kako bi ih kombinirali u jednu cijelinu i time izgradili naš store.

Naš `src/store/reducers/index.ts` izgleda ovako:

```javascript
import { combineReducers } from "redux";

export default combineReducers({
  // here we will be adding reducers
});
```

Konfiguraciju store-a (dodavanje reducer-a, middleware-a, ...) pišemo u `src/store/store.ts`:

```javascript
import { configureStore } from "@reduxjs/toolkit";

import reducers from "./reducers";

export default configureStore({
  reducer: reducers,
  // disable serializable check when fetching from API (use to avoid console error)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

Gore navedeni `configureStore` iz Redux Toolkit-a automatski uključuje Redux Dev Tools preko kojega možemo pratiti ponašanje naših akcija ([redux dev tools]).

Kako bi mogli raditi sa store-om potrebno je napraviti izvoz reducera i konfiguracije store-a te stvoriti u `src/store` novi `index.ts`. Iz njega radimo export svih file-ova iz `store` direktorija:

```javascript
// src/store/index.ts
export { default as reducers } from "./reducers";
export { default as store } from "./store";
```

### Povezivanje aplikacije i store-a

Kako bi aplikacija mogla komunicirati sa našim store-om u `src/index.tsx` dodajemo wrapper koji cijelu aplikaciju poslužuje sa našim store-om.

```javascript
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { TodoMain } from "./pages";
import { store } from "./store";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <TodoMain />
  </Provider>,
  document.getElementById("root")
);
```

### Akcije

Kako bi dohvatili neku vrijednost iz store-a ili kako bi komunicirali sa našim API-jem potrebno je pozvati određenu akciju koja će nam to omogućiti.

Akcije obično imaju tri stanja REQUEST, SUCCESS, FAILURE, te ovisno o navedenim stanjima korisniku prikazujemo sadržaj (npr. kada je stanje akcije tipa REQUEST korisniku se prikazuje neka vrsta loadinga, a na SUCCESS mu se prikažu određeni podaci).

Kako bi mogli komunicirati sa našim API-jem koristit ćemo `axios`: `npm i axios`

Postavljamo axios klijenta globalno na razini naše aplikacije, dodajemo `src/config.ts` sa sljedećom konfiguracijom:

```javascript
import axios from "axios";

export default {
  axios: axios.create({
    baseURL: process.env.REACT_APP_API_URL, // read API url from .env file
    headers: {
      authorization: "",
    },
  }),
};
```

Akcije ćemo pisati u sklopu reducer-a stoga više o njima u nastavku.

### Reduceri

Kako bi mogli upravljati podacima koji se dobiju nakon što se izvrši određena akcija koristimo reducere.

Na njih možemo gledati kao spremnike informacija koje dobivamo nakon izvršene akcije te se ti podaci koriste u našim komponentama.

Važno je da reduceri budu jasno nazvani (npr. reducer `todos.ts` će obrađivati podatke za sve akcije koje se izvrše, a vezane su uz todo-e).

Kreiramo naš prvi reducer `src/store/reducers/todos.ts` koji će biti zadužen za obradu rezultata akcija vezanih za todo-e.

Kako ne bi koristili hardcoded vrijednosti u kodu kreiramo u `src/constants` file `paths.ts` koji će sadržavati sve API putanje koje su nam potrebne te `interfaces.ts` gdje ćemo definirati naše interfaceove koje koristimo kroz aplikaciju.

```javascript
// src/constants/paths.ts
export default {
  API: {
    TODOS: "/todos/",
  },
};

// src/constants/interfaces.ts
export interface TodoData {
  completed?: boolean;
  created_at?: Date;
  description?: string;
  id?: number;
  label?: string;
}

export interface TodosState {
  data: Array<TodoData>;
  hasLoaded: boolean;
}

export interface TodosPayload {
  data: Array<TodoData>;
}

// src/constants/index.ts
export { default as paths } from "./paths";
```

Na početku našeg `todos.ts` reducer-a importamo sve što nam je potrebno. Koristit ćemo `slice` te `thunk` iz redux toolkit-a.

```javascript
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import config from "src/config";
import { paths } from "src/constants";

import { TodosState, TodosPayload } from "src/constants/interfaces";
```

Svaki reducer ima inicijalno stanje varijabli te ovisno o rezultatu neke akcije stanja varijabli se mijenjaju.

```javascript
const initialState: TodosState = {
  data: [],
  hasLoaded: false,
};
```

Za dohvat svih todo-a koristit ćemo `thunk` kako bi pozvali API endpoint `/todos/` pomoću konfiguriranog axios klijenta. Rezultat axios poziva vraćamo kao rezultat funkcije te naš reducer obrađuje rezultat ovisno o tipu (REQUEST, SUCCESS, FAILURE).

```javascript
const getTodos = createAsyncThunk("getTodos", async () =>
  config.axios.get(paths.API.TODOS)
);
```

Nakon uspješno izvršenog dohvata podataka sa našeg API endpointa, response se nalazi u `payload` objektu te na temelju njega ažuriramo naš state.

```javascript
const extraReducers = {
  [getTodos.pending.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: false,
  }),
  [getTodos.fulfilled.type]: (
    state: TodosState,
    { payload }: PayloadAction<TodosPayload>
  ) => ({
    ...state,
    data: payload.data,
    hasLoaded: true,
  }),
  [getTodos.rejected.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: true,
  }),
};
```

Jedino što je ostalo je povezati sve definirano pomoću slice-a te napraviti export akcija i našeg reducer-a.

```javascript
const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers,
});

export { getTodos };
export default todos.reducer;
```

Izgled našeg `todos.ts`:

```javascript
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import config from "src/config";
import { paths } from "src/constants";

import { TodosState, TodosPayload } from "src/constants/interfaces";

const initialState: TodosState = {
  data: [],
  hasLoaded: false,
};

const getTodos = createAsyncThunk("getTodos", async () =>
  config.axios.get(paths.API.TODOS)
);

const extraReducers = {
  [getTodos.pending.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: false,
  }),
  [getTodos.fulfilled.type]: (
    state: TodosState,
    { payload }: PayloadAction<TodosPayload>
  ) => ({
    ...state,
    data: payload.data,
    hasLoaded: true,
  }),
  [getTodos.rejected.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: true,
  }),
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers,
});

export { getTodos };
export default todos.reducer;
```

Ažuriramo `src/store/reducers/index.ts` tako da dodajemo naš `todos` reducer:

```javascript
import { combineReducers } from "redux";

import todos from "./todos";

export default combineReducers({
  // here we will be adding reducers
  todos,
});
```

### Selectori

Za jednostavnije upravljanje podacima iz reducer-a koristimo selectore.

Kreiramo novi direktorij `src/store/selectors` te unutar njega `todos.ts` i `index.ts`.

Radimo dohvat `data` objekta iz našeg store-a te varijable `hasLoaded` koja nam govori ako je akcija izvršena.

```javascript
// src/store/selectors/todos.ts
import { createSelector } from "@reduxjs/toolkit";

import { TodosState } from "src/constants/interfaces";

export default createSelector(
  (state: { todos: TodosState }) => ({
    hasLoaded: state.todos.hasLoaded,
    todos: state.todos.data,
  }),
  (data) => data
);

// src/store/selectors/index.ts
import todos from "./todos";

export default {
  todos,
};
```

Dodajemo defaultni export selectora iz `src/store/index.ts`:

```javascript
...
export { default as selectors } from "./selectors";
...
```

Ažuriramo `src/pages/TodoMain/index.tsx`:

Koristit ćemo `useDispatch()` i `useSelector()` hook-ove za dispatch akcije te za dohvat podataka iz kreiranog selektora.

```javascript
...
import { useDispatch, useSelector } from "react-redux";

import { selectors } from "src/store";

import { TodosState } from "src/constants/interfaces";

import { getTodos } from "src/store/reducers/todos";

const TodoMain: FC = () => {
  const dispatch = useDispatch();
  const { hasLoaded, todos } = useSelector(selectors.todos);
  ...
```

Želimo da se dohvat svih poštojećih todo-a izvrši na prvom učitavanju stranice stoga koristimo `useEffect()` hook koji će nam to omogućiti. useEffect() će se sljedeći put pozvati ili kod reload-a stranice ili kod promjene prop-a kojega postavimo u njegove dependency array (`[]`).

Koristimo `hasLoaded` varijablu te prikazujemo loader ako se akcija još nije izvršila kako se ne bi dogodilo da korisnik vidi praznu stranicu dok mu se još sa API endpointa nisu vratili svi todo-i. Ispisujemo dohvaćene todo-e u konzoli.

```javascript
...
useEffect(() => {
  dispatch(getTodos());
}, [dispatch]);

if (!hasLoaded) {
  return <div>Loading...</div>;
}

console.log(todos);
...
```

Izgled našeg page-a:

```javascript
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectors } from "src/store";

import { getTodos } from "src/store/reducers/todos";

const TodoMain: FC = () => {
  const dispatch = useDispatch();
  const { hasLoaded, todos } = useSelector(selectors.todos);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (!hasLoaded) {
    return <div>Loading...</div>;
  }

  console.log(todos);

  return (
    <div>
      <h1>Hello from todo main app!</h1>
    </div>
  );
};

export default memo(TodoMain);
```

## Kreiranje todo-a

Kako bi dodali todo potrebno je ažurirati reducer `src/store/reducers/todos.ts` i kreirati akciju koja će nam stvoriti todo. Kao parametar sada proslijeđujemo objekt `data` koji sadrži definiciju našeg todo-a.

Ažuriramo interface pošto ćemo primiti payload koji je različit od onoga kada smo imali `get` akciju:

```javascript
// src/constants/interfaces.ts
export interface TodosCreatePayload {
  data: TodoData;
}
```

```javascript
// src/store/reducers/todos.ts
...
import {
  TodoData,
  TodosCreatePayload,
  TodosPayload,
  TodosState,
} from "src/constants/interfaces";

...
const createTodo = createAsyncThunk("createTodo", async (data: TodoData) =>
  config.axios.post(paths.API.TODOS, data)
);
...
```

Kao i ranije moramo ažurirati podatke na temelju response-a iz akcije te to odradujemo u reduceru. Važno je primjetiti da u `data` sada ne spremamo cijeli response već u postojeći array dodajemo objekt kojega nam je vratila akcija - `data: [...state.data, payload.data]`.

```javascript
...
[createTodo.pending.type]: (state: TodosState) => ({
  ...state,
  hasLoaded: false,
}),
[createTodo.fulfilled.type]: (
  state: TodosState,
  { payload }: PayloadAction<TodosCreatePayload>
) => ({
  ...state,
  data: [...state.data, payload.data],
  hasLoaded: true,
}),
[createTodo.rejected.type]: (state: TodosState) => ({
  ...state,
  hasLoaded: true,
}),
...

export { createTodo, getTodos };
```

Izgled kompletiranog `src/store/reducers/todos.ts`:

```javascript
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import config from "src/config";
import { paths } from "src/constants";

import {
  TodoData,
  TodosCreatePayload,
  TodosPayload,
  TodosState,
} from "src/constants/interfaces";

const initialState: TodosState = {
  data: [],
  hasLoaded: false,
};

const getTodos = createAsyncThunk("getTodos", async () =>
  config.axios.get(paths.API.TODOS)
);

const createTodo = createAsyncThunk("createTodo", async (data: TodoData) =>
  config.axios.post(paths.API.TODOS, data)
);

const extraReducers = {
  [getTodos.pending.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: false,
  }),
  [getTodos.fulfilled.type]: (
    state: TodosState,
    { payload }: PayloadAction<TodosPayload>
  ) => ({
    ...state,
    data: payload.data,
    hasLoaded: true,
  }),
  [getTodos.rejected.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: true,
  }),

  [createTodo.pending.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: false,
  }),
  [createTodo.fulfilled.type]: (
    state: TodosState,
    { payload }: PayloadAction<TodosCreatePayload>
  ) => ({
    ...state,
    data: [...state.data, payload.data],
    hasLoaded: true,
  }),
  [createTodo.rejected.type]: (state: TodosState) => ({
    ...state,
    hasLoaded: true,
  }),
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers,
});

export { createTodo, getTodos };
export default todos.reducer;
```

Ažuriramo `src/pages/TodoMain/index.tsx` koji nam pokazuje sve todo-e. Koristit ćemo useState() hook koji će nam čuvati upisani tekst te će se na klik `ADD` gumba pozvati akcija koja će kreirati todo sa tekstom kojega smo unijeli u input.

Dodajemo dvije nove funkcije gdje jedna ažurira tekst na temelju svakog unosa korisnika te druga koja poziva akciju sa unesenim tekstom.

```javascript
const handleInputChange = useCallback((e) => setTodo(e.target.value), []);

const addTodo = useCallback(
  () => dispatch(createTodo({ label: todo, description: "Empty" })),
  [dispatch, todo]
);
```

Dodajemo nove tagove u HTML dio koji će nam renderirati input, gumb za dodavanje todo-a, listu kreiranih todo-a.

```javascript
...
<input onChange={handleInputChange} />
<button onClick={addTodo}>ADD</button>
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.label}</li>
  ))}
</ul>
...
```

Kompletirani `src/pages/TodoMain/index.tsx`:

```javascript
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectors } from "src/store";

import { TodosState } from "src/constants/interfaces";

import { createTodo, getTodos } from "src/store/reducers/todos";

const TodoMain: FC = () => {
  const [todo, setTodo] = useState("");
  const dispatch = useDispatch();
  const { hasLoaded, todos } = useSelector(selectors.todos);

  const handleInputChange = useCallback((e) => setTodo(e.target.value), []);

  const addTodo = useCallback(
    () => dispatch(createTodo({ label: todo, description: "Empty" })),
    [dispatch, todo]
  );

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (!hasLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello from todo main app!</h1>
      <input onChange={handleInputChange} />
      <button onClick={addTodo}>ADD</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default memo(TodoMain);
```

Isprobajte dodavanje novih todo-a i ne zaboravite da morate imati pokrenute servere.

## Style

Kao CSS framework u sklopu ovog tutoriala korititi ćemo Bulma CSS, te instaliramo sljedeće pakete potrebne za stiliziranje naše aplikacije:

- `npm i bulma`
- `npm i node-sass`

[function based component]: https://www.robinwieruch.de/react-function-component
[memoizaciju]: https://codeburst.io/understanding-memoization-in-3-minutes-2e58daf33a19
[redux dev tools]: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
[ovdje]: https://reactjs.org/docs/components-and-props.html
