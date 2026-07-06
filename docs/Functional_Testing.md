# Functional Testing

## Credit Score Analyzer

| Test Case | Input | Expected Result | Status |
|-----------|------:|-----------------|:------:|
| TC-01 | 780 | Excellent | ✅ Pass |
| TC-02 | 700 | Good | ✅ Pass |
| TC-03 | 500 | Poor | ✅ Pass |
| TC-04 | 250 | Validation Error | ✅ Pass |
| TC-05 | Empty Input | Validation Error | ✅ Pass |

---

## EMI Calculator

| Test Case | Input | Expected Result | Status |
|-----------|--------|----------------|:------:|
| TC-01 | ₹5,00,000, 8.5%, 60 Months | EMI Calculated Successfully | ✅ Pass |
| TC-02 | Empty Loan Amount | Validation Error | ✅ Pass |
| TC-03 | Loan Tenure = 0 | Validation Error | ✅ Pass |
| TC-04 | Empty Loan Tenure | Validation Error | ✅ Pass |

---

## Conclusion

## Conclusion

Functional testing was performed on the Credit Score Analyzer and EMI Calculator modules.

All test cases passed successfully, including valid inputs, invalid inputs, and validation scenarios. The application correctly performed calculations, displayed accurate results, and handled user input validation without errors.

The application meets the expected functional requirements.