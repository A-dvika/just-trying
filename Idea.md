Below is a concrete, side-by-side view of **(1) your current “classic Redux” folder layout, (2) a typical slice-based layout, and (3) how the code you write and import changes.**

---

## 1 ️⃣  Current layout (classic Redux)

```
src/
└─ redux/
   ├─ actions/
   │  ├─ selectedSystemsActions.ts
   │  ├─ systemsActions.ts
   │  └─ toastActions.ts
   ├─ reducers/
   │  ├─ selectedSystemsReducer.ts
   │  ├─ systemsReducer.ts
   │  ├─ toastReducer.ts
   │  └─ index.ts          ← combineReducers lives here
   └─ store.ts             ← createStore / applyMiddleware
```

**Key traits**

| 🗂️ Where you put things    | How many files per feature                                              |
| --------------------------- | ----------------------------------------------------------------------- |
| Action **types & creators** | 1 file                                                                  |
| Reducer logic               | 1 file                                                                  |
| Async thunks                | often live in the same `actions/` folder or a separate `thunks/` folder |
| Root reducer & store        | own files                                                               |

---

## 2 ️⃣  Suggested layout with `createSlice`

```
src/
├─ app/
│  └─ store.ts                 ← configureStore, typed hooks
└─ features/
   ├─ selectedSystems/
   │  └─ selectedSystemsSlice.ts
   ├─ systems/
   │  ├─ systemsSlice.ts
   │  └─ systemsThunks.ts      ← (optional) createAsyncThunk helpers
   └─ toast/
      └─ toastSlice.ts
```

🔸 **Folder-per-feature** keeps actions, reducer, and (optionally) thunks in the *same* file or directory.
🔸 No `actions/` or `reducers/` directories; slices generate those for you.
🔸 `combineReducers` disappears—`configureStore` takes an object of slice reducers.

> **Migration tip:** do this one feature at a time; the classic reducers can stay in place until converted.

---

## 3 ️⃣  Usage differences in components & tests

| What you do                  | Classic Redux                                                            | With slices                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Import an action creator** | `ts import { addSystem } from '@/redux/actions/selectedSystemsActions';` | `ts import { addSystem } from '@/features/selectedSystems/selectedSystemsSlice';`              |
| **Dispatch**                 | `dispatch(addSystem(payload));`                                          | identical – but the action creator was auto-generated, so no stray strings                     |
| **Select state**             | `const list = useSelector((s: RootState) => s.selectedSystems);`         | same – but your `RootState` now comes from `store.getState` type helper                        |
| **Immutable update**         | You write spread / concat: `return [...state, newItem];`                 | Write “mutating” code (Immer does the copy): `state.push(newItem);`                            |
| **Async API call**           | Hand-written thunk in `systemsActions.ts` with three manual action types | `createAsyncThunk('systems/fetch', async () => …)` auto-makes `pending / fulfilled / rejected` |
| **DevTools & middleware**    | Add manually                                                             | Included by default in `configureStore`                                                        |

---

### Tiny before/after code snapshot

<details>
<summary>selectedSystems — classic reducer</summary>

```ts
// reducers/selectedSystemsReducer.ts
export const ADD_SYSTEM = 'ADD_SYSTEM';
export function addSystem(sys: System) {
  return { type: ADD_SYSTEM, payload: sys };
}

const initial: System[] = [];
export default function selectedSystemsReducer(
  state = initial,
  action: AnyAction
) {
  switch (action.type) {
    case ADD_SYSTEM:
      return state.find(s => s.id === action.payload.id)
        ? state
        : [...state, action.payload];
    default:
      return state;
  }
}
```

</details>

<details>
<summary>selectedSystems — slice version</summary>

```ts
// features/selectedSystems/selectedSystemsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface System { id: string; /* … */ }
const initialState: System[] = [];

const selectedSystemsSlice = createSlice({
  name: 'selectedSystems',
  initialState,
  reducers: {
    addSystem(state, action: PayloadAction<System>) {
      if (!state.find(s => s.id === action.payload.id)) {
        state.push(action.payload);   // looks mutable—Immer clones safely
      }
    },
    removeSystem(state, action: PayloadAction<string>) {
      return state.filter(s => s.id !== action.payload);
    },
  },
});

export const { addSystem, removeSystem } = selectedSystemsSlice.actions;
export default selectedSystemsSlice.reducer;
```

</details>

---

## 4 ️⃣  Quick “why it’s better” recap for a slide or stand-up

> *Moving from the classic `actions/ + reducers/` folders to feature slices reduces boilerplate \~80 %, co-locates logic, gives us typed actions automatically, and bakes in DevTools + safer immutable updates. We can migrate slice-by-slice without breaking anything.*

Feel free to ping me for a step-by-step plan or PR template for the first slice. Good luck!
