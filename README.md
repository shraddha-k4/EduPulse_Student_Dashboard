# EduPulse — Student Academic Performance Dashboard

A responsive, browser-based dashboard inspired by the supplied Python practical for student academic performance and dropout-risk analysis.

## Run it
1. Extract the ZIP.
2. Open `index.html` in Chrome or Edge.
3. Click **Import CSV** and select `student_dropout_risk_2026.csv` (or another CSV with compatible columns).

The dashboard reads CSV files locally in the browser using Papa Parse and renders charts with Chart.js. Internet access is needed for those CDN libraries and the Google font.

## Pages
- Overview: key metrics, GPA trend, student status, attendance distribution, quick insights
- Students: searchable/filterable student records
- Analytics: grade distribution, attendance-vs-GPA scatter plot, attendance comparison, basic data-quality checks
- Dropout risk: transparent heuristic support flags based on attendance and semester GPA

## Expected CSV columns
Uses fields from the supplied Python script, especially `person_id`, `age`, `admission_grade`, `attendance_rate`, `gpa_semester_1`, `gpa_semester_2`, `missed_deadlines`, and `dropout`.

## Important
The included initial figures are illustrative demo records, not real student data. This is a frontend dashboard, not a port of the Python scikit-learn training pipeline. The dropout-risk page uses simple rules for review and must not be treated as a definitive prediction. To run the actual Linear Regression and Logistic Regression models from the Python practical, connect this frontend to a Python API (for example, Flask or FastAPI).
