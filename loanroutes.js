const express = require('express');
const router = express.Router();


router.post('/calculate', (req, res) => {
    const { 
        principal, 
        interestRate, 
        years, 
        currentLandCost, 
        futureLandValue, 
        homeValue, 
        homeDepreciationRate 
    } = req.body;

    try {
      
        if (
            (principal !== undefined && (typeof principal !== 'number' || principal <= 0)) ||
            (interestRate !== undefined && (typeof interestRate !== 'number' || interestRate < 0)) ||
            (years !== undefined && (typeof years !== 'number' || years <= 0)) ||
            (currentLandCost !== undefined && (typeof currentLandCost !== 'number' || currentLandCost <= 0)) ||
            (futureLandValue !== undefined && (typeof futureLandValue !== 'number' || futureLandValue <= 0)) ||
            (homeValue !== undefined && (typeof homeValue !== 'number' || homeValue <= 0)) ||
            (homeDepreciationRate !== undefined && (typeof homeDepreciationRate !== 'number' || homeDepreciationRate < 0))
        ) {
            return res.status(400).json({ error: 'Invalid input values. Ensure all inputs are positive numbers.' });
        }

        let response = {};

        
        if (principal !== undefined && interestRate !== undefined && years !== undefined) {
            const monthlyInterestRate = interestRate / 100 / 12;
            const numberOfPayments = years * 12;
            const monthlyPayment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
            const totalPayment = monthlyPayment * numberOfPayments;
            const totalInterest = totalPayment - principal;

            response.loanDetails = {
                monthlyPayment: monthlyPayment.toFixed(2),
                totalPayment: totalPayment.toFixed(2),
                totalInterest: totalInterest.toFixed(2)
            };
        }

     
        if (currentLandCost !== undefined && futureLandValue !== undefined && homeValue !== undefined && homeDepreciationRate !== undefined) {
            const landAppreciation = futureLandValue - currentLandCost;
            const landAppreciationRate = (landAppreciation / currentLandCost) * 100 / years;

            const futureHomeValue = homeValue * Math.pow(1 - homeDepreciationRate / 100, years);
            const homeDepreciation = homeValue - futureHomeValue;

            response.propertyDetails = {
                landAppreciationRate: landAppreciationRate.toFixed(2),
                homeDepreciation: homeDepreciation.toFixed(2),
                homeDepreciationRate: homeDepreciationRate.toFixed(2) // 
            };
        }

       
        res.json(response);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'An error occurred while calculating values.' });
    }
});

module.exports = router;

