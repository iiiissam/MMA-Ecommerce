import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";

test("La page affiche un texte", () => {
  render(<Home />);
  expect(screen.getByText("Bienvenue")).toBeInTheDocument();
});
