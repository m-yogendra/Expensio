# MyTracker Database Scripts

This folder contains SQL scripts for MyTracker.

## Files
- `database_setup.sql` -> creates database/table structure
- `seed_expenses.sql` -> inserts historical expense records

## Run Scripts
From project root:

```powershell
mysql -uroot -p < database\database_setup.sql
mysql -uroot -p < database\seed_expenses.sql
```

You will be prompted for your MySQL password.

## Notes
- `seed_expenses.sql` includes:
  - `CREATE TABLE IF NOT EXISTS expenses`
  - `DELETE FROM expenses`
  - Full historical insert data
- Running seed script resets table data and re-inserts the baseline records.
- New user expenses from frontend/backend continue to be saved into the same `expenses` table.
