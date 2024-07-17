import NewsletterBanner from "./components/NewsletterBanner";
import { ThemeProvider } from "./context/theme";

function App() {
  return (
    <ThemeProvider>
      <div className="bg-white w-screen flex items-center justify-center h-[100vh] dark:bg-black">
        <NewsletterBanner />
      </div>
    </ThemeProvider>
  );
}

export default App;
