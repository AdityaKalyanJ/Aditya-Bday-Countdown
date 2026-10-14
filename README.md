# Aditya's Birthday Bash

A one-page invitation for Aditya's birthday party: Saturday, 17 October 2026, 4:00 PM at Villa 50, Vertex Bougainvillea.

Live at https://adityainvite.netlify.app/

## What's on the page

- A live countdown to the party that switches to "It's party time! 🎉" with confetti when it reaches zero
- Party details with buttons to add it to Google Calendar or Apple/Outlook (`aditya-birthday.ics`), get directions and share the invite (native share sheet on phones, copy link or WhatsApp elsewhere)
- A music button that plays a music-box "Happy Birthday". To use your own track, add the file (e.g. `audio/song.mp3`) and set `data-src` on `#music-toggle` in `index.html`
- A large link preview for WhatsApp and social apps (`images/og-invite.jpg`, 1200×630). It shows the date and time, so regenerate it if those change
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
