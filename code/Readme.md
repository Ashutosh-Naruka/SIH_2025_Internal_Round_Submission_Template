## Tasks Accomplished

- [x] **Mobile App Development (React Native + Expo):**
   •	Implemented citizen-facing mobile app screens:
	•	New issue reporting (camera + GPS auto-tag + text/voice input)
	•	Issue description and evidence upload
	•	Real-time issue status updates
	•	Integrated Expo features for camera, location, and notifications.
	•	Connected app with Firebase for storing images, metadata, and real-time updates.
	•	Implemented duplication detection logic and AI-based priority scoring integration.
	•	Enabled user feedback system to rate resolution and track satisfaction.
- [x] **Admin Dashboard (Web):**
   •	Designed real-time dashboard for monitoring civic issues with:
	•	Map visualization of reported issues
	•	Analytics for issue severity and duplication
	•	SLA-driven alerts for priority issues
	•	Integrated Firebase Firestore for real-time synchronization of citizen reports.
	•	Created workflow for issue verification, automatic department routing, and status updates.
	•	Developed resolved issue photo verification system for civic workers and admin.
- [x] **AI/Automation Features**
   •	Implemented AI engine to:
	•	Classify issues by type and severity
	•	Remove duplicate reports
	•	Assign priority scores to issues
	•	Enabled predictive hotspot engine using on-device ML for anticipating high-priority areas.
	•	Calculated estimated repair costs automatically based on issue category and duplicates.
- [x] **GIS & Mapping Integration**
   •	Integrated Mapbox for visualizing reported issues on interactive maps.
	•	Enabled GPS tagging and mapping for mobile and dashboard.
	•	Optimized routing for field crews based on AI-generated optimal paths.
- [x] **Backend & Data Handling**
   •	Set up Firebase storage for images and metadata.
	•	Configured Firestore real-time sync for instant updates between mobile app and dashboard.
	•	Automated JSON payload generation for department API endpoints.
	•	Ensured secure and transparent handling using blockchain-based immutable audit trail (conceptual/prototype).
- [x] **Testing & Deployment**
	•	Conducted end-to-end testing for mobile app and admin dashboard workflow.
	•	Verified real-time synchronization, duplication detection, and status updates.
	•	Tested mobile and web integration with Firebase backend.



## Technology Stack

This project leverages the following technologies:

- **[React.js](https://react.dev/):** A powerful JavaScript library for building fast and interactive web user interfaces, especially single-page applications.
- **[React Native](https://reactnative.dev/):**  A framework for building native mobile apps using React, allowing code reuse across iOS and Android.
- **[Expo](https://expo.dev/):** A platform and toolchain built on top of React Native for faster app development, testing, and deployment without native setup hassle.
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript):** The core programming language for building dynamic web and mobile applications.
- **[Google Firestore](https://firebase.google.com/products/firestore):** A scalable cloud NoSQL database that provides real-time data synchronization for web and mobile apps.
- **[Mapbox](https://www.mapbox.com/):** A location data platform that provides customizable maps, navigation, and geospatial functionalities for applications.


## Key Features

- **Feature 1:** Civic Workers send resolved issue’s photo to admin dashboard for verification
- **Feature 2:** Resource Optimization using AI to calculate optimal routes
- **Feature 3:** Offline Mesh Reporting System for remote and low-connectivity areas
- **Feature 4:** Predictive Hotspot Engine through on- device machine learning model
- **Feature 5:** Blockchain Immutable Audit Trail for complete citizen-authority transparency

## Local Setup Instructions (Write for both windows and macos)

Follow these steps to run the project locally

1. **For running mobile app**
   ```bash
   git clone https://github.com/Ashutosh-Naruka/SIH-FINAL-dual-
   cd mobile app 
   npm install -g expo-cli
   npm install
   npx expo start
   ```
2. **For running web app**
   ```bash
   git clone https://github.com/Ashutosh-Naruka/SIH-FINAL-dual-
   cd dashboard  
   npm install
   npm start
   ```


