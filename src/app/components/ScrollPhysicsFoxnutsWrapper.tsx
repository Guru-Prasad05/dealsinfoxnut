"use client";

import dynamic from "next/dynamic";

const ScrollPhysicsFoxnuts = dynamic(
  () => import("./ScrollPhysicsFoxnuts"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full"
        style={{ height: "300px" }}
      />
    ),
  }
);

export default function ScrollPhysicsFoxnutsWrapper({
  fromColor,
  toColor,
}: {
  fromColor: string;
  toColor: string;
}) {
  return (
    <ScrollPhysicsFoxnuts
      fromColor={fromColor}
      toColor={toColor}
      // Each wrapper sits just before the "next screen" section.
      // We derive the target based on the gradient colors it is bridging.
      targetSelector={
        fromColor === "#1E3A34" && toColor === "#F5F3EA"
          ? "#products"
          : fromColor === "#F5F3EA" && toColor === "#FAFAF5"
          ? "#benefits"
          : "#enquiry"
      }
    />
  );
}
