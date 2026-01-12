# SQL Comparison Operations

Here are the common comparison operations used in SQL:

1. **Equality & Inequality**
   - `=` (Equal to)
   - `!=` or `<>` (Not equal to)

2. **Relational Comparisons**
   - `<` (Less than)
   - `>` (Greater than)
   - `<=` (Less than or equal to)
   - `>=` (Greater than or equal to)

3. **Membership Testing**
   - `IN` (Value exists in a list)
   - `NOT IN` (Value doesn't exist in a list)

4. **Pattern Matching**
   - `LIKE` (Pattern matching with wildcards)
   - `NOT LIKE` (Inverse pattern matching)

5. **NULL Checking**
   - `IS NULL` (Value is null)
   - `IS NOT NULL` (Value is not null)

6. **Range Testing**
   - `BETWEEN` (Value within a range)
   - `NOT BETWEEN` (Value outside a range)

7. **Logical Operators** (Often used with comparisons)
   - `AND` (All conditions must be true)
   - `OR` (At least one condition must be true)
   - `NOT` (Negates a condition)

8. **Set Operations**
   - `EXISTS` (Checks if subquery returns rows)
   - `NOT EXISTS` (Checks if subquery returns no rows)

Based on your code, I can see you're implementing the `NOT IN` operation in your query builder library. The `comparisonOperations` object in your codebase likely contains references to these operations.