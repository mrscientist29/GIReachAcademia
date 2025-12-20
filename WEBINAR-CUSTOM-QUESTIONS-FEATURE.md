# Webinar Multiple Custom Questions & Optional Experience Field

## Overview
Enhanced the webinar system to allow admins to add multiple custom questions with add/remove functionality and make the "Years of Experience" field optional in registration forms.

## Features Added

### 1. Multiple Custom Questions System
- **Admin Side**: Admins can add unlimited custom questions with "+" button
- **Question Management**: Each question can be edited, marked as required, or deleted
- **User Side**: All custom questions appear dynamically in the registration form
- **Data Storage**: All custom question answers are stored with registration data
- **Required Fields**: Questions can be marked as required with validation

### 2. Optional Experience Field
- **Admin Control**: Toggle switch to include/exclude "Years of Experience" field
- **Dynamic Form**: Registration form only shows experience field when enabled
- **Backward Compatibility**: Existing webinars maintain their current behavior

### 3. Enhanced Admin Interface
- **Visual Indicators**: Webinar cards show count of custom questions and experience field status
- **Registration Table**: Enhanced to display all custom question answers with question context
- **Better UX**: Clean interface with add/remove buttons and Switch component

## Technical Changes

### Data Structure Updates
- Added `CustomQuestion` interface with `id`, `question`, and `required` fields
- `Webinar` interface: Added `customQuestions: CustomQuestion[]` array and `includeExperienceField` fields
- `WebinarRegistration` interface: Made `experience` optional, added `customQuestionAnswers?: { [questionId: string]: string }`

### UI Components Modified
- **Admin Webinar Editor**: 
  - Multiple custom questions with add/remove functionality
  - Each question has edit, required toggle, and delete options
  - Experience field toggle switch
- **User Registration Form**: 
  - Dynamic rendering of all custom questions
  - Required field validation for marked questions
  - Conditional experience field display
- **Admin Registration Table**: Enhanced to show all custom question answers with question context

### Default Examples
- Webinar 1: Has 2 custom questions + experience field enabled
- Webinar 2: No custom questions + experience field disabled

## Usage

### For Admins
1. Go to Admin → Webinars
2. Click "Create Webinar" or edit existing webinar
3. In "Registration Form Settings" section:
   - Click "Add Question" to create custom questions
   - Edit question text and mark as required if needed
   - Use trash icon to remove unwanted questions
   - Toggle "Years of Experience" field on/off
4. Save webinar

### For Users
- Registration form shows all custom questions dynamically
- Required questions are marked with red asterisk (*)
- Form validation ensures required questions are answered
- Experience field only shows when enabled by admin

## Benefits
- **Ultimate Flexibility**: Unlimited custom questions per webinar
- **Granular Control**: Each question can be required or optional
- **Scalable**: Easy to add/remove questions as needs change
- **User-Friendly**: Clear interface with intuitive add/remove buttons
- **Better Data Collection**: Targeted questions for each specific webinar topic