# 🎄 Christmas Wish Generator Web App

A festive, fully responsive Christmas web application that allows users to create and share personalized Christmas wishes with beautiful animations and a magical theme.

## Features

### 🎅 Core Features

- **Homepage with Festive Theme**
  - Animated snowfall
  - Twinkling Christmas lights
  - Background Christmas music
  - Smooth animations and bounce effects

- **Wish Generation**
  - Enter your name to create a unique wish link
  - Optional custom message
  - Multiple theme options (Snow, Lights, Santa, Fireplace)
  - Copy-to-clipboard functionality

- **Personalized Wish Page**
  - Displays custom greeting messages
  - Shows sender's name with festive styling
  - Sparkle animations and floating decorations
  - Ringing bells (interactive easter egg)

- **Social Sharing**
  - Share via WhatsApp
  - Share via Facebook
  - Share via Twitter
  - Copy link option

- **Extra Features**
  - Auto-playing Christmas music (with toggle control)
  - Fully responsive design (mobile, tablet, desktop)
  - SQLite database to store wishes
  - Theme customization
  - Beautiful CSS3 animations

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Styling**: CSS3 with animations and flexbox
- **Fonts**: Google Fonts (Fredoka, Pacifico)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Navigate to the project directory**
   ```bash
   cd christ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
christ/
├── public/
│   ├── index.html          # Homepage
│   ├── wish.html           # Wish display page
│   ├── styles.css          # All styling and animations
│   └── scripts.js          # All JavaScript functionality
├── data/
│   └── wishes.db           # SQLite database (created automatically)
├── server.js               # Express server
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## How to Use

### Creating a Wish

1. Enter your name in the input field
2. (Optional) Choose a theme: ❄️ Snow, 💡 Lights, 🎅 Santa, 🔥 Fireplace
3. (Optional) Add a custom message
4. Click "Generate My Christmas Wish Link"
5. Copy the generated link and share it!

### Sharing a Wish

- **Copy Link**: Manually copy and share the URL
- **WhatsApp**: Opens WhatsApp with pre-filled text
- **Facebook**: Opens Facebook share dialog
- **Twitter**: Opens Twitter with pre-filled tweet

### Receiving a Wish

1. Open the wish link shared by someone
2. See the beautiful Christmas greeting with the sender's name
3. Click the bells 🔔 to hear a bell sound (easter egg!)
4. Create your own wish by clicking "Create Your Own Wish"

## Customization

### Change Background Music
Edit the audio source in `index.html` and `wish.html`:
```html
<audio id="christmas-music" loop>
    <source src="YOUR_AUDIO_URL" type="audio/mpeg">
</audio>
```

### Change Colors
Edit the CSS gradients in `styles.css`:
```css
.homepage {
    background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a3a28 100%);
}
```

### Add More Themes
1. Add a new theme option in `index.html`
2. Add the theme styling in `applyTheme()` function in `scripts.js`

## API Endpoints

- `GET /` - Homepage
- `GET /wish` - Wish display page
- `POST /api/wishes` - Create a new wish
- `GET /api/wishes/:from_name` - Get wishes by sender name
- `GET /api/wishes/id/:id` - Get wish by ID
- `POST /api/wishes/:id/share` - Increment share count

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## Performance Tips

1. Christmas music is hosted externally to reduce file size
2. CSS animations use hardware acceleration
3. Snowflake effects are optimized for performance
4. Database queries are indexed

## Troubleshooting

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or another port
```

### Music Won't Play
- Browser autoplay policies may prevent automatic play
- Click the music button to enable it manually
- Some browsers require user interaction before playing audio

### Database Error
- Ensure the `data/` folder exists
- Check file permissions
- Delete `wishes.db` and restart the server to create a fresh database

## Future Enhancements

- User authentication
- Wish likes/reactions
- Animated gift opening
- Video wishes support
- Wish history tracking
- Email notifications
- More theme options
- Sound effects for interactions

## License

MIT

## Author

Nathaniel 🎄

---

**Happy Holidays! 🎄✨🎅**
