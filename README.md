# ASTRO PENDIENTES 🚀

A gamified, retro-style task management application inspired by the cosmos. Organize your daily quests, earn XP, and collect badges as you level up your productivity.

![Astro Pendientes Preview](public/preview.png) *(Note: Add a real preview image to public/preview.png if available)*

## 🌟 Features

- **Gamified Productivity**: Earn score and coins for every completed task.
- **Saga Selection**: Change the entire UI theme based on your favorite classic games:
  - 🍄 **Super Mario**
  - 👻 **Pacman**
  - ⚡ **Sonic**
  - 🔥 **Pokemon**
  - 🛡️ **Zelda**
- **Badge System**: Earn a unique badge for every 3 tasks completed.
- **Folder Organization**: Group your quests into different "Worlds" or project folders.
- **Quest Details**: Add descriptions, set deadlines, and assign priorities (Low, Medium, High).
- **Pomodoro Timer**: Integrated retro-style focus timer to help you stay in the "Zone".
- **Dynamic HUD**: Real-time stats display including Score, Coins (Completed Tasks), and World status.
- **Responsive Hero**: An animated sprite that reacts to your task actions (Jumping, Victory, Idle).

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/)

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (Latest LTS recommended)
- A Supabase account and project

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proyecto-u1-app-full-stack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Ensure you have a `tasks` table in your Supabase database with the following structure:
   - `id` (uuid, primary key)
   - `created_at` (timestamptz)
   - `title` (text)
   - `description` (text, optional)
   - `completed` (boolean, default: false)
   - `user_id` (uuid, references auth.users)
   - `priority` (text, default: 'medium')
   - `folder` (text, default: 'MAIN')
   - `deadline` (date, optional)

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

- `src/components/`: Modular React components.
  - `HUD.jsx`: The top status bar.
  - `GameHero.jsx`: Animated character sprite.
  - `TaskItem.jsx`: Individual quest management.
  - `BadgeDisplay.jsx`: Achievements container.
  - `PomodoroTimer.jsx`: Focus tool.
- `src/lib/supabase.js`: Supabase client configuration.
- `src/index.css`: Global styles and theme variable definitions.

## 📄 License

This project is open-source and available under the MIT License.
