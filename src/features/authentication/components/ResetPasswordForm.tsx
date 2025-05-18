import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import FormLogo from "@/assets/images/Axola-logo-alt.png";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { useAuth } from "@/app/context/authContext";
import { toast } from "sonner";

type Inputs = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordForm = () => {
  const { resetPassword, logout } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
    try {
      setFormError(null);
      await resetPassword({ password });
      toast.success("Password reset successful. You can now log in.");
      await logout();
      setTimeout(() => navigate("/login"), 2500);
    } catch (e: any) {
      toast.error(`${e.message ?? "Something went wrong. Please try again."}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center z-20 max-w-[470px] min-w-[300px] w-full sm:w-[470px]"
    >
      <div className="bg-white p-10 rounded-xl w-full">
        <div className="flex items-center justify-center">
          <img src={FormLogo} alt="Form Logo" height={220} width={220} />
        </div>

        <h1 className="text-2xl pt-8 font-medium text-gray-600 text-center">
          Set a New Password
        </h1>

        {formError && (
          <div className="input-error-message mt-4 text-red-600 text-sm text-center">
            {formError}
          </div>
        )}

        <div className="flex flex-col pt-9">
          {/* Password */}
          <div className="mt-1">
            <div className="relative w-full">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: {
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must include at least one uppercase letter",
                    hasTwoDigits: (value) =>
                      (value.match(/\d/g) || []).length >= 2 ||
                      "Password must include at least two numbers",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "Password must include at least one special character",
                  },
                  onChange: () => trigger("confirmPassword"),
                })}
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                autoComplete="new-password"
                className="w-full input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="input-error-message">
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mt-5">
            <div className="relative w-full">
              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="w-full input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="input-error-message">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button w-full mt-6 bg-secondary text-white"
        >
          {isSubmitting ? (
            <CircularLoadingSpinner
              className="flex items-center w-full justify-center"
              color="white"
            />
          ) : (
            <p>Reset Password</p>
          )}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
