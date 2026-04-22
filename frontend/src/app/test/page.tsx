"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";

const PageData = () => {
  useEffect(() => {
    console.log("After paint");
  }, []);
  useLayoutEffect(() => {
    console.log("Before paint");
  }, []);

  return <div onLoad={() => console.log("Loaded")}>Rendering</div>;
};

export default PageData;
