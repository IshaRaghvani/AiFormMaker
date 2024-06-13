import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Themes from "app/_data/Themes";
import GradientBg from "app/_data/GradientBg";
import { Button } from "@/components/ui/button";

function Controller({ setSelectedTheme, setSelectedBackground }) {
  const [showmore, setshowmore] = useState(6);
  return (
    <div>
      <h2 className="py-5 text-white">Select Themes</h2>
      <Select onValueChange={(value) => setSelectedTheme(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {Themes.map((theme, index) => (
            <SelectItem value={theme.theme} key={index}>
              <div className="flex gap-3">
                <div className="flex pb-3">
                  <div
                    className="h-5 w-5 rounded-l-md"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <div
                    className="h-5 w-5"
                    style={{ backgroundColor: theme.secondary }}
                  ></div>
                  <div
                    className="h-5 w-5"
                    style={{ backgroundColor: theme.accent }}
                  ></div>
                  <div
                    className="h-5 w-5 rounded-r-md"
                    style={{ backgroundColor: theme.neutral }}
                  ></div>
                </div>
                {theme.theme}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <h2 className="mt-8 my-4 text-white">Background</h2>
      <div className="grid grid-cols-3 gap-5 text-white">
        {GradientBg.map(
          (bg, index) =>
            index < showmore && (
              <div
                key={index}
                className="w-full h-[70px] cursor-pointer rounded-lg border
                hover:border-gray-500 hover:border-2 flex items-center justify-center"
                style={{ background: bg.gradient }}
                onClick={() => setSelectedBackground(bg.gradient)}
              >
                {index == 0 && "None"}
              </div>
            )
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full my-1 text-white"
        onClick={() => setshowmore(showmore > 6 ? 6 : 20)}
      >
        {showmore > 6 ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
}

export default Controller;
