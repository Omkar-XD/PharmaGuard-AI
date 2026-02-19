# Pharmacode Frontend

## Overview

The **Pharmacode Frontend** is a React-based user interface developed as part of a team project.
It provides an interactive workflow for uploading pharmaceutical/medical data, triggering analysis, and presenting structured results with risk severity indicators.

The application follows a multi-page flow to guide users from data submission through processing to final result visualization.

---

## Key Features

* Structured multi-step analysis workflow
* File upload and validation interface
* Real-time processing feedback with loaders
* Risk severity visualization
* JSON response inspection for transparency
* Modular component-based architecture
* REST API integration layer

---

## Technology Stack

* **Framework:** React (Create React App)
* **Language:** JavaScript (ES6+)
* **Styling:** CSS
* **Architecture:** Component-driven design
* **Communication:** REST API

---

## Project Structure

```
frontend/
 ├── src/
 │   ├── components/
 │   │   ├── JsonViewer.js
 │   │   ├── Loader.js
 │   │   ├── ResultCard.js
 │   │   ├── RiskSeverityMeter.js
 │   │   └── UploadForm.js
 │   │
 │   ├── pages/
 │   │   ├── LandingPage.js
 │   │   ├── AnalyzePage.js
 │   │   ├── ProcessingPage.js
 │   │   └── ResultsPage.js
 │   │
 │   ├── api.js
 │   ├── App.js
 │   └── index.js
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd pharmacode-main/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

---

## Build for Production

```bash
npm run build
```

This generates an optimized production build in the `build/` directory.

---

## Running Tests

```bash
npm test
```

---

## API Configuration

All backend communication is handled through:

```
src/api.js
```

Update the base API URL as required for your environment.

Example:

```js
const BASE_URL = "http://localhost:8000";
```

---

## Application Workflow

1. **Landing Page** – Entry point and navigation
2. **Analyze Page** – User uploads input data
3. **Processing Page** – Displays loader while analysis runs
4. **Results Page** – Presents structured output and risk severity indicators

---

## Future Enhancements

* Authentication and user management
* Improved error handling and validation
* Result persistence and history tracking
* Export functionality (PDF/CSV)
* Responsive UI improvements

---

## Team

This project was developed collaboratively as part of an academic/team initiative.

---
