import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/svg/logo";
import AuthBackgroundShape from "@/assets/svg/auth-background-shape";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useAlert } from "@/services/alert";
import { OTPConfirmationSchema } from "@/lib/validation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ConfirmOtpPage = () => {
  const [otp, setOtp] = useState("");
  const storedState = useLocation();
  const email = storedState.state?.key || "";
  const otpReason = storedState.state?.reason || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; otpCode?: string }>(
    {},
  );
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear old errors

    const validation = OTPConfirmationSchema.safeParse({ email, code: otp });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        otpCode: fieldErrors.code?.[0],
      });
      setLoading(false);
      return; // Stop here if validation fails
    }
    try {
      const result = await api.post<{ message: string }>("/auth/verify-otp", {
        email,
        code: otp,
      });
      if (result.message) {
        showAlert(result.message, "success");
        navigate("/login");
      }
    } catch (e: any) {
      showAlert(
        "Verification Failed",
        e.message || "Invalid or expired code",
        "error",
      );
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
            <CardTitle className="text-2xl">{otpReason}</CardTitle>
            <CardDescription className="text-base text-center">
              A 6-digit code was sent to{" "}
              <span className="font-semibold text-primary">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-4">
              <Label>Enter Verification Code</Label>

              {/* 6-Digit OTP Input */}
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className={errors.otpCode ? "border-destructive" : ""}
              >
                <InputOTPGroup className="gap-2 sm:gap-4">
                  <InputOTPSlot
                    index={0}
                    className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-12 w-10 sm:h-14 sm:w-12 text-lg border-2"
                  />
                </InputOTPGroup>
              </InputOTP>

              {errors.otpCode && (
                <p className="text-destructive text-xs">{errors.otpCode}</p>
              )}
            </div>

            <Button
              className="w-full h-12"
              type="submit"
              disabled={loading || otp.length < 6}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            {/* <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
                <Button variant="link" type="button" className="p-1 h-auto">
                  Resend Code
                </Button>
              </p>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmOtpPage;
