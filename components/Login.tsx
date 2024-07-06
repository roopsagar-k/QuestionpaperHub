"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { SignIn } from "@/lib/signin";
import { AuthError } from "next-auth";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface LoginProps {
  setIsLogin?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLogin }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await SignIn(
        email,
        password,
        `${setIsLogin === undefined ? "/home" : pathname}`
      );
      setIsLoading(false);
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      if (error instanceof AuthError) {
        setIsLoading(false);
        setError(error.message.split(".")[0].trim());
      }
      throw error;
    }
  };
  return (
    <Card className="z-[300000]">
      <CardHeader>
        <CardTitle>Log in to Your Account</CardTitle>
        <CardDescription>
          Enter your credentials below to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 sm:gap-4">
          <Button
            variant={"outline"}
            name="google"
            onClick={() =>
              signIn("discord", {
                callbackUrl: `${setIsLogin === undefined ? "/home" : pathname}`,
              })
            }
            className="w-full sm:w-1/2 flex items-center justify-center shadow-sm text-black hover:text-primary dark:text-white dark:hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30px"
              height="30px"
              viewBox="0,0,256,256"
              className="mx-2"
            >
              <g
                fill="currentColor"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
              >
                <g transform="scale(5.12,5.12)">
                  <path d="M41.625,10.76953c-3.98047,-3.20313 -10.27734,-3.74609 -10.54687,-3.76563c-0.41797,-0.03516 -0.81641,0.19922 -0.98828,0.58594c-0.01562,0.02344 -0.15234,0.33984 -0.30469,0.83203c2.63281,0.44531 5.86719,1.33984 8.79297,3.15625c0.46875,0.28906 0.61328,0.90625 0.32422,1.375c-0.19141,0.30859 -0.51562,0.47656 -0.85156,0.47656c-0.17969,0 -0.36328,-0.05078 -0.52734,-0.15234c-5.03125,-3.12109 -11.3125,-3.27734 -12.52344,-3.27734c-1.21094,0 -7.49609,0.15625 -12.52344,3.27734c-0.46875,0.29297 -1.08594,0.14844 -1.375,-0.32031c-0.29297,-0.47266 -0.14844,-1.08594 0.32031,-1.37891c2.92578,-1.8125 6.16016,-2.71094 8.79297,-3.15234c-0.15234,-0.49609 -0.28906,-0.80859 -0.30078,-0.83594c-0.17578,-0.38672 -0.57031,-0.62891 -0.99219,-0.58594c-0.26953,0.01953 -6.56641,0.5625 -10.60156,3.80859c-2.10547,1.94922 -6.32031,13.33984 -6.32031,23.1875c0,0.17578 0.04688,0.34375 0.13281,0.49609c2.90625,5.10938 10.83984,6.44531 12.64844,6.50391c0.00781,0 0.01953,0 0.03125,0c0.32031,0 0.62109,-0.15234 0.80859,-0.41016l1.82813,-2.51562c-4.93359,-1.27344 -7.45312,-3.4375 -7.59766,-3.56641c-0.41406,-0.36328 -0.45312,-0.99609 -0.08594,-1.41016c0.36328,-0.41406 0.99609,-0.45312 1.41016,-0.08984c0.05859,0.05469 4.69922,3.99219 13.82422,3.99219c9.14063,0 13.78125,-3.95312 13.82813,-3.99219c0.41406,-0.35937 1.04297,-0.32422 1.41016,0.09375c0.36328,0.41406 0.32422,1.04297 -0.08984,1.40625c-0.14453,0.12891 -2.66406,2.29297 -7.59766,3.56641l1.82813,2.51563c0.1875,0.25781 0.48828,0.41016 0.80859,0.41016c0.01172,0 0.02344,0 0.03125,0c1.80859,-0.05859 9.74219,-1.39453 12.64844,-6.50391c0.08594,-0.15234 0.13281,-0.32031 0.13281,-0.49609c0,-9.84766 -4.21484,-21.23828 -6.375,-23.23047zM18.5,30c-1.93359,0 -3.5,-1.78906 -3.5,-4c0,-2.21094 1.56641,-4 3.5,-4c1.93359,0 3.5,1.78906 3.5,4c0,2.21094 -1.56641,4 -3.5,4zM31.5,30c-1.93359,0 -3.5,-1.78906 -3.5,-4c0,-2.21094 1.56641,-4 3.5,-4c1.93359,0 3.5,1.78906 3.5,4c0,2.21094 -1.56641,4 -3.5,4z"></path>
                </g>
              </g>
            </svg>
            Discord
          </Button>
          <Button
            variant={"outline"}
            name="google"
            onClick={() =>
              signIn("google", {
                callbackUrl: `${setIsLogin === undefined ? "/home" : pathname}`,
              })
            }
            className="w-full sm:w-1/2 flex items-center justify-center shadow-sm text-black hover:text-primary dark:text-white dark:hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30px"
              height="30px"
              viewBox="0,0,256,256"
            >
              <g
                fill="currentColor"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
              >
                <g transform="scale(4,4)">
                  <path d="M30.997,28.126l20.738,0.029c1.81,8.576 -1.499,25.845 -20.738,25.845c-12.153,0 -22.005,-9.85 -22.005,-22c0,-12.15 9.852,-22 22.005,-22c5.708,0 10.907,2.173 14.817,5.736l-6.192,6.19c-2.321,-1.988 -5.329,-3.196 -8.625,-3.196c-7.33,0 -13.273,5.941 -13.273,13.27c0,7.329 5.942,13.27 13.273,13.27c6.156,0 10.412,-3.644 11.978,-8.738h-11.978z"></path>
                </g>
              </g>
            </svg>
            Google
          </Button>
        </div>
        <div className="flex items-center gap-2 justify-center my-4">
          <div className="h-[0.5px] w-32 bg-slate-400"></div>
          <div className="text-foreground dark:text-slate-400 text-sm">
            OR CONTINUE WITH
          </div>
          <div className="h-[0.5px] w-32 bg-slate-400"></div>
        </div>
      </CardContent>

      <CardFooter>
        <form
          onSubmit={(e) => handleLogin(e)}
          className="flex flex-col gap-4 w-full"
        >
          <Label htmlFor="email" className="w-full">
            <span>Email</span>
            <Input
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="mt-3"
              required
            />
          </Label>
          <Label htmlFor="password" className="w-full">
            <span>Password</span>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="mt-3"
              required
            />
          </Label>
          <p className="w-full text-center">
            Don&apos;t have an account?
            <span
              className="text-blue-500 mx-3 hover:underline hover:cursor-pointer"
              onClick={() =>
                setIsLogin ? setIsLogin(false) : router.replace("/register")
              }
            >
              Register
            </span>
          </p>
          {error && (
            <p className="w-full text-center text-destructive -mt-3">{error}</p>
          )}
          <Button type="submit" className="w-full">
            {isLoading ? (
              <div className="flex gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Login
              </div>
            ) : (
              <div>Login</div>
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Login;
