# ASTRO PENDIENTES 🚀

**Astro Pendientes** is a premium, high-end task management application designed with a "Soft Space/Astral" aesthetic. It transforms your daily productivity into a cosmic journey, allowing you to manage missions, sync with celestial energies, and earn cosmic honors.

![Astro Pendientes Preview](public/preview.png)
> [!NOTE]
> *Experience productivity in a glassmorphic, atmospheric workspace inspired by the vastness of the nebula.*

## 🌟 Stellar Features

### 🛸 Astral HUD & Identity
- **Commander Profile**: Customize your astral identity with an editable name and avatar URL directly from the interface.
- **Dynamic HUD**: A sleek, persistent header showing your total Sync Score and Stardust (completed missions) in real-time.

### 🌌 Astral Menu (Orbital Utility)
- **Centralized Hub**: A sliding glassmorphic sidebar that declutters your workspace while keeping essential tools at your fingertips.
- **Chronos Sync (Pomodoro)**: A specialized focus timer with multiple modes (Work, Rest, Deep Rest) to maintain your cognitive orbit.
- **Cosmic Honors**: A gamified achievement system that awards unique astral badges for every 3 successful missions.

### 🔮 Stellar Horoscope
- **Daily Insight**: Connect with the stars! Select your zodiac sign to receive daily productivity-focused predictions and wisdom from the cosmos.
- **Quick Preview**: A dedicated "Daily Insight" panel in your main dashboard keeps you inspired throughout your shift.

### 📋 Mission Management
- **Sector Organization**: Group your missions into folders for clear categorical separation.
- **Priority Matrix**: Assign priority levels (Low, Medium, High) with color-coded cosmic indicators.
- **Detailed Intelligence**: Add optional descriptions and arrival deadlines to every task.

## 🚀 Cosmic Tech Stack

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) for high-speed interstellar performance.
- **Atmospheric UI**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism.
- **Fluid Motion**: [Framer Motion](https://www.framer.com/motion/) for smooth, weightless transitions.
- **Astral Icons**: [Lucide React](https://lucide.dev/).
- **Stellar Storage**: [Supabase](https://supabase.com/) for real-time data synchronization.

## 🛠️ Launch Sequence (Setup)

### Prerequisites
- Node.js (Latest LTS)
- A Supabase Project

### Installation Steps

1. **Clone the Sector**
   ```bash
   git clone <repository-url>
   cd astro-pendientes
   ```

2. **Fuel the Engine**
   ```bash
   npm install
   ```

3. **Configure the Warp Drive**
   Create a `.env` file in the root with your Supabase coordinates:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database**
   Create a `tasks` table in Supabase:
   - `id` (uuid, primary key)
   - `title`, `description`, `completed` (boolean), `user_id` (uuid)
   - `priority` (low/medium/high), `folder` (default: 'MAIN'), `deadline` (date)

5. **Initiate Ignition**
   ```bash
   npm run dev
   ```

## 📁 System Architecture

- `src/components/HUD.jsx`: The command center status bar.
- `src/components/GameHero.jsx`: Reactive astral visualizer.
- `src/components/PomodoroTimer.jsx`: Chronos synchronization tool.
- `src/components/BadgeDisplay.jsx`: Achievement rendering engine.
- `src/lib/supabase.js`: Direct link to the stellar database.

## 📄 Cosmic License

Licensed under the MIT License. Explore the stars responsibly.
