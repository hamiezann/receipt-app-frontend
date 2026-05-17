import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/svg/logo";
import AuthBackgroundShape from "@/assets/svg/auth-background-shape";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useAlert } from "@/services/alert";
import { LoginSchema } from "@/lib/validation";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    const validation = LoginSchema.safeParse({ email, password });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setLoading(false);
      return; // Stop here if validation fails
    }
    try {
      const result = await api.post<{ token: string }>("/auth/login", {
        email,
        password,
      });
      if (result.token) {
        localStorage.setItem("token", result.token);
        showAlert("You have been logged in succesfully.", "success");
        navigate("/dashboard");
      }
    } catch (e: any) {
      showAlert("Login Failed", e.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-y-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        {/* <Card className=""> */}
        <CardHeader className="gap-6">
          <Logo className="gap-3 " />

          <div>
            <CardTitle className="mb-1.5 text-2xl text-center">
              Sign in to X3RA
            </CardTitle>
            <CardDescription className="text-base text-center">
              Track & manage your spendings.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Login Form */}
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="userEmail" className="leading-5">
                  Email address*
                </Label>
                <Input
                  type="email"
                  id="userEmail"
                  className={errors.email ? "border-destructive" : ""}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="w-full space-y-1">
                <Label htmlFor="password" className="leading-5">
                  Password*
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    className={
                      errors.password ? "border-destructive pr-9" : "pr-9"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible((prevState) => !prevState)}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                  >
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className="sr-only">
                      {isVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between gap-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox id="rememberMe" className="size-6" />
                  <Label htmlFor="rememberMe" className="text-muted-foreground">
                    {" "}
                    Remember Me
                  </Label>
                </div>

                <a href="/forgot-password" className="hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? " Signing in..." : "Sign in to X3RA"}
              </Button>
            </form>

            <p className="text-muted-foreground text-center">
              New on our platform?{" "}
              <a
                href="/register"
                className="text-card-foreground hover:underline"
              >
                Create an account
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
