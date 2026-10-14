# Aditya's Birthday Bash

A one-page invitation for Aditya's birthday party: Saturday, 17 October 2026, 4:00 PM at Vertex Bougainvillea, Villa No. 50.

Live at https://adityainvite.netlify.app/

## What's on the page

- A live countdown to the party that switches to "It's party time! 🎉" when it reaches zero
- Party details with buttons to add it to Google Calendar or Apple/Outlook (`aditya-birthday.ics`) and to get directions
- An embedded map, the RSVP note and the party highlights

## Editing

It's a static site with no build step.

- Content is in `index.html`.
- Change the party time in the `data-target` attribute of `#countdown` in `index.html`. Also update the Google Calendar link and `aditya-birthday.ics` so they match.
- Styles are in `css/style.css`. The countdown and event-card styles are at the end of the file.

## Running locally

Serve the folder with any static server, for example:

```bash
npx http-server -p 8080
```

Then open http://localhost:8080.
