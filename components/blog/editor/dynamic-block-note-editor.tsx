"use client";
import dynamic from "next/dynamic";

export const DynamicBlockNoteEditor = dynamic(
    () => import("./block-note-editor"),
    { ssr: false }
);
