
import LoginForm from "@/components/login-form";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to LoginSnake</h1>
      <LoginForm />
    </div>
  );
}
