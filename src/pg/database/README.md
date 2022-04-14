# `<pg-database>`

Out of all the components this is the most useful one as it controls the local cache of icon data. From a high level this component gives access to a `DatabaseService` instance.

```typescript
import '@pictogrammers/components/pgAnnoy.js';
```

## Usage

| Events | Description |
| ------ | ----------- |
| `onsync` | `event = { detail: { db } }` |
| `onerror` | `event = { detail: { message }}` |

> Note: We will try to recover and if there is no way the database is deleted and resynced. Onerror is only called on failure to serialize data not on network issues!


## Development

Understanding the data workflow will give you an idea of all the steps of syncing icon data.

```
# Set some kind of isLoading
connect -> data exists
           -> true -> onsync -> sync data -> onsync
           -> sync data -> onsync
```