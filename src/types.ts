import { useState } from "react";

export type UserData = {
  name: string;
  exp: number;
  level: number;
  streak: number;
  lastLogin: string | null;
  quizScores: {
    OD_score: number; // 0-100 (0=Dry, 100=Oily)
    SB_score: number; // 0-100 (Sensitive)
    P_score: number; // 0-100 (Pigment)
    EA_score: number; // 0-100 (Aging)
  } | null;
  routines: any[];
  photos: any[];
};

export const defaultUserData: UserData = {
  name: "",
  exp: 0,
  level: 1,
  streak: 0,
  lastLogin: null,
  quizScores: null,
  routines: [],
  photos: [],
};
