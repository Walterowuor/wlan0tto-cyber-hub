# Wlan0tto Cyber Hub v2

A modern web application for cyber services, security tips, and digital needs.

## Features

- Service management with dynamic pricing
- Real-time search functionality
- Dynamic theme switching (Light/Dark)
- Responsive design
- Progressive Web App (PWA) support
- Interactive UI components (carousel, tabs, etc.)

## Project Structure

```
wlan0tto-cyber-hub-v2/
├── index.html              # Main HTML file
├── js/
│   ├── app.js             # Main application file
│   └── components/
│       ├── ServiceManager.js  # Service management component
│       └── UIManager.js       # UI management component
├── css/
│   └── styles.css         # Main stylesheet
├── assets/
│   └── icons/             # Favicon and app icons
├── services.json          # Service data
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
└── privacy.html           # Privacy policy
```

## Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wlan0tto-cyber-hub-v2
   ```

2. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Open your browser and navigate to:
   - Python server: `http://localhost:8000`
   - Node.js server: `http://localhost:3000`

## Deployment

### Option 1: Static Hosting

1. Build the project (if using a build tool)
2. Upload the contents to your web hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static file hosting service

### Option 2: Traditional Web Server

1. Copy all files to your web server's root directory
2. Ensure proper MIME types are configured:
   - `.js` files: `application/javascript`
   - `.json` files: `application/json`
   - `.css` files: `text/css`

## Testing

1. Open the browser's developer tools (F12)
2. Check the Console tab for any errors
3. Test the following functionality:
   - Service loading and display
   - Search functionality
   - Price calculations
   - Theme switching
   - Carousel
   - Typed.js animation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- TailwindCSS (via CDN)
- Typed.js (via CDN)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [support@wlan0tto.com](mailto:support@wlan0tto.com) or text [+254743149316](https://wa.me/+254743149316). 