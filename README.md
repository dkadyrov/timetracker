# Time Tracker

A static JavaScript-based web application for tracking time entries with customizable templates and data persistence.

## Features

- **Time Entry Management**: Add timestamped entries with descriptions and optional notes
- **Timezone Support**: Switch between Local Time and UTC display
- **Quick Entry Templates**: Create reusable templates for common activities (e.g., "Flight Up", "Battery Change")
- **Data Persistence**: All data is saved locally in the browser and persists across sessions
- **CSV Export**: Download all entries as a CSV file for external analysis
- **Responsive Design**: Works on desktop and mobile devices

## Usage

1. **Create Templates**: Add frequently used activity descriptions as templates for quick entry
2. **Add Time Entries**: Enter activities with timestamps (or use current time)
3. **View Entries**: See all entries in reverse chronological order
4. **Export Data**: Download entries as CSV for backup or analysis
5. **Timezone Toggle**: Switch between local time and UTC display

## Deployment on GitLab Pages

### Option 1: Direct Upload
1. Create a new repository on GitLab
2. Upload all files (`index.html`, `styles.css`, `script.js`) to the repository
3. Go to Settings → Pages in your GitLab project
4. Select "Deploy from a branch" and choose your main branch
5. Your site will be available at `https://yourusername.gitlab.io/yourprojectname`

### Option 2: Using GitLab CI/CD
1. Create a new repository on GitLab
2. Add all files to the repository
3. Create a `.gitlab-ci.yml` file in the root directory with the following content:

```yaml
pages:
  stage: deploy
  script:
    - mkdir public
    - cp *.html public/
    - cp *.css public/
    - cp *.js public/
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

4. Commit and push your changes
5. GitLab CI/CD will automatically deploy your site

## File Structure

```
timetracker/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- Data persists between browser sessions
- Data is specific to the domain/browser combination
- No server or external service required
- Data is lost if browser storage is cleared

## Development

To modify the application:
1. Edit the HTML structure in `index.html`
2. Modify styling in `styles.css`
3. Update functionality in `script.js`

The application uses vanilla JavaScript with no external dependencies, making it easy to customize and deploy anywhere.

## License

This project is open source and available under the MIT License.
