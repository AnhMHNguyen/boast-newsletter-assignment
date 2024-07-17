import React, { useState } from "react";
import axios from "axios";
import Selector from "./Selector";
import { ProvinceSelector } from "../lib/mock-data";
import { useTheme } from "../context/theme";

interface ErrorMessageProps {
  email?: string;
  country?: string;
}

const NewsletterBanner: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<ErrorMessageProps>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [emailValidated, setEmailValidated] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailValidated(false);
      setErrorMessage((prevState) => ({
        ...prevState,
        email: "Please enter your email address.",
      }));
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValid = emailRegex.test(email);
      setEmailValidated(isValid);
      setErrorMessage((prevState) => ({
        ...prevState,
        email: isValid ? undefined : "Please enter a valid email address.",
      }));
    }
  };

  const resetError = (field: keyof ErrorMessageProps) => {
    setErrorMessage((prevState) => ({
      ...prevState,
      [field]: undefined,
    }));
    if (submitError) setSubmitError(false);
  };

  const handleOnSubmit = async () => {
    if (!emailValidated) {
      validateEmail(email);
      return;
    }

    if (!selectedCountry) {
      setErrorMessage((prevState) => ({
        ...prevState,
        country: "Country is required.",
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          email,
          country: selectedCountry,
          ...(selectedProvince && { province: selectedProvince }),
        }
      );

      if (response.status === 201) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error("ERROR_POST ->", error);
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  return (
    <div className="w-full p-2 max-w-[500px] flex flex-col">
      <div className="w-full flex justify-between items-center mb-2">
        <img
          src="/images/boast-logo.webp"
          alt="boast logo"
          className="w-full max-w-[200px] mb-2"
        />
        <div
          className="w-fit bg-black dark:bg-white text-white dark:text-black font-bold py-2 px-4 rounded-[8px] cursor-pointer"
          onClick={toggleTheme}
        >
          {theme}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-black text-xl md:text-2xl font-[800] dark:text-white">
          Sign up <br />
          for our newsletter
        </h2>
        <p className="text-black text-sm md:text-md dark:text-white mb-5">
          Keep up to date on the latest in R&D tax credits and innovation
          funding.
        </p>

        {submitSuccess ? (
          <h2 className="text-black text-md md:text-lg font-[800] dark:text-white">
            Success! Thank you for your subscription.
          </h2>
        ) : (
          <>
            <div className="w-full relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 border border-gray-300 bg-white rounded-md w-full transition-all active:outline-none active:border-black focus:outline-none focus:border-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={email}
                onChange={(e) => {
                  resetError("email");
                  emailValidated && setEmailValidated(false);
                  setEmail(e.target.value);
                }}
                onBlur={handleEmailBlur}
              />
              {emailValidated ? (
                <img
                  src="/images/check.svg"
                  alt="check-icon"
                  className="absolute right-2 top-3"
                />
              ) : errorMessage.email ? (
                <img
                  src="/images/error.svg"
                  alt="error-icon"
                  className="absolute right-2 top-3.5"
                />
              ) : null}
            </div>
            {errorMessage.email && (
              <p className="text-red-500 text-xs md:text-sm">
                {errorMessage.email}
              </p>
            )}
            <Selector
              value={selectedCountry}
              onSelect={(value) => {
                resetError("country");
                setSelectedCountry(value);
                setSelectedProvince("");
              }}
              options={["United States", "Canada", "Other"]}
              placeholder="Select your country"
              className="mt-3"
            />
            {errorMessage.country && (
              <p className="text-red-500 text-xs md:text-sm">
                {errorMessage.country}
              </p>
            )}

            {selectedCountry && selectedCountry !== "Other" && (
              <Selector
                value={selectedProvince}
                onSelect={(value) => setSelectedProvince(value)}
                options={ProvinceSelector[selectedCountry]}
                placeholder="Select your province/state"
                className="mt-3"
              />
            )}

            <button
              type="submit"
              className={`w-fit bg-black dark:bg-white text-white dark:text-black font-bold py-2 px-4 rounded-[8px] mt-5 ${
                loading || !email ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={loading || !email || !emailValidated}
              onClick={handleOnSubmit}
            >
              {loading ? (
                <img src={`/images/spinner-${theme}.svg`} alt="spinner-icon" />
              ) : (
                "SUBMIT"
              )}
            </button>

            {submitError && (
              <p className="text-red-500 text-xs md:text-sm">
                Something went wrong. Please try again later.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterBanner;
