import React from "react";
import { render, screen } from "@testing-library/react-native";
import { MemberDTO } from "../DTO/organisationDTO";
import { MemberView } from "../components/organisationoverview_components/MemberView";

const generateMember = (index: number, hasImage = true): MemberDTO => ({
  id: index,
  firstName: `Member${index}`,
  lastName: `Last${index}`,
  image: hasImage ? `https://example.com/image${index}.jpg` : null,
});

describe("MemberView Component", () => {
  it("renders the correct number of members when below MAX_DISPLAYED_MEMBERS", () => {
    const members = Array.from({ length: 5 }, (_, i) => generateMember(i));
    render(<MemberView members={members} />);

    const queriedMembers = screen.queryAllByTestId("member");
    expect(queriedMembers.length).toBe(5);
  });

  it("renders only MAX_DISPLAYED_MEMBERS when members exceed limit", () => {
    const members = Array.from({ length: 10 }, (_, i) => generateMember(i));
    render(<MemberView members={members} />);

    const memberImages = screen.queryAllByTestId("member");
    expect(memberImages.length).toBe(8);
    expect(screen.getByText("+2")).toBeTruthy();
  });

  it("displays profile picture when image is not provided", () => {
    const members = [generateMember(0, false)]; // Member without image
    render(<MemberView members={members} />);

    // Checks for initials based on provided first and last name
    expect(screen.getByText("ML")).toBeTruthy();
  });
});
