import { makeDecorator } from "@storybook/addons";
import React from "react";

export const customWrapperStyle = makeDecorator({
  name: "customWrapperStyle",
  parameterName: "customWrapperStyle",
  wrapper: (getStory, context, { parameters }) => {
    const defaultStyle = {
      alignItems: "center",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      minHeight: "100vh",
      padding: "1rem",
      position: "relative",
      width: "100vw",
    };
    const style =
      (parameters &&
        parameters.style &&
        (parameters.defaultStyle === false
          ? parameters.style
          : { ...defaultStyle, ...parameters.style })) ||
      defaultStyle;

    if (parameters && parameters.disable) {
      return getStory(context);
    }

    return React.createElement(
      "section",
      { style, className: "wrapper-section" },
      [
        React.createElement("style", {
          children: `section.wrapper-section > div {max-width: 100%;}`,
        }),

        getStory(context),
      ]
    );
  },
});
