import React from "react";
import { render, screen } from "@testing-library/react";

import { CappedPreviewSlider } from "@/components/ui/capped-preview-slider";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
    writable: true
  });
  window.dispatchEvent(new Event("resize"));
}

describe("capped preview slider", () => {
  it("caps long preview lists at six cards and shows controls when needed", () => {
    setViewportWidth(1440);

    render(
      <CappedPreviewSlider
        ariaLabel="Preview list"
        items={Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`)}
        nextLabel="View next"
        previousLabel="View previous"
        getItemKey={(item) => item}
        renderItem={(item) => <div data-testid="preview-item">{item}</div>}
      />
    );

    expect(screen.getAllByTestId("preview-item")).toHaveLength(6);
    expect(
      screen.getByRole("button", { name: /View next/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /View previous/i })
    ).toBeInTheDocument();
  });

  it("hides controls when every card fits inside the current viewport", () => {
    setViewportWidth(1440);

    render(
      <CappedPreviewSlider
        ariaLabel="Preview list"
        items={["One", "Two", "Three"]}
        nextLabel="View next"
        previousLabel="View previous"
        getItemKey={(item) => item}
        renderItem={(item) => <div>{item}</div>}
      />
    );

    expect(
      screen.queryByRole("button", { name: /View next/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /View previous/i })
    ).not.toBeInTheDocument();
  });
});
