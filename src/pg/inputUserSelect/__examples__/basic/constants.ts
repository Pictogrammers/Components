import { User } from "./../../../shared/models/user";

const AVATAR = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAasSURBVHhe7Z1taFZlGMevHNN9SDEFM0KXWakgpWWmaep8mW6+LHtjHxphkBDVF4kk0IjyiwV9iIgISWRJgzILQ2s5p8t3DJcYJn0oX+ZUcLqpNR26nv9zrnvPOfee7Xk79zkXcf3g4bmv52ye2/O7z32u+74e8Y4FM6u6SRHDAH5XhKBChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChKFChBH7P9h5Z91qGjX6Xo6IGur3UN2XWzhyyyuvvkRTpz/GEdGZ0y303pr1HMVDrHdI6X2jaObs6VQ6ZnTPq+q5xTRggPtuDSoZREufqQicO9mXRJ/iJFYhS5dXcivF8OHDkhfGNeUVc6mkpISjFOn6FCWxCSkuLqay+U9xFGRB4mK5BkLSgT6hb3ERm5DpM6fS4CF3ckR06dJlbhFNmTqJhg2/i6PwwbQ0bsKDHHnPDgP6hL7FRWxCli6v4JbH7p1N3CIqKiqixcsWchQ+i5bM55ZH/Y5d3PKw+xYlsQi5e+QIemTyRI6Ifjt6nPY2HeTIo68ppVAwHZVXzOOIqLOzk7Zt3Z58N6Bv6GMcxCLEvtgYob8fO0EXWi/yJwlp94yghyelpIWFPVU2Ne6nf67/m3z342pAZCJyIUhpK6vKOfJGaFPjvmTbnjqWJdLSsLEThvrt3jnNuwF9jCL9ton8jFOemJxMbQ0YmTc6byTbtpBpMxKjeXBqNBcKpiEkDAbckceajyfbePffoegj+ho1kQvpNV35RuaF8xeTzxPDwIHFNKeP1DgfcG4kDAZ7ANhxHNNWpEKQys6YNY0jpLptPSPU0GvaCnGhZl/gxoZUZgfsGH11mX6nI1Ih88rnBEborp/2cCsFnif+jKd0TGLNMD61ZsgXJAhIFAwnT/xJZ0+f48gDMT43oK/oc5REKqTXdGXdDQDPEzvjCWPlbicI6c4N4p62IhOCEYrRbsBIPPX3GY6C2BlPeWVZcjMwX5AYIEEw3LzZlViI/sJREHyO4wb02UX63ReRCSmvzHx3GPBcOfVXShY2AWeVzeAod5AYIEEwHNx3mK5evcZREHyO437svrskEiEY3bPKnuSo/xFqCHPqyGaq9GMfR98LuUNzIRIhuCD+re7+RqihoX433bp1iyNvOyOfWsUDD90f2EhEZnfk0FGO0oPj+DkD+h7VsyQyIX4yjVDQdukyHTnczJFHPhdl0eIF3PJAZnf79m2O0oPjdgb4vxFib3VnM0INP1vi5i6cndN2RrqaSzaDAdg/h79DFNVE50LsClzzkWPJGjr+cple51paA2uSXKuJ9kaiqXukO5f9Av46CYiimuj0Sw4YoXXfbQxclEI5dOBXWvvW+xz1z4cfrwts8xfK1Y5rVP30CurqSqXFYeP0DrFHaBhkW020ay5hEEU10akQF5W3bKuJrh7CrquJzqYsjNDarz/nyFt7rHrt7Z6t9lyYt3AOVb/4LEfetnnNCys56g0e/JvqPgvsXX20/hM6cfwkR9kzYeI4WrX6dY48ap5fmdyZdoEzITUrqqnm5WqOcpv7bTBFbd6yIbAx+eYba3rtFBvw5bd1H6zliOjKlXaqrlqRMd1NB+Ru/nZDoIZT+0Ud1W6s4yhcnExZdlUQ2ClsLqRbk/RXTbSnq6Zd+/OSAfB727+v58jDZTXRyZ9qVwWRuh7YG9wfyhVbaF/VRHsjERQyGIC9JnFZTXQipNcIbdxfcKoIoUg7DX1VE7FV799IxFri5B+pGkc+2JVM4CppCF2IXRUE5ksMhQCh9TsaOPJIV02sWBLcKsm0iZkt27bu4JaHq2pi6ELsqiAeqNlulWTixx92csvDriai7a+5gGy3SjJh36GuqomhCwnzgWqDgpa/xAr81US7sohpJqz0FHdoo3W3uZi2QhViVwVBoQ9UG3vEm2oiXmj78X89NQzwDUc/LqqJRWNHj3+X2wWDETN06BBqT0xTeGFEf1X7DR8Nh9aW8/T4tEepo70jeY7r165Ty9lWGplYBGLKMudua7tMGz7dlFiQ3uTfLJz2Kx00ZmwpdXd395wHC92+1kP5oP/lkTCcpL1K/qgQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQURD9B1WpU64ZforRAAAAAElFTkSuQmCC';

export const users: User[] = [
  {
    "id": "14ea5584-07e3-11e4-bf19-842b2b6cfe1b",
    "base64": AVATAR,
    "name": "First Last 1",
    "twitter": "templarian",
    "github": "Templarian",
    "website": "http://templarian.com",
    "iconCount": 1000
  },
  {
    "id": "24ea5584-07e3-11e4-bf19-842b2b6cfe1b",
    "base64": AVATAR,
    "name": "First Last 2",
    "twitter": "templarian",
    "github": "Templarian",
    "website": "http://templarian.com",
    "iconCount": 0
  },
  {
    "id": "34ea5584-07e3-11e4-bf19-842b2b6cfe1b",
    "base64": AVATAR,
    "name": "First Last 3",
    "twitter": "templarian",
    "github": "Templarian",
    "website": "http://templarian.com",
    "iconCount": 9999
  }
].map(u => new User().from(u as any));