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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/services/api";
import { useAlert } from "@/services/alert";
import { ConfirmResetPassSchema } from "@/lib/validation";

const ResetPasswordPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    const validation = ConfirmResetPassSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      setLoading(false);
      return; // Stop here if validation fails
    }
    try {
      const result = await api.post<{ message: string }>(
        "/auth/reset-password",
        {
          newPassword: password,
          token,
        },
      );
      if (result.message) {
        showAlert(
          result.message,
          "Succesfully changed your password",
          "success",
        );
        navigate("/login");
      }
    } catch (e: any) {
      showAlert("Reset Failed", e.message || "Invalid credentials", "error");
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
          <Logo className="gap-3" />

          <div>
            <CardTitle className="mb-1.5 text-2xl text-center">
              Reset Password for X3RA
            </CardTitle>
            <CardDescription className="text-base text-center">
              Easy right? No worries! Easy re-onboarding.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Login Form */}
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              {/* confirm password */}
              <div className="w-full space-y-1">
                <Label htmlFor="password" className="leading-5">
                  Confirm Password*
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible2 ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    className={
                      errors.password ? "border-destructive pr-9" : "pr-9"
                    }
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible2((prevState) => !prevState)}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                  >
                    {isVisible2 ? <EyeOffIcon /> : <EyeIcon />}
                    <span className="sr-only">
                      {isVisible2 ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? " Resetting ..." : "Change password"}
              </Button>
            </form>

            <p className="text-muted-foreground text-center">
              Familiar with our platform?{" "}
              <a href="/login" className="text-card-foreground hover:underline">
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
