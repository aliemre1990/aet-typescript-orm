 This causes infinite loop

```typescript
 function generateParamFn<
     TDbType extends DbType
 >(dbType: TDbType) {
     return <
         TName extends string,
         TValueType extends DbValueTypes | null = any
     >(
         name: TName
     ) => {
         return new QueryParam<TDbType, TName, TValueType>(name);
     }
}
```

When generic parameter provided in generator function, it causes infinite loop if QueryParam type uses that generic parameter inside it.

Instead do:

```typescript
function generatePgParamFn() {
    return <
        TName extends string,
        TValueType extends DbValueTypes | null = any
    >(
        name: TName
    ) => {
        return new QueryParam<PgDbType, TName, TValueType>(name, dbTypes.postgresql);
    }
}

function generateMySQLParamFn() {
    return <
        TName extends string,
        TValueType extends DbValueTypes | null = any
    >(
        name: TName
    ) => {
        return new QueryParam<MySQLDbType, TName, TValueType>(name, dbTypes.postgresql);
    }
}
```

Write generator for each db type to overcome infinite loop.

Or keep current function and explicitly type functions for each db type like this

```typescript
type PgParamFn = ReturnType<typeof generateParamFn<PgDbType>>;
type MySqlParamFn = ReturnType<typeof generateParamFn<MySQLDbType>>;
```