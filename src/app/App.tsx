import { AppRouter } from "./router";
import { AppProviders } from './providers/index';
import { Toaster } from "@/components/ui/sonner"
export function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster />
    </AppProviders>)
}