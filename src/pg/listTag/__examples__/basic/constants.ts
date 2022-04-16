import { Tag } from "../../../shared/models/tag";

export const tags = [
  new Tag().from({
    id: 'uuid1',
    name: 'test 1',
    url: 'test-1',
    count: 42
  }),
  new Tag().from({
    id: 'uuid2',
    name: 'test 2',
    url: 'test-2',
    count: 12
  }),
  new Tag().from({
    id: 'uuid3',
    name: 'test 3',
    url: 'test-3',
    count: 0
  })
]