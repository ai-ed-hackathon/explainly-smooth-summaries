
# Explainly - AI-powered Transcript Summarizer

Explainly is a modern web application that turns lecture, video, and course transcripts into readable educational summaries using AI.

## Features

- **Upload Interface**: Easily upload transcript files for AI processing
- **Summary Dashboard**: Browse and manage all your transcript summaries
- **AI-Generated Content**: Automatic generation of summaries, key concepts, and quiz questions
- **Clean, Minimal Design**: Focus on content with a distraction-free interface

## Project Structure

The project follows a modern React architecture with the following key components:

- **Pages**: Main application views (Home, Dashboard, Auth)
- **Components**: Reusable UI elements organized by feature
- **Hooks**: Custom React hooks for shared logic
- **Lib**: Utility functions and helpers

## Next Steps

- Connect Supabase for authentication and data storage
- Set up a POST webhook to process new transcripts
- Implement vectorstore for AI summarization
- Create functionality to display processed summaries in the UI

## Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd explainly

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) to view the application.

## Technical Stack

- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for navigation
- React Query for data fetching

## License

This project is licensed under the MIT License.
