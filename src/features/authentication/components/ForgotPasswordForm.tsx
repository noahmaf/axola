import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLogo from "@/assets/images/Axola-logo-alt.png";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/authContext";

type Inputs = {
  email: string;
};

const ForgotPasswordForm = () => {
  const { sendPasswordResetEmail } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    try {
      setFormError(null);
      setSuccessMessage(null);
      await sendPasswordResetEmail({ email });
      toast.success(`Password reset email sent. Check your inbox.`);
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

        <h1 className="text-2xl pt-8 font-medium text-gray-600 justify-center text-center flex">
          Reset Your Password
        </h1>

        {formError && (
          <div className="input-error-message mt-4 text-red-600 text-sm text-center">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 text-green-600 text-sm text-center">
            {successMessage}
          </div>
        )}

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
        </div>

        <div className="flex justify-center items-center text-sm text-neutral-600 mt-3">
          <Button
            variant="link"
            className="text-neutral-500 hover:text-secondary px-1 underline-offset-2"
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="button w-full mt-6 bg-secondary"
        >
          {isSubmitting ? (
            <CircularLoadingSpinner
              className="flex items-center w-full justify-center"
              color="white"
            />
          ) : (
            <p>Send Reset Link</p>
          )}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
