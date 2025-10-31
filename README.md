# TravelAI - AI-Powered Travel Guide

A modern, beautiful web application that helps users plan perfect trips using advanced AI technology. Built with Next.js, TypeScript, Tailwind CSS, and Azure OpenAI.

## Features

### 🌟 Core Features

- **AI-Powered Itinerary Builder**: Multi-step form that collects user preferences and generates personalized travel itineraries using Azure OpenAI
- **Streaming AI Responses**: Real-time streaming of itinerary generation for better user experience
- **Chain of Thought Visualization**: Watch AI's thought process as it plans your trip
- **Suggested Destinations**: Pre-curated destinations with AI-generated descriptions
- **Live Weather Integration**: Real-time weather data for all destinations via OpenWeatherMap API
- **Beautiful UI/UX**: Modern glassmorphism design with smooth animations and transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🎨 Design Features

- Dark mode by default with light mode support
- Lottie animations for engaging visuals
- Floating elements and parallax effects
- Custom scrollbar and smooth scrolling
- Loading skeletons and micro-interactions
- Gradient text and glassmorphism effects

## Tech Stack

- **Frontend**: Next.js 16.0, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **AI**: Azure OpenAI (GPT-4o)
- **Weather API**: OpenWeatherMap
- **Animations**: Lottie, Custom CSS animations
- **Markdown**: react-markdown for itinerary rendering

## Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Azure OpenAI Account** with API access
4. **OpenWeatherMap API Key** (free tier available)

## Getting Started

### 1. Clone or Navigate to Project

```bash
cd ai-travel-guide
```

### 2. Install Dependencies

All dependencies should already be installed, but if needed:

```bash
npm install
```

Additional required packages:
```bash
npm install @azure/openai framer-motion react-lottie-player axios date-fns lucide-react react-markdown
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API credentials:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-01

# Optional: Use different model for suggestions (cheaper/faster)
AZURE_OPENAI_SUGGESTIONS_DEPLOYMENT=gpt-35-turbo

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 4. Get Your API Keys

#### Azure OpenAI:
1. Go to [Azure Portal](https://portal.azure.com)
2. Create an Azure OpenAI resource
3. Deploy a model (recommended: GPT-4o or GPT-4 Turbo)
4. Get your API key and endpoint from "Keys and Endpoint" section
5. Note your deployment name

#### OpenWeatherMap:
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-travel-guide/
├── app/
│   ├── api/
│   │   ├── generate-itinerary/  # Azure OpenAI streaming endpoint
│   │   └── weather/             # Weather API endpoint
│   ├── itinerary/               # Itinerary builder page
│   ├── suggestions/             # Suggested trips page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   ├── Navigation.tsx           # Navigation bar
│   ├── Hero.tsx                 # Hero section
│   ├── FeaturesSection.tsx      # Features display
│   ├── HowItWorks.tsx           # How it works section
│   ├── PopularDestinations.tsx  # Destinations showcase
│   ├── ChainOfThought.tsx       # AI thinking visualization
│   ├── ItineraryResult.tsx      # Itinerary display
│   └── Footer.tsx               # Footer
├── public/                      # Static assets
├── .env.local.example           # Environment variables template
└── package.json                 # Dependencies
```

## Key Features Explained

### 1. Itinerary Builder (`/itinerary`)

A 3-step form that collects:
- **Step 1**: Destination, travel dates
- **Step 2**: Budget, travelers, accommodation, pace
- **Step 3**: Interests and special requirements

The form submits to `/api/generate-itinerary` which:
1. Streams "chain of thought" steps
2. Generates a personalized itinerary using Azure OpenAI
3. Returns formatted markdown content in real-time

### 2. Suggested Trips (`/suggestions`)

Displays curated destinations with:
- Beautiful card layouts
- Live weather data on hover
- Destination ratings and highlights
- Best time to visit information
- Direct link to plan trip for that destination

### 3. Weather Integration

The weather API (`/api/weather`) fetches real-time data:
- Temperature and feels-like
- Weather conditions
- Humidity and wind speed
- Weather icons

### 4. AI Streaming & Chain of Thought

The application uses Server-Sent Events (SSE) to stream:
- Thinking process steps (Chain of Thought)
- Generated itinerary content character-by-character
- Provides engaging user experience during AI processing

## Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: #1e90ff;      /* Ocean Blue */
  --secondary: #ff6b35;    /* Sunset Orange */
  --accent: #ffd93d;       /* Golden Hour */
  /* ... */
}
```

### Adding More Destinations

Edit `app/suggestions/page.tsx` and add to the `destinations` array:

```typescript
{
  id: 10,
  name: 'Your City',
  country: 'Your Country',
  image: 'image-url',
  description: 'Description',
  highlights: ['Attraction 1', 'Attraction 2'],
  bestTimeToVisit: 'Best months',
  rating: 4.8,
  coordinates: { lat: 0.0, lon: 0.0 },
}
```

### Modifying AI Prompts

Edit the prompts in `app/api/generate-itinerary/route.ts`:

```typescript
const systemPrompt = `Your custom system prompt...`;
const userPrompt = `Your custom user prompt...`;
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### API Errors

- **Azure OpenAI 401**: Check your API key and endpoint
- **Azure OpenAI 404**: Verify deployment name is correct
- **Weather API errors**: Ensure OpenWeatherMap API key is valid

### Styling Issues

- Clear browser cache
- Delete `.next` folder and rebuild
- Check Tailwind CSS configuration

### Performance

- Use GPT-3.5 Turbo for faster responses
- Implement caching for weather data
- Optimize images with Next.js Image component

## Contributing

Feel free to submit issues and pull requests!

## License

This project is for educational purposes. Modify and use as needed.

## Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error messages and environment details

---

Built with ❤️ using Next.js and Azure OpenAI
