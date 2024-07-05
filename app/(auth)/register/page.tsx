"use client";
import Register from "@/components/Register";
import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";

const RegisterPage = () => {
  const [open, setOpen] = useState(true);
  return (
    <LandingPage open={open} setOpen={setOpen}>
      <Register />
    </LandingPage>
  );
};

export default RegisterPage;
