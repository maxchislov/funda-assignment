import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        "funda-blue": "#0071b3",
        "funda-orange": "#c25400",
      },
    },
    aspectRatio: {
      property: "16 / 10",
    },
  },
};
