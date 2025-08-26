import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import BookList from "./components/BookList";

const queryClient = new QueryClient();

function App() {
  const appStyles = {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={appStyles}>
        <BookList />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
