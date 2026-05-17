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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useAlert } from "@/services/alert";
import { ResetPassSchema } from "@/lib/validation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    const validation = ResetPassSchema.safeParse({ email });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
      });
      setLoading(false);
      return; // Stop here if validation fails
    }
    try {
      const result = await api.post<{ message: string }>(
        "/auth/forgot-password",
        {
          email,
        },
      );
      if (result.message) {
        showAlert(result.message, "success");
        navigate("/login");
      }
    } catch (e: any) {
      showAlert("Failed", e.message || "Invalid credentials", "error");
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
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-base text-center">
              No worries, we'll send you reset instructions.
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

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? " Sending instructions..." : "Reset password"}
              </Button>
            </form>

            <p className="text-muted-foreground text-center">
              Back?{" "}
              <a href="/login" className="text-card-foreground hover:underline">
                Return to login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
