# Shared

The shared directory is where all the utilities, models, and data services live.

## Database Service

```ts
import { DatabaseService } from '../shared/databaseService';

const db = new DatabaseService();

await db.sync();
```

| Method | Description |
| -------| ----------- |
| `db.synced` | `true` if database has been synced. |
| `db.sync()` | Calling multiple times do nothing. |
| `db.resync()` | Ignores `synced` and verifies local cache |
| `db.delete()` | Delete all local cache |
| `db.getIconByName(fontId, name)` | Get single icon data |
| `db.geticons(fontId[, term])` | Get all icons in a font with search term |

> Note: All data is parsed into models. This can take a second, so data needs to be cached once pulled from the database.

## Toast

Reference the toast documentation.