## Week 2 Documentation: Migration Portal Project

### Conversations and Findings

#### Discussion with Harsha Jotwani

Currently, users manually copy and paste NDS names or user IDs from external CSV files into the search bar individually to select systems. This method is inefficient, particularly for bulk searches.

#### Suggested Feature Enhancement

To address this issue, the following enhancements are proposed:

* **Drag-and-Drop File Import**: Allow users to import CSV files directly into the portal.
* **File Validation**: Implement checks to ensure the uploaded file contains only NDS names or user IDs.
* **Automated Bulk Search**: Post-import, the portal automatically filters and searches, displaying relevant system details efficiently.

### Feedback from Justin Smith (Portal User)

Key feedback and requests from the user included:

* Difficulty in tracking migration status.
* Need for improved UI to schedule, monitor, and track migrations clearly.
* Necessity for a retry mechanism when migrations get stuck, alongside detailed logging to diagnose and resolve issues.
* Requirement for user-specific search capabilities, filtering by username, and an aggregation view.
* Improved cancellation workflow, specifically allowing cancellations only before approval.

### New Workflow and UI Implementation

A new workflow was designed based on user feedback, detailed through the provided images. The project's next phase involves:

* **Implementing a User-Friendly UI** using the GS UI toolkit.
* **Backend Integration**: Connecting the search system to the backend to enable real-time data retrieval and filtering.

This week focused significantly on enhancing usability, efficiency, and reliability, laying a strong foundation for an effective migration portal.
