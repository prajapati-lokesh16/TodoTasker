
import { TaskProvider } from '@/context/context'



export const metadata = {
  title: "Todo Dashboard",
  description: "You can Mangae you Todo tasks here",
};



export default function DashboardLayout({ children }) {
  return (

      <>
        <TaskProvider>
          {children}
        </TaskProvider>
      </>

  );
}
