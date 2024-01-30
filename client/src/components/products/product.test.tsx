import { BrowserRouter } from "react-router-dom";
import Product from "./Product";
import { render, screen } from "@testing-library/react";

describe("Product Component", () => {
  it("render product component", () => {
    render(
      <BrowserRouter>
        <Product />
      </BrowserRouter>
    );
    // const element = screen.getByTestId("title");
    const element = screen.getByText(/product/);
    expect(element).toBeInTheDocument();
  });
});
