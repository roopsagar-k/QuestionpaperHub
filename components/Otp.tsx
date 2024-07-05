import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "@/axiosConfig";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

interface OtpProps {
  setOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
  genratedOtp: string;
  setOptVerification: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  password: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setOptMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsLogin?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Otp: React.FC<OtpProps> = ({
  setOtpVerified,
  genratedOtp,
  email,
  password,
  setMessage,
  setOptMessage,
  setOptVerification,
  setIsLogin,
}) => {
  const [userEnteredOpt, setUserEnteredOpt] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserContext();

  async function checkOtp(value: string) {
    setUserEnteredOpt(value);
    if (value.length === 6 && value !== genratedOtp) {
      setOptMessage("Invalid OTP! Please enter correct OTP.");
      setUserEnteredOpt("");
    }
    if (value.length === 6 && value === genratedOtp) {
      setOptVerification(false);
      setOtpVerified(true);
      try {
        const response = await axios.post("/api/register", {
          email,
          password,
        });
        if (response.status === 201) {
          console.log("user from otp: ", response.data);
          setUser(response.data.user[0]);
          toast({ description: "User registration successfully! :)" });
          setIsLogin !== undefined ? setIsLogin(true) : router.push("/login");
        } else {
          setOptVerification(false);
          setMessage(response.data.errorMessage);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setOtpVerified(false);
    }
  }
  return (
    <div>
      <InputOTP
        value={userEnteredOpt}
        onChange={(value) => checkOtp(value)}
        maxLength={6}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default Otp;
