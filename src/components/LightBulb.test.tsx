import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LightBulb } from "./LightBulb";

describe("LightBulb", () => {
  it("renders with the correct data-testid", () => {
    render(
      <LightBulb id="bulb-1" label="Bulb 1" color="#ff0000" active={false} />,
    );
    expect(screen.getByTestId("bulb-bulb-1")).toBeInTheDocument();
  });

  it("has an accessible aria-label when inactive", () => {
    render(
      <LightBulb id="bulb-1" label="Bulb 1" color="#ff0000" active={false} />,
    );
    expect(screen.getByRole("img", { name: "Bulb 1" })).toBeInTheDocument();
  });

  it("includes '(active)' in aria-label when active", () => {
    render(
      <LightBulb id="bulb-1" label="Bulb 1" color="#ff0000" active={true} />,
    );
    expect(
      screen.getByRole("img", { name: "Bulb 1 (active)" }),
    ).toBeInTheDocument();
  });

  it("applies the active CSS class when active=true", () => {
    render(
      <LightBulb id="bulb-2" label="Bulb 2" color="#00ff00" active={true} />,
    );
    const wrapper = screen.getByTestId("bulb-bulb-2");
    const bulbDiv = wrapper.querySelector("[class*='active']");
    expect(bulbDiv).toBeInTheDocument();
  });

  it("does not apply the active CSS class when active=false", () => {
    render(
      <LightBulb id="bulb-3" label="Bulb 3" color="#0000ff" active={false} />,
    );
    const wrapper = screen.getByTestId("bulb-bulb-3");
    const bulbDiv = wrapper.querySelector("[class*='active']");
    expect(bulbDiv).not.toBeInTheDocument();
  });

  it("renders the bulb label text", () => {
    render(
      <LightBulb id="bulb-1" label="My Bulb" color="#ff0000" active={false} />,
    );
    expect(screen.getByText("My Bulb")).toBeInTheDocument();
  });
});
