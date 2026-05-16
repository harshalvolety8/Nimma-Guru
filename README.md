# Nimma-Guru (ನಿಮ್ಮ ಗುರು)

Connecting retired professionals with students for free community mentorship.

Nimma-Guru is a non-commercial platform built to facilitate **Gyaan-Daan** (Knowledge Donation). We connect experienced, retired professionals with students and learners in their community who need guidance, all for free.

## 🌟 Vision

Our mission is to ensure that the vast wealth of knowledge and experience held by retired professionals doesn't go to waste, but instead serves as a lighthouse for the next generation. No fees, no ads—just pure mentorship.

## 🚀 Features

- **Gyaan-Daan Platform**: A direct connection between Gurus and Students.
- **Wall of Fame**: Recognizing our most dedicated and appreciated mentors.
- **Smart Search**: Find Gurus by skill (Mathematics, Science, Music, Arts, etc.), name, or location.
- **Profile Management**: Gurus can manage their skills, availability, and social contributions.
- **Community Focused**: Integrated with local community centers and libraries.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Database**: [Supabase](https://supabase.com/) (Backend-as-a-Service)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Styling**: Custom Design System with dark-mode support.
- **Fonts**: Inter, Playfair Display, and Poppins (via Google Fonts).

## 📂 Project Structure

- `app/`: Main application screens and routing logic.
- `components/`: Reusable UI components (GuruCard, etc.).
- `constants/`: Theme tokens, colors, and global constants.
- `lib/`: Third-party integrations (Supabase client).
- `supabase/`: Database migrations and configuration.
- `hooks/`: Custom React hooks for data fetching and state.
- `types/`: TypeScript definitions and data models.

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your mobile device (for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Nimma-Guru
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Scan the QR code with Expo Go to run the app on your device.

## 🤝 Contributing

We welcome contributions from the community! Whether you are a developer, a designer, or someone who wants to help manage the community, feel free to reach out.

## 📄 License

This project is open-source and available under the MIT License.
