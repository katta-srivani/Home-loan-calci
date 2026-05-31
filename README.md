# Home Loan Calculator

Full-stack home loan calculator with an Express API and static frontend.

## Features

- EMI calculation
- Total payment and total interest
- Land appreciation rate
- Home depreciation estimate
- Principal vs interest visual split
- First 12-month payment schedule preview
- Responsive frontend served directly from Express

## Run Locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## API

```text
POST /api/loans/calculate
```

Example body:

```json
{
  "principal": 5000000,
  "interestRate": 8.5,
  "years": 20,
  "currentLandCost": 2500000,
  "futureLandValue": 4500000,
  "homeValue": 3000000,
  "homeDepreciationRate": 2
}
```
