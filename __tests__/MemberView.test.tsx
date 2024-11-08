import React from "react";
import { render, screen } from "@testing-library/react-native";
import { CutoffList } from "../components/organisationoverview_components/CutoffList";

import { User } from "../DTO/organisationDTO";

const generateMember = (index: string, email: string): User => ({
  id: index,
  email: email,
  firstName: `Member${index}`,
  lastName: `Last${index}`,
});

describe("MemberView Component", () => {
  it("renders the correct number of members when below MAX_DISPLAYED_MEMBERS", () => {
    const members = Array.from({ length: 5 }, (_, i) => generateMember(i.toString(), i.toString() + "@mail"));
    render(<CutoffList entries={members} onPress={() => {}} />);

    const queriedMembers = screen.queryAllByTestId("member");
    expect(queriedMembers.length).toBe(5);
  });

  it("renders only MAX_DISPLAYED_MEMBERS when members exceed limit", () => {
    const members = Array.from({ length: 10 }, (_, i) =>
      generateMember(i.toString(), i.toString() + "@mail")
    );
    render(<CutoffList entries={members} onPress={() => {}} />);

    const memberImages = screen.queryAllByTestId("member");
    expect(memberImages.length).toBe(8);
    expect(screen.getByText("+2")).toBeTruthy();
  });

  it("displays profile picture when image is not provided", () => {
    const members = [generateMember("0", "false")]; // Member without image
    render(<CutoffList entries={members} onPress={() => {}} />);

    // Checks for initials based on provided first and last name
    expect(screen.getByText("ML")).toBeTruthy();
  });
});
