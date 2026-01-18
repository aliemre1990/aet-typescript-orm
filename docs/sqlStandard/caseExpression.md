# SQL CASE Expression

A `CASE` expression is a conditional statement in SQL that allows you to implement if-then-else logic within queries. It evaluates conditions and returns different values based on which condition is met.

## Two Syntax Types

### Simple CASE
Compares a single expression against multiple values:

```sql
CASE expression
  WHEN value1 THEN result1
  WHEN value2 THEN result2
  ELSE result_default
END
```

**Example:**
```sql
SELECT 
  car_id,
  CASE status
    WHEN 'available' THEN 'Ready to Rent'
    WHEN 'rented' THEN 'Currently Rented'
    WHEN 'maintenance' THEN 'Under Maintenance'
    ELSE 'Unknown'
  END AS car_status
FROM cars;
```

### Searched CASE
Evaluates multiple conditions (more flexible):

```sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE result_default
END
```

**Example:**
```sql
SELECT 
  car_id,
  rental_price,
  CASE
    WHEN rental_price > 100 THEN 'Premium'
    WHEN rental_price BETWEEN 50 AND 100 THEN 'Standard'
    WHEN rental_price < 50 THEN 'Budget'
    ELSE 'Unpriced'
  END AS price_category
FROM cars;
```

## Key Points

- `CASE` is evaluated sequentially—the first matching `WHEN` is returned
- The `ELSE` clause is optional (defaults to `NULL` if omitted)
- Can be used in `SELECT`, `WHERE`, `ORDER BY`, and other clauses
- Works with aggregation functions: `SUM(CASE WHEN ... THEN 1 ELSE 0 END)`