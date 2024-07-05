"use client";
import React, { useEffect, useState } from "react";
import Login from "@/components/Login";
import LandingPage from "@/components/LandingPage";

const LoginPage = () => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  },[])
  return (
    <LandingPage open={open} setOpen={setOpen}>  
      <Login />
    </LandingPage>
  );
};

export default LoginPage;
