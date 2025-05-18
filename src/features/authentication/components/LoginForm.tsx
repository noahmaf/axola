import { Navigate, useNavigate } from "react-router-dom";
import FormLogo from "@/assets/images/Axola-logo-alt.png";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/authContext";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { isAuthenticated, login, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  if (isAuthenticated) {
    return (
      <Navigate to="/announcements" state={{ currentTab: "Announcements" }} />
    );
  }

  const logIn: SubmitHandler<Inputs> = async (data) => {
    try {
      setFormError(null);
      await login({ email: data.email, password: data.password });

      if (error) {
      }
    } catch (e: any) {
      toast.error(`Login failed: ${e} `);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(logIn)}
      className="flex items-center justify-center z-20 max-w-[470px] min-w-[300px] w-full sm:w-[470px]"
    >
      <div className="bg-white p-10 rounded-xl w-full">
        <div className="flex items-center justify-center">
          <img src={FormLogo} alt="Form Logo" height={220} width={220} />
        </div>

        <h1 className="text-2xl pt-8 font-medium text-gray-500 justify-center text-center flex">
          Welcome Back
        </h1>
        {formError && <div className="form-error-message">{formError}</div>}

        <div className="flex flex-col pt-9">
          <div className="mt-1">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Email address"
              autoComplete="email"
              className="w-full input"
            />
            {errors.email && (
              <div className="input-error-message">{errors.email.message}</div>
            )}
          </div>

          <div className="mt-5">
            <div className="relative w-full">
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
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
        </div>

        <div className="flex justify-end items-center text-sm text-neutral-600 mt-3">
          <Button
            variant="link"
            className="text-neutral-500 hover:text-secondary  px-1 underline-offset-2"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button w-full mt-6 bg-red"
        >
          {isSubmitting ? (
            <CircularLoadingSpinner
              className="flex items-center w-full justify-center "
              color="white"
            />
          ) : (
            <p>Log In</p>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
